import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Download, Loader2, MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { money } from "@/lib/format";
import { BUSINESS, whatsappLink } from "@/config/business";
import { useCart, lineTotal, type CartLine } from "@/context/CartContext";
import { generateQuote, downloadBlob, cartLineToItem } from "@/lib/quote";
import QuoteDialog from "./QuoteDialog";
import { IS_IOS, IS_IN_APP_BROWSER, getIabName } from "@/lib/browser";

type WaStep = "idle" | "loading" | "ready";

interface WaResult {
  quoteId: string;
  blob: Blob;
  blobUrl: string;
  waUrl: string;
}

/** WhatsApp message with cart details and the quote ID. */
function buildWhatsAppMessage(lines: CartLine[], total: number, quoteId: string): string {
  const detail = lines
    .map((l) => {
      const u = l.unit === "pack" ? "paq" : "pza";
      const color = l.color ? ` ${l.color}` : "";
      return `• ${l.quantity} ${u} — ${l.product} ${l.variant}${color} (${l.sku}): ${money(lineTotal(l))}`;
    })
    .join("\n");
  return (
    `Hola ${BUSINESS.name}, quiero cotizar estos productos (Folio ${quoteId}):\n\n${detail}\n\n` +
    `Total estimado (con IVA): ${money(total)}\n\n¿Me pueden confirmar disponibilidad y precio final?`
  );
}

const COUNTDOWN_SECS = 4;

