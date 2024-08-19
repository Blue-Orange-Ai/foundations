import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig ({
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "core",
            fileName: "index",
        },
        rollupOptions: {
            external: ["react", "@Blue-Orange-Ai/foundations-clients"],
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
});