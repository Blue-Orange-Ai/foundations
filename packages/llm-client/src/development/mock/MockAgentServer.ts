// ---------------------------------------------------------------------------
// MockAgentServer — a fake llm-agent service for the development environment.
//
// It answers the same routes the real FastAPI service does (`/config/models`,
// `/tools`, `/workflows`, `POST /chat`, `POST /workflows/{id}/advance`) with the
// same content types, so `AgentClient` is exercised end to end: the ndjson
// framing, the incremental reader, the abort path and the event taxonomy are all
// the real code — only the other end of the socket is fake.
// ---------------------------------------------------------------------------

import {
    ChatRequest,
    ConfigAgentDto,
    ConfigEmbedderDto,
    DisplayAction,
    StreamEvent,
    ToolDefinition,
    WorkflowAdvanceRequest,
    WorkflowDefinition,
    WorkflowState,
} from '../../interfaces/AgentProtocol';
import { getMockSettings, LATENCY_PROFILE } from './MockSettings';
import { MockScenario, MockStep, selectScenario } from './scenarios';

// -- Static discovery payloads ---------------------------------------------

export const MOCK_MODELS: ConfigAgentDto[] = [
    {
        name: 'claude-opus-5',
        provider: 'anthropic',
        display_name: 'Claude Opus 5',
        description: 'Highest capability, extended thinking, vision.',
        text: true,
        images: true,
        default: true,
    },
    {
        name: 'claude-sonnet-5',
        provider: 'anthropic',
        display_name: 'Claude Sonnet 5',
        description: 'Balanced quality and latency for everyday work.',
        text: true,
        images: true,
        default: false,
    },
    {
        name: 'claude-haiku-4-5',
        provider: 'anthropic',
        display_name: 'Claude Haiku 4.5',
        description: 'Fastest and cheapest; good for classification.',
        text: true,
        images: true,
        default: false,
    },
    {
        name: 'gemini-2.5-pro',
        provider: 'google',
        display_name: 'Gemini 2.5 Pro',
        description: 'Long context with native multimodal input.',
        text: true,
        images: true,
        default: false,
    },
    {
        name: 'gpt-4.1',
        provider: 'openai',
        display_name: 'GPT-4.1',
        description: 'General purpose reasoning model.',
        text: true,
        images: true,
        default: false,
    },
    {
        name: 'llama-3.3-70b',
        provider: 'bedrock',
        display_name: 'Llama 3.3 70B',
        description: 'Self-hosted open weights; text only.',
        text: true,
        images: false,
        default: false,
    },
    {
        name: 'mistral-large-2',
        provider: 'mistral',
        display_name: 'Mistral Large 2',
        description: 'Strong multilingual performance.',
        text: true,
        images: false,
        default: false,
    },
];

export const MOCK_EMBEDDERS: ConfigEmbedderDto[] = [
    {
        name: 'text-embedding-3-large',
        provider: 'openai',
        display_name: 'Text Embedding 3 Large',
        description: 'General purpose retrieval embeddings.',
        dimensions: 3072,
        default: true,
    },
    {
        name: 'voyage-3',
        provider: 'voyage',
        display_name: 'Voyage 3',
        description: 'Tuned for code and technical documents.',
        dimensions: 1024,
        default: false,
    },
];

