# Actualización solicitada por Coplast de México — 2026

## Instrucción para Claude Code

Implementa este documento completo en el repositorio actual. Lee primero `CLAUDE.md`,
`Pendientes.md` y este archivo. Conserva la arquitectura existente y usa
`catalog/catalog.csv` como única fuente de verdad del catálogo. No edites
`src/data/catalog.json` ni copies archivos manualmente a `public/catalog/`: ambos se
generan con `npm run build:catalog`.

La solicitud más reciente del cliente tiene prioridad sobre el catálogo anterior.
No publiques información contradictoria ni inventes SKU, precio, empaque, material,
medidas o disponibilidad.

## Archivos y flujo real del proyecto

```text
catalog/catalog.csv
        ↓ npm run build:catalog
src/data/catalog.json

catalog/images/<imagen-familia>.png
catalog/images/variants/<SKU>.png
        ↓ npm run build:catalog
public/catalog/
public/catalog/variants/
```

Las 15 imágenes necesarias ya están acomodadas en `catalog/images/` y
`catalog/images/variants/`. Las imágenes de variante deben conservar exactamente el
nombre del SKU definido en este documento.

## 1. Sustituir todo el mensaje de material reciclado

En `src/components/HeroSection.tsx` existen al menos estas tres afirmaciones:

- `Plástico reciclado`
- `Fabricados con plástico reciclado de alta resistencia`
- `Material reciclado`

Sustituirlas por mensajes verdaderos y consistentes:

- Estadística: `100%` / `Material virgen`
- Característica: título `Calidad de fabricación`
- Descripción: `Fabricados exclusivamente con material virgen de alta resistencia`
- Franja inferior: `Material virgen`

Cambiar el icono `Recycle` de esos bloques por uno que comunique calidad o material
sin insinuar reciclaje. Después buscar en todo el repositorio, sin incluir
dependencias ni artefactos de build:

```bash
rg -n -i "reciclad|reciclaje|eco-responsable" src index.html public README.md
```

El resultado no debe dejar ninguna afirmación comercial de material reciclado.

## 2. Cambios exactos en `catalog/catalog.csv`

### 2.1 Comederos varios

Conservar la familia `Comederos varios`, pero actualizar sus filas:

| SKU | Variante | Paquete | Precio base/oferta | Imagen de variante |
|---|---|---:|---:|---|
| `CM-ML` | `Media luna 250 g` | 100 | 4.00 | `catalog/images/variants/CM-ML.png` |
| `CM-CH` | `Champion 250 g` | 200 | 6.00 | `catalog/images/variants/CM-CH.png` |
| `CM-CU` | `Cuadrado 350 g` | 200 | 6.00 | `catalog/images/variants/CM-CU.png` |
| `CM-CT` | `Cuadrado con tapa 750 g` | 100 | 12.00 | `catalog/images/variants/CM-CT.png` |

En las cuatro filas, usar el mismo valor en `precio_planta` y `precio_oferta` para
que no se muestre una oferta inexistente. Mantener `unidad_precio=por pieza`,
`moneda=MXN` y `disponible=Si`.

### 2.2 Comederos redondos

Agregar a la familia existente `Comederos redondos`:

| Campo | Valor |
|---|---|
| `sku` | `CM-R2K` |
| `categoria` | `Comederos` |
| `producto` | `Comederos redondos` |
| `variante` | `2 kg` |
| `material` | `Plástico` |
| `colores` | `Varios colores` |
| `piezas_por_paquete` | `100` |
| `precio_planta` / `precio_oferta` | `12` / `12` |
| `imagen` | la imagen de familia actual `comederos_redondos.png` |
| imagen de variante | `catalog/images/variants/CM-R2K.png` |
| `descripcion` | `Comedero redondo de 2 kg de capacidad, en plástico resistente.` |

### 2.3 Mamilas

Reemplazar la fila antigua `MAM` (estándar, paquete 70) por una sola familia
`Mamila para becerro con chupón` con estas dos variantes:

| SKU | Variante | Paquete | Precio | Imagen de variante |
|---|---|---:|---:|---|
| `MAM-2L` | `Lisa 2 L` | 60 | 34.00 | `catalog/images/variants/MAM-2L.png` |
| `MAM-3L` | `Con asa 3 L` | 40 | 44.00 | `catalog/images/variants/MAM-3L.png` |

Para ambas filas:

- `categoria=Bebederos`
- `material=Plástico`
- `unidad_precio=por pieza`
- `moneda=MXN`
- `disponible=Si`
- `imagen=mamila_becerro.png`

Usar exactamente `2 L` y `3 L`. La presentación de 3 L debe quedar en 40 piezas
porque es la indicación más reciente, aunque la lista anterior diga 60.

### 2.4 Separadores para Tolva Plus

Agregar una nueva familia dentro de la categoría `Tolvas`:

| SKU | Producto | Variante | Imagen |
|---|---|---|---|
| `SEP-TP-CH` | `Separadores para Tolva Plus` | `Chico` | `separadores_tolva_plus.png` |
| `SEP-TP-GR` | `Separadores para Tolva Plus` | `Grande` | `separadores_tolva_plus.png` |

No publicar todavía ninguno de los dos precios:

| Variante | Solicitud nueva | Lista anterior |
|---|---:|---:|
| Chico | 16.00 | 13.00 |
| Grande | 13.00 | 16.00 |

La interfaz debe mostrar `Consulta precio` y una acción de contacto/cotización sin
calcular total. No usar `0`, `1`, un precio de relleno ni intercambiar valores.

### 2.5 Eliminar producto sin existencia

