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
    },
    build: {
        lib: {
            // Vite 6 names the emitted CSS after the package (foundations-*.css)
            // by default; consumers import <pkg>/dist/style.css, so keep that name.
            cssFileName: "style",
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "core",
            formats: ["es", "umd"],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            // react-dom/server is external for the same reason as react-dom/client:
            // the marker components are serialised to HTML for the map, and bundling
            // the server renderer would ship both its dev and production copies.
            external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "react-dom/server", "@blue-orange-ai/foundations-clients"],
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