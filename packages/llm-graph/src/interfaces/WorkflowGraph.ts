/**
 * The workflow domain model for the LLM graph editor.
 *
 * These types mirror the `@blue-orange-ai/llm-agent` workflow schema
 * (`entities/workflow_definition.py`) so a graph drawn in the editor serialises
 * directly to a definition that agent's engine can run. The editor is designed
 * to be used *only* with that agent — the canvas is a `task` DAG and the links
 * are `depends_on` edges.
 */

/** The node kinds understood by the agent's workflow engine. */
export type WorkflowNodeType =
    | 'task'    // DAG node: run an agent once its `depends_on` complete
    | 'step'    // conversational step (single `next`)
    | 'gate'    // deterministic if/then/else
    | 'router'  // agent-selected routing
    | 'loop'    // bounded repeat of a body
    | 'end'     // terminal success
    | 'fail';   // terminal failure

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

/** An inline tool declaration, mirroring the agent's `ActionDefinition`. */
export interface WorkflowTool {
    name: string;
    description?: string;
    parameters?: Array<WorkflowToolParameter>;
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
