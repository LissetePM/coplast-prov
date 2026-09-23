import { motion } from "framer-motion";
import { Droplets, UtensilsCrossed, Package, Rabbit, PawPrint, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const lines = [
  {
    icon: UtensilsCrossed,
    name: "Comederos",
    cat: "Comederos",
    desc: "Comederos de tolva, plato y bota en diferentes tamaños y presentaciones.",
    color: "border-t-accent",
    iconBg: "bg-accent/15",
    iconColor: "text-accent-foreground",
    ctaColor: "text-accent-foreground",
  },
  {
    icon: Droplets,
    name: "Bebederos",
    cat: "Bebederos",
    desc: "Bebederos plásticos en distintas capacidades para aves y animales de granja.",
    color: "border-t-destructive",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    ctaColor: "text-destructive",
  },
  {
    icon: Package,
    name: "Tolvas",
    cat: "Tolvas",
    desc: "Tolvas para almacenamiento y dispensado de alimento en granjas avícolas.",
    color: "border-t-lime",
    iconBg: "bg-lime/10",
    iconColor: "text-lime",
    ctaColor: "text-lime",
  },
  {
    icon: Rabbit,
    name: "Conejos",
    cat: "Conejos",
    desc: "Implementos especializados para la crianza y manejo de conejos.",
    color: "border-t-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    ctaColor: "text-primary",
  },
  {
    icon: PawPrint,
    name: "Mascotas",
    cat: "Mascotas",
    desc: "Accesorios y utensilios plásticos para el cuidado de mascotas.",
    color: "border-t-green",
    iconBg: "bg-green/10",
    iconColor: "text-green",
    ctaColor: "text-green",
  },
  {
    icon: BookOpen,
    name: "Catálogo completo",
    cat: null,
    desc: "Consulta todas nuestras líneas de producto, presentaciones y capacidades disponibles.",
    color: "border-t-accent",
    iconBg: "bg-accent/15",
    iconColor: "text-accent-foreground",
    ctaColor: "text-accent-foreground",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 150, damping: 18 } },
};

const ProductLinesSection = () => {
  const navigate = useNavigate();

  function goToCategory(cat: string | null) {
    navigate(cat ? `/?cat=${cat}` : "/");
    setTimeout(() => {
      document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  return (
  <section className="py-20 lg:py-28 bg-background">
    <div className="container mx-auto">
      <motion.div
        className="max-w-2xl mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lime font-semibold text-sm tracking-[3px] uppercase mb-3">Nuestros Productos</p>
        <h2 className="text-3xl lg:text-[40px] font-bold text-foreground tracking-tight leading-tight">
          Líneas de implementos
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Fabricamos implementos plásticos funcionales en diversas capacidades, tamaños y presentaciones.
        </p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {lines.map((line) => (
          <motion.div
            key={line.name}
            className={`group relative bg-card rounded-xl border border-border border-t-4 ${line.color} p-6 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgb(0_0_0/0.1)] hover:-translate-y-2`}
            variants={cardVariant}
            whileHover={{ scale: 1.03 }}
          >
            <div className={`w-14 h-14 rounded-xl ${line.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <line.icon className={`w-7 h-7 ${line.iconColor}`} />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">{line.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{line.desc}</p>
            <button
              type="button"
              onClick={() => goToCategory(line.cat)}
              className={`${line.ctaColor} font-bold text-sm hover:underline inline-flex items-center gap-1 transition-all group-hover:gap-2 bg-transparent p-0 border-0 cursor-pointer`}
            >
              {line.cat ? "Ver productos" : "Ver catálogo"}{" "}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
  );
};

export default ProductLinesSection;
