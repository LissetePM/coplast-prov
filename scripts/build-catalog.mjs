// @ts-check
/**
 * Builds the web catalog from catalog/catalog.csv
 *
 * Flow:  edit catalog/catalog.csv  ->  npm run build:catalog  ->  updated catalog
 *
 *  - Validates data (columns, prices, duplicate SKUs, missing images)
 *  - Groups products by family (CSV column "producto") with their variants
 *  - Calculates current price, sale flag, and pack price
 *  - Writes src/data/catalog.json (read by the web app)
 *  - Copies family images to public/catalog/
 *
 * Pricing rule (agreed with the client):
 *  - current price = precio_oferta if set, otherwise precio_planta
 *  - on sale (crossed out) ONLY if precio_oferta < precio_planta
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = join(ROOT, "catalog", "catalog.csv");
const IMG_SRC = join(ROOT, "catalog", "images");
const IMG_OUT = join(ROOT, "public", "catalog");
const VAR_SRC = join(IMG_SRC, "variants"); // imágenes por variante, nombradas <sku>.<ext>
const VAR_OUT = join(IMG_OUT, "variants");
const JSON_OUT = join(ROOT, "src", "data", "catalog.json");

const REQUIRED_COLS = [
  "sku", "categoria", "producto", "variante", "piezas_por_paquete",
  "precio_planta", "precio_oferta", "imagen",
];

// Optional column. Rows marked "Si" are published without a price ("Consulta
// precio") and must leave precio_planta and precio_oferta empty. Deliberately
// not in REQUIRED_COLS so an older client CSV without it still builds.
const QUOTE_ON_REQUEST_COL = "consultar_precio";

// Variant images are found by SKU, not named in the CSV, so the extension has to
// be guessed. Order matters: the first hit wins, and WebP is what ships.
const VARIANT_IMAGE_EXTS = [".webp", ".png"];

/** Parser CSV robusto: respeta comillas, comas internas y comillas escapadas (""). */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  text = text.replace(/^﻿/, ""); // quita BOM
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } // comilla escapada ("")
        else inQuotes = false;
      } else field += c;
    } else if (c === '"' && field === "") inQuotes = true; // comilla solo abre al inicio del campo
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* ignora */ }
    else field += c; // incluye una comilla a mitad de un campo sin comillas (ej. 12" tubo)
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function fail(msg) {
  console.error(`\n❌ build-catalog: ${msg}\n`);
  process.exit(1);
}

