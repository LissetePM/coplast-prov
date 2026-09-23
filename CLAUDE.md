# Agro-Plast Vision — Project Rules for Claude

## Language convention (STRICT)

All code must use **English only** for identifiers and comments.
Spanish is allowed **only** for:
- User-visible page content (strings rendered in the UI)
- Product image filenames under `catalog/images/` and `public/catalog/` (client-provided)
- CSV data files (`catalog/catalog.csv`, client-provided)
- Client-facing documentation (`README.md`, docs for Coplast)

**Everything else must be English:**
- File names (project source files, not product images)
- Component names, function names, variable names, constants
- TypeScript interface/type names and their field names
- Code comments
- Netlify function names and their exported symbols

### Rationale
The codebase is a Spanish/English mix inherited from early development. We standardized
to English-only code so any developer can read it without language confusion. Violations
make code review harder and are rejected in PRs.

---

## File & component naming

| What | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `QuoteDialog.tsx`, `FamilyCard.tsx` |
| Non-component TS/JS | camelCase | `quote.ts`, `browser.ts` |
| Netlify functions | kebab-case | `generate-quote.mjs` |
| Netlify lib files | kebab-case | `quote-pdf.mjs`, `quote-id.mjs` |
| CSS / config | kebab-case | `tailwind.config.ts` |

---

## Key identifier mapping (Spanish → English)

The following renames were applied in the English refactor. Use the English names going forward:

### Types (`src/types/catalog.ts`)
| Old | New |
|-----|-----|
| `Variante` | `Variant` |
| `Familia` | `Family` |
| `Catalogo` | `Catalog` |
| `.variante` | `.label` |
| `.piezasPorPaquete` | `.piecesPerPack` |
| `.precioPlanta` | `.basePrice` |
| `.precioOferta` | `.salePrice` |
| `.precioVigente` | `.currentPrice` |
| `.enOferta` | `.onSale` |
| `.precioPaquete` | `.packPrice` |
| `.unidadPrecio` | `.priceUnit` |
| `.imagenVariante` | `.variantImage` |
| `.coloresDisponibles` | `.availableColors` |
| `.novedad` | `.isNew` |
| `.disponible` | `.available` |
| `.producto` | `.product` |
| `.categoria` | `.category` |
| `.colores` | `.colors` |
| `.descripcion` | `.description` |
| `.imagen` | `.image` |
| `.variantes` | `.variants` |
| `.generadoEn` | `.generatedAt` |
| `.moneda` | `.currency` |
| `.categorias` | `.categories` |
| `.familias` | `.families` |

### CartLine fields (`src/context/CartContext.tsx`)
| Old | New |
|-----|-----|
| `.familiaId` | `.familyId` |
| `.producto` | `.product` |
| `.variante` | `.variant` |
| `.imagen` | `.image` |
| `.unidad` | `.unit` |
| `.piezasPorPaquete` | `.piecesPerPack` |
| `.precioUnitario` | `.unitPrice` |
| `.precioPaquete` | `.packPrice` |
| `.enOferta` | `.onSale` |
| `.cantidad` | `.quantity` |
| `setCantidad` | `setQuantity` |

### Quote lib (`src/lib/quote.ts`, was `cotizacion.ts`)
| Old | New |
|-----|-----|
| `CotizacionPayload` | `QuotePayload` |
| `CotizacionResultado` | `QuoteResult` |
| `generarCotizacion` | `generateQuote` |
| `descargarBlob` | `downloadBlob` |
| `lineToItem` | `cartLineToItem` |
| `.modo` | `.mode` |
| `.cliente` | `.companyName` |
| `.atencion` | `.contactName` |
| `.ubicacion` | `.location` |
| `.telefono` | `.phone` |
| `.correo` | `.email` |
| `.folio` | `.quoteId` |

### Components
| Old | New |
|-----|-----|
| `CotizacionDialog` | `QuoteDialog` |
| `cotizarPorWhatsapp` | `quoteViaWhatsApp` |
| `buildWhatsappMessage` | `buildWhatsAppMessage` |
| `resetWa` | `resetWhatsAppFlow` |
| `iabName()` | `getIabName()` |
| `BUSINESS.nombre` | `BUSINESS.name` |
| `BUSINESS.telefono` | `BUSINESS.phone` |

### Netlify functions
| Old file | New file |
|----------|----------|
| `generar-cotizacion.mjs` | `generate-quote.mjs` |
| `cotizacion-pdf.mjs` | `quote-pdf.mjs` |
| `folio.mjs` | `quote-id.mjs` |
| `storage.mjs` | `quote-storage.mjs` |

| Old export | New export |
|-----------|-----------|
| `generarCotizacionPDF` | `generateQuotePDF` |
| `siguienteFolio` | `nextQuoteId` |
| `guardarCotizacion` | `storeQuote` |
| `enviarCorreo` | `sendEmail` |
| `htmlCotizacion` | `buildQuoteEmail` |

---

## Catalog data pipeline

```
catalog/catalog.csv  (Spanish column headers, client-provided — DO NOT rename)
        ↓ npm run build:catalog
src/data/catalog.json  (English keys — generated, DO NOT edit manually)
        ↓ imported by React
src/types/catalog.ts   (English TypeScript interfaces)
```

When the client provides a new CSV:
1. Replace `catalog/catalog.csv`
2. Add any new images to `catalog/images/`
3. Run `npm run build:catalog`
4. Commit the updated `catalog.json` and any new images

---

## Stack summary

- **Frontend**: React 18 + Vite 7 + TypeScript + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **PDF generation**: Netlify Functions (serverless) + pdf-lib
- **Email**: Nodemailer over SMTP (env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- **Storage**: Netlify Blobs (quote PDFs + metadata)
- **Deployment**: Netlify (auto-deploy from main branch)

---

## Commit message style

Use conventional commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`, etc.
Scope examples: `catalog`, `cart`, `quote`, `pdf`, `email`, `navbar`.
