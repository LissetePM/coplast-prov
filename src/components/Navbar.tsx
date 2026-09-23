import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo-coplast.webp";
import { whatsappLink } from "@/config/business";
import { useCart } from "@/context/CartContext";

// Root-relative anchors so the nav still reaches the home sections from the
// legal routes, where a bare "#productos" would resolve to nothing.
const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Productos", href: "/#productos" },
  { label: "¿Por qué Coplast?", href: "/#por-que" },
  { label: "Contacto", href: "/#contacto" },
];

const WHATSAPP_URL = whatsappLink(
  "Hola, me interesa conocer los productos avícolas de Coplast de México y solicitar una cotización.",
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lines, totalItems, openCart, requestWhatsappFlow } = useCart();
  const hasCart = lines.length > 0;

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasCart) {
      e.preventDefault();
      requestWhatsappFlow();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 bg-card transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_8px_0_rgb(0_0_0/0.08)]" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20">
        <a href="/#inicio" className="flex items-center gap-2">
          <img src={logoImg} alt="Coplast de México" className="h-10 w-auto" />
          <span className="font-display font-bold text-lg tracking-tight hidden sm:inline text-primary">
            COPLAST
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-display font-bold text-sm transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Cotizar por WhatsApp
          </a>
          {/* Carrito — desktop */}
          <button
            onClick={openCart}
            aria-label="Ver cotización"
            className="relative p-2 bg-primary text-primary-foreground rounded-full hover:brightness-110 transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[17px] h-[17px] px-0.5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: carrito + hamburguesa */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={openCart}
            aria-label="Ver cotización"
            className="relative p-2 bg-primary text-primary-foreground rounded-full hover:brightness-110 transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[17px] h-[17px] px-0.5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-0 top-16 bg-card z-40 flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-foreground font-display font-bold text-2xl hover:text-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-display font-bold text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <MessageCircle className="w-5 h-5" />
              Cotizar por WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
