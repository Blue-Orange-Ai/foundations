import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig ({
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "calendar",
            formats: ["es", "umd"],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "@blue-orange-ai/foundations-core"],
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: "dist/types",
        }),
    ],
});
