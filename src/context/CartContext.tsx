import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { BUSINESS } from "@/config/business";
import catalogData from "@/data/catalog.json";
import type { Catalog, Family, Variant } from "@/types/catalog";

const catalog = catalogData as Catalog;

/** SKU -> { family, variant } index for reconciling the saved cart. */
const variantsBySku = new Map<string, { family: Family; variant: Variant }>();
for (const family of catalog.families) {
  for (const variant of family.variants) {
    variantsBySku.set(variant.sku, { family, variant });
  }
}

/** A cart line: one variant (+ optional color) + how many packs/pieces. */
export interface CartLine {
  /** Line identity: sku, plus color if applicable (same SKU in 2 colors = 2 lines). */
  id: string;
  sku: string;
  familyId: string;
  product: string;
  variant: string;
  /** Chosen color (e.g. tolva tradicional), or null if the variant has no colors. */
  color: string | null;
  image: string;
  /** Unit of sale: pack if the variant has piecesPerPack, otherwise piece. */
  unit: "pack" | "piece";
  piecesPerPack: number | null;
  /** Price per piece (current). */
  unitPrice: number;
  /** Full pack price, or null. */
  packPrice: number | null;
  onSale: boolean;
  /** Number of packs (or pieces if unit is piece). */
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  add: (family: Family, variant: Variant, quantity?: number, color?: string | null) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  iva: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  pendingWhatsapp: boolean;
  requestWhatsappFlow: () => void;
  clearPendingWhatsapp: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "coplast.cart.v1";

/** Line total based on unit of sale. */
export function lineTotal(l: CartLine): number {
  if (l.unit === "pack" && l.packPrice != null) return l.quantity * l.packPrice;
  return l.quantity * l.unitPrice;
}

/**
 * Builds a line with fresh data from the catalog.
 *
 * Returns null for variants without a confirmed price ("Consulta precio"):
 * they must never reach the cart, or subtotal/IVA/total and the quote PDF
 * would silently treat a missing price as $0.00. This is the single choke
 * point for that rule — both `add()` and the localStorage reload go through
 * it, so neither can bypass the check.
 */
function buildLine(
  family: Family,
  variant: Variant,
  quantity: number,
  color: string | null = null,
): CartLine | null {
  if (variant.quoteOnRequest || variant.currentPrice == null) return null;
  return {
    id: color ? `${variant.sku}·${color}` : variant.sku,
    sku: variant.sku,
    familyId: family.id,
    product: family.product,
    variant: variant.label,
    color,
    image: family.image,
    unit: variant.piecesPerPack ? "pack" : "piece",
    piecesPerPack: variant.piecesPerPack,
    unitPrice: variant.currentPrice,
    packPrice: variant.packPrice,
    onSale: variant.onSale,
    quantity,
  };
}

/**
 * Reads the saved cart and reconciles it against the current catalog:
 * refreshes prices/names/images by SKU and drops SKUs that no longer exist
 * or are out of stock. Prevents quoting with stale prices.
 */
function loadCartFromStorage(): CartLine[] {
  let stored: unknown;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    stored = raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
  if (!Array.isArray(stored)) return [];
  const result: CartLine[] = [];
  for (const item of stored) {
    const part = item as Partial<CartLine>;
    if (typeof part?.sku !== "string") continue;
    const found = variantsBySku.get(part.sku);
    if (!found || !found.variant.available) continue;
    // keep the saved color only if the variant still offers it
    const color =
      typeof part.color === "string" && found.variant.availableColors.includes(part.color)
        ? part.color
        : null;
    // Drops saved lines whose variant has since become quote-on-request,
    // the same way it already drops SKUs that went out of stock.
    const line = buildLine(
      found.family,
      found.variant,
      Math.max(1, Math.floor(Number(part.quantity) || 1)),
      color,
    );
    if (line) result.push(line);
  }
  return result;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadCartFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingWhatsapp, setPendingWhatsapp] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const requestWhatsappFlow = () => { setIsCartOpen(true); setPendingWhatsapp(true); };
  const clearPendingWhatsapp = () => setPendingWhatsapp(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota/private mode errors */
    }
  }, [lines]);

  const add: CartContextValue["add"] = (family, variant, quantity = 1, color = null) => {
    const newLine = buildLine(family, variant, quantity, color);
    if (!newLine) return; // quote-on-request variants are contact-only
    setLines((prev) => {
      const existing = prev.find((l) => l.id === newLine.id);
      if (existing) {
        return prev.map((l) => (l.id === newLine.id ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, newLine];
    });
  };

  const setQuantity: CartContextValue["setQuantity"] = (id, quantity) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  };

  const remove: CartContextValue["remove"] = (id) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

  const clear = () => setLines([]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0);
    const vat = subtotal * BUSINESS.ivaRate;
    return {
      lines,
      add,
      setQuantity,
      remove,
      clear,
      totalItems: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal,
      iva: vat,
      total: subtotal + vat,
      isCartOpen,
      openCart,
      closeCart,
      pendingWhatsapp,
      requestWhatsappFlow,
      clearPendingWhatsapp,
    };
  }, [lines, isCartOpen, pendingWhatsapp]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