export const MOCK_TOOLS: ToolDefinition[] = [
    {
        id: 'tool-web-search',
        name: 'web_search',
        description: 'Search the public web and return ranked snippets.',
        parameters: [
            { name: 'query', type_expr: 'str', description: 'The search query.', required: true },
            { name: 'max_results', type_expr: 'int', description: 'How many results to return.', required: false },
        ],
        groups: ['research'],
        display_type: 'WEB_SEARCH',
        title_template: 'Searched the web for "{query}"',
        enabled: true,
    },
    {
        id: 'tool-web-fetch',
        name: 'web_fetch',
        description: 'Fetch a URL and return its readable content.',
        parameters: [{ name: 'url', type_expr: 'str', description: 'Absolute URL to fetch.', required: true }],
        groups: ['research'],
        display_type: 'WEB_FETCH',
        title_template: 'Fetched {url}',
        enabled: true,
    },
    {
        id: 'tool-read-file',
        name: 'read_file',
        description: 'Read a file from the workspace.',
        parameters: [
            { name: 'path', type_expr: 'str', description: 'Workspace-relative path.', required: true },
            { name: 'limit', type_expr: 'int', description: 'Maximum lines to read.', required: false },
        ],
        groups: ['workspace'],
        display_type: 'READ_FILE',
        title_template: 'Read {path}',
        enabled: true,
    },
    {
        id: 'tool-write-file',
        name: 'write_file',
        description: 'Write or patch a file in the workspace.',
        parameters: [
            { name: 'path', type_expr: 'str', description: 'Workspace-relative path.', required: true },
            { name: 'content', type_expr: 'str', description: 'New file contents.', required: true },
        ],
        groups: ['workspace'],
        display_type: 'WRITE_FILE',
        title_template: 'Updated {path}',
        enabled: true,
    },
    {
        id: 'tool-sql-query',
        name: 'sql_query',
        description: 'Run a read-only SQL query against the analytics warehouse.',
        parameters: [{ name: 'sql', type_expr: 'str', description: 'A SELECT statement.', required: true }],
        groups: ['data'],
        display_type: 'DATABASE',
        title_template: 'Queried the warehouse',
        enabled: true,
    },
    {
        id: 'tool-run-command',
        name: 'run_command',
        description: 'Run a shell command in the sandbox.',
        parameters: [
            { name: 'command', type_expr: 'str', description: 'The command line to run.', required: true },
            { name: 'timeout', type_expr: 'int', description: 'Seconds before the command is killed.', required: false },
        ],
        groups: ['workspace'],
        display_type: 'RUN_COMMAND',
        title_template: 'Ran {command}',
        enabled: false,
    },
];

export const MOCK_WORKFLOWS: WorkflowDefinition[] = [
    {
        id: 'onboarding',
        name: 'Customer onboarding',
        group: 'sales',
        start: 'collect_company',
        description: 'Collects company details, verifies the domain and books a kickoff call.',
    },
    {
        id: 'expense-approval',
        name: 'Expense approval',
        group: 'finance',
        start: 'collect_receipt',
        description: 'Walks a submitter through receipt capture, coding and approval routing.',
    },
];

// -- Stream construction ---------------------------------------------------

const encoder = new TextEncoder();

const abortError = (): Error => {
    const error = new Error('The operation was aborted.');
    error.name = 'AbortError';
    return error;
};

const sleep = (ms: number, signal?: AbortSignal | null): Promise<void> =>
    new Promise((resolve) => {
        if (ms <= 0 || !ms) {
            resolve();
            return;
        }
        const finish = () => {
            clearTimeout(timer);
            signal?.removeEventListener('abort', finish);
            resolve();
        };
        const timer = setTimeout(finish, ms);
        signal?.addEventListener('abort', finish);
    });

/** Split text into small, word-aligned deltas so it types out like a real stream. */
const toDeltas = (text: string, perDelta: number): string[] => {
    const tokens = text.match(/\s*\S+/g) || [text];
    const deltas: string[] = [];
    for (let i = 0; i < tokens.length; i += perDelta) {
        deltas.push(tokens.slice(i, i + perDelta).join(''));
    }
    return deltas;
};

/** ~4 characters per token, the usual rule of thumb. */
const estimateTokens = (chars: number): number => Math.max(1, Math.round(chars / 4));

interface TurnContext {
    provider: string;
    model: string;
    thinking: boolean;
    promptChars: number;
}

const modelFor = (name?: string): { provider: string; model: string } => {
    const found = MOCK_MODELS.find((m) => m.name === name) || MOCK_MODELS.find((m) => m.default) || MOCK_MODELS[0];
    return { provider: found.provider, model: found.name };
};

/**
 * Turn a scenario into the ndjson body of a streaming chat response. Deltas are
 * paced by the current latency profile and the whole thing unwinds immediately
 * when the caller aborts (the stop button), mirroring a real cancelled request.
 */
