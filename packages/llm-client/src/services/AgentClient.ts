// ---------------------------------------------------------------------------
// AgentClient — the single transport to the llm-agent FastAPI service.
//
// Everything the UI needs from the server goes through here: the streaming
// `POST /chat` turn, model/tool/workflow discovery and the streaming workflow
// `advance` endpoint. Responses are `application/x-ndjson` — one JSON
// `StreamEvent` per line — so we read the body incrementally and hand each
// decoded event to a callback as it arrives.
// ---------------------------------------------------------------------------

import {
    ChatRequest,
    ConfigAgentDto,
    StreamEvent,
    ToolDefinition,
    WorkflowAdvanceRequest,
    WorkflowDefinition,
    WorkflowState,
} from '../interfaces/AgentProtocol';

export interface AgentClientConfig {
    /** Base URL of the llm-agent service, e.g. "http://localhost:6012". */
    baseUrl: string;
    /**
     * Bearer token sent as the `Authorization` header. Passport auth on the
     * server resolves the caller from this. When omitted, requests rely on the
     * `authorization` cookie (credentials: 'include').
     */
    token?: string;
    /** Extra headers merged into every request. */
    headers?: Record<string, string>;
}

export interface ChatStreamHandlers {
    onEvent: (event: StreamEvent) => void;
    onError?: (error: Error) => void;
    onDone?: () => void;
}

const trimSlash = (s: string) => s.replace(/\/+$/, '');

export class AgentClient {
    private baseUrl: string;
    private token?: string;
    private extraHeaders: Record<string, string>;

    constructor(config: AgentClientConfig) {
        this.baseUrl = trimSlash(config.baseUrl);
        this.token = config.token;
        this.extraHeaders = config.headers || {};
    }

    setToken(token?: string) {
        this.token = token;
    }

    private headers(json = true): Record<string, string> {
        const headers: Record<string, string> = { ...this.extraHeaders };
        if (json) headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/x-ndjson, application/json';
        if (this.token) headers['Authorization'] = this.token;
        return headers;
    }

    // -- Discovery ---------------------------------------------------------

    async getModels(): Promise<ConfigAgentDto[]> {
        return this.getJson<ConfigAgentDto[]>('/config/models');
    }

    async getTools(): Promise<ToolDefinition[]> {
        return this.getJson<ToolDefinition[]>('/tools');
    }

    async getWorkflows(): Promise<WorkflowDefinition[]> {
        return this.getJson<WorkflowDefinition[]>('/workflows');
    }

    async getWorkflowRun(workflowId: string, conversationId: string): Promise<WorkflowState> {
        return this.getJson<WorkflowState>(
            `/workflows/${encodeURIComponent(workflowId)}/runs/${encodeURIComponent(conversationId)}`,
        );
    }

    private async getJson<T>(path: string): Promise<T> {
        const res = await fetch(`${this.baseUrl}${path}`, {
            method: 'GET',
            headers: this.headers(false),
            credentials: 'include',
        });
        if (!res.ok) {
            throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
        }
        return (await res.json()) as T;
    }

    // -- Streaming chat ----------------------------------------------------

    /**
     * Stream a chat turn. Returns immediately with an `abort` function that
     * cancels the in-flight request. Each ndjson `StreamEvent` is delivered to
     * `handlers.onEvent` as it arrives.
     */
    chat(request: ChatRequest, handlers: ChatStreamHandlers): { abort: () => void } {
        const controller = new AbortController();
        this.streamNdjson(`/chat`, request, handlers, controller.signal);
        return { abort: () => controller.abort() };
    }

    /**
     * Drive a workflow run forward by one user message. Streams the turn's
     * `StreamEvent`s, then a terminal `STATE` line — delivered via
     * `onState` — describing the run's new status/current node/slots.
     */
    advanceWorkflow(
        workflowId: string,
        request: WorkflowAdvanceRequest,
        handlers: ChatStreamHandlers & { onState?: (state: WorkflowState) => void },
    ): { abort: () => void } {
        const controller = new AbortController();
        this.streamNdjson(
            `/workflows/${encodeURIComponent(workflowId)}/advance`,
            request,
            {
                ...handlers,
                onEvent: (event: any) => {
                    // The terminal line of an advance stream is a WorkflowState,
                    // distinguishable by its `current_node` field.
                    if (event && event.current_node !== undefined && event.type === undefined) {
                        handlers.onState?.(event as WorkflowState);
                    } else {
                        handlers.onEvent(event as StreamEvent);
                    }
                },
            },
            controller.signal,
        );
        return { abort: () => controller.abort() };
    }

    private async streamNdjson(
        path: string,
        body: unknown,
        handlers: ChatStreamHandlers,
        signal: AbortSignal,
    ): Promise<void> {
        try {
            const res = await fetch(`${this.baseUrl}${path}`, {
                method: 'POST',
                headers: this.headers(true),
                body: JSON.stringify(body),
                credentials: 'include',
                signal,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`POST ${path} failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
            }
            if (!res.body) {
                throw new Error(`POST ${path} returned no response body`);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                let newlineIndex: number;
                while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                    const line = buffer.slice(0, newlineIndex).trim();
                    buffer = buffer.slice(newlineIndex + 1);
                    if (line) this.emitLine(line, handlers);
                }
            }

            // Flush any trailing buffered line (stream ended without newline).
            const tail = buffer.trim();
            if (tail) this.emitLine(tail, handlers);

            handlers.onDone?.();
        } catch (err) {
            if ((err as any)?.name === 'AbortError') {
                handlers.onDone?.();
                return;
            }
            handlers.onError?.(err instanceof Error ? err : new Error(String(err)));
        }
    }

    private emitLine(line: string, handlers: ChatStreamHandlers) {
        try {
            const event = JSON.parse(line);
            handlers.onEvent(event);
        } catch {
            // Ignore malformed lines rather than tearing down the whole stream.
        }
    }
}
