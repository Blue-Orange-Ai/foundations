import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig ({
    build: {
        lib: {
            entry: resolve(__dirname, "src/vite-entry.tsx"),
            name: "foundations3dModels",
            formats: ["es", "umd"],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "three",
                "@react-three/fiber",
                "@react-three/drei",
                "@blue-orange-ai/foundations-core",
                "@blue-orange-ai/foundations-clients",
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