export default function CartFab() {
  const { lines, subtotal, iva, total, setQuantity, remove, clear, isCartOpen, closeCart, pendingWhatsapp, clearPendingWhatsapp } = useCart();
  const [waStep, setWaStep] = useState<WaStep>("idle");
  const [waResult, setWaResult] = useState<WaResult | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // On entering "ready": auto-download and start countdown only on desktop.
  // iOS and IAB are skipped: iOS navigates in the same tab with blob:, IAB blocks window.open.
  useEffect(() => {
    if (waStep !== "ready" || !waResult) return;
    if (!IS_IOS && !IS_IN_APP_BROWSER) {
      downloadBlob(waResult.blob, `${waResult.quoteId}.pdf`);
      setCountdown(COUNTDOWN_SECS);
      timerRef.current = setInterval(() => {
        setCountdown((n) => {
          if (n <= 1) {
            clearInterval(timerRef.current!);
            const win = window.open(waResult.waUrl, "_blank", "noopener,noreferrer");
            if (!win) setPopupBlocked(true);
            return 0;
          }
          return n - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current!);
    }
  }, [waStep, waResult]);

  const resetWhatsAppFlow = () => {
    clearInterval(timerRef.current!);
    if (waResult?.blobUrl) URL.revokeObjectURL(waResult.blobUrl);
    setWaStep("idle");
    setWaResult(null);
    setCountdown(COUNTDOWN_SECS);
    setPopupBlocked(false);
  };

  const quoteViaWhatsApp = async () => {
    if (lines.length === 0 || waStep !== "idle") return;
    setWaStep("loading");
    try {
      const { quoteId, blob } = await generateQuote({ mode: "whatsapp", items: lines.map(cartLineToItem) });
      const blobUrl = URL.createObjectURL(blob);
      const waUrl = whatsappLink(buildWhatsAppMessage(lines, total, quoteId));
      setWaResult({ quoteId, blob, blobUrl, waUrl });
      setWaStep("ready");
    } catch (e) {
      setWaStep("idle");
      toast.error("No se pudo generar la cotización", { description: e instanceof Error ? e.message : undefined });
    }
  };

  const handlePdfDownload = () => {
    if (!waResult) return;
    if (IS_IOS) {
      // window.open with blob URL on user gesture opens new tab on iOS
      // without navigating the main tab, preserving the WhatsApp redirect.
      window.open(waResult.blobUrl, "_blank", "noopener");
    } else {
      downloadBlob(waResult.blob, `${waResult.quoteId}.pdf`);
    }
  };

  // When another component calls requestWhatsappFlow(), trigger the flow
  // automatically as soon as the sheet is open and state is idle.
  useEffect(() => {
    if (pendingWhatsapp && isCartOpen && waStep === "idle") {
      clearPendingWhatsapp();
      quoteViaWhatsApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingWhatsapp, isCartOpen]);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => { if (!open) { closeCart(); resetWhatsAppFlow(); } }}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        {waStep === "loading" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="relative">
              <Loader2 className="w-14 h-14 animate-spin text-[hsl(var(--whatsapp))]" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold">Armando tu cotización…</p>
              <p className="text-sm text-muted-foreground">Generando PDF con folio único</p>
            </div>
          </div>
        ) : waStep === "ready" && waResult ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <div className="space-y-1">
              <p className="text-xl font-bold">¡Cotización lista!</p>
              <p className="text-sm text-muted-foreground">Folio <span className="font-mono font-semibold text-foreground">{waResult.quoteId}</span></p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <a
                href={waResult.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={IS_IOS || IS_IN_APP_BROWSER ? undefined : resetWhatsAppFlow}
                className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] rounded-lg py-3 font-bold hover:brightness-110 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Ir a WhatsApp
              </a>
              {popupBlocked && (
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center -mt-1">
                  WhatsApp no se abrió automáticamente (ventanas emergentes bloqueadas). Usa el botón de arriba.
                </p>
              )}
              {IS_IN_APP_BROWSER ? (
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  Estás en {getIabName()}. El PDF no se puede guardar desde aquí — Coplast ya recibió tu cotización por correo.
                  Para descargarlo, abre la página en Safari o Chrome.
                </p>
              ) : (
                <>
                  <button
                    onClick={handlePdfDownload}
                    className="w-full inline-flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {IS_IOS ? "Ver y guardar PDF" : "Volver a descargar PDF"}
                  </button>
                  {IS_IOS && (
                    <p className="text-xs text-muted-foreground text-center">
                      El PDF se abre en otra pestaña. Guárdalo con el botón compartir ↑ → "Guardar en Archivos".
                    </p>
                  )}
                </>
              )}
            </div>
            {!IS_IOS && !popupBlocked && countdown > 0 && (
              <p className="text-xs text-muted-foreground">
                Abriendo WhatsApp en {countdown}s…{" "}
                <button onClick={resetWhatsAppFlow} className="underline hover:text-foreground">cancelar</button>
              </p>
            )}
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Tu cotización</SheetTitle>
              <SheetDescription>
                Revisa los productos y genera tu cotización. Precios en pesos mexicanos (MXN).
              </SheetDescription>
            </SheetHeader>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
                <ShoppingCart className="w-10 h-10 opacity-40" />
                <p>Aún no agregas productos.<br />Explora el catálogo y agrega lo que necesites.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
                  {lines.map((l) => (
                    <div key={l.id} className="py-3 flex gap-3">
                      <img src={l.image} alt={l.product} className="w-14 h-14 rounded-lg object-contain bg-muted/40 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">{l.product}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.variant}{l.color ? ` · ${l.color}` : ""} · {l.sku}
                          {l.unit === "pack" && l.piecesPerPack ? ` · paq. ${l.piecesPerPack} pzas` : ""}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center border border-border rounded-md">
                            <button aria-label="Quitar uno" onClick={() => setQuantity(l.id, l.quantity - 1)} className="p-1 text-muted-foreground hover:text-foreground">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                            <button aria-label="Agregar uno" onClick={() => setQuantity(l.id, l.quantity + 1)} className="p-1 text-muted-foreground hover:text-foreground">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold tabular-nums">{money(lineTotal(l))}</span>
                        </div>
                      </div>
                      <button aria-label="Eliminar" onClick={() => remove(l.id)} className="text-muted-foreground hover:text-destructive self-start">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <SheetFooter className="flex-col gap-3 sm:flex-col">
                  <div className="w-full space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span><span className="tabular-nums">{money(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>IVA 16%</span><span className="tabular-nums">{money(iva)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-foreground pt-1 border-t border-border">
                      <span>Total</span><span className="tabular-nums">{money(total)}</span>
                    </div>
                  </div>
                  <QuoteDialog />
                  <button
                    onClick={quoteViaWhatsApp}
                    disabled={waStep !== "idle"}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[hsl(var(--whatsapp))] text-[hsl(var(--whatsapp-foreground))] rounded-lg py-3 font-bold transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Cotizar por WhatsApp
                  </button>
                  <button onClick={clear} className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" /> Vaciar cotización
                  </button>
                </SheetFooter>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
