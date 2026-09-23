import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, MapPin, Flag } from "lucide-react";
import { BUSINESS, whatsappLink } from "@/config/business";

const WHATSAPP_URL = whatsappLink(
  "Hola, me interesa conocer los productos avícolas de Coplast de México y solicitar una cotización.",
);

const MAILTO_URL = `mailto:ventas@coplastdemexico.com?subject=${encodeURIComponent("Solicitud de cotización | Coplast de México")}&body=${encodeURIComponent(`Hola, me gustaría solicitar una cotización de productos de Coplast de México.

Nombre:
Empresa:
Ciudad/Estado:
Tipo de cliente: (Granja / Distribuidor / Mayoreo / Revendedor)
Productos de interés:
Cantidad estimada:
Teléfono de contacto:
Comentarios adicionales:`)}`;

const ContactSection = () => (
  <section id="contacto" className="py-20 lg:py-28">
    <div className="container mx-auto">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lime font-semibold text-sm tracking-[3px] uppercase mb-3">Contacto</p>
        <h2 className="text-3xl lg:text-[40px] font-bold text-foreground tracking-tight leading-tight">
          Cotiza con nosotros
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Email quotation */}
        <motion.div
          className="bg-card rounded-2xl border border-border p-8 space-y-6 order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-primary rounded-xl px-6 py-4">
            <h3 className="font-display font-bold text-xl text-primary-foreground">Solicita tu cotización</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Si representas una empresa, distribuidor o compras de mayoreo, puedes enviarnos tu solicitud con la información base para cotizar más rápido.
          </p>
          <a
            href={MAILTO_URL}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-display font-bold text-base transition-all hover:brightness-110 hover:scale-105 active:scale-95"
          >
            <Mail className="w-5 h-5" />
            Enviar correo de cotización
          </a>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>ventas@coplastdemexico.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>México</span>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp */}
        <motion.div
          className="bg-primary rounded-2xl p-8 space-y-6 order-1 lg:order-2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div
            className="w-14 h-14 rounded-2xl bg-whatsapp/20 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageCircle className="w-7 h-7 text-whatsapp" />
          </motion.div>
          <h3 className="font-display font-bold text-xl text-primary-foreground">Cotiza por WhatsApp</h3>
          <p className="text-primary-foreground/70 leading-relaxed">
            Escríbenos por WhatsApp para recibir atención directa y resolver dudas sobre productos, presentaciones y cotizaciones.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-whatsapp text-whatsapp-foreground px-8 py-4 rounded-xl font-display font-bold text-lg transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-[0_8px_30px_-4px_hsl(var(--whatsapp)/0.4)]"
          >
            <MessageCircle className="w-5 h-5" />
            Cotiza por WhatsApp
          </a>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-accent text-lg font-bold">
              <Phone className="w-5 h-5" />
              <span>{BUSINESS.phone}</span>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              Atención comercial directa para granjas, distribuidores y compradores de mayoreo.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
              <Flag className="w-4 h-4" />
              <span>Vendemos a toda la República Mexicana 🇲🇽</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
