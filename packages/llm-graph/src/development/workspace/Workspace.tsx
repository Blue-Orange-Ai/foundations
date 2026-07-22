import React, { useState } from "react";
import "./Workspace.css";
import { LlmGraphEditor } from "../../components/editor/LlmGraphEditor";
import { LlmGraphProvider, ModelOption } from "../../components/providers/LlmGraphProvider";
import { WorkflowDefinition } from "../../interfaces/WorkflowGraph";

const MODELS: Array<ModelOption> = [
    { provider: "anthropic", model: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
    { provider: "anthropic", model: "claude-opus-4-8", label: "Claude Opus 4.8" },
    { provider: "open-ai", model: "gpt-4o", label: "GPT-4o" },
    { provider: "google", model: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
];

/** A sample research DAG: gather → (summarise ‖ critique) → report. */
const SAMPLE: WorkflowDefinition = {
    name: "Research Assistant",
    description: "Parallel research fan-out / fan-in.",
    groups: ["llm-chat-user"],
    nodes: {
        gather: {
            id: "gather", type: "task", provider: "anthropic", model: "claude-sonnet-4-5",
            system_prompt: "Gather the key sources on the topic.",
            depends_on: [],
            metadata: { ui: { x: 120, y: 80, label: "Gather Sources", description: "Collect the source material" } },
        },
        summarise: {
            id: "summarise", type: "task", provider: "anthropic", model: "claude-sonnet-4-5",
            system_prompt: "Summarise the gathered sources.",
            depends_on: ["gather"],
            metadata: { ui: { x: 520, y: 20, label: "Summarise", description: "Condense the findings" } },
        },
        critique: {
            id: "critique", type: "task", provider: "open-ai", model: "gpt-4o",
            system_prompt: "Critique the gathered sources for gaps and bias.",
            depends_on: ["gather"],
            metadata: { ui: { x: 520, y: 200, label: "Critique", description: "Find gaps and bias" } },
        },
        report: {
            id: "report", type: "task", provider: "anthropic", model: "claude-opus-4-8",
            system_prompt: "Write the final report from the summary and critique.",
            depends_on: ["summarise", "critique"], output_key: "final",
            metadata: { ui: { x: 920, y: 110, label: "Final Report", description: "Synthesise everything" } },
        },
    },
};

export const Workspace: React.FC = () => {
    const [dark, setDark] = useState<boolean>(false);

    return (
        <div className={`workspace-main-window ${dark ? "blue-orange-dark-mode" : ""}`}>
            <div className="workspace-toolbar">
                <span>LLM Graph — Agent Workflow Editor</span>
                <button onClick={() => setDark((value) => !value)}>
                    {dark ? "Light" : "Dark"} mode
                </button>
            </div>
            <div className="workspace-display-window">
                <LlmGraphProvider
                    models={MODELS}
                    onSave={(definition) => console.log("save", definition)}
                    onRun={(definition) => console.log("run", definition)}
                >
                    <LlmGraphEditor initialDefinition={SAMPLE} onChange={() => undefined}></LlmGraphEditor>
                </LlmGraphProvider>
            </div>
        </div>
    );
};
