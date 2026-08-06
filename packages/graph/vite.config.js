import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";

// primitives-graph ships a global `:not(svg) { transform-origin: 0 0 }` rule. Once this
// package's stylesheet is loaded it applies to every element on the host page, which breaks
// anything relying on the default centre origin (e.g. the core spinner rotations). Scope it
// to the graph canvas so it keeps working inside the graph without leaking out.
const scopePrimitivesGraphGlobals = () => ({
    name: "scope-primitives-graph-globals",
    enforce: "pre",
    transform(code, id) {
        if (!id.includes("@blue-orange-ai/primitives-graph") || !id.split("?")[0].endsWith(".css")) {
            return null;
        }
        return {
            code: code.replace(/(^|[,}])\s*:not\(svg\)\s*\{/g, "$1.blue-orange-graph-canvas-parent :not(svg){"),
            map: null,
        };
    },
});

export default defineConfig({
    server: { port: 3000, open: false },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        mockReset: true,
        css: false,
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "graph",
            formats: ["es", "umd"],
            fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "@blue-orange-ai/foundations-clients"],
        },
    },
    plugins: [
        scopePrimitivesGraphGlobals(),
        react(),
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});