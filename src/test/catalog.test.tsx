import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import FamilyCard from "@/components/catalog/FamilyCard";
import catalogData from "@/data/catalog.json";
import type { Catalog } from "@/types/catalog";

const catalog = catalogData as Catalog;

// Two sizes, no sale (34/34 and 44/44). Default selection is the first variant, MAM-2L.
const mamila = catalog.families.find((f) => f.id === "mamila-para-becerro-con-chupon")!;

// The 2026 catalog publishes no sale prices, so the sale rendering is exercised on a
// copy of TM-05 (153 -> 152.5). It is not the default variant, so the sale assertions
// below must select it first.
const tolvaMetalicaBase = catalog.families.find((f) => f.id === "tolva-metalica")!;
const tolvaMetalica = {
  ...tolvaMetalicaBase,
  variants: tolvaMetalicaBase.variants.map((v) =>
    v.sku === "TM-05"
      ? { ...v, basePrice: 153, salePrice: 152.5, currentPrice: 152.5, onSale: true, packPrice: 3050 }
      : v,
  ),
};

beforeEach(() => localStorage.clear());

describe("ProductCatalog", () => {
  it("renders families and category filter buttons", () => {
    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>,
    );
    expect(screen.getByText("Mamila para becerro con chupón")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
    for (const c of catalog.categories) {
      expect(screen.getByRole("button", { name: c })).toBeInTheDocument();
    }
  });
});

describe("FamilyCard — pricing", () => {
  it("crosses out base price and shows sale price when discounted", () => {
    render(
      <CartProvider>
        <FamilyCard family={tolvaMetalica} />
      </CartProvider>,
    );
    // TM-12 is selected by default and is not on sale; pick the discounted TM-05.
    fireEvent.click(screen.getByRole("button", { name: "5 kg" }));
    expect(screen.getByText("$153.00")).toHaveClass("line-through"); // base price
    expect(screen.getByText("$152.50")).toBeInTheDocument(); // current price (sale)
    expect(screen.getByText("Oferta")).toBeInTheDocument();
  });

  it("does not cross out any price when base and sale match", () => {
    render(
      <CartProvider>
        <FamilyCard family={mamila} />
      </CartProvider>,
    );
    expect(screen.getByText("$34.00")).not.toHaveClass("line-through");
    expect(screen.queryByText("Oferta")).not.toBeInTheDocument();
  });

  it("shows pack price in parentheses", () => {
    render(
      <CartProvider>
        <FamilyCard family={mamila} />
      </CartProvider>,
    );
    expect(screen.getByText(/Paquete de 60 pzas/)).toBeInTheDocument();
    expect(screen.getByText("($2,040.00)")).toBeInTheDocument(); // 34 * 60
  });
});

function CartProbe() {
  const { totalItems, subtotal } = useCart();
  return <div data-testid="probe">{`${totalItems}|${subtotal}`}</div>;
}

function CartIdsProbe() {
  const { lines } = useCart();
  return <div data-testid="ids">{lines.map((l) => l.id).join(",")}</div>;
}

describe("Cart", () => {
  it("adding a product sums 1 pack at the current price", () => {
    render(
      <CartProvider>
        <FamilyCard family={mamila} />
        <CartProbe />
      </CartProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    // 1 pack * (34 current price * 60 pieces) = 2040
    expect(screen.getByTestId("probe").textContent).toBe("1|2040");
  });
});

describe("FamilyCard — family/variant images", () => {
  const redondos = catalog.families.find((f) => f.id === "comederos-redondos")!;

  it("navigates family -> variants with arrows and jumping to the variant image on select", () => {
    render(
      <CartProvider>
        <FamilyCard family={redondos} />
      </CartProvider>,
    );
    // Read the expected paths from the catalog instead of hardcoding them, so a
    // change of image format (PNG -> WebP) does not break the navigation test.
    const [cmR05, cmR1K] = redondos.variants;
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", redondos.image); // family image by default
    fireEvent.click(screen.getByRole("button", { name: "Imagen siguiente" }));
    expect(img.getAttribute("src")).toBe(cmR05.variantImage); // 1st variant
    fireEvent.click(screen.getByRole("button", { name: "Imagen siguiente" }));
    expect(img.getAttribute("src")).toBe(cmR1K.variantImage); // 2nd variant
    // selecting by button jumps to that variant's image
    fireEvent.click(screen.getByRole("button", { name: "500 gr" }));
    expect(img.getAttribute("src")).toBe(cmR05.variantImage);
  });
});

describe("FamilyCard — quote on request (comedero lineal plástico 22 cm)", () => {
  // The only variant the 2026 catalog prints without a price.
  const separadores = catalog.families.find((f) => f.id === "comedero-lineal-plastico-con-rejilla-metalica")!;

  it("shows 'Consulta precio' and never a zero price", () => {
    render(
      <CartProvider>
        <FamilyCard family={separadores} />
      </CartProvider>,
    );
    expect(screen.getByText("Consulta precio")).toBeInTheDocument();
    // Intl.NumberFormat prints null as "$0.00" instead of throwing, so assert
    // explicitly that no price-shaped text leaked into the card.
    expect(screen.queryByText("$0.00")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Paquete de/)).not.toBeInTheDocument();
  });

  it("offers WhatsApp contact instead of the cart stepper", () => {
    render(
      <CartProvider>
        <FamilyCard family={separadores} />
      </CartProvider>,
    );
    expect(screen.queryByRole("button", { name: "Agregar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Agregar uno" })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Consultar precio/ });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(decodeURIComponent(link.getAttribute("href")!)).toContain("CLM-22");
  });

  it("keeps the cart empty even when add() is called directly", () => {
    function ForceAdd() {
      const { add } = useCart();
      return (
        <button type="button" onClick={() => add(separadores, separadores.variants[0], 1)}>
          forzar
        </button>
      );
    }
    render(
      <CartProvider>
        <ForceAdd />
        <CartProbe />
      </CartProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "forzar" }));
    expect(screen.getByTestId("probe").textContent).toBe("0|0");
  });

  it("is published without a price", () => {
    expect(separadores.variants.map((v) => v.label)).toEqual(["22 cm"]);
    for (const v of separadores.variants) {
      expect(v.quoteOnRequest).toBe(true);
      expect(v.currentPrice).toBeNull();
      expect(v.basePrice).toBeNull();
      expect(v.packPrice).toBeNull();
      expect(v.onSale).toBe(false);
    }
  });
});

describe("Catalog data — separadores para tolva", () => {
  it("publishes the 2026 catalog prices", () => {
    const sep = catalog.families.find((f) => f.id === "separadores-para-tolva-plus")!;
    expect(sep.variants.map((v) => [v.label, v.currentPrice])).toEqual([
      ["Chico", 13],
      ["Mediano", 14],
      ["Grande", 16],
    ]);
    for (const v of sep.variants) expect(v.quoteOnRequest).toBe(false);
  });
});

describe("FamilyCard — color selection (tolva tradicional)", () => {
  const tolva = catalog.families.find((f) => f.id === "tolva-tradicional")!;

  it("allows selecting a color and stores it in the cart line", () => {
    render(
      <CartProvider>
        <FamilyCard family={tolva} />
        <CartIdsProbe />
      </CartProvider>,
    );
    expect(screen.getByRole("button", { name: "Amarillo" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Negro" }));
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    // default variant TT-01 (1 kg) + color Negro
    expect(screen.getByTestId("ids").textContent).toBe("TT-01·Negro");
  });
});
