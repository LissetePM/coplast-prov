import { MessageCircle, Eye, Factory, Truck, Award, ShieldCheck, Gem, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappLink } from "@/config/business";
import bebederoPiso from "@/assets/hero/bebedero-piso.webp";
import comederoParaGallo from "@/assets/hero/comedero-para-gallo.webp";
import comederoCampana from "@/assets/hero/comedero-campana.webp";
import comederoLamina from "@/assets/hero/comedero-lamina.webp";
import mayoreoDirecto from "@/assets/hero/mayoreo-directo.webp";
import bebederoAutomatico from "@/assets/hero/bebedero-automatico.webp";

const WHATSAPP_URL = whatsappLink(
  "Hola, me interesa conocer los productos avícolas de Coplast de México y solicitar una cotización.",
);

// Imported rather than referenced from /public so Vite fingerprints them for
// long-term caching and fails the build if a file goes missing, instead of
// shipping a 404 into the hero. Filenames stay in Spanish, like every other
// client-provided product photo in this repo.
const products = [
  { image: bebederoPiso, name: "Bebederos de Piso" },
  { image: comederoCampana, name: "Comedero Tolva" },
  { image: comederoParaGallo, name: "Comederos para gallo" },
  { image: comederoLamina, name: "Comederos de Lámina" },
  { image: bebederoAutomatico, name: "Bebederos Automáticos" },
  { image: mayoreoDirecto, name: "Mayoreo Directo" },
];

const particles = [
  { size: 8, top: "20%", left: "8%", delay: 0 },
  { size: 5, top: "60%", left: "82%", delay: 1.5 },
  { size: 12, top: "78%", left: "22%", delay: 3 },
  { size: 6, top: "35%", left: "67%", delay: 2 },
  { size: 4, top: "14%", left: "52%", delay: 4 },
  { size: 7, top: "50%", left: "40%", delay: 1 },
];

