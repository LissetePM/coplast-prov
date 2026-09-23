# Coplast de México

Catálogo digital de implementos avícolas y plásticos para granjas.

## Descripción

Coplast de México es una plataforma web que muestra el catálogo de productos plásticos para el sector avícola y ganadero. La aplicación permite a clientes explorar productos, solicitar cotizaciones y contactar directamente con el fabricante.

## Stack Tecnológico

- **Vite** - Herramienta de construcción y servidor de desarrollo
- **TypeScript** - JavaScript con tipado estático
- **React 18** - Librería de UI moderna con hooks
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes UI de alta calidad
- **React Router** - Enrutamiento del lado del cliente
- **React Hook Form** - Gestión de formularios con validación
- **Zod** - Validación de esquemas
- **TanStack Query** - Obtención de datos y gestión de estado
- **date-fns** - Utilidades de manipulación de fechas
- **React Day Picker** - Componente de selección de fechas
- **Recharts** - Librería de visualización de datos
- **Framer Motion** - Librería de animaciones
- **Lucide React** - Librería de iconos
- **next-themes** - Funcionalidad de cambio de tema

## Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
cd agro-plast-vision
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir el navegador y navegar a `http://localhost:8080`

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run build:dev` - Construir para modo desarrollo
- `npm run preview` - Previsualizar construcción de producción
- `npm run lint` - Ejecutar ESLint
- `npm run test` - Ejecutar pruebas
- `npm run test:watch` - Ejecutar pruebas en modo watch

## Estructura del Proyecto

```
src/
├── components/          # Componentes UI reutilizables
│   ├── ui/             # Componentes UI base
│   └── ...             # Componentes de características
├── App.tsx             # Componente principal de la aplicación
├── main.tsx            # Punto de entrada de la aplicación
└── ...                 # Otros archivos fuente
```

## Características

- **Catálogo de Productos**: Exploración de implementos avícolas y plásticos
- **Gestión de Cotizaciones**: Sistema de solicitud de cotizaciones
- **Diseño Responsivo**: Layout responsivo optimizado para móviles
- **Modo Oscuro**: Soporte integrado para tema claro/oscuro
- **Visualización de Datos**: Gráficos y analíticas con Recharts
- **Accesibilidad**: Componentes compatibles con WCAG
- **Contacto Directo**: Integración con WhatsApp para consultas

## Desarrollo

### Estilo de Código

Este proyecto usa ESLint para linting de código y sigue las mejores prácticas de TypeScript. Ejecute el linter antes de confirmar cambios:

```bash
npm run lint
```

### Pruebas

Las pruebas se escriben usando Vitest y React Testing Library. Ejecute las pruebas con:

```bash
npm run test
```

Para pruebas continuas durante el desarrollo:

```bash
npm run test:watch
```

### Pruebas E2E

Las pruebas end-to-end están disponibles usando Playwright:

```bash
npm run test:e2e
```

## Despliegue

### Construir para Producción

```bash
npm run build
```

Los archivos construidos estarán en el directorio `dist`, listos para despliegue en cualquier servicio de hosting estático.

### Opciones de Despliegue

- **Vercel** - Despliegue con configuración cero
- **Netlify** - Arrastrar y soltar la carpeta `dist`
- **GitHub Pages** - Usar GitHub Actions para despliegue automático
- **AWS S3/CloudFront** - Para infraestructura personalizada
- **Cualquier servicio de hosting estático** - La salida de construcción es estándar

## Personalización

### Estilos

El proyecto usa Tailwind CSS para estilos. Personalice el tema modificando:

- `tailwind.config.js` - Configuración de Tailwind
- Los estilos de componentes están en línea con clases de Tailwind

## Catálogo PDF descargable

El botón **"Descargar catálogo PDF"** de la sección Catálogo sirve un archivo estático:

| | |
|---|---|
| Archivo en el repo | `public/catalogo-coplast.pdf` |
| URL pública | `/catalogo-coplast.pdf` |
| Botón | `src/components/CatalogSection.tsx` (constante `CATALOG_PDF`) |

### Actualizar el catálogo

1. Sustituir `public/catalogo-coplast.pdf` por el PDF nuevo, **con el mismo nombre**
2. Commit y push a `main` (Netlify redespliega solo)

No hay que tocar código: Vite copia `public/` a `dist/` y Netlify lo sirve desde su CDN.
El nombre no lleva el año a propósito, para que los enlaces ya compartidos sigan
funcionando cuando cambie el catálogo.

### Comprimir antes de subirlo

Conviene revisar el peso: el PDF que entrega el cliente suele venir con las imágenes
guardadas **sin pérdida** (PNG), lo que infla el archivo varias veces. La versión de
septiembre 2026 pasó de **18.4 MB a 5.8 MB** recomprimiendo solo las imágenes a JPEG,
sin diferencia visible y conservando el texto vectorial.

Lo ideal es pedir al diseñador que lo exporte con compresión JPEG desde el archivo
original. Si no es posible, sirve cualquier herramienta que recomprima los rasters
(por ejemplo Ghostscript con `-dPDFSETTINGS=/ebook`), cuidando dos cosas: no
rasterizar el texto y no tocar las máscaras de transparencia (`SMask`).

Un catálogo de ~16 páginas A4 debería quedar por debajo de ~6 MB. El público objetivo
consulta el sitio desde datos móviles, así que el peso importa.

# Configuración del correo (cotizaciones)

El envío usa **SMTP** (nodemailer). Todo se controla con **variables de entorno**, así
que cambiar entre el Gmail de pruebas y el correo del proveedor de Coplast **no requiere
tocar código** — solo cambiar estas variables.

| Variable | Qué es | Ejemplo |
|---|---|---|
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto | `587` (o `465`) |
| `SMTP_USER` | Usuario / correo | `tucorreo@gmail.com` |
| `SMTP_PASS` | Contraseña (o App Password) | `xxxx xxxx xxxx xxxx` |
| `SMTP_SECURE` | `true` si usas el puerto 465 (opcional) | `false` |
| `EMAIL_FROM` | Remitente que ve el cliente | `Coplast de México <ventas@coplastdemexico.com>` |
| `COTIZACION_NOTIFY_EMAIL` | Correo interno de Coplast que recibe copia de cada cotización (parametrizable) | `ventas@coplastdemexico.com` |

## Pruebas locales (Gmail) con `netlify dev`

1. Activa la verificación en 2 pasos en tu cuenta de Google.
2. Crea una **App Password** (Google → Seguridad → Contraseñas de aplicaciones).
3. Crea un archivo **`.env`** en la raíz del proyecto (ya está en `.gitignore`):

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tucorreo@gmail.com
   SMTP_PASS=la-app-password-de-16-digitos
   EMAIL_FROM=Pruebas Coplast <tucorreo@gmail.com>
   COTIZACION_NOTIFY_EMAIL=tucorreo@gmail.com
   ```
4. `npx netlify dev` → genera una cotización; te debe llegar el correo.

## Producción (proveedor de Coplast)

En Netlify → Site settings → Environment variables, define las mismas variables con los
datos SMTP del proveedor de Coplast (host/puerto/usuario/contraseña reales) y
`COTIZACION_NOTIFY_EMAIL` con la bandeja interna. Sin cambios de código.

> Si `SMTP_*` no está configurado, el PDF se genera y descarga igual; solo se omite el envío
> (la función lo reporta en el encabezado `X-Email-Sent`).


### Tema

El soporte para tema claro/oscuro es proporcionado por `next-themes`. Las preferencias de tema se guardan automáticamente en localStorage.

### Contenido

Actualice el contenido modificando los componentes React en el directorio `src/components`.

## Contribución

1. Fork del repositorio
2. Crear una rama de característica
3. Realizar los cambios
4. Ejecutar pruebas y linting
5. Enviar un pull request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
