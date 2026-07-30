// ---------------------------------------------------------------------------
// Demo history for the development environment.
//
// Session history lives in localStorage (the agent service is stateless), so an
// empty browser means an empty sidebar. These seeded conversations populate
// every recency bucket — Today through Older — and between them cover each
// message state the transcript can render: reasoning, tool actions (complete and
// failed), generated media, user attachments, token usage, a cancelled turn and
// a failed turn.
// ---------------------------------------------------------------------------

import { ChatMessage, ChatSession, MessagePart } from '../../interfaces/ChatInterfaces';
import { SessionStore } from '../../services/SessionStore';
import { CHART_IMAGE_URL, RESULTS_CSV_URL } from './mockAssets';

const DAY = 24 * 60 * 60 * 1000;

const SEED_FLAG = 'blue-orange-llm-mock-seeded';

let sequence = 0;
const id = (prefix: string): string => `demo-${prefix}-${++sequence}`;

const user = (text: string, createdAt: number, attachments?: ChatMessage['attachments']): ChatMessage => ({
    id: id('user'),
    role: 'user',
    parts: [{ type: 'text', text }],
    attachments,
    status: 'complete',
    createdAt,
});

const assistant = (
    parts: MessagePart[],
    createdAt: number,
    overrides: Partial<ChatMessage> = {},
): ChatMessage => ({
    id: id('assistant'),
    role: 'assistant',
    parts,
    status: 'complete',
    createdAt,
    provider: 'anthropic',
    model: 'claude-opus-5',
    usage: { request_tokens: 412, response_tokens: 286, total_tokens: 698 },
    ...overrides,
});

const session = (title: string, ageMs: number, build: (at: number) => ChatMessage[]): ChatSession => {
    const at = Date.now() - ageMs;
    const messages = build(at);
    return {
        id: id('session'),
        title,
        messages,
        createdAt: at,
        updatedAt: messages.length ? messages[messages.length - 1].createdAt : at,
        model: 'claude-opus-5',
    };
};

