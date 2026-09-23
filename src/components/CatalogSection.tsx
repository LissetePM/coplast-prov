import { motion } from "framer-motion";
import { Eye, Download, MessageCircle, type LucideIcon } from "lucide-react";
import { whatsappLink } from "@/config/business";
import { IS_IOS, IS_IN_APP_BROWSER, getIabName } from "@/lib/browser";

const WHATSAPP_URL = whatsappLink(
  "Hola, me gustaría recibir el catálogo de productos de Coplast de México.",
);

// Archivo estático en public/. Para publicar un catálogo nuevo se sustituye ese
// PDF y se redespliega: la ruta no cambia, así los enlaces ya compartidos siguen
// funcionando. Por eso el nombre no lleva año.
const CATALOG_PDF = "/catalogo-coplast.pdf";

// iOS ignora el atributo download y los in-app browsers de redes sociales además
// lo bloquean, así que ahí el PDF se abre en el visor y el usuario lo guarda a mano.
const OPENS_IN_VIEWER = IS_IOS || IS_IN_APP_BROWSER;

type CatalogOption = {
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  href: string;
  external: boolean;
  downloadAs?: string;
  note?: string;
  accent: string;
  ctaBg: string;
  iconBg: string;
  iconColor: string;
};

const options: CatalogOption[] = [
  {
    icon: Eye, title: "Ver catálogo en línea",
    desc: "Consulta nuestras líneas de producto y presentaciones disponibles.",
    cta: "Ver catálogo", href: "#productos", external: false,
    accent: "border-lime hover:shadow-lime/20", ctaBg: "bg-lime text-lime-foreground",
    iconBg: "bg-lime/15", iconColor: "text-lime",
  },
  {
    icon: Download, title: "Descargar catálogo PDF",
    desc: "Descarga nuestro catálogo completo en formato PDF para consulta offline.",
    cta: OPENS_IN_VIEWER ? "Ver catálogo PDF" : "Descargar PDF",
    href: CATALOG_PDF,
    external: OPENS_IN_VIEWER,
    downloadAs: OPENS_IN_VIEWER ? undefined : "Catalogo-Coplast.pdf",
    note: IS_IN_APP_BROWSER
      ? `Estás en ${getIabName()}: para guardarlo, abre la página en Safari o Chrome.`
      : IS_IOS
        ? 'Se abre en otra pestaña. Guárdalo con el botón compartir ↑ → "Guardar en Archivos".'
        : undefined,
    accent: "border-accent hover:shadow-accent/20", ctaBg: "bg-accent text-accent-foreground",
    iconBg: "bg-accent/15", iconColor: "text-accent-foreground",
  },
  {
    icon: MessageCircle, title: "Pedir por WhatsApp",
    desc: "Escríbenos y te enviamos el catálogo actualizado directo a tu teléfono.",
    cta: "Pedir por WhatsApp", href: WHATSAPP_URL, external: true,
    accent: "border-whatsapp hover:shadow-whatsapp/20", ctaBg: "bg-whatsapp text-whatsapp-foreground",
    iconBg: "bg-whatsapp/15", iconColor: "text-whatsapp",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 16 } },
};

const CatalogSection = () => (
  <section id="catalogo" className="py-20 lg:py-28 bg-primary relative overflow-hidden">
    {/* Animated background accent */}
    <motion.div
      className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
      style={{ background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)" }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />

    <div className="container mx-auto relative">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-accent font-semibold text-sm tracking-[3px] uppercase mb-3">Catálogo</p>
        <h2 className="text-3xl lg:text-[40px] font-bold text-primary-foreground tracking-tight leading-tight mb-4">
          Catálogo Temporada Avícola 2026
        </h2>
        <p className="text-primary-foreground/60 text-lg max-w-xl">
          Elige la forma más conveniente para conocer toda nuestra oferta de productos.
        </p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {options.map((o) => (
          <motion.a
            key={o.title}
            href={o.href}
            target={o.external ? "_blank" : undefined}
            rel={o.external ? "noopener noreferrer" : undefined}
            download={o.downloadAs}
            className={`group bg-card rounded-xl border-2 ${o.accent} p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}
            variants={cardVariant}
            whileHover={{ scale: 1.03 }}
          >
            <div className={`w-14 h-14 rounded-xl ${o.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <o.icon className={`w-7 h-7 ${o.iconColor}`} />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">{o.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{o.desc}</p>
            <span className={`inline-flex items-center px-5 py-2.5 rounded-lg font-bold text-sm ${o.ctaBg} transition-all group-hover:brightness-110 group-hover:gap-2 gap-1`}>
              {o.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
            {o.note && (
              <p className="text-xs text-muted-foreground leading-snug mt-4">{o.note}</p>
            )}
          </motion.a>
        ))}
      </motion.div>
    </div>
  </section>
);

export default CatalogSection;
