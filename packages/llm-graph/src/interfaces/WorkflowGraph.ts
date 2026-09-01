/**
 * The workflow domain model for the LLM graph editor.
 *
 * These types mirror the `@blue-orange-ai/llm-agent` workflow schema
 * (`entities/workflow_definition.py`) so a graph drawn in the editor serialises
 * directly to a definition that agent's engine can run. The editor is designed
 * to be used *only* with that agent — the canvas is a `task` DAG and the links
 * are `depends_on` edges.
 */

/**
 * The node kinds the editor can place.
 *
 * All of them except `tool` and `memory` are node kinds the agent's workflow
 * engine understands directly. Those two are *editor-only*: they are drawn as
 * rows inside the box of the agent node that owns them, and are folded back
 * into that node's `tools` / `tool_ids` / `memory` when the definition is
 * serialised (see `WorkflowSerializer.serialize`).
 */
export type WorkflowNodeType =
    | 'task'    // DAG node: run an agent once its `depends_on` complete
    | 'step'    // conversational step (single `next`)
    | 'gate'    // deterministic if/then/else
    | 'router'  // agent-selected routing
    | 'loop'    // bounded repeat of a body
    | 'end'     // terminal success
    | 'fail'    // terminal failure
    | 'tool'    // editor-only child of an agent node
    | 'memory'; // editor-only memory store attached to an agent node

/** How a node is rendering during a live run (for status overlays). */
export type NodeRunStatus =
    | 'idle'
    | 'pending'
    | 'running'
    | 'succeeded'
    | 'failed'
    | 'skipped';

/** A tool parameter, mirroring the agent's `ActionParameter`. */
export interface WorkflowToolParameter {
    name: string;
    type_expr?: string;
    required?: boolean;
    description?: string;
}

/**
 * An inline tool declaration, mirroring the agent's `ActionDefinition`.
 *
 * A tool may declare tools of its own. Those are *scoped* to it: only that tool
 * can call them, and they are invisible to the agent that owns the parent. This
 * nests to any depth.
 */
export interface WorkflowTool {
    name: string;
    description?: string;
    parameters?: Array<WorkflowToolParameter>;
    /** Tools only this tool may call, declared inline. */
    tools?: Array<WorkflowTool>;
    /** Tools only this tool may call, referenced from the registry. */
    tool_ids?: Array<string>;
}

/**
 * A Postgres connection backing an agent's memory.
 *
 * `uri` and the discrete fields are alternatives: when a `uri` is given it is
 * used as-is, otherwise the connection is assembled from `host`/`port`/etc.
 *
 * There is deliberately no password field. A workflow definition is saved,
 * exported and passed around as plain JSON, so the password is named rather
 * than carried: `password_secret` is the name of a secret the agent resolves
 * at run time.
 */
export interface PostgresConnection {
    /** Full connection URI, e.g. `postgresql://user@host:5432/agent_memory`. */
    uri?: string;
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    /** Name of the secret holding the password (never the password itself). */
    password_secret?: string;
    /** Require TLS on the connection. */
    ssl?: boolean;
    /** Schema the memory table lives in. Defaults to `public`. */
    schema?: string;
    /** Table the memories are stored in. */
    table?: string;
}

/** The kinds of store an agent's memory can be backed by. */
export type MemoryProvider = 'postgres';

/**
 * A memory store attached to an agent node: what the agent recalls before it
 * runs, and what it writes back afterwards.
 */
export interface WorkflowMemory {
    /** Backing store. Postgres is the only one wired up today. */
    provider: MemoryProvider;
    /** Scope the memories are partitioned by. Defaults to the node id. */
    namespace?: string;
    /** How many prior memories to load into the agent's context. */
    recall_limit?: number;
    /** Whether the agent writes new memories back when its turn ends. */
    write?: boolean;
    /** Connection used when `provider` is `postgres`. */
    postgres?: PostgresConnection;
}

/** One option an agent `router` may pick. */
export interface WorkflowRoute {
    target: string;
    name?: string;
    description?: string;
}

/** The model configuration a `task`/`step`/`router` node's agent runs with. */
export interface AgentSpec {
    provider?: string;
    model?: string;
    system_prompt?: string;
    thinking?: boolean;
    thinking_budget_tokens?: number;
    temperature?: number;
    max_tokens?: number;
    api_token?: string;
    uri?: string;
    api_version?: string;
}

/** Editor-only presentation metadata carried through the definition. */
export interface NodeUiMetadata {
    x?: number;
    y?: number;
    /** Display title shown on the node card (defaults to the node id). */
    label?: string;
    /** Short subtitle shown on the node card. */
    description?: string;
    /** remixicon class, e.g. `ri-robot-2-line`. */
    icon?: string;
    /** Accent colour for the node card. */
    color?: string;
}

/** A single workflow node. Only the fields relevant to its `type` are used. */
export interface WorkflowNode extends AgentSpec {
    id: string;
    type: WorkflowNodeType;

    // --- task (DAG) ---
    depends_on?: Array<string>;
    output_key?: string;
    prompt?: string;

    // --- task + step ---
    tools?: Array<WorkflowTool>;
    tool_ids?: Array<string>;
    until?: string;
    next?: string;
    max_tries?: number;
    ttl_seconds?: number;
    on_exhausted?: string;

    // --- shared error transition ---
    on_error?: string;

    // --- gate ---
    condition?: string;
    then?: string;
    otherwise?: string;

    // --- router ---
    routes?: Array<WorkflowRoute>;
    default?: string;

    // --- loop ---
    body?: string;

    // --- terminal (end / fail) ---
    message?: string;

    // --- memory (folded out of / into the `memory` node on the canvas) ---
    /** The memory store this agent recalls from and writes back to. */
    memory?: WorkflowMemory;

    // --- tool (editor-only; folded into the parent agent on serialise) ---
    /**
     * The node that owns this tool — an agent node, or another tool when this
     * one is scoped to a parent tool. Only set on `tool` nodes.
     */
    parent?: string;
    /** The tool name exposed to the model. */
    name?: string;
    /** What the tool does — shown to the model and on the node card. */
    description?: string;
    /** Inline parameter schema for the tool. */
    parameters?: Array<WorkflowToolParameter>;
    /**
     * When set, the tool is a reference to a registry tool rather than an
     * inline declaration, and serialises into the parent's `tool_ids`.
     */
    tool_ref?: string;

    // --- editor metadata (round-tripped via the agent's node `metadata`) ---
    metadata?: { ui?: NodeUiMetadata } & Record<string, any>;
}

/** A named graph of nodes plus its entry point and access groups. */
export interface WorkflowDefinition {
    name: string;
    description?: string;
    groups?: Array<string>;
    /** Optional for a DAG (entry points are the dependency-free tasks). */
    start?: string;
    nodes: Record<string, WorkflowNode>;
}

/** Live run state, mirroring the agent's `/advance` terminal STATE line. */
export interface WorkflowRunState {
    status?: string;
    current_node?: string;
    completed_nodes?: Array<string>;
    node_results?: Record<string, any>;
    error?: string | null;
    /** Per-node status, if the host computes one for the overlay. */
    node_status?: Record<string, NodeRunStatus>;
}

/** The result of validating a definition on the client before saving/running. */
export interface WorkflowValidationIssue {
    nodeId?: string;
    message: string;
    severity: 'error' | 'warning';
}
