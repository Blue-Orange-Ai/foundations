// Dev-only Monaco worker wiring for the Vite dev server.
// Replaces the webpack MonacoWebpackPlugin that was used under CRA.
// This file is imported by the dev entry (index.tsx) only — it is NOT part of
// the library build (vite-entry.tsx), so consumers configure their own workers.
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

(self as any).MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
        if (label === "json") return new jsonWorker();
        if (label === "css" || label === "scss" || label === "less") return new cssWorker();
        if (label === "html" || label === "handlebars" || label === "razor") return new htmlWorker();
        if (label === "typescript" || label === "javascript") return new tsWorker();
        return new editorWorker();
    },
};
