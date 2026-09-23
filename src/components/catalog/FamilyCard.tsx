import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUSINESS, whatsappLink } from "@/config/business";
import { money } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import type { Family } from "@/types/catalog";

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 140, damping: 18 } },
};

export default function FamilyCard({ family }: { family: Family }) {
  const { add } = useCart();
  const availableVariants = family.variants.filter((v) => v.available);
  const [selectedSku, setSelectedSku] = useState(availableVariants[0]?.sku ?? family.variants[0].sku);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Carousel: [family, ...variants that have a photo]. Default shows family.
  const slides = useMemo(() => {
    const s: { sku: string | null; img: string }[] = [{ sku: null, img: family.image }];
    for (const v of family.variants) {
      if (v.variantImage) s.push({ sku: v.sku, img: v.variantImage });
    }
    return s;
  }, [family]);
  const [slideIndex, setSlideIndex] = useState(0);
  const hasCarousel = slides.length > 1;
  const currentImage = slides[Math.min(slideIndex, slides.length - 1)].img;

  const selectedVariant = family.variants.find((v) => v.sku === selectedSku) ?? family.variants[0];
  const isByPack = selectedVariant.piecesPerPack != null && selectedVariant.packPrice != null;
  const unit = isByPack ? "pack" : "piece";
  const unitNoun = selectedVariant.priceUnit.replace(/^por\s+/i, "");
  const isOutOfStock = !selectedVariant.available;

  // The client has not confirmed a price for this variant: the card shows
  // "Consulta precio" and sends the customer to WhatsApp instead of the cart.
  // The `currentPrice == null` half is a safety net, in case a future CSV
  // leaves the price empty without marking the row as quote-on-request.
  const isQuoteOnRequest = selectedVariant.quoteOnRequest || selectedVariant.currentPrice == null;
  const priceRequestMessage =
    `Hola ${BUSINESS.name}, quiero conocer el precio de ` +
    `${family.product} — ${selectedVariant.label} (SKU ${selectedVariant.sku}).`;

  const colors = selectedVariant.availableColors;
  const activeColor = colors.length
    ? colors.includes(selectedColor ?? "")
      ? selectedColor
      : colors[0]
    : null;

  // Navigate through photos; landing on a variant selects it.
  const navigate = (dir: 1 | -1) => {
    const next = (slideIndex + dir + slides.length) % slides.length;
    setSlideIndex(next);
    if (slides[next].sku) setSelectedSku(slides[next].sku!);
  };
  // Choosing a variant by button jumps to its photo (or family photo if none).
  const selectVariant = (sku: string) => {
    setSelectedSku(sku);
    const idx = slides.findIndex((s) => s.sku === sku);
    setSlideIndex(idx >= 0 ? idx : 0);
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    add(family, selectedVariant, quantity, activeColor);
    toast.success(`Agregado: ${family.product} ${selectedVariant.label}`, {
      description: `${quantity} ${unit === "pack" ? "paquete" : "pieza"}${quantity > 1 ? "s" : ""}${activeColor ? ` · ${activeColor}` : ""}`,
    });
    setQuantity(1);
  };

  return (
    <motion.div
      variants={cardVariant}
      className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden transition-shadow hover:shadow-[0_20px_40px_-12px_rgb(0_0_0/0.15)]"
    >
      {/* Image with family <-> variant arrows */}
      <div className="relative bg-muted/40 aspect-[16/9] flex items-center justify-center overflow-hidden">
        <img
          src={currentImage}
          alt={slides[slideIndex]?.sku ? `${family.product} ${selectedVariant.label}` : family.product}
          loading="lazy"
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {hasCarousel && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={() => navigate(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-1.5 shadow hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => navigate(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-1.5 shadow hover:bg-background transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {family.isNew && (
            <Badge className="bg-destructive text-destructive-foreground border-0">Nuevo</Badge>
          )}
          {selectedVariant.onSale && (
            <Badge className="bg-green text-green-foreground border-0">Oferta</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs font-semibold text-lime uppercase tracking-wider">{family.category}</p>
        <h3 className="font-display font-bold text-lg text-foreground leading-tight mt-1">
          {family.product}
        </h3>
        {(selectedVariant.description || family.description) && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-3">
            {selectedVariant.description || family.description}
          </p>
        )}

        {/* Variant selector (size / model) */}
        {family.variants.length > 1 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1.5">Elige una opción:</p>
            <div className="flex flex-wrap gap-1.5">
              {family.variants.map((v) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => selectVariant(v.sku)}
                  disabled={!v.available}
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    v.sku === selectedSku
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color selector (does not change price) */}
        {colors.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1.5">Color:</p>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium border transition-colors ${
                    c === activeColor
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mt-4">
          {selectedVariant.quoteOnRequest || selectedVariant.currentPrice == null ? (
            <>
              <p className="font-display font-bold text-2xl text-foreground">Consulta precio</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Escríbenos para conocer el precio y la presentación de este producto.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-end gap-2">
                {selectedVariant.onSale && selectedVariant.basePrice != null && (
                  <span className="text-sm text-muted-foreground line-through">
                    {money(selectedVariant.basePrice)}
                  </span>
                )}
                <span className={`font-display font-bold text-2xl ${selectedVariant.onSale ? "text-green" : "text-foreground"}`}>
                  {money(selectedVariant.currentPrice)}
                </span>
                <span className="text-sm text-muted-foreground mb-0.5">/ {unitNoun}</span>
              </div>
              {isByPack ? (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Paquete de {selectedVariant.piecesPerPack} pzas{" "}
                  <span className="font-semibold text-foreground">({money(selectedVariant.packPrice!)})</span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-0.5">Venta por {unitNoun} · consulta el paquete</p>
              )}
            </>
          )}
        </div>

        {/* Quote on request: contact only, never the cart (no price to total) */}
        {isQuoteOnRequest ? (
          <div className="mt-auto pt-4 border-t border-border">
            <Button asChild className="w-full gap-1.5">
              <a href={whatsappLink(priceRequestMessage)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Consultar precio
              </a>
            </Button>
          </div>
        ) : (
        /* Stepper + add */
        <div className="mt-auto pt-4 border-t border-border flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg">
            <button
              type="button"
              aria-label="Quitar uno"
              onClick={() => setQuantity((c) => Math.max(1, c - 1))}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              aria-label="Agregar uno"
              onClick={() => setQuantity((c) => c + 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground w-14 leading-tight">
            {unit === "pack" ? "paquete" : "pieza"}{quantity > 1 ? "s" : ""}
          </span>
          <Button onClick={handleAdd} disabled={isOutOfStock} className="flex-1 gap-1.5">
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? "Sin stock" : "Agregar"}
          </Button>
        </div>
        )}
      </div>
    </motion.div>
  );
}
