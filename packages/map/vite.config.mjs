import { resolve } from "path";
import { defineConfig, esmExternalRequirePlugin } from "vite";
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: { port: 3000, open: false },
    // The development workspace renders foundations-core, whose ESM build pulls
    // in the CommonJS foundations-clients — pre-bundled here so its named
    // exports resolve, the same way the other core consumers do it.
    optimizeDeps: {
        include: ["@blue-orange-ai/foundations-clients"],
        // sockjs-client (via foundations-clients) references Node's `global`,
        // which webpack used to shim and Vite does not.
        rolldownOptions: {
            transform: { define: { global: "globalThis" } },
        },
    },
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
            // react-dom/server is external for the same reason as react-dom/client:
            // the marker components are serialised to HTML for the map, and bundling
            // the server renderer would ship both its dev and production copies.
            // React itself is externalised by esmExternalRequirePlugin below.
            external: ["react-dom/server", "@blue-orange-ai/foundations-clients"],
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