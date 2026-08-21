import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: { port: 3000, open: false },
    // foundations-clients is a symlinked workspace package that ships CommonJS,
    // so Vite must pre-bundle it into ESM instead of serving it raw.
    optimizeDeps: {
        include: ["@blue-orange-ai/foundations-clients"],
        // sockjs-client (via foundations-clients) references Node's `global`,
        // which webpack used to shim and Vite does not.
        esbuildOptions: {
            define: { global: "globalThis" },
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
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "chat",
            formats: ["es", "umd"],
            fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "@blue-orange-ai/foundations-core", "@blue-orange-ai/foundations-clients"],
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
