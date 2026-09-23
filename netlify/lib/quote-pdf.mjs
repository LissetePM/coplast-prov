// Generates the quote PDF (1 page, letter) with pdf-lib, reproducing the
// Coplast commercial design. Pure module: receives data, returns Uint8Array.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { LOGO_BASE64 } from "./logo-data.mjs";

const MM = 2.834645669; // 1 mm in points
const mm = (v) => v * MM;

// Brand palette
const C = {
  green: hex("#1E8A3C"),
  greenD: hex("#14672C"),
  blue: hex("#1B6FB0"),
  blueD: hex("#114E7E"),
  ink: hex("#1F2A33"),
  grey: hex("#6B7680"),
  light: hex("#F2F6F4"),
  line: hex("#D8E0DC"),
  amber: hex("#F4A81D"),
  amberBg: hex("#FFF6E2"),
  mxGreen: hex("#006847"),
  mxRed: hex("#CE1126"),
  white: rgb(1, 1, 1),
};

function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const money = (v) =>
  "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tileColors = ["green", "blue", "amber", "greenD", "blueD"];

/** SVG path of a rounded rectangle (corners with Bézier). */
function roundedRectPath(w, h, r) {
  const k = 0.5523 * r;
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `C ${w - r + k} 0 ${w} ${r - k} ${w} ${r}`,
    `L ${w} ${h - r}`,
    `C ${w} ${h - r + k} ${w - r + k} ${h} ${w - r} ${h}`,
    `L ${r} ${h}`,
    `C ${r - k} ${h} 0 ${h - r + k} 0 ${h - r}`,
    `L 0 ${r}`,
    `C 0 ${r - k} ${r - k} 0 ${r} 0`,
    "Z",
  ].join(" ");
}

/**
 * @param {object} data
 *  quoteId, date, companyName, contactName, location (strings; companyName/contactName/location optional)
 *  items: [{ name, sku, unit, quantity, unitPrice, packPrice, piecesPerPack, amount, onSale }]
 *  ivaRate (e.g. 0.16)
 */
