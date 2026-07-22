// ---------------------------------------------------------------------------
// Agent protocol types — a 1:1 mapping of the llm-agent server contract.
//
// These mirror the pydantic models the `llm-agent` FastAPI service emits /
// accepts (see entities/stream_event.py, entities/display_action.py,
// entities/chat_request.py, entities/media_reference.py, ...). Keeping them
// isolated from the UI model means the wire format can evolve without touching
// component code — the StreamParser is the single translation layer between
// this protocol and the richer `ChatInterfaces` UI model.
// ---------------------------------------------------------------------------

/** Discriminator for the different kinds of events emitted in a chat stream. */
export type StreamEventType =
    | 'TEXT'
    | 'THINKING'
    | 'ACTION'
    | 'MEDIA'
    | 'USAGE'
    | 'ERROR'
    | 'COMPLETE';

/** The category of a display action surfaced in the chat stream. */
export type DisplayActionType =
    | 'READ_FILE'
    | 'WRITE_FILE'
    | 'GREP'
    | 'GLOB'
    | 'WEB_SEARCH'
    | 'WEB_FETCH'
    | 'RUN_COMMAND'
    | 'DATABASE'
    | 'THINKING'
    | 'CUSTOM';

export type ActionStatus = 'RUNNING' | 'COMPLETE' | 'ERROR';

/** A single user-facing action (tool call) rendered within the response stream. */
export interface DisplayAction {
    id: string;
    action_type: DisplayActionType;
    title: string;
    detail?: string | null;
    status: ActionStatus;
    tool_name?: string | null;
    metadata?: Record<string, any>;
    created_at?: string;
}

/** A lightweight, serialisable reference to an uploaded media object. */
export interface MediaReference {
    uuid: string;
    filename?: string | null;
    content_type?: string | null;
    media_type?: string | null;
    url?: string | null;
    size?: number | null;
    media_id?: number | null;
}

export interface Usage {
    request_tokens?: number | null;
    response_tokens?: number | null;
    total_tokens?: number | null;
}

/** A single newline-delimited-JSON event in the chat response stream. */
export interface StreamEvent {
    type: StreamEventType;
    content?: string | null;
    action?: DisplayAction | null;
    media?: MediaReference | null;
    usage?: Usage | null;
    provider?: string | null;
    model?: string | null;
    metadata?: Record<string, any>;
    timestamp?: string;
}

export type MessageType = 'PROMPT' | 'RESPONSE';

/** A single historical turn, as the server expects it back in `history`. */
export interface ChatMessageDto {
    content: string;
    attachments?: string[];
    created_at: string;
    message_type: MessageType;
    request_tokens?: number | null;
    reponse_tokens?: number | null;
    total_tokens?: number | null;
    provider?: string | null;
    model?: string | null;
}

/** Body of `POST /chat` and `POST /jobs/chat`. */
export interface ChatRequest {
    prompt: string;
    model?: string;
    /** Media UUIDs (resolved server-side via MediaService.download_with_uuid). */
    attachments?: string[];
    history?: ChatMessageDto[];
    /** Enable extended "thinking" output for models that support it. */
    thinking?: boolean;
    /** Ids of registered tools the turn is permitted to use. */
    tool_ids?: string[];
    /** A full agent declaration in the agent DSL. */
    agent_dsl?: string;
    /** Optional system prompt override applied to the turn. */
    system_prompt?: string;
}

/** `GET /config/models` item. */
export interface ConfigAgentDto {
    name: string;
    provider: string;
    display_name: string;
    description: string;
    text: boolean;
    images: boolean;
    default: boolean;
}

/** `GET /config/embedders` item. */
export interface ConfigEmbedderDto {
    name: string;
    provider: string;
    display_name: string;
    description: string;
    dimensions: number;
    default: boolean;
}

export interface ActionParameter {
    name: string;
    type_expr?: string;
    description?: string | null;
    required?: boolean;
}

/** `GET /tools` item — a registered, access-controlled tool. */
export interface ToolDefinition {
    id: string;
    name: string;
    description?: string | null;
    parameters: ActionParameter[];
    groups: string[];
    display_type: DisplayActionType;
    title_template?: string | null;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
}

export type WorkflowStatus = 'RUNNING' | 'WAITING' | 'COMPLETED' | 'FAILED';

/** Terminal `STATE` line emitted after a `POST /workflows/{id}/advance` turn. */
export interface WorkflowState {
    workflow: string;
    conversation_id: string;
    current_node: string;
    status: WorkflowStatus;
    slots: Record<string, any>;
    error?: string | null;
    last_reply?: string | null;
}

/** `GET /workflows` item (subset the UI needs for selection/rendering). */
export interface WorkflowDefinition {
    id?: string;
    name?: string;
    group?: string;
    start?: string;
    description?: string | null;
    [key: string]: any;
}

export interface WorkflowAdvanceRequest {
    conversation_id: string;
    prompt?: string;
    reset?: boolean;
}
