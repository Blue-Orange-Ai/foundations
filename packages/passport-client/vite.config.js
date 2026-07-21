import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig ({
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "passport-client",
            formats: ["es", "umd"],
            fileName: (format) => format === "es" ? "index.mjs" : "index.umd.js",
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react-router-dom",
                "@blue-orange-ai/foundations-clients",
                "@blue-orange-ai/foundations-core",
            ],
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});
