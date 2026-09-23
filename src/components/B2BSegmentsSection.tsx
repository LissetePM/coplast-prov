import { motion } from "framer-motion";
import { Egg, Store, ShoppingBag, Package, Repeat } from "lucide-react";

const segments = [
  { icon: Egg, label: "Granjas avícolas", color: "border-destructive/30 bg-destructive/5 hover:bg-destructive/10", iconColor: "text-destructive" },
  { icon: Store, label: "Distribuidores agropecuarios", color: "border-lime/30 bg-lime/5 hover:bg-lime/10", iconColor: "text-lime" },
  { icon: ShoppingBag, label: "Tiendas de insumos", color: "border-accent/30 bg-accent/5 hover:bg-accent/10", iconColor: "text-accent-foreground" },
  { icon: Package, label: "Compradores de mayoreo", color: "border-primary/30 bg-primary/5 hover:bg-primary/10", iconColor: "text-primary" },
  { icon: Repeat, label: "Revendedores", color: "border-green/30 bg-green/5 hover:bg-green/10", iconColor: "text-green" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 180, damping: 16 } },
};

const B2BSegmentsSection = () => (
  <section className="py-20 lg:py-28 bg-cream">
    <div className="container mx-auto">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lime font-semibold text-sm tracking-[3px] uppercase mb-3">Nuestros Clientes</p>
        <h2 className="text-3xl lg:text-[40px] font-bold text-foreground tracking-tight leading-tight">
          Atendemos a
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {segments.map((s) => (
          <motion.div
            key={s.label}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 ${s.color} cursor-default transition-all duration-300`}
            variants={card}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-sm">
              <s.icon className={`w-6 h-6 ${s.iconColor} shrink-0`} />
            </div>
            <span className="font-display font-bold text-foreground text-sm text-center">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default B2BSegmentsSection;
