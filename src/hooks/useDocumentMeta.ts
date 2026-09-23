import { useEffect } from "react";

// Per-route title, description and canonical without pulling in react-helmet:
// this app only needs three tags on two extra routes, which is not worth a
// dependency. React 18 has no native metadata hoisting, so the tags in
// index.html are edited in place and restored on unmount, leaving the home
// page exactly as it was.

const SITE_ORIGIN = "https://coplastdemexico.com";

interface DocumentMeta {
  title: string;
  description: string;
  /** Root-relative path, e.g. "/aviso-de-privacidad". */
  path: string;
  /**
   * Set on routes with no real content (e.g. 404) so search engines drop the
   * URL instead of indexing it. index.html ships "index, follow"; omitted
   * (the default) leaves that alone for every normal page.
   */
  noindex?: boolean;
}

/** Finds a head tag, creating it if index.html does not already carry one. */
function findOrCreate(selector: string, build: () => HTMLElement): HTMLElement {
  const existing = document.head.querySelector<HTMLElement>(selector);
  if (existing) return existing;
  const created = build();
  document.head.appendChild(created);
  return created;
}

export function useDocumentMeta({ title, description, path, noindex }: DocumentMeta): void {
  useEffect(() => {
    const descriptionTag = findOrCreate('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    });
    const canonicalTag = findOrCreate('link[rel="canonical"]', () => {
      const tag = document.createElement("link");
      tag.setAttribute("rel", "canonical");
      return tag;
    });
    const robotsTag = noindex
      ? findOrCreate('meta[name="robots"]', () => {
          const tag = document.createElement("meta");
          tag.setAttribute("name", "robots");
          return tag;
        })
      : null;

    // Social previews read the Open Graph copy, not <title>. Only tags that
    // index.html already carries are touched, so nothing is invented here.
    const shareTags: [HTMLElement | null, string][] = [
      [document.head.querySelector<HTMLElement>('meta[property="og:title"]'), title],
      [document.head.querySelector<HTMLElement>('meta[property="og:description"]'), description],
      [document.head.querySelector<HTMLElement>('meta[property="og:url"]'), `${SITE_ORIGIN}${path}`],
      [document.head.querySelector<HTMLElement>('meta[name="twitter:title"]'), title],
      [document.head.querySelector<HTMLElement>('meta[name="twitter:description"]'), description],
    ];

    const previous = {
      title: document.title,
      description: descriptionTag.getAttribute("content"),
      canonical: canonicalTag.getAttribute("href"),
      robots: robotsTag?.getAttribute("content") ?? null,
      share: shareTags.map(([tag]) => tag?.getAttribute("content") ?? null),
    };

    document.title = title;
    descriptionTag.setAttribute("content", description);
    canonicalTag.setAttribute("href", `${SITE_ORIGIN}${path}`);
    if (robotsTag) robotsTag.setAttribute("content", "noindex, nofollow");
    for (const [tag, value] of shareTags) tag?.setAttribute("content", value);

    return () => {
      document.title = previous.title;
      if (previous.description !== null) descriptionTag.setAttribute("content", previous.description);
      if (previous.canonical !== null) canonicalTag.setAttribute("href", previous.canonical);
      if (robotsTag && previous.robots !== null) robotsTag.setAttribute("content", previous.robots);
      shareTags.forEach(([tag], i) => {
        const value = previous.share[i];
        if (tag && value !== null) tag.setAttribute("content", value);
      });
    };
  }, [title, description, path, noindex]);
}