const stats = [
  { num: "+20", label: "Años de experiencia" },
  { num: "32", label: "Estados cubiertos" },
  { num: "100%", label: "Material virgen" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 180, damping: 18 },
  },
};

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-svh flex flex-col items-stretch bg-primary overflow-hidden"
    >
      {/* ── Background radial blobs ── */}
      <motion.div
        className="absolute -right-32 -top-32 w-[700px] h-[700px] rounded-full opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--lime)) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-48 bottom-0 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--yellow)) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Dot pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20h1v1h-1z'/%3E%3Cpath d='M0 0h1v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Gold floating particles ── */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              background: "rgba(245,168,0,0.22)",
            }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>

      {/* ── Field scene SVG ── */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-[1]"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a6b30" />
            <stop offset="100%" stopColor="#0d3a18" />
          </linearGradient>
        </defs>
        {/* Rolling hills */}
        <path
          d="M0 160 Q180 80 360 140 Q540 200 720 120 Q900 40 1080 130 Q1260 220 1440 140 L1440 260 L0 260Z"
          fill="url(#grass)"
          opacity="0.45"
        />
        <path
          d="M0 200 Q200 170 400 190 Q600 210 800 175 Q1000 140 1200 180 Q1350 205 1440 190 L1440 260 L0 260Z"
          fill="#0d4020"
          opacity="0.6"
        />
        <rect x="0" y="248" width="1440" height="12" fill="#0a2e12" opacity="0.75" />
        {/* Grass blades */}
        <g opacity="0.55" fill="#2d8a40">
          {[80, 88, 95, 300, 308, 900, 1200, 1208].map((x, i) => (
            <rect key={i} x={x} y={244 - (i % 3) * 4} width="3" height={14 + (i % 3) * 4} rx="1.5" />
          ))}
        </g>
        {/* Rooster silhouettes */}
        <g fill="#0a2e12" opacity="0.4">
          <ellipse cx="130" cy="250" rx="18" ry="7" />
          <ellipse cx="118" cy="243" rx="9" ry="6" />
          <path d="M126 238 L130 233 L134 238Z" />
          <ellipse cx="1300" cy="250" rx="18" ry="7" />
          <ellipse cx="1312" cy="243" rx="9" ry="6" />
          <path d="M1304 238 L1308 233 L1312 238Z" />
        </g>
      </svg>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center py-28 lg:py-0 px-5 lg:px-8">

          {/* LEFT — Text */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
              style={{
                background: "rgba(58,170,53,0.15)",
                borderColor: "rgba(58,170,53,0.5)",
                color: "#7de87a",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-lime"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Fabricante Mexicano · Hecho en México
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-primary-foreground text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight"
              style={{ textWrap: "balance" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Implementos avícolas{" "}
              <span className="text-accent">directo del fabricante</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-primary-foreground/75 text-lg lg:text-xl max-w-prose leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Bebederos, comederos y soluciones plásticas para granjas, distribuidores y
              compradores de mayoreo en toda la República Mexicana.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-display font-bold text-lg transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-[0_8px_30px_-4px_hsl(var(--yellow)/0.4)]"
              >
                <MessageCircle className="w-5 h-5" />
                Cotiza por WhatsApp →
              </a>
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/30 hover:border-primary-foreground hover:bg-primary-foreground/10 text-primary-foreground px-8 py-4 rounded-xl font-display font-bold text-lg transition-all"
              >
                <Eye className="w-5 h-5" />
                Ver catálogo 2026
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-8 pt-6 border-t border-primary-foreground/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display font-extrabold text-[2rem] leading-none"
                    style={{ color: "hsl(var(--yellow))" }}
                  >
                    {s.num}
                  </div>
                  <div className="text-xs text-primary-foreground/50 tracking-wider uppercase mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Product card grid */}
          <motion.div
            className="relative flex justify-center items-end"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.2, 0, 0, 1] }}
          >
            {/* Glow orb */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(245,168,0,0.15) 0%, transparent 65%)",
                transform: "scale(1.15)",
              }}
            />

            <div className="relative w-full max-w-sm">
              {/* Card */}
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* 6-product grid */}
                <motion.div
                  className="grid grid-cols-3 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {products.map((prod) => (
                    <motion.div
                      key={prod.name}
                      variants={cardItemVariants}
                      whileHover={{ y: -4 }}
                      className="group flex flex-col items-center gap-2 rounded-2xl py-3 px-2 cursor-default transition-shadow hover:shadow-lg"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      {/* alt="" on purpose: the product name is rendered right
                          below, so a description here would be read twice. */}
                      <img
                        src={prod.image}
                        alt=""
                        width={600}
                        height={600}
                        decoding="async"
                        className="h-14 w-14 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                      />
                      <span
                        className="text-center font-bold tracking-wide uppercase leading-tight"
                        style={{ fontSize: "0.6rem", color: "hsl(var(--primary))" }}
                      >
                        {prod.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Feature rows */}
                <motion.div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(58,170,53,0.12)",
                    border: "1px solid rgba(58,170,53,0.3)",
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <ShieldCheck className="w-6 h-6 shrink-0" style={{ color: "#7de87a" }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#7de87a" }}>
                      Calidad de fabricación
                    </div>
                    <div className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
                      Fabricados exclusivamente con material virgen de alta resistencia
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(26,68,128,0.25)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.95, duration: 0.5 }}
                >
                  <MapPin className="w-6 h-6 shrink-0 text-accent" />
                  <div>
                    <div className="font-bold text-sm text-accent">Cobertura Nacional</div>
                    <div className="text-xs leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
                      Envíos a toda la República Mexicana
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Hecho en México badge */}
              <motion.div
                className="absolute -bottom-5 -right-3 font-display font-extrabold text-[0.65rem] tracking-widest uppercase whitespace-nowrap px-4 py-2 rounded-full"
                style={{
                  background: "hsl(var(--primary))",
                  border: "2px solid hsl(var(--yellow))",
                  color: "hsl(var(--yellow))",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 14 }}
              >
                🦅 Hecho en México
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom trust strip ── */}
      <motion.div
        className="relative z-10 bg-primary-foreground/10 backdrop-blur-sm border-t border-primary-foreground/10 mt-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="container mx-auto py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-primary-foreground/70 text-sm font-medium">
          <motion.span
            className="flex items-center gap-2"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Award className="w-4 h-4 text-accent" />
            Hecho en México 🇲🇽
          </motion.span>
          <span className="hidden sm:inline text-primary-foreground/30">·</span>
          <span className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-lime" />
            Fabricante directo
          </span>
          <span className="hidden sm:inline text-primary-foreground/30">·</span>
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-accent" />
            Distribución nacional
          </span>
          <span className="hidden sm:inline text-primary-foreground/30">·</span>
          <span className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-lime" />
            Material virgen
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
