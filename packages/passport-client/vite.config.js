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
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "passport-client",
            formats: ["es", "umd"],
            fileName: (format) => format === "es" ? "index.mjs" : "index.umd.js",
        },
        rollupOptions: {
            external: [
                "react", "react-dom", "react/jsx-runtime", "react-dom/client",
                "react-router-dom",
                "@blue-orange-ai/foundations-clients",
                "@blue-orange-ai/foundations-core",
            ],
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