/** "Comedero lineal con rejilla de colores" -> "comedero-lineal-con-rejilla-de-colores" */
function slug(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toNum(s) {
  const v = (s ?? "").toString().trim().replace(/,/g, "");
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

// ---------------------------------------------------------------- leer CSV
if (!existsSync(CSV_PATH)) fail(`No existe ${CSV_PATH}`);
const rows = parseCSV(readFileSync(CSV_PATH, "utf8"));
if (rows.length < 2) fail("El CSV no tiene filas de datos.");
const header = rows[0].map((h) => h.trim());
for (const col of REQUIRED_COLS) {
  if (!header.includes(col)) fail(`Falta la columna obligatoria "${col}" en el CSV.`);
}
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const get = (r, c) => (r[idx[c]] ?? "").trim();

// ---------------------------------------------------------------- validar + transformar
const errors = [];
const seenSku = new Set();
const usedImages = new Set();
const usedVariantImages = new Set();
let totalVariants = 0;
let onSaleCount = 0;
let quoteOnRequestCount = 0;
/** @type {Map<string, any>} */
const families = new Map();
const categories = [];

rows.slice(1).forEach((r, i) => {
  const ln = i + 2; // nº de línea en el archivo
  const sku = get(r, "sku");
  const productName = get(r, "producto");
  const categoryName = get(r, "categoria");
  if (!sku) return void errors.push(`Línea ${ln}: SKU vacío.`);
  if (seenSku.has(sku)) errors.push(`Línea ${ln}: SKU duplicado "${sku}".`);
  seenSku.add(sku);
  if (!productName) errors.push(`Línea ${ln} (${sku}): "producto" vacío.`);
  if (!categoryName) errors.push(`Línea ${ln} (${sku}): "categoria" vacía.`)

  const quoteOnRequest = get(r, QUOTE_ON_REQUEST_COL).toLowerCase() === "si";
  const planta = toNum(get(r, "precio_planta"));
  const oferta = toNum(get(r, "precio_oferta"));
  if (quoteOnRequest) {
    // A row cannot say "ask for the price" and carry a price at the same time:
    // that would publish a number the client has not confirmed.
    if (planta !== null) errors.push(`Línea ${ln} (${sku}): "${QUOTE_ON_REQUEST_COL}" es "Si", así que "precio_planta" debe quedar vacío.`);
    if (oferta !== null) errors.push(`Línea ${ln} (${sku}): "${QUOTE_ON_REQUEST_COL}" es "Si", así que "precio_oferta" debe quedar vacío.`);
  } else {
    if (planta === null) errors.push(`Línea ${ln} (${sku}): "precio_planta" vacío (es el precio base obligatorio).`);
    else if (Number.isNaN(planta)) errors.push(`Línea ${ln} (${sku}): "precio_planta" no es un número.`);
    else if (planta <= 0) errors.push(`Línea ${ln} (${sku}): "precio_planta" debe ser mayor a 0.`);
    if (Number.isNaN(oferta)) errors.push(`Línea ${ln} (${sku}): "precio_oferta" no es un número.`);
    else if (oferta !== null && oferta <= 0) errors.push(`Línea ${ln} (${sku}): "precio_oferta" debe ser mayor a 0 (déjalo vacío si no hay oferta).`);
  }

  const piezas = toNum(get(r, "piezas_por_paquete"));
  if (Number.isNaN(piezas)) errors.push(`Línea ${ln} (${sku}): "piezas_por_paquete" no es un número.`);
  else if (piezas !== null && piezas < 1) errors.push(`Línea ${ln} (${sku}): "piezas_por_paquete" debe ser al menos 1 (déjalo vacío si se vende por pieza).`);

  const imagen = get(r, "imagen");
  if (!imagen) errors.push(`Línea ${ln} (${sku}): "imagen" vacía.`);
  else if (!existsSync(join(IMG_SRC, basename(imagen)))) {
    errors.push(`Línea ${ln} (${sku}): no existe la imagen "catalog/images/${basename(imagen)}".`);
  } else usedImages.add(basename(imagen));

  if (errors.length) return;
  // A quote-on-request row legitimately has no precio_planta, so the two
  // conditions must stay separate or those rows would be silently dropped.
  if (!quoteOnRequest && planta === null) return;
  const isOnSale = !quoteOnRequest && oferta !== null && oferta < planta;
  const currentPrice = quoteOnRequest ? null : oferta ?? planta;
  const isNew = get(r, "novedad").toLowerCase() === "si";
  const isAvailable = get(r, "disponible").toLowerCase() !== "no";

  const famId = slug(productName);
  if (!families.has(famId)) {
    if (!categories.includes(categoryName)) categories.push(categoryName);
    families.set(famId, {
      id: famId,
      product: productName,
      category: categoryName,
      material: get(r, "material"),
      colors: get(r, "colores"),
      description: get(r, "descripcion"),
      image: `/catalog/${basename(imagen)}`,
      isNew: false,
      variants: [],
    });
  }
  // Individual variant image (catalog/images/variants/<sku>.<ext>), optional.
  // WebP wins when both exist: the catalog ships WebP, and the PNG is kept only
  // as the source master. PNG still resolves so a newly added product whose
  // image has not been converted yet does not silently lose its photo.
  const variantFile = VARIANT_IMAGE_EXTS
    .map((ext) => `${sku}${ext}`)
    .find((name) => existsSync(join(VAR_SRC, name)));
  const hasVariantImage = Boolean(variantFile);
  if (hasVariantImage) usedVariantImages.add(variantFile);
  // selectable colors (do not affect price or SKU), pipe-separated in CSV
  const availableColors = get(r, "colores_disponibles")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  const fam = families.get(famId);
  fam.isNew = fam.isNew || isNew;
  if (!fam.description && get(r, "descripcion")) fam.description = get(r, "descripcion");
  fam.variants.push({
    sku,
    label: get(r, "variante"),
    piecesPerPack: piezas,
    basePrice: quoteOnRequest ? null : planta,
    salePrice: quoteOnRequest ? null : oferta,
    currentPrice,
    onSale: isOnSale,
    packPrice: currentPrice !== null && piezas ? Math.round(currentPrice * piezas * 100) / 100 : null,
    quoteOnRequest,
    priceUnit: get(r, "unidad_precio") || "por pieza",
    description: get(r, "descripcion") || fam.description,
    variantImage: hasVariantImage ? `/catalog/variants/${variantFile}` : null,
    availableColors,
    isNew,
    available: isAvailable,
  });
  totalVariants++;
  if (isOnSale) onSaleCount++;
  if (quoteOnRequest) quoteOnRequestCount++;
});

if (errors.length) {
  fail(`Se encontraron ${errors.length} problema(s):\n  - ${errors.join("\n  - ")}`);
}

// ---------------------------------------------------------------- escribir JSON
const catalogo = {
  generatedAt: new Date().toISOString().slice(0, 10),
  currency: "MXN",
  categories,
  families: [...families.values()],
};
mkdirSync(dirname(JSON_OUT), { recursive: true });
writeFileSync(JSON_OUT, JSON.stringify(catalogo, null, 2) + "\n", "utf8");

// ---------------------------------------------------------------- copiar imágenes
mkdirSync(IMG_OUT, { recursive: true });
// limpia imágenes previas para no dejar huérfanas
for (const f of existsSync(IMG_OUT) ? readdirSync(IMG_OUT) : []) {
  if (/\.(png|jpe?g|webp)$/i.test(f)) rmSync(join(IMG_OUT, f));
}
let copied = 0;
for (const img of usedImages) {
  copyFileSync(join(IMG_SRC, img), join(IMG_OUT, img));
  copied++;
}

// variant images -> public/catalog/variants/
mkdirSync(VAR_OUT, { recursive: true });
for (const f of existsSync(VAR_OUT) ? readdirSync(VAR_OUT) : []) {
  if (/\.(png|jpe?g|webp)$/i.test(f)) rmSync(join(VAR_OUT, f));
}
let copiedVar = 0;
for (const img of usedVariantImages) {
  copyFileSync(join(VAR_SRC, img), join(VAR_OUT, img));
  copiedVar++;
}

console.log(`✅ Catalog built:
  · ${families.size} families, ${totalVariants} variants, ${categories.length} categories
  · ${onSaleCount} variant(s) on sale (price crossed out)
  · ${quoteOnRequestCount} variant(s) quoted on request (no published price)
  · ${copied} family images + ${copiedVar} variant images -> public/catalog/
  · JSON -> src/data/catalog.json`);
