import { motion } from "framer-motion";
import farmPhoto640 from "@/assets/about/coplast-granja-avicola-mexico-640.webp";
import farmPhoto960 from "@/assets/about/coplast-granja-avicola-mexico-960.webp";
import farmPhoto1280 from "@/assets/about/coplast-granja-avicola-mexico-1280.webp";

// Three widths of the same 2:1 photo. The browser downloads exactly one: a
// phone takes the 640 (40 KB) instead of the full-size 154 KB.
const FARM_PHOTO_SRCSET = [
  `${farmPhoto640} 640w`,
  `${farmPhoto960} 960w`,
  `${farmPhoto1280} 1280w`,
].join(", ");

// The photo sits in the right column: half the container from lg up, nearly the
// full viewport once the grid stacks on phones.
const FARM_PHOTO_SIZES = "(min-width: 1024px) 45vw, 92vw";

const badges = [
  { label: "Sector avícola", color: "bg-destructive/10 text-destructive" },
  { label: "Mayoreo", color: "bg-accent/20 text-accent-foreground" },
  { label: "Fabricante directo", color: "bg-primary/10 text-primary" },
];

const AboutSection = () => (
  <section id="nosotros" className="py-20 lg:py-28 bg-cream">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
        >
          <p className="text-lime font-semibold text-sm tracking-[3px] uppercase">Quiénes Somos</p>
          <h2 className="text-3xl lg:text-[40px] font-bold text-foreground tracking-tight leading-tight">
            Soluciones plásticas para el sector avícola y ganadero
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Coplast de México es un fabricante mexicano especializado en implementos plásticos funcionales para el sector avícola y animal. Nuestros productos están diseñados para cubrir las necesidades operativas y comerciales de granjas, distribuidores y negocios del ramo pecuario.
            </p>
            <p>
              Combinamos durabilidad, funcionalidad y fabricación responsable para ofrecer soluciones que facilitan el trabajo diario en el campo mexicano, con una atención directa y cercana que distingue a nuestra marca.
            </p>
          </div>
          <motion.div
            className="flex flex-wrap gap-3 pt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {badges.map((b, i) => (
              <motion.span
                key={b.label}
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${b.color} transition-transform hover:scale-105`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                {b.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* 3/2 on phones gives the photo real presence (it would be only ~180px
            tall at its native 2:1); from sm up the full frame is shown uncropped. */}
        <motion.div
          className="aspect-[3/2] sm:aspect-[2/1] rounded-2xl border-2 border-primary/10 overflow-hidden"
          initial={{ opacity: 0, x: 30, rotate: 2 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={farmPhoto960}
            srcSet={FARM_PHOTO_SRCSET}
            sizes={FARM_PHOTO_SIZES}
            alt="Productor avícola mexicano acomodando comederos y bebederos Coplast entre sus gallinas, dentro de un galpón de granja al amanecer."
            width={1280}
            height={640}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
