# `@blue-orange-ai/foundations-llm-graph`

A node-based **agent workflow editor** for building LLM automations — a visual
canvas of agent *tasks* wired into a DAG, in the spirit of n8n and Happy Robot.
It is the companion authoring UI for the `@blue-orange-ai/llm-agent` workflow
engine: a graph drawn here serialises directly to a workflow definition that
engine runs.

The package is built entirely on the existing Foundations packages — the canvas
is the Foundations **`graph`** component (a React wrapper over the
`primitives-graph` engine) and every panel, form and control is a **`core`**
component. It adds no new third-party dependencies.

## Features

- **Canvas editor** (`LlmGraphEditor`) — drag to create and connect nodes, drag
  a link between two tasks to add a dependency, right-click to configure,
  auto-layout (ELK), zoom/pan, and fit-to-view.
- **Node palette** — a searchable, categorised add-node menu: agent nodes
  (`task`, `step`, `router`), logic (`gate`, `loop`) and terminals (`end`,
  `fail`).
- **Config drawer** — per-node forms (model picker, system prompt, tools,
  dependencies, routes, conditions, …) built from `core` inputs.
- **Live validation** — the same integrity checks the agent enforces
  (acyclicity, resolvable dependencies, tasks-only dependencies) surfaced before
  you save or run.
- **Run status overlay** — feed the agent's live run state in and the node cards
  light up pending / running / succeeded / failed.
- **Round-trip serialisation** — `WorkflowSerializer` converts the canvas to a
  definition (and back), preserving node layout via the definition's node
  `metadata`.

## Install

```bash
npm install @blue-orange-ai/foundations-llm-graph
```

Peer stylesheets the consuming app must load once:

```ts
import 'remixicon/fonts/remixicon.css';
import 'tippy.js/dist/tippy.css';
import '@blue-orange-ai/foundations-core/dist/style.css';
import '@blue-orange-ai/foundations-llm-graph/dist/style.css';
```

## Usage

```tsx
import {
    LlmGraphProvider,
    LlmGraphEditor,
    WorkflowDefinition,
} from '@blue-orange-ai/foundations-llm-graph';

const models = [
    { provider: 'anthropic', model: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
    { provider: 'open-ai', model: 'gpt-4o', label: 'GPT-4o' },
];

export function Builder() {
    return (
        <LlmGraphProvider
            models={models}
            onSave={(def) => api.post('/workflows', def)}
            onRun={(def) => api.post(`/workflows/${slug(def.name)}/advance`, {
                conversation_id: crypto.randomUUID(), prompt: 'Start', reset: true,
            })}
        >
            <LlmGraphEditor onChange={(def: WorkflowDefinition) => console.log(def)} />
        </LlmGraphProvider>
    );
}
```

`onSave` / `onRun` receive the serialised `WorkflowDefinition` — POST it straight
to the agent's `/workflows` and `/workflows/{id}/advance` endpoints.

## The data model

The exported types mirror the agent's workflow schema
(`entities/workflow_definition.py`). The editor is DAG-first: the canvas is a
graph of `task` nodes and the links are `depends_on` edges. Each node also
carries editor-only presentation under `metadata.ui` (position, label, icon,
colour), which the agent stores verbatim so a workflow round-trips without losing
its layout.

```ts
interface WorkflowNode {
    id: string;
    type: 'task' | 'step' | 'router' | 'gate' | 'loop' | 'end' | 'fail';
    // task: the DAG edges
    depends_on?: string[];
    output_key?: string;
    // agent config (task / step / router)
    provider?: string; model?: string; system_prompt?: string;
    tools?: WorkflowTool[]; tool_ids?: string[];
    // …plus gate / router / loop / terminal fields
    metadata?: { ui?: { x; y; label; description; icon; color } };
}
```

## Architecture

| Layer | What it does |
| --- | --- |
| `LlmGraphEditor` | Wraps the `graph` canvas; owns the `WorkflowDefinition` and keeps it in sync with the canvas. |
| `NodePalette` / `EditorToolbar` | Add-node menu and the name / actions bar (add, layout, validate, export, save, run). |
| `NodeConfigDrawer` / `RoutesEditor` | Per-node configuration forms built from `core`. |
| `WorkflowSerializer` | Definition ⇄ canvas: `toGraphNodes` / `logicalEdges`, `reconcile` (canvas → model), `validate`, `serialize`. |
| `NodeHtml` / `NodeFactory` / `GraphOptionsBuilder` | Node-card markup, node creation with defaults, and the canvas options + control toolbar. |
| `NodeCatalog` | Per-node-type presentation (icon, colour, label) and field defaults. |
| `LlmGraphProvider` | Editor-wide config (available models, registry tools, save/run callbacks). |

The canvas is the source of truth for **topology** (which nodes exist and how
they are wired); the definition holds each node's **config**. On every canvas
change the editor reconciles the two — rebuilding `depends_on` from the live
edges while preserving authored config and syncing node positions.

## Local development

```bash
cd packages/llm-graph
npm install
npm start     # opens the dev workspace with a sample research DAG
npm run build # vite library build + type declarations
```
