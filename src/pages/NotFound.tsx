import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Netlify's SPA fallback (netlify.toml) serves this page with a 200 status
  // for any unmatched path, so a "soft 404" would otherwise get indexed as a
  // real page. noindex is the only signal available at the client.
  useDocumentMeta({
    title: "Página no encontrada | Coplast de México",
    description: "La página que buscas no existe o fue movida.",
    path: location.pathname,
    noindex: true,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