const scenarioStream = (scenario: MockScenario, ctx: TurnContext, signal?: AbortSignal | null): ReadableStream<Uint8Array> => {
    const pacing = LATENCY_PROFILE[getMockSettings().latency];
    let responseChars = 0;
    let actionSeq = 0;

    return new ReadableStream<Uint8Array>({
        async start(controller) {
            let cancelled = false;
            const onAbort = () => {
                if (cancelled) return;
                cancelled = true;
                try {
                    controller.error(abortError());
                } catch {
                    /* already closed */
                }
            };

            if (signal) {
                if (signal.aborted) {
                    onAbort();
                    return;
                }
                signal.addEventListener('abort', onAbort);
            }

            const emit = (event: StreamEvent) => {
                if (cancelled) return;
                controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
            };

            const emitDeltas = async (type: 'TEXT' | 'THINKING', text: string, perDelta: number) => {
                for (const delta of toDeltas(text, perDelta)) {
                    if (cancelled) return;
                    responseChars += delta.length;
                    emit({
                        type,
                        content: delta,
                        provider: ctx.provider,
                        model: ctx.model,
                        timestamp: new Date().toISOString(),
                    });
                    await sleep(pacing.chunk, signal);
                }
            };

            const emitAction = async (step: Extract<MockStep, { kind: 'action' }>) => {
                actionSeq += 1;
                const id = `mock-action-${actionSeq}`;
                const base: DisplayAction = {
                    id,
                    action_type: step.actionType,
                    title: step.title,
                    status: 'RUNNING',
                    tool_name: step.toolName ?? null,
                    metadata: step.args ? { arguments: step.args } : {},
                    created_at: new Date().toISOString(),
                };
                emit({ type: 'ACTION', action: base, provider: ctx.provider, model: ctx.model });
                await sleep(pacing.action, signal);
                if (cancelled) return;
                emit({
                    type: 'ACTION',
                    action: {
                        ...base,
                        status: step.error ? 'ERROR' : 'COMPLETE',
                        detail: step.error || step.result || null,
                    },
                    provider: ctx.provider,
                    model: ctx.model,
                });
                await sleep(Math.round(pacing.chunk * 4), signal);
            };

            try {
                await sleep(pacing.firstByte, signal);

                for (const step of scenario.steps) {
                    if (cancelled) return;
                    switch (step.kind) {
                        case 'thinking':
                            // The `thinking` request flag really does gate reasoning output.
                            if (ctx.thinking) await emitDeltas('THINKING', step.text, 4);
                            break;
                        case 'text':
                            await emitDeltas('TEXT', step.text, 2);
                            break;
                        case 'action':
                            await emitAction(step);
                            break;
                        case 'media':
                            emit({ type: 'MEDIA', media: step.media, provider: ctx.provider, model: ctx.model });
                            await sleep(Math.round(pacing.chunk * 6), signal);
                            break;
                        case 'error':
                            emit({ type: 'ERROR', content: step.message, provider: ctx.provider, model: ctx.model });
                            if (!cancelled) controller.close();
                            return;
                        default:
                            break;
                    }
                }

                if (cancelled) return;

                // A plausible bill: prompt + history in, everything streamed out,
                // plus a flat allowance for the system prompt and tool schemas.
                const requestTokens = estimateTokens(ctx.promptChars) + 180;
                const responseTokens = estimateTokens(responseChars);
                emit({
                    type: 'COMPLETE',
                    provider: ctx.provider,
                    model: ctx.model,
                    usage: {
                        request_tokens: requestTokens,
                        response_tokens: responseTokens,
                        total_tokens: requestTokens + responseTokens,
                    },
                    timestamp: new Date().toISOString(),
                });
                controller.close();
            } catch (error) {
                if (!cancelled) {
                    controller.error(error instanceof Error ? error : new Error(String(error)));
                }
            } finally {
                signal?.removeEventListener('abort', onAbort);
            }
        },
    });
};

// -- Workflow advance ------------------------------------------------------

const WORKFLOW_NODES: Record<string, Array<{ node: string; reply: string }>> = {
    onboarding: [
        { node: 'collect_company', reply: 'Thanks — which company are you onboarding, and what is their primary domain?' },
        { node: 'verify_domain', reply: 'Domain verified. Who should be the primary technical contact?' },
        { node: 'book_kickoff', reply: 'Noted. I have three kickoff slots next week — Tuesday 10:00, Wednesday 14:00 or Friday 09:00. Which suits?' },
        { node: 'complete', reply: 'Kickoff booked and the onboarding checklist has been sent. Anything else?' },
    ],
    'expense-approval': [
        { node: 'collect_receipt', reply: 'Please attach the receipt and tell me the total.' },
        { node: 'code_expense', reply: 'Which cost centre should this be coded to?' },
        { node: 'route_approval', reply: 'Routed to your approver — you will get an email when it is signed off.' },
    ],
};

const workflowProgress = new Map<string, number>();

