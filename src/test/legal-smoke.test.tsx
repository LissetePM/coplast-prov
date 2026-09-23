import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { PENDING } from "@/config/legal";
import PrivacyNotice from "@/pages/PrivacyNotice";
import TermsAndConditions from "@/pages/TermsAndConditions";

const errorSpy = vi.spyOn(console, "error");
const warnSpy = vi.spyOn(console, "warn");

// React Router v6 announces its v7 future flags on every render. That noise is
// pre-existing and unrelated to these pages, so it is filtered out rather than
// silenced, which would also hide real warnings.
const isOurs = (call: unknown[]) => !String(call[0]).includes("React Router Future Flag");

beforeEach(() => {
  errorSpy.mockClear();
  warnSpy.mockClear();
});
afterEach(() => {
  expect(errorSpy.mock.calls.filter(isOurs)).toEqual([]);
  expect(warnSpy.mock.calls.filter(isOurs)).toEqual([]);
});

const renderPage = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>,
  );

describe("legal pages", () => {
  it("privacy notice renders and sets its meta tags", () => {
    renderPage(<PrivacyNotice />);
    expect(screen.getByRole("heading", { level: 1, name: /Aviso de Privacidad Integral/ })).toBeInTheDocument();
    expect(document.title).toContain("Aviso de Privacidad");
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"))
      .toBe("https://coplastdemexico.com/aviso-de-privacidad");
    // No cookie banner and no cookie policy: the site has no trackers.
    expect(screen.queryByText(/política de cookies/i)).not.toBeInTheDocument();
  });

  // Guards the one mistake that must never reach production: shipping a legal
  // page that still shows a placeholder where a real legal datum belongs.
  it("neither document ships an unconfirmed placeholder", () => {
    const { unmount } = renderPage(<PrivacyNotice />);
    expect(screen.queryByText(PENDING)).not.toBeInTheDocument();
    unmount();
    renderPage(<TermsAndConditions />);
    expect(screen.queryByText(PENDING)).not.toBeInTheDocument();
  });

  it("terms render with jurisdiction left pending", () => {
    renderPage(<TermsAndConditions />);
    expect(screen.getByRole("heading", { level: 1, name: /Términos y Condiciones/ })).toBeInTheDocument();
    expect(document.title).toContain("Términos y Condiciones");
    expect(screen.getByRole("heading", { name: /Legislación aplicable/ })).toBeInTheDocument();
  });
});