export async function generateQuotePDF(data) {
  const { quoteId, date, companyName, contactName, location, phone, email, items, ivaRate = 0.16 } = data;
  const W = 612, H = 792;

  const doc = await PDFDocument.create();
  const page = doc.addPage([W, H]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const logo = await doc.embedPng(LOGO_BASE64);

  // ---- drawing helpers ----
  const text = (s, x, y, size, f = font, color = C.ink) =>
    page.drawText(String(s), { x, y, size, font: f, color });
  const textRight = (s, xRight, y, size, f = font, color = C.ink) => {
    const wTxt = f.widthOfTextAtSize(String(s), size);
    page.drawText(String(s), { x: xRight - wTxt, y, size, font: f, color });
  };
  const textCenter = (s, xc, y, size, f = font, color = C.ink) => {
    const wTxt = f.widthOfTextAtSize(String(s), size);
    page.drawText(String(s), { x: xc - wTxt / 2, y, size, font: f, color });
  };
  // rounded rect: (x,y) = bottom-left corner
  const roundRect = (x, yBottom, w, h, r, opts = {}) =>
    page.drawSvgPath(roundedRectPath(w, h, r), { x, y: yBottom + h, ...opts });

  // ============================================================ HEADER
  const HB = mm(42);
  page.drawRectangle({ x: 0, y: H - HB, width: W, height: HB, color: C.blue });
  // diagonal green stripe (quadrilateral)
  page.drawSvgPath(`M ${W * 0.56} 0 L ${W} 0 L ${W} ${HB} L ${W * 0.41} ${HB} Z`, {
    x: 0, y: H, color: C.green,
  });

  // white tile with logo
  const tile = mm(28), tx = mm(14), ty = H - HB + (HB - tile) / 2;
  roundRect(tx, ty, tile, tile, mm(4), { color: C.white });
  const pad = mm(2);
  const logoDims = logo.scaleToFit(tile - 2 * pad, tile - 2 * pad);
  page.drawImage(logo, {
    x: tx + (tile - logoDims.width) / 2,
    y: ty + (tile - logoDims.height) / 2,
    width: logoDims.width,
    height: logoDims.height,
  });

  // wordmark + badge + tagline
  const textx = tx + tile + mm(7);
  text("COPLAST DE MÉXICO", textx, H - mm(15), 19, bold, C.white);
  // badge "Fabricante mexicano"
  const by = H - mm(23), bh = mm(6.2), bw = mm(47);
  roundRect(textx, by, bw, bh, bh / 2, { color: rgb(1, 1, 1), opacity: 0.16 });
  const fx = textx + mm(3), fw = mm(4.2), fy = by + mm(1.4), fh = bh - mm(2.8);
  page.drawRectangle({ x: fx, y: fy, width: fw / 3, height: fh, color: C.mxGreen });
  page.drawRectangle({ x: fx + fw / 3, y: fy, width: fw / 3, height: fh, color: C.white });
  page.drawRectangle({ x: fx + (2 * fw) / 3, y: fy, width: fw / 3, height: fh, color: C.mxRed });
  text("Fabricante mexicano", fx + fw + mm(2.5), by + mm(1.9), 9, bold, C.white);
  text("Implementos avícolas y soluciones plásticas para granjas", textx, H - mm(29), 8.5, font, C.white);

  // right block
  textRight("COTIZACIÓN", W - mm(15), H - mm(15), 13, bold, C.white);
  textRight(`Folio ${quoteId}`, W - mm(15), H - mm(20), 9, font, C.white);
  textRight(date, W - mm(15), H - mm(24.5), 9, font, C.white);

  // ============================================================ BODY
  let y = H - mm(49); // below the header

  // client chip (line 1: name/attention/location; line 2: contact info)
  const partes = [companyName, contactName && `Atn. ${contactName}`, location].filter(Boolean).join("   ·   ");
  const contacto = [phone && `Tel. ${phone}`, email].filter(Boolean).join("   ·   ");
  if (partes || contacto) {
    const dosLineas = Boolean(partes && contacto);
    const chipH = dosLineas ? mm(14) : mm(11);
    roundRect(mm(16), y - chipH, W - mm(32), chipH, mm(2), {
      color: C.light, borderColor: C.line, borderWidth: 0.5,
    });
    let ly = y - mm(6.5);
    if (partes) {
      text("Cliente:", mm(20), ly, 9.5, bold, C.ink);
      text(partes, mm(20) + bold.widthOfTextAtSize("Cliente: ", 9.5), ly, 9.5, font, C.ink);
      ly -= mm(5);
    }
    if (contacto) {
      text("Contacto:", mm(20), ly, 9, bold, C.ink);
      text(contacto, mm(20) + bold.widthOfTextAtSize("Contacto: ", 9), ly, 9, font, C.ink);
    }
    y -= chipH + mm(5);
  }

  // ---- table ----
  const left = mm(16);
  const cols = [mm(14), mm(67), mm(26), mm(32), mm(30)]; // tile, product, qty, price, amount
  const cx = [left];
  for (let i = 0; i < cols.length; i++) cx.push(cx[i] + cols[i]);

  // table header
  const headH = mm(8.5);
  page.drawRectangle({ x: left, y: y - headH, width: W - mm(32), height: headH, color: C.blue });
  const headY = y - mm(5.6);
  text("PRODUCTO", cx[1] + mm(2), headY, 8.5, bold, C.white);
  textRight("CANT.", cx[3] - mm(2), headY, 8.5, bold, C.white);
  textRight("PRECIO", cx[4] - mm(2), headY, 8.5, bold, C.white);
  textRight("IMPORTE", cx[5] - mm(3), headY, 8.5, bold, C.white);
  y -= headH;

  // Each row shows: pack size, number of packs, total pieces,
  // price per pack and (small) price per piece. Marks "Oferta" if applicable.
  const rowH = mm(12);
  let subtotal = 0;
  items.forEach((it, i) => {
    subtotal += it.amount;
    if (i % 2 === 1) {
      page.drawRectangle({ x: left, y: y - rowH, width: W - mm(32), height: rowH, color: C.light });
    }
    const porPaq = it.unit === "pack" && it.piecesPerPack;
    // color tile with initial
    const t = mm(7.5), tlx = cx[0] + (cols[0] - t) / 2, tly = y - (rowH + t) / 2;
    roundRect(tlx, tly, t, t, mm(1.6), { color: C[tileColors[i % tileColors.length]] });
    textCenter((it.name[0] || "·").toUpperCase(), tlx + t / 2, tly + t / 2 - 3.2, t * 0.5, bold, C.white);
    // PRODUCT: name + subtitle (code and presentation)
    text(it.name, cx[1] + mm(2), y - mm(5), 9, bold, C.ink);
    const sub = porPaq ? `Cód. ${it.sku} · paq. de ${it.piecesPerPack} pzas` : `Cód. ${it.sku} · venta por pieza`;
    text(sub, cx[1] + mm(2), y - mm(9), 7, font, C.grey);
    // QTY: number of packs + total pieces
    textRight(porPaq ? `${it.quantity} paq` : `${it.quantity} pzas`, cx[3] - mm(2), y - mm(5), 9, font, C.ink);
    if (porPaq) textRight(`${it.quantity * it.piecesPerPack} pzas`, cx[3] - mm(2), y - mm(9), 7, font, C.grey);
    // PRICE: per pack (large) + per piece (small); green if on sale
    textRight(money(porPaq ? it.packPrice : it.unitPrice), cx[4] - mm(2), y - mm(5), 9, font, C.ink);
    const nota = it.onSale ? `Oferta · ${money(it.unitPrice)}/pza` : porPaq ? `${money(it.unitPrice)}/pza` : "";
    if (nota) textRight(nota, cx[4] - mm(2), y - mm(9), 7, font, it.onSale ? C.green : C.grey);
    // AMOUNT
    textRight(money(it.amount), cx[5] - mm(3), y - mm(7), 9.5, bold, C.ink);
    page.drawLine({ start: { x: left, y: y - rowH }, end: { x: W - mm(16), y: y - rowH }, thickness: 0.5, color: C.line });
    y -= rowH;
  });

  const vat = subtotal * ivaRate;
  const total = subtotal + vat;
  y -= mm(5);

  // ---- promo (left) + totals (right) ----
  const promoW = mm(92), promoH = mm(24), totW = mm(64);
  roundRect(left, y - promoH, promoW, promoH, mm(2), { color: C.amberBg, borderColor: C.amber, borderWidth: 0.8 });
  text("Compra por volumen", left + mm(4), y - mm(7), 10, bold, C.greenD);
  text("Pregunta por descuentos al comprar 20 paquetes", left + mm(4), y - mm(13), 8, font, C.greenD);
  text("o más del mismo producto.", left + mm(4), y - mm(17.5), 8, font, C.greenD);

  // totals (separate coordinates to avoid overlap)
  const totRight = W - mm(16), totX = totRight - totW;
  text("Subtotal", totX + mm(2), y - mm(6), 10, font, C.grey);
  textRight(money(subtotal), totRight - mm(3), y - mm(6), 10, font, C.grey);
  text("IVA 16%", totX + mm(2), y - mm(13), 10, font, C.grey);
  textRight(money(vat), totRight - mm(3), y - mm(13), 10, font, C.grey);
  const barTop = y - mm(15), barH = mm(11);
  page.drawRectangle({ x: totX, y: barTop - barH, width: totW, height: barH, color: C.green });
  const totBase = barTop - barH / 2 - 4.5;
  text("TOTAL", totX + mm(3), totBase, 13, bold, C.white);
  textRight(money(total), totRight - mm(3), totBase, 13, bold, C.white);
  y -= mm(32);

  // ---- cross-sell ----
  text("También te puede interesar", left, y, 11, bold, C.blueD);
  y -= mm(3);
  const csH = mm(16), csW = (W - mm(32)) / 3;
  const cross = [
    ["Tolvas y comederos", "varias capacidades"],
    ["Bebederos colgantes", "1/2 a 10 litros"],
    ["Productos para mascotas", "tazones y más"],
  ];
  roundRect(left, y - csH, W - mm(32), csH, mm(2), { color: C.light, borderColor: C.line, borderWidth: 0.5 });
  cross.forEach(([t1, t2], i) => {
    const cxx = left + i * csW + mm(4);
    text(t1, cxx, y - mm(6.5), 9, bold, C.ink);
    text(t2, cxx, y - mm(10.5), 8, font, C.grey);
  });
  y -= csH + mm(5);

  // ---- footer: WhatsApp stripe + legend ----
  const waMsg = `Hola Coplast de México, quiero dar seguimiento a la cotización ${quoteId}.`;
  const waUrl = `https://wa.me/525625289330?text=${encodeURIComponent(waMsg)}`;
  const fbX = mm(16), fbY = mm(9), fbW = W - mm(32), fbH = mm(12);
  roundRect(fbX, fbY, fbW, fbH, mm(3), { color: C.green });
  textCenter("Haz tu pedido por WhatsApp   ›   56 2528 9330   |   coplastdemexico.com", W / 2, fbY + mm(4.2), 11, bold, C.white);
  // clickable link
  const link = doc.context.register(
    doc.context.obj({
      Type: "Annot", Subtype: "Link", Rect: [fbX, fbY, fbX + fbW, fbY + fbH],
      Border: [0, 0, 0], A: { Type: "Action", S: "URI", URI: waUrl },
    }),
  );
  page.node.set(doc.context.obj("Annots"), doc.context.obj([link]));

  textCenter("Hecho en México · Precios en MXN · Vigencia 15 días · Sujetos a disponibilidad.", W / 2, fbY + fbH + mm(3), 8, font, C.grey);

  return await doc.save();
}
