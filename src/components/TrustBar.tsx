import { Bird, Factory, Flag, Truck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Bird, label: "Sector Avícola" },
  { icon: Factory, label: "Fabricante Directo" },
  { icon: Flag, label: "Hecho en México" },
  { icon: Truck, label: "Envíos Nacionales" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 15 } },
};

const TrustBar = () => (
  <section className="bg-accent py-6">
    <div className="container mx-auto">
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {items.map((i) => (
          <motion.div
            key={i.label}
            className="flex flex-col items-center gap-2 text-center group"
            variants={item}
          >
            <div className="w-14 h-14 rounded-xl bg-accent-foreground/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <i.icon className="w-8 h-8 text-accent-foreground" />
            </div>
            <span className="text-sm font-bold text-accent-foreground">{i.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustBar;
