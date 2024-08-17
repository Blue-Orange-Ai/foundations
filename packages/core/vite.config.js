import { resolve } from "path";
import { defineConfig } from "vite";

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
});