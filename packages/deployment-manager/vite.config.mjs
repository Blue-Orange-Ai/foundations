import { resolve } from "path";
import { defineConfig, esmExternalRequirePlugin } from "vite";
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
    },
    build: {
        lib: {
            // Vite 6 names the emitted CSS after the package (foundations-*.css)
            // by default; consumers import <pkg>/dist/style.css, so keep that name.
            cssFileName: "style",
            entry: resolve(import.meta.dirname, "src/vite-entry.tsx"),
            name: "core",
            formats: ["es", "umd"],
            fileName: (format) => format === "es" ? "index.mjs" : "index.umd.js",
        },
        rolldownOptions: {
            external: ["@blue-orange-ai/foundations-clients", "@blue-orange-ai/foundations-code-editors"],
        },
    },
    plugins: [
        // Bundled CommonJS dependencies (e.g. use-sync-external-store via
        // @tiptap/react) require() React. Rolldown cannot turn a require() of an
        // external into an import on its own and would ship a require() shim
        // that throws in the browser, so convert those calls to ESM imports.
        esmExternalRequirePlugin({ external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"] }),
        react(),
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});