import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/business";
import { useCart } from "@/context/CartContext";

const WHATSAPP_URL = whatsappLink(
  "Hola, me interesa conocer los productos avícolas de Coplast de México y solicitar una cotización.",
);

const WhatsAppFAB = () => {
  const { lines, requestWhatsappFlow } = useCart();
  const hasCart = lines.length > 0;

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasCart) {
      e.preventDefault();
      requestWhatsappFlow();
    }
  };

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-whatsapp text-whatsapp-foreground rounded-full flex items-center justify-center shadow-[0_6px_20px_0_hsl(var(--whatsapp)/0.4)] hover:brightness-110 transition-all"
      aria-label={hasCart ? "Cotizar carrito por WhatsApp" : "Contactar por WhatsApp"}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 12 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.div>
    </motion.a>
  );
};

export default WhatsAppFAB;