const buildSessions = (): ChatSession[] => [
    session('Rate limiting strategy for the public API', 2 * 60 * 60 * 1000, (at) => [
        user('We keep getting bursts from one customer. Token bucket or sliding window?', at),
        assistant(
            [
                {
                    type: 'reasoning',
                    text:
                        'They care about bursts specifically, which is the case where the two algorithms ' +
                        'differ most. Lead with the behavioural difference, then the operational cost of each.',
                    inProgress: false,
                },
                {
                    type: 'text',
                    text: `**Token bucket**, with a burst allowance sized to your slowest downstream.

| | Token bucket | Sliding window |
| --- | --- | --- |
| Burst handling | Allowed up to bucket size | Smoothed, rejected at the edge |
| State per key | 2 numbers | A log or ring buffer |
| Fairness | Good | Better |
| Cost at 10k keys | Trivial | Noticeable |

A sliding window is stricter, and that strictness is the problem: a customer batching once an hour looks identical to abuse. Token bucket lets the batch through and still caps the sustained rate.

\`\`\`python
def allow(bucket, rate, capacity, now):
    elapsed = now - bucket.updated_at
    bucket.tokens = min(capacity, bucket.tokens + elapsed * rate)
    bucket.updated_at = now
    if bucket.tokens < 1:
        return False
    bucket.tokens -= 1
    return True
\`\`\`

Return \`429\` with \`Retry-After\` set from the deficit, so well-behaved clients back off without guessing.`,
                },
            ],
            at + 40 * 1000,
        ),
        user('Where should it live — gateway or service?', at + 5 * 60 * 1000),
        assistant(
            [
                {
                    type: 'text',
                    text: 'Gateway, for anything expressed in requests per second. Keep service-level limits for the expensive operations only (report generation, exports) where the unit of cost is not a request.',
                },
            ],
            at + 5 * 60 * 1000 + 20 * 1000,
            { usage: { request_tokens: 980, response_tokens: 74, total_tokens: 1054 } },
        ),
    ]),

    session('Why is the nightly pipeline slow?', 6 * 60 * 60 * 1000, (at) => [
        user('The nightly finance pipeline went from 20 minutes to nearly two hours. What changed?', at),
        assistant(
            [
                {
                    type: 'reasoning',
                    text: 'Look at the run history before the code — a step-change in duration usually points at data volume or a plan change, not a deploy.',
                    inProgress: false,
                },
                {
                    type: 'action',
                    id: 'demo-action-runs',
                    actionType: 'DATABASE',
                    title: 'Queried pipeline_runs (30 rows)',
                    status: 'COMPLETE',
                    toolName: 'sql_query',
                    arguments: { sql: 'select started_at, duration_seconds from pipeline_runs order by started_at desc limit 30' },
                    detail:
                        'started_at           | duration_seconds\n' +
                        '---------------------+-----------------\n' +
                        '2026-07-29 02:00:00  | 6841\n' +
                        '2026-07-28 02:00:00  | 6605\n' +
                        '2026-07-27 02:00:00  | 1284\n' +
                        '2026-07-26 02:00:00  | 1191',
                },
                {
                    type: 'action',
                    id: 'demo-action-grep',
                    actionType: 'GREP',
                    title: 'Searched for "for row in" across 84 files',
                    status: 'COMPLETE',
                    toolName: 'grep',
                    arguments: { pattern: 'for row in', glob: 'pipelines/**/*.py' },
                    detail: 'pipelines/finance/reconcile.py:112: for row in ledger_rows:\npipelines/finance/reconcile.py:118:     account = fetch_account(row.account_id)',
                },
                {
                    type: 'action',
                    id: 'demo-action-explain',
                    actionType: 'DATABASE',
                    title: 'Explained the account lookup',
                    status: 'ERROR',
                    toolName: 'sql_query',
                    arguments: { sql: 'explain analyze select * from accounts where id = $1' },
                    detail: 'permission denied for schema finance_internal (role: pipeline_reader)',
                },
                {
                    type: 'text',
                    text: `It jumped on **27 July**, from ~21 minutes to ~1h54m, and nothing was deployed that day.

The cause is \`pipelines/finance/reconcile.py:118\` — an account lookup inside the ledger loop. That is an N+1: it was invisible at 40k ledger rows and is not at 380k, which is where the row count landed after the new region was switched on.

Batch the lookup before the loop:

\`\`\`python
accounts = fetch_accounts([row.account_id for row in ledger_rows])
for row in ledger_rows:
    account = accounts[row.account_id]
\`\`\`

I could not run \`explain analyze\` to confirm the index is being used — the pipeline role has no access to \`finance_internal\`.`,
                },
            ],
            at + 90 * 1000,
            { usage: { request_tokens: 1840, response_tokens: 612, total_tokens: 2452 } },
        ),
    ]),

    session('Q7 revenue vs forecast', DAY + 3 * 60 * 60 * 1000, (at) => [
        user('Chart actual revenue against forecast for the last seven quarters and give me the numbers.', at),
        assistant(
            [
                {
                    type: 'action',
                    id: 'demo-action-revenue',
                    actionType: 'DATABASE',
                    title: 'Aggregated revenue by region and quarter',
                    status: 'COMPLETE',
                    toolName: 'sql_query',
                    arguments: { sql: 'select region, quarter, revenue from finance.revenue where quarter >= 1' },
                    detail: '21 rows in 63ms',
                },
                { type: 'text', text: 'Actuals have run ahead of forecast since Q5, and the gap is widening:' },
                {
                    type: 'media',
                    media: {
                        uuid: 'demo-chart',
                        filename: 'revenue-vs-forecast.svg',
                        content_type: 'image/svg+xml',
                        media_type: 'IMAGE',
                        url: CHART_IMAGE_URL,
                        size: 4212,
                    },
                },
                {
                    type: 'media',
                    media: {
                        uuid: 'demo-csv',
                        filename: 'regional-results.csv',
                        content_type: 'text/csv',
                        media_type: 'FILE',
                        url: RESULTS_CSV_URL,
                        size: 218,
                    },
                },
                { type: 'text', text: 'APAC is the whole story — 19% above plan, against 8% in AMER and 11% in EMEA.' },
            ],
            at + 110 * 1000,
        ),
    ]),

    session('Reviewing the incident timeline', 4 * DAY, (at) => [
        user(
            'Here is the graph from the postmortem — does the timeline in it match what you found in the logs?',
            at,
            [
                {
                    uuid: 'demo-attachment-1',
                    mediaId: 4901,
                    filename: 'incident-timeline.svg',
                    contentType: 'image/svg+xml',
                    url: CHART_IMAGE_URL,
                    size: 4212,
                    progress: 100,
                },
            ],
        ),
        assistant(
            [
                {
                    type: 'action',
                    id: 'demo-action-logs',
                    actionType: 'READ_FILE',
                    title: 'Read logs/2026-07-25/gateway.log',
                    status: 'COMPLETE',
                    toolName: 'read_file',
                    arguments: { path: 'logs/2026-07-25/gateway.log', limit: 2000 },
                    detail: '2000 lines read (truncated at limit)',
                },
                {
                    type: 'text',
                    text: 'Mostly — but the first 5xx appears in the gateway log at **02:14:07**, nine minutes before the chart',
                },
            ],
            at + 70 * 1000,
            {
                status: 'error',
                error: 'Upstream provider error: 529 overloaded_error — the model provider is at capacity.',
                usage: null,
            },
        ),
        user('Try again please', at + 4 * 60 * 1000),
        assistant(
            [
                {
                    type: 'text',
                    text: 'The timeline is close but starts too late. Gateway logs show the first 5xx at 02:14:07',
                },
            ],
            at + 4 * 60 * 1000 + 15 * 1000,
            { status: 'cancelled', usage: null },
        ),
    ]),

    session('Naming things: events vs commands', 12 * DAY, (at) => [
        user('Our event names are a mess. Any rule of thumb?', at),
        assistant(
            [
                {
                    type: 'text',
                    text: `Two rules cover most of it:

1. **Events are facts, in the past tense** — \`OrderPlaced\`, \`InvoiceSettled\`. They describe something that already happened and cannot be rejected.
2. **Commands are requests, in the imperative** — \`PlaceOrder\`, \`SettleInvoice\`. They can fail, so they need a reply.

If a name reads naturally in both roles, the boundary is wrong: something is doing two jobs.`,
                },
            ],
            at + 25 * 1000,
            { usage: { request_tokens: 96, response_tokens: 132, total_tokens: 228 } },
        ),
    ]),

    session('Postgres connection pool sizing', 47 * DAY, (at) => [
        user('How big should the connection pool be for 8 app instances?', at),
        assistant(
            [
                {
                    type: 'reasoning',
                    text: 'They will expect a formula. Give the one that matters — cores, not instances — and the failure mode of guessing high.',
                    inProgress: false,
                },
                {
                    type: 'text',
                    text: `Size it from the **database**, not the app. A reasonable starting point:

$$\\text{connections} = (2 \\times \\text{cores}) + \\text{effective spindles}$$

On an 8-core instance that is roughly 18 connections *in total*, so with 8 app instances each pool gets 2, not 20. Pools sized per-instance are how a database ends up with 160 connections and less throughput than it had at 20 — every one of them competing for the same cores.

If 2 per instance feels too tight, put a pooler in front (pgbouncer in transaction mode) rather than raising the ceiling.`,
                },
            ],
            at + 45 * 1000,
        ),
    ]),
];

/**
 * Write the demo conversations into the session store. Runs once per browser
 * unless `force` is set (the dev panel's "Reseed" button).
 */
export const seedDemoSessions = (namespace?: string, force = false): boolean => {
    const store = new SessionStore(namespace);
    const alreadySeeded = localStorage.getItem(SEED_FLAG) === 'true';
    if (!force && (alreadySeeded || store.load().length > 0)) return false;

    sequence = 0;
    store.saveAll(buildSessions());
    localStorage.setItem(SEED_FLAG, 'true');
    return true;
};

/** Drop all persisted conversations, including the seeded ones. */
export const clearDemoSessions = (namespace?: string): void => {
    new SessionStore(namespace).clear();
    localStorage.removeItem(SEED_FLAG);
};
