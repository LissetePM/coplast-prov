import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { IS_IN_APP_BROWSER, getIabName } from "@/lib/browser";
import { toast } from "sonner";

export default function InAppBrowserBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!IS_IN_APP_BROWSER || dismissed) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado", {
        description: "Pégalo en Safari o Chrome para abrir la página completa.",
      });
    } catch {
      toast.error("No se pudo copiar", {
        description: "Copia manualmente: " + window.location.href,
      });
    }
  };

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-3 text-sm text-amber-900">
      <ExternalLink className="w-4 h-4 shrink-0 text-amber-600" />
      <p className="flex-1 leading-snug">
        Estás en <strong>{getIabName()}</strong>. Para descargar el catálogo o tu cotización en PDF, abre la página en Safari o Chrome.
      </p>
      <button
        onClick={handleCopyLink}
        className="shrink-0 font-semibold underline underline-offset-2 hover:text-amber-700 whitespace-nowrap"
      >
        Copiar enlace
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar aviso"
        className="shrink-0 text-amber-500 hover:text-amber-800"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
