import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { generateQuote, downloadBlob, cartLineToItem } from "@/lib/quote";

const isEmailValid = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

// Letters only (including accents and ñ), spaces and basic name punctuation.
// Rejects digits and special characters that could be used for injection.
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.,'\-]+$/;
const isNameValid = (s: string) => s.trim().length >= 3 && NAME_RE.test(s.trim());

// Phone: digits and + only, minimum 10 digits.
const isPhoneValid = (s: string) => /^\+?\d{10,15}$/.test(s.trim());

function RequiredMark() {
  return <span className="text-destructive/70 ml-0.5" aria-hidden>*</span>;
}

function FieldError({ msg }: { msg: string }) {
  return <p className="text-xs text-destructive mt-0.5">{msg}</p>;
}

const FIELDS = ["contactName", "phone", "email", "companyName", "location"] as const;
type Field = typeof FIELDS[number];

export default function QuoteDialog() {
  const { lines } = useCart();
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  // Starts unchecked on purpose and is never pre-accepted: consent has to be
  // an act of the user, not a default we set for them.
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const markTouched = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));
  const fieldError = (field: Field, invalid: boolean) => touched[field] && invalid;
  const [loading, setLoading] = useState(false);

  const isValid =
    privacyAccepted &&
    isNameValid(contactName) &&
    isPhoneValid(phone) &&
    isEmailValid(email) &&
    (companyName.trim() === "" || isNameValid(companyName)) &&
    (location.trim() === "" || isNameValid(location));

  const submit = async () => {
    if (lines.length === 0 || !isValid) return;
    setLoading(true);
    try {
      const { quoteId, blob, emailSent } = await generateQuote({
        mode: "email",
        companyName, contactName, location, phone, email,
        items: lines.map(cartLineToItem),
      });
      downloadBlob(blob, `${quoteId}.pdf`);
      toast.success(`Cotización ${quoteId} lista`, {
        description: emailSent ? `Enviada a ${email} y descargada.` : "Descargada (el correo no se pudo enviar).",
      });
      setOpen(false);
    } catch (e) {
      toast.error("No se pudo generar la cotización", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) {
      setTouched({});
      // Consent does not survive the dialog: reopening asks again.
      setPrivacyAccepted(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={lines.length === 0} className="w-full gap-2">
          <Mail className="w-4 h-4" />
          Descargar y enviar por correo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Datos para la cotización</DialogTitle>
          <DialogDescription>
            Los campos con <span className="text-destructive/70">*</span> son obligatorios. Te enviaremos
            la cotización por correo y se descargará el PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cot-contactName">Atención (contacto)<RequiredMark /></Label>
            <Input
              id="cot-contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              onBlur={() => markTouched("contactName")}
              placeholder="Sr. Ramón Estrada"
              maxLength={80}
            />
            {fieldError("contactName", !isNameValid(contactName)) && (
              <FieldError msg="Solo letras, mínimo 3 caracteres, sin números" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cot-phone">Teléfono<RequiredMark /></Label>
              <Input
                id="cot-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
                onBlur={() => markTouched("phone")}
                placeholder="5512345678"
                maxLength={16}
              />
              {fieldError("phone", !isPhoneValid(phone)) && (
                <FieldError msg="Solo dígitos y +, mínimo 10 dígitos" />
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cot-email">Correo<RequiredMark /></Label>
              <Input
                id="cot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder="cliente@correo.com"
                maxLength={80}
              />
              {fieldError("email", !isEmailValid(email)) && (
                <FieldError msg="Correo inválido" />
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cot-companyName">Nombre o empresa <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Input
              id="cot-companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onBlur={() => markTouched("companyName")}
              placeholder="Distribuidora del Bajío"
              maxLength={80}
            />
            {fieldError("companyName", companyName.trim() !== "" && !isNameValid(companyName)) && (
              <FieldError msg="Solo letras, mínimo 3 caracteres, sin números" />
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cot-location">Ciudad / Estado <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Input
              id="cot-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => markTouched("location")}
              placeholder="León, Guanajuato"
              maxLength={80}
            />
            {fieldError("location", location.trim() !== "" && !isNameValid(location)) && (
              <FieldError msg="Solo letras, mínimo 3 caracteres, sin números" />
            )}
          </div>

          {/* The notice opens in a new tab: navigating away would close the
              dialog and throw away everything already typed. */}
          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="cot-privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
              aria-describedby="cot-privacy-hint"
              className="mt-0.5"
            />
            <Label htmlFor="cot-privacy" className="text-xs font-normal leading-relaxed cursor-pointer">
              He leído el{" "}
              <a
                href="/aviso-de-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Aviso de Privacidad
              </a>
              <RequiredMark />
            </Label>
          </div>
          <p id="cot-privacy-hint" className="text-xs text-muted-foreground">
            Usamos tus datos únicamente para elaborar y enviarte esta cotización, y para darle
            seguimiento. No te enviaremos publicidad.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={loading || !isValid || lines.length === 0} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {loading ? "Enviando…" : "Descargar y enviar por correo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