const workflowStream = (
    workflowId: string,
    request: WorkflowAdvanceRequest,
    signal?: AbortSignal | null,
): ReadableStream<Uint8Array> => {
    const pacing = LATENCY_PROFILE[getMockSettings().latency];
    const nodes = WORKFLOW_NODES[workflowId] || WORKFLOW_NODES.onboarding;
    const key = `${workflowId}:${request.conversation_id}`;
    if (request.reset) workflowProgress.delete(key);
    const index = Math.min(workflowProgress.get(key) || 0, nodes.length - 1);
    workflowProgress.set(key, index + 1);
    const step = nodes[index];
    const done = index >= nodes.length - 1;

    return new ReadableStream<Uint8Array>({
        async start(controller) {
            const emit = (payload: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
            await sleep(pacing.firstByte, signal);
            for (const delta of toDeltas(step.reply, 2)) {
                emit({ type: 'TEXT', content: delta } as StreamEvent);
                await sleep(pacing.chunk, signal);
            }
            const state: WorkflowState = {
                workflow: workflowId,
                conversation_id: request.conversation_id,
                current_node: done ? 'complete' : nodes[Math.min(index + 1, nodes.length - 1)].node,
                status: done ? 'COMPLETED' : 'WAITING',
                slots: { last_prompt: request.prompt || '', turns: index + 1 },
                last_reply: step.reply,
            };
            emit(state);
            controller.close();
        },
    });
};

// -- Request routing -------------------------------------------------------

const json = (body: unknown, status = 200): Response =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

const ndjson = (stream: ReadableStream<Uint8Array>): Response =>
    new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'application/x-ndjson' },
    });

const parseBody = <T>(init?: RequestInit): T => {
    try {
        return JSON.parse(typeof init?.body === 'string' ? init.body : '{}') as T;
    } catch {
        return {} as T;
    }
};

/**
 * Handle a request aimed at the mock agent. Returns `null` for paths the real
 * service would not recognise either, so the caller can 404 explicitly.
 */
export const handleAgentRequest = (path: string, init?: RequestInit): Response | null => {
    const method = (init?.method || 'GET').toUpperCase();
    const signal = init?.signal as AbortSignal | undefined;

    if (method === 'GET') {
        switch (path) {
            case '/config/models':
                return json(MOCK_MODELS);
            case '/config/embedders':
                return json(MOCK_EMBEDDERS);
            case '/tools':
                return json(MOCK_TOOLS);
            case '/workflows':
                return json(MOCK_WORKFLOWS);
            default:
                break;
        }

        const run = path.match(/^\/workflows\/([^/]+)\/runs\/([^/]+)$/);
        if (run) {
            const nodes = WORKFLOW_NODES[decodeURIComponent(run[1])] || WORKFLOW_NODES.onboarding;
            const index = Math.min(workflowProgress.get(`${decodeURIComponent(run[1])}:${decodeURIComponent(run[2])}`) || 0, nodes.length - 1);
            const state: WorkflowState = {
                workflow: decodeURIComponent(run[1]),
                conversation_id: decodeURIComponent(run[2]),
                current_node: nodes[index].node,
                status: index >= nodes.length - 1 ? 'COMPLETED' : 'WAITING',
                slots: { turns: index },
            };
            return json(state);
        }
        return null;
    }

    if (method === 'POST' && (path === '/chat' || path === '/jobs/chat')) {
        const request = parseBody<ChatRequest>(init);
        const { provider, model } = modelFor(request.model);
        const prompt = request.prompt || '';
        const settings = getMockSettings();
        // A composer mode ("Research") steers the reply the way a real agent's
        // tool policy would, unless a scenario has been pinned in the panel.
        const scenario =
            settings.scenario === 'auto' && (request.modes || []).includes('research')
                ? selectScenario('tools', prompt)
                : selectScenario(settings.scenario, prompt);
        const ctx: TurnContext = {
            provider,
            model,
            thinking: request.thinking !== false,
            promptChars: prompt.length + JSON.stringify(request.history || []).length,
        };
        // Surface what the client actually sent — handy when checking that the
        // composer's controls (model, settings, modes, tools, attachments) all
        // reach the wire.
        // Logged as one string so nothing is collapsed in the console.
        // eslint-disable-next-line no-console
        console.debug(
            `[mock-agent] POST /chat ${JSON.stringify({
                scenario: scenario.key,
                model: request.model,
                thinking: request.thinking,
                effort: request.effort,
                temperature: request.temperature,
                modes: request.modes,
                tool_ids: request.tool_ids,
                attachments: request.attachments,
                historyTurns: (request.history || []).length,
            })}`,
        );
        return ndjson(scenarioStream(scenario, ctx, signal));
    }

    const advance = path.match(/^\/workflows\/([^/]+)\/advance$/);
    if (method === 'POST' && advance) {
        const request = parseBody<WorkflowAdvanceRequest>(init);
        return ndjson(workflowStream(decodeURIComponent(advance[1]), request, signal));
    }

    return null;
};
