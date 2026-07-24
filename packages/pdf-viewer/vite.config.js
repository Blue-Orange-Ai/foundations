import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig ({
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "pdfViewer",
            formats: ["es", "umd"],
            fileName: (format) => (format === "es" ? "index.mjs" : "index.umd.js"),
        },
        rollupOptions: {
            // React, the shared foundations packages and all @embedpdf packages
            // are left as external peer/normal dependencies so they are not
            // bundled into the library output.
            external: (id) =>
                id === "react" ||
                id === "react-dom" ||
                id === "react/jsx-runtime" ||
                id.startsWith("@blue-orange-ai/") ||
                id.startsWith("@embedpdf/"),
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});
