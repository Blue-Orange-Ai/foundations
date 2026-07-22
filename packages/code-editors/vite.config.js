import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig ({
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "core",
            formats: ["es", "umd"],
            fileName: (format) => format === "es" ? "index.mjs" : "index.umd.js",
        },
        rollupOptions: {
            external: ["react", "@blue-orange-ai/foundations-clients", "monaco-editor"],
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});