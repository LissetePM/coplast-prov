import { motion } from "framer-motion";
import { ShieldCheck, Palette, Headset, Leaf } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Calidad y durabilidad", desc: "Productos fabricados con materiales resistentes para un uso prolongado en condiciones de campo.", iconBg: "bg-destructive", iconColor: "text-destructive-foreground" },
  { icon: Palette, title: "Variedad de colores", desc: "Distintas capacidades, tamaños y colores para cubrir las necesidades de cada operación.", iconBg: "bg-lime", iconColor: "text-lime-foreground" },
  { icon: Headset, title: "Atención B2B directa", desc: "Comunicación cercana y personalizada para distribuidores, granjas y compradores de mayoreo.", iconBg: "bg-primary", iconColor: "text-primary-foreground" },
  { icon: Leaf, title: "Fabricación responsable", desc: "Compromiso con procesos de manufactura conscientes y orientados a la responsabilidad ambiental.", iconBg: "bg-green", iconColor: "text-green-foreground" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  show: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, stiffness: 150, damping: 18 } },
};

const WhyCoplastSection = () => (
  <section id="por-que" className="py-20 lg:py-28 bg-sky">
    <div className="container mx-auto">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lime font-semibold text-sm tracking-[3px] uppercase mb-3">Nuestra Diferencia</p>
        <h2 className="text-3xl lg:text-[40px] font-bold text-foreground tracking-tight leading-tight">
          ¿Por qué elegir Coplast de México?
        </h2>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            className="group flex gap-5 bg-card rounded-xl p-6 border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            variants={cardVariant}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-16 h-16 rounded-full ${f.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              <f.icon className={`w-8 h-8 ${f.iconColor}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyCoplastSection;
