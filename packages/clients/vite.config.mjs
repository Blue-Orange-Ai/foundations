import { resolve } from "path";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

// Every runtime dependency stays external: consumers install them alongside
// this package, and bundling them would ship duplicate copies.
const external = Object.keys(pkg.dependencies ?? {});

export default defineConfig({
    build: {
        outDir: "lib",
        // The library is plain TypeScript with no browser-only globals at
        // import time, so keep the output close to the source.
        target: "es2020",
        sourcemap: true,
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            // lib/index.js stays CommonJS so existing `require()` consumers and
            // the `main` field keep working; ESM consumers get lib/index.mjs.
            fileName: (format) => format === "es" ? "index.mjs" : "index.js",
        },
        rolldownOptions: {
            external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
        },
    },
    test: {
        environment: "node",
        passWithNoTests: true,
    },
});
