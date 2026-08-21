import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: { port: 3000, open: false },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        mockReset: true,
        css: false,
        // monaco-editor ships only a `module` entry (no `main`, no `exports`),
        // which Vite's node resolution cannot resolve, and the real editor needs
        // browser APIs jsdom lacks. Swap it for a recorder in tests only — the
        // library build still treats monaco as an external peer (see below).
        alias: {
            "monaco-editor": resolve(__dirname, "src/testUtils/monacoMock.ts"),
        },
    },
    build: {
        lib: {
            // Vite 6 names the emitted CSS after the package (foundations-*.css)
            // by default; consumers import <pkg>/dist/style.css, so keep that name.
            cssFileName: "style",
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "core",
            formats: ["es", "umd"],
            fileName: (format) => format === "es" ? "index.mjs" : "index.umd.js",
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "@blue-orange-ai/foundations-clients", "monaco-editor"],
        },
    },
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});