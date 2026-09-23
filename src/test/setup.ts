import "@testing-library/jest-dom";
import { MotionGlobalConfig } from "framer-motion";

// Render animations instantly at their final values. Rendering the full catalog
// grid means ~21 animated cards, and driving those tweens through jsdom's
// timers dominated the suite's runtime (the ProductCatalog test alone took ~11s
// and blew past the default 5s timeout). Tests assert on the settled DOM, never
// on frames in flight, so skipping the tweens costs no coverage.
MotionGlobalConfig.skipAnimations = true;

// framer-motion usa IntersectionObserver/ResizeObserver para whileInView; jsdom no los trae.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver = NoopObserver as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver = NoopObserver as unknown as typeof ResizeObserver;

// localStorage en memoria, consistente (jsdom/Node a veces traen uno parcial).
const __store = new Map<string, string>();
const localStorageMock: Storage = {
  getItem: (k) => (__store.has(k) ? __store.get(k)! : null),
  setItem: (k, v) => void __store.set(k, String(v)),
  removeItem: (k) => void __store.delete(k),
  clear: () => __store.clear(),
  key: (i) => [...__store.keys()][i] ?? null,
  get length() {
    return __store.size;
  },
};
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: localStorageMock });
Object.defineProperty(window, "localStorage", { configurable: true, value: localStorageMock });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
