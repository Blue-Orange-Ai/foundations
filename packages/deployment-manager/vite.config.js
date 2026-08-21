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
            external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "@blue-orange-ai/foundations-clients", "@blue-orange-ai/foundations-code-editors"],
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