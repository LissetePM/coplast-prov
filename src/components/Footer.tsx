import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-coplast.webp";
import { Award } from "lucide-react";

// Root-relative anchors ("/#productos" instead of "#productos") so the footer
// keeps working from the legal routes, where a bare fragment would point at a
// section that is not on the page.
const footerLinks = {
  navegacion: [
    { label: "Inicio", href: "/#inicio" },
    { label: "Productos", href: "/#productos" },
    { label: "¿Por qué Coplast?", href: "/#por-que" },
    { label: "Contacto", href: "/#contacto" },
  ],
  productos: [
    { label: "Bebederos", href: "/#productos" },
    { label: "Comederos", href: "/#productos" },
    { label: "Implementos avícolas", href: "/#productos" },
    { label: "Catálogo completo", href: "/#catalogo" },
  ],
};

const legalLinks = [
  { label: "Aviso de Privacidad", to: "/aviso-de-privacidad" },
  { label: "Términos y Condiciones", to: "/terminos-y-condiciones" },
];

const Footer = () => (
  <footer className="bg-primary text-primary-foreground/70 pt-16 pb-8">
    <div className="container mx-auto">
      <motion.div
        className="grid sm:grid-cols-3 gap-12 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Coplast de México" className="h-12 w-auto" />
            <span className="font-display font-bold text-xl text-primary-foreground">COPLAST</span>
          </div>
          <p className="text-sm leading-relaxed">
            Fabricante mexicano de soluciones plásticas funcionales para el sector avícola y ganadero.
          </p>
          <div className="flex items-center gap-2 text-accent text-sm font-bold">
            <Award className="w-4 h-4" />
            Hecho en México 🇲🇽
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-primary-foreground text-sm uppercase tracking-wider mb-4">Navegación</h4>
          <ul className="space-y-2">
            {footerLinks.navegacion.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-sm hover:text-primary-foreground transition-colors hover:translate-x-1 inline-block">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-primary-foreground text-sm uppercase tracking-wider mb-4">Productos</h4>
          <ul className="space-y-2">
            {footerLinks.productos.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-sm hover:text-primary-foreground transition-colors hover:translate-x-1 inline-block">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="h-[2px] bg-accent/30 mb-8" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs">© 2025 Coplast de México · Todos los derechos reservados</p>
        <nav aria-label="Enlaces legales">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-xs underline underline-offset-4 hover:text-primary-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
