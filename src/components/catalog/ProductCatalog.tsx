import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import catalogData from "@/data/catalog.json";
import type { Catalog } from "@/types/catalog";
import FamilyCard from "./FamilyCard";

const catalog = catalogData as Catalog;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const cat = searchParams.get("cat");
    return cat && catalog.categories.includes(cat) ? cat : "Todos";
  });
  const [query, setQuery] = useState("");

  // Sync category with URL param when navigating from ProductLinesSection
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat && catalog.categories.includes(cat)) {
      setActiveCategory(cat);
    } else if (!cat) {
      setActiveCategory("Todos");
    }
  }, [searchParams]);

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat);
    if (cat === "Todos") {
      setSearchParams((prev) => { prev.delete("cat"); return prev; }, { replace: true });
    } else {
      setSearchParams((prev) => { prev.set("cat", cat); return prev; }, { replace: true });
    }
  }

  function clearFilter() {
    setActiveCategory("Todos");
    setSearchParams((prev) => { prev.delete("cat"); return prev; }, { replace: true });
  }

  const families = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.families.filter((f) => {
      const okCat = activeCategory === "Todos" || f.category === activeCategory;
      const okQuery =
        !q ||
        f.product.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.variants.some((v) => v.sku.toLowerCase().includes(q));
      return okCat && okQuery;
    });
  }, [activeCategory, query]);

  const categories = ["Todos", ...catalog.categories];
  const isFiltered = activeCategory !== "Todos";

  return (
    <section id="productos" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          className="max-w-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lime font-semibold text-sm tracking-[3px] uppercase mb-3">Nuestro Catálogo</p>
          <h2 className="text-3xl lg:text-[40px] font-bold text-foreground tracking-tight leading-tight">
            Elige tus productos y arma tu cotización
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Selecciona el tamaño de cada modelo, mira el precio por pieza y por paquete, y agrega lo que
            necesites. Al terminar, genera tu cotización.
          </p>
        </motion.div>

        {/* Active filter banner */}
        <AnimatePresence>
          {isFiltered && (
            <motion.div
              className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-primary/10 border border-primary/25 w-fit"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <SlidersHorizontal className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-primary font-medium">
                Mostrando solo: <strong>{activeCategory}</strong>
                <span className="text-primary/60 font-normal"> — hay más productos en otras categorías</span>
              </span>
              <button
                type="button"
                onClick={clearFilter}
                className="ml-1 flex items-center gap-1 text-xs text-primary/70 hover:text-primary font-semibold transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Ver todos
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter hint when no filter active */}
        <AnimatePresence>
          {!isFiltered && (
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium mb-6 w-fit"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              Filtra por categoría o busca por nombre para encontrar tu producto
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCategoryClick(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  c === activeCategory
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative lg:ml-auto lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto o SKU…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {families.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No encontramos productos con esos filtros.
          </p>
        ) : (
          <motion.div
            key={`${activeCategory}|${query}`}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {families.map((f) => (
              <FamilyCard key={f.id} family={f} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
