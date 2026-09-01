import React, { useState } from "react";
import "./Workspace.css";
import { LlmGraphEditor } from "../../components/editor/LlmGraphEditor";
import { LlmGraphProvider, ModelOption } from "../../components/providers/LlmGraphProvider";
import { WorkflowDefinition, WorkflowTool } from "../../interfaces/WorkflowGraph";

const MODELS: Array<ModelOption> = [
    { provider: "anthropic", model: "claude-sonnet-5", label: "Claude Sonnet 5" },
    { provider: "anthropic", model: "claude-opus-5", label: "Claude Opus 5" },
    { provider: "open-ai", model: "gpt-4o", label: "GPT-4o" },
    { provider: "google", model: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
];

/** Registry tools a node config can reference instead of declaring inline. */
const REGISTRY_TOOLS: Array<WorkflowTool> = [
    { name: "crm_lookup", description: "Look a contact up in the CRM." },
    { name: "send_email", description: "Send an email on the caller's behalf." },
];

/**
 * A sample research DAG. The first agent has a Postgres-backed memory store and
 * tools inside its box, one of which scopes tools of its own:
 * gather (web_search → rank/dedupe, fetch_page) → (summarise ‖ critique) → report.
 *
 * The nodes carry no positions, so the editor lays the workflow out vertically
 * on mount — which is what the default flow looks like.
 */
const SAMPLE: WorkflowDefinition = {
    name: "Research Assistant",
    description: "Parallel research fan-out / fan-in.",
    groups: ["llm-chat-user"],
    nodes: {
        gather: {
            id: "gather", type: "task", provider: "anthropic", model: "claude-sonnet-5",
            system_prompt: "Gather the key sources on the topic.",
            depends_on: [],
            memory: {
                provider: "postgres",
                namespace: "research",
                recall_limit: 20,
                write: true,
                postgres: {
                    host: "db.internal",
                    port: 5432,
                    database: "agent_memory",
                    user: "agent",
                    password_secret: "PG_AGENT_PASSWORD",
                    schema: "public",
                    table: "memories",
                    ssl: true,
                },
            },
            tools: [
                {
                    name: "web_search",
                    description: "Search the web for sources on a topic.",
                    parameters: [
                        { name: "query", type_expr: "str", required: true, description: "What to search for." },
                        { name: "limit", type_expr: "int", required: false, description: "How many results to return." },
                    ],
                    // Scoped to web_search: the agent cannot call these itself.
                    tools: [
                        {
                            name: "rank_results",
                            description: "Order raw hits by relevance.",
                            parameters: [
                                { name: "hits", type_expr: "list[str]", required: true, description: "The hits to rank." },
                            ],
                        },
                        {
                            name: "dedupe_results",
                            description: "Drop hits pointing at the same source.",
                        },
                    ],
                },
                {
                    name: "fetch_page",
                    description: "Fetch and read a single page.",
                    parameters: [
                        { name: "url", type_expr: "str", required: true, description: "The page to read." },
                    ],
                },
            ],
            metadata: { ui: { label: "Gather Sources", description: "Collect the source material" } },
        },
        summarise: {
            id: "summarise", type: "task", provider: "anthropic", model: "claude-sonnet-5",
            system_prompt: "Summarise the gathered sources.",
            depends_on: ["gather"],
            metadata: { ui: { label: "Summarise", description: "Condense the findings" } },
        },
        critique: {
            id: "critique", type: "task", provider: "open-ai", model: "gpt-4o",
            system_prompt: "Critique the gathered sources for gaps and bias.",
            depends_on: ["gather"],
            tools: [
                {
                    name: "fact_check",
                    description: "Check a claim against a trusted source.",
                    parameters: [
                        { name: "claim", type_expr: "str", required: true, description: "The claim to verify." },
                    ],
                },
            ],
            metadata: { ui: { label: "Critique", description: "Find gaps and bias" } },
        },
        report: {
            id: "report", type: "task", provider: "anthropic", model: "claude-opus-5",
            system_prompt: "Write the final report from the summary and critique.",
            depends_on: ["summarise", "critique"], output_key: "final",
            metadata: { ui: { label: "Final Report", description: "Synthesise everything" } },
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
                    tools={REGISTRY_TOOLS}
                    onSave={(definition) => console.log("save", definition)}
                    onRun={(definition) => console.log("run", definition)}
                >
                    <LlmGraphEditor initialDefinition={SAMPLE} onChange={() => undefined}></LlmGraphEditor>
                </LlmGraphProvider>
            </div>
        </div>
    );
};