Eliminar por completo la fila `CLC-60`, correspondiente al comedero lineal plástico
de 60 cm. No modificar `CLM-60`, que es el comedero lineal metálico de 60 cm y sí
debe seguir disponible.

### 2.6 Caja transportadora

Agregar una familia:

| Campo | Valor |
|---|---|
| `sku` | `CAJ-TR` |
| `categoria` | `Accesorios avícolas` |
| `producto` | `Caja transportadora` |
| `variante` | `47 × 17 × 51 cm` |
| `material` | dejar vacío si la fuente no lo confirma |
| `piezas_por_paquete` | dejar vacío |
| `precio_planta` / `precio_oferta` | `48` / `48` |
| `unidad_precio` | `por pieza` |
| `imagen` | `caja_transportadora.png` |
| `descripcion` | `Caja transportadora para aves de 47 cm de alto, 17 cm de ancho y 51 cm de largo.` |

### 2.7 Productos para conejos

Corregir la fila actual `CM-BT`; no debe seguir clasificada como comedero plástico:

| Campo | Valor |
|---|---|
| `sku` | conservar `CM-BT` |
| `categoria` | `Conejos` |
| `producto` | `Comedero metálico de bota` |
| `variante` | `Estándar` |
| `material` | `Metálico` |
| `colores` | `Galvanizado` si la imagen/fuente lo confirma; en otro caso vacío |
| `piezas_por_paquete` | `70` |
| `precio_planta` / `precio_oferta` | `63` / `63` |
| `imagen` | `comedero_bota_metalico.png` |

Reemplazar la fila antigua `NID` por dos variantes de la misma familia:

| SKU | Variante | Paquete | Precio | Imagen de variante |
|---|---|---:|---:|---|
| `NID-EU` | `Chico Europeo` | 10 | 150.00 | `catalog/images/variants/NID-EU.png` |
| `NID-AM` | `Grande Americano` | 10 | 170.00 | `catalog/images/variants/NID-AM.png` |

Para ambas usar `categoria=Conejos`, `producto=Nido para conejo`,
`imagen=nido_conejo.png`, `unidad_precio=por pieza`, `moneda=MXN` y
`disponible=Si`.

### 2.8 Tolvas tradicionales

En todas las filas `TT-*`:

- Cambiar `imagen` a `tolvas_tradicionales_colores.png`.
- Conservar `colores_disponibles=Amarillo|Negro`.
- Usar la descripción:
  `Disponible en distintos colores, sujetos a disponibilidad. Colores básicos: amarillo y negro.`

No prometer disponibilidad permanente de otros colores.

## 3. Soporte técnico para “Consulta precio”

El generador actual exige `precio_planta > 0` y los tipos usan `number`. Para los
separadores, implementar soporte explícito para precio pendiente sin afectar los
demás productos:

1. En `scripts/build-catalog.mjs`, permitir `precio_planta` vacío únicamente para
   filas que se marquen como cotización sin precio. La solución preferida es añadir
   una columna clara al CSV, por ejemplo `consultar_precio`, con `Si/No`.
2. En `src/types/catalog.ts`, modelar los campos de precio como `number | null`
   donde corresponda.
3. En `src/components/catalog/FamilyCard.tsx`, mostrar `Consulta precio` cuando no
   exista precio y ocultar los cálculos de paquete.
4. En `src/context/CartContext.tsx`, `src/components/catalog/CartFab.tsx`,
   `src/components/catalog/QuoteDialog.tsx`, `src/lib/quote.ts` y
   `netlify/lib/quote-pdf.mjs`, impedir sumas con `null` y evitar que una cotización
   formal presente un total falso.
5. Para una variante sin precio, ofrecer contacto por WhatsApp o permitir incluirla
   como una partida marcada `Precio por confirmar`, según encaje mejor con el flujo
   actual.
6. Agregar pruebas para el render y el flujo de una variante sin precio.

Mantener identificadores, comentarios y nombres de código en inglés, conforme a
`CLAUDE.md`.

## 4. Imágenes y accesibilidad

`FamilyCard.tsx` ya genera el texto alternativo desde producto + variante y usa
`object-contain`. Verificar que las nuevas etiquetas produzcan textos descriptivos.
No recortar las imágenes; todas son cuadradas de 2000 × 2000 px con fondo blanco.

No duplicar manualmente imágenes en `public/catalog`. El build las copiará.

Como mejora separada, se puede abordar el pendiente existente de optimización
PNG→WebP, pero no debe bloquear esta actualización ni borrar los PNG fuente.

## 5. Validación obligatoria

Ejecutar:

```bash
npm ci
npm run build:catalog
npm run lint
npm test
npm run build
```

Después validar:

- No aparece ningún texto que afirme material reciclado.
- `CLC-60` no existe en CSV, JSON generado, búsqueda, filtros ni interfaz.
- `CLM-60` sí permanece.
- Las cinco presentaciones de comederos muestran su foto individual.
- Las dos mamilas muestran 2 L/60 piezas/$34 y 3 L/40 piezas/$44.
- Los separadores muestran `Consulta precio`, nunca `0.00`.
- La caja transportadora muestra $48 por pieza y no inventa empaque.
- El comedero de bota aparece en Conejos como metálico.
- Los nidos muestran 10 piezas y precios de $150/$170.
- Las tolvas tradicionales informan que los colores están sujetos a disponibilidad.
- No hay imágenes rotas, errores de consola ni regresiones en carrito, cotización,
  PDF, desktop o móvil.

## Criterio de cierre

Al terminar, entregar:

1. Resumen de archivos modificados.
2. Tabla final de SKU, presentación, paquete y precio.
3. Resultado de cada comando de validación.
4. Decisiones tomadas para `Consulta precio`.
5. Cualquier dato que siga requiriendo confirmación del cliente.

