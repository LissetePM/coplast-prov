import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // The ProductCatalog test mounts every family in the catalog, which lands
    // around 4.5s in jsdom even with animations skipped (see src/test/setup.ts)
    // and so sat right on the 5s default, failing intermittently. The catalog
    // only grows, and CI runners are slower than a dev laptop, so give it real
    // headroom instead of a value the next few products would exhaust again.
    testTimeout: 20_000,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
