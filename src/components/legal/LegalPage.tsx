import { useEffect, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { LEGAL, PENDING, isPending } from "@/config/legal";

// Shared shell for the legal documents. Reuses the site's own Navbar and
// Footer so these pages read as part of the site rather than a bolted-on
// annex, and keeps the reading column narrow enough to stay comfortable.

interface LegalPageProps {
  title: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  path: string;
  children: ReactNode;
}

/**
 * Renders an unconfirmed legal value. Styled loudly on purpose: a placeholder
 * that blends into the text is a placeholder that ships to production.
 */
export function Pending() {
  return (
    <mark className="bg-destructive/15 text-destructive font-semibold px-1.5 py-0.5 rounded not-italic">
      {PENDING}
    </mark>
  );
}

/** Prints a legal value, or a visible marker when it is still unconfirmed. */
export function LegalValue({ value }: { value: string }) {
  return isPending(value) ? <Pending /> : <>{value}</>;
}

/** Section heading + body, numbered consistently across both documents. */
export function LegalSection({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h2 id={id} className="font-display font-bold text-xl lg:text-2xl text-foreground tracking-tight mt-10 mb-3">
        {heading}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function LegalPage({
  title, intro, metaTitle, metaDescription, path, children,
}: LegalPageProps) {
  useDocumentMeta({ title: metaTitle, description: metaDescription, path });

  // These pages are reached from links at the very bottom of the home page, so
  // without this the reader would land mid-document.
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <>
      <Navbar />
      <main className="bg-cream pt-28 lg:pt-36 pb-20">
        <div className="container mx-auto">
          <article className="max-w-3xl mx-auto">
            <header>
              <h1 className="font-display font-bold text-3xl lg:text-[40px] text-foreground tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mt-4">{intro}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Última actualización: <time dateTime={LEGAL.lastUpdatedISO}>{LEGAL.lastUpdated}</time>
              </p>
            </header>

            <div className="mt-8 text-muted-foreground leading-relaxed [&_p]:leading-relaxed [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
              {children}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
