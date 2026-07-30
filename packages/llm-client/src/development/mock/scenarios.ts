// ---------------------------------------------------------------------------
// Scripted answers for the development mock server.
//
// A scenario is an ordered list of steps; the mock server turns each step into
// the ndjson `StreamEvent`s the real llm-agent would emit (THINKING/TEXT deltas,
// ACTION lifecycles, MEDIA, USAGE/COMPLETE, ERROR). Between them they exercise
// every renderer in the client: markdown (headings, lists, tables, code, math,
// quotes), collapsible reasoning, every display-action type and status, inline
// image + file media, token usage and in-band errors.
// ---------------------------------------------------------------------------

import { DisplayActionType, MediaReference } from '../../interfaces/AgentProtocol';
import { CHART_IMAGE_URL, RESULTS_CSV_URL, SUMMARY_MD_URL } from './mockAssets';
import { ScenarioKey } from './MockSettings';

export type MockStep =
    | { kind: 'thinking'; text: string }
    | { kind: 'text'; text: string }
    | {
          kind: 'action';
          actionType: DisplayActionType;
          title: string;
          toolName?: string;
          args?: Record<string, any>;
          /** Result shown when the action is expanded; omit for a bare row. */
          result?: string;
          /** When set the action resolves to ERROR with this text. */
          error?: string;
      }
    | { kind: 'media'; media: MediaReference }
    | { kind: 'error'; message: string };

export interface MockScenario {
    key: Exclude<ScenarioKey, 'auto'>;
    label: string;
    steps: MockStep[];
}

const image = (): MediaReference => ({
    uuid: 'mock-chart-0001',
    filename: 'revenue-vs-forecast.svg',
    content_type: 'image/svg+xml',
    media_type: 'IMAGE',
    url: CHART_IMAGE_URL,
    size: 4212,
});

const csv = (): MediaReference => ({
    uuid: 'mock-results-0002',
    filename: 'regional-results.csv',
    content_type: 'text/csv',
    media_type: 'FILE',
    url: RESULTS_CSV_URL,
    size: 218,
});

const markdownFile = (): MediaReference => ({
    uuid: 'mock-summary-0003',
    filename: 'pipeline-summary.md',
    content_type: 'text/markdown',
    media_type: 'FILE',
    url: SUMMARY_MD_URL,
    size: 142,
});

// -- rich ------------------------------------------------------------------

const RICH: MockScenario = {
    key: 'rich',
    label: 'Rich markdown answer',
    steps: [
        {
            kind: 'thinking',
            text:
                'The user is asking a comparison question, so a short framing paragraph followed ' +
                'by a table is the clearest shape. I should check current guidance before ' +
                'committing to numbers, then close with a concrete recommendation rather than ' +
                'leaving the trade-off open.',
        },
        {
            kind: 'action',
            actionType: 'WEB_SEARCH',
            title: 'Searched the web for "REST vs gRPC latency 2026"',
            toolName: 'web_search',
            args: { query: 'REST vs gRPC latency 2026', max_results: 5 },
            result:
                '5 results\n' +
                '1. Protocol overhead in practice — benchmarks across 4 runtimes\n' +
                '2. gRPC-web: what still needs a proxy\n' +
                '3. When JSON is fast enough\n' +
                '4. Streaming APIs: SSE, WebSocket, gRPC\n' +
                '5. Schema evolution with protobuf',
        },
        {
            kind: 'text',
            text: `Both are fine choices — the decision usually comes down to who consumes the API and whether you need streaming.

## The short version

- **REST + JSON** wins on reach: every browser, proxy and debugging tool understands it.
- **gRPC** wins on shape: a schema, generated clients, and first-class bidirectional streaming.

| Dimension | REST + JSON | gRPC |
| --- | --- | --- |
| Contract | OpenAPI (optional) | Protobuf (required) |
| Browser support | Native | Needs gRPC-web + proxy |
| Streaming | SSE / WebSocket | Built in, both directions |
| Payload size | Larger | ~30–60% smaller |
| Debuggability | \`curl\`-friendly | Needs tooling |

### A rough cost model

Per-request overhead is dominated by serialisation plus round trips, so with $n$ calls the total time behaves like:

$$T \\approx n \\left( t_{\\text{rtt}} + \\frac{s}{b} \\right)$$

Which means fewer, larger calls beat a chatty interface long before the wire format matters.

> If a service is only ever called by your own backends and moves a lot of small messages, gRPC pays for itself. Otherwise start with REST.

**Recommendation:** keep the public edge REST, and use gRPC between internal services where you control both ends. See the [protocol comparison notes](https://example.com/protocols) for the full benchmark table.`,
        },
    ],
};

// -- tools -----------------------------------------------------------------

const TOOLS: MockScenario = {
    key: 'tools',
    label: 'Tool run (all action types)',
    steps: [
        {
            kind: 'thinking',
            text:
                'This needs the actual repository state, not a guess. Locate the config, read it, ' +
                'confirm the migration status in the database, then run the test suite before ' +
                'reporting anything back.',
        },
        {
            kind: 'action',
            actionType: 'GLOB',
            title: 'Found 4 files matching **/config/*.yaml',
            toolName: 'glob',
            args: { pattern: '**/config/*.yaml' },
            result: 'config/app.yaml\nconfig/database.yaml\nconfig/logging.yaml\nconfig/queues.yaml',
        },
        {
            kind: 'action',
            actionType: 'READ_FILE',
            title: 'Read config/database.yaml',
            toolName: 'read_file',
            args: { path: 'config/database.yaml', limit: 40 },
            result:
                'pool:\n  min: 2\n  max: 10\n  timeout_seconds: 30\nmigrations:\n  auto_apply: false\n  directory: db/migrations',
        },
        {
            kind: 'action',
            actionType: 'GREP',
            title: 'Searched for "auto_apply" across 312 files',
            toolName: 'grep',
            args: { pattern: 'auto_apply', glob: '**/*.py' },
            result: 'db/runner.py:41: if settings.auto_apply:\ndb/runner.py:88: # auto_apply is disabled in production',
        },
        {
            kind: 'action',
            actionType: 'DATABASE',
            title: 'Queried schema_migrations (4 rows)',
            toolName: 'sql_query',
            args: { sql: 'select version, applied_at from schema_migrations order by version desc limit 4' },
            result:
                'version | applied_at\n' +
                '--------+---------------------\n' +
                '0041    | 2026-07-28 09:14:02\n' +
                '0040    | 2026-07-21 17:03:55\n' +
                '0039    | 2026-07-14 11:47:31\n' +
                '0038    | 2026-07-07 08:22:10',
        },
        {
            kind: 'action',
            actionType: 'WEB_FETCH',
            title: 'Fetched https://internal.example.com/runbooks/migrations',
            toolName: 'web_fetch',
            args: { url: 'https://internal.example.com/runbooks/migrations' },
            error: 'HTTP 403 Forbidden — the runbook host rejected the request (no VPN route from this sandbox).',
        },
        {
            kind: 'action',
            actionType: 'RUN_COMMAND',
            title: 'Ran npm test -- db/',
            toolName: 'run_command',
            args: { command: 'npm test -- db/', timeout: 120 },
            result: 'Test Files  6 passed (6)\n     Tests  48 passed (48)\n  Duration  9.41s',
        },
        {
            kind: 'action',
            actionType: 'WRITE_FILE',
            title: 'Updated config/database.yaml',
            toolName: 'write_file',
            args: { path: 'config/database.yaml', changes: 1 },
            result: '1 change written: migrations.auto_apply false -> true (staging profile only)',
        },
        {
            kind: 'text',
            text: `Done — here's what the repository actually says.

**Migrations are not auto-applied.** \`config/database.yaml\` sets \`migrations.auto_apply: false\`, and \`db/runner.py:88\` documents that as deliberate for production. The last applied version is **0041** (28 Jul 2026), so nothing is pending.

I enabled \`auto_apply\` for the staging profile only and re-ran the database suite — 48 tests pass.

One thing I couldn't check: the internal migrations runbook returned **403** from this sandbox, so the policy note there is unverified.`,
        },
    ],
};

// -- media -----------------------------------------------------------------

const MEDIA: MockScenario = {
    key: 'media',
    label: 'Generated media (image + files)',
    steps: [
        {
            kind: 'thinking',
            text: 'A chart will communicate the trend better than a table here. Pull the numbers first, then plot actual against forecast.',
        },
        {
            kind: 'action',
            actionType: 'DATABASE',
            title: 'Aggregated revenue by region and quarter',
            toolName: 'sql_query',
            args: { sql: 'select region, quarter, revenue from finance.revenue where quarter >= 6' },
            result: '6 rows in 42ms',
        },
        {
            kind: 'text',
            text: 'Revenue is tracking **ahead of forecast** for the third quarter running, with APAC accounting for most of the gap:',
        },
        { kind: 'media', media: image() },
        {
            kind: 'text',
            text: `A few things worth noting:

1. **APAC** is 19% above plan — the largest single contributor.
2. **AMER** is the steadiest at 8%, and also the largest absolute number.
3. **EMEA** improved but is still the smallest of the three.

The underlying rows and a short summary are attached:`,
        },
        { kind: 'media', media: csv() },
        { kind: 'media', media: markdownFile() },
        {
            kind: 'text',
            text: 'Want me to break APAC down by country, or extend the forecast another two quarters?',
        },
    ],
};

// -- code ------------------------------------------------------------------

const CODE: MockScenario = {
    key: 'code',
    label: 'Code-heavy answer',
    steps: [
        {
            kind: 'thinking',
            text: 'The bug is almost certainly the missing cleanup on unmount. Show the fix, then the test that would have caught it.',
        },
        {
            kind: 'action',
            actionType: 'READ_FILE',
            title: 'Read src/hooks/usePoller.ts',
            toolName: 'read_file',
            args: { path: 'src/hooks/usePoller.ts' },
            result: '38 lines read',
        },
        {
            kind: 'text',
            text: `The interval is never cleared, so every re-render adds another timer. Return a cleanup function from the effect:

\`\`\`ts
import { useEffect, useRef } from 'react';

export const usePoller = (callback: () => void, intervalMs: number) => {
    const latest = useRef(callback);
    latest.current = callback;

    useEffect(() => {
        if (intervalMs <= 0) return;
        const id = setInterval(() => latest.current(), intervalMs);
        // Without this, each dependency change leaks a live interval.
        return () => clearInterval(id);
    }, [intervalMs]);
};
\`\`\`

Two details matter here:

- The callback goes in a ref so a new function identity per render doesn't restart the timer.
- \`intervalMs\` stays in the dependency array, so changing the cadence tears the old timer down first.

A test that fails before the fix and passes after:

\`\`\`ts
it('clears its interval on unmount', () => {
    vi.useFakeTimers();
    const tick = vi.fn();
    const { unmount } = renderHook(() => usePoller(tick, 1000));

    vi.advanceTimersByTime(3000);
    expect(tick).toHaveBeenCalledTimes(3);

    unmount();
    vi.advanceTimersByTime(5000);
    expect(tick).toHaveBeenCalledTimes(3);
});
\`\`\`

And to check nothing else in the codebase has the same shape:

\`\`\`bash
rg -n 'setInterval\\(' src --glob '!*.test.ts' -A 3 | rg -v 'clearInterval'
\`\`\`

If that prints anything, it's the same leak in a different file.`,
        },
    ],
};

// -- long ------------------------------------------------------------------

const LONG: MockScenario = {
    key: 'long',
    label: 'Long streaming answer',
    steps: [
        {
            kind: 'thinking',
            text:
                'This is a broad question, so structure carries most of the weight: define the ' +
                'problem, walk the stages in order, and finish with the failure modes people ' +
                'actually hit in production rather than a summary of the summary.',
        },
        {
            kind: 'text',
            text: `## How a request becomes a rendered page

### 1. Resolution

The browser turns a hostname into an address. That means the OS resolver cache, then the recursive resolver, then the authoritative nameserver — three chances to be stale and one to be wrong. Most "the deploy didn't take" incidents end here, at a TTL nobody chose deliberately.

### 2. Connection

TCP's handshake costs a round trip; TLS historically cost two more, now usually one. On a 90ms link that is a fifth of a second before a single byte of your content moves. Connection reuse is therefore not an optimisation, it is the difference between a fast site and a slow one.

### 3. The request

One line, some headers, maybe a body. The headers are where the interesting failures live: a cookie jar that grew past the server's limit, an \`Accept-Encoding\` a proxy rewrote, an \`Authorization\` header stripped on redirect.

### 4. Edge and cache

Before your application sees anything, a CDN decides whether it needs to. A cache hit is two orders of magnitude cheaper than an origin request, which is why cache keys deserve as much design attention as the schema. Vary on too much and you fragment the cache; vary on too little and you serve one user's page to another.

### 5. Application

Now the code runs: routing, authentication, authorisation, then the handler. The handler almost always talks to a database, and the database is almost always where the time goes — not because databases are slow, but because it is easy to ask them the same question in a loop.

### 6. Response and render

Bytes stream back, the parser builds a DOM, the style engine resolves the cascade, layout runs, and pixels appear. Anything that blocks the parser delays all of it, which is why script placement still matters two decades after the advice was first written down.

## The failure modes that actually happen

1. **Chatty interfaces.** N+1 queries and N+1 API calls have the same cause: a loop where a batch belonged.
2. **Unbounded work.** A query with no limit, a fan-out with no cap, a retry with no ceiling. All fine until the day the input is larger.
3. **Retries without backoff.** The cheapest way to turn a slow dependency into an outage.
4. **Caching without invalidation.** Correct until the first write, then quietly wrong.
5. **Timeouts that outlive patience.** A 30-second timeout on a 2-second budget is a queue, not a safeguard.

## What to measure

Latency is a distribution, not a number. Track p50 for the typical experience and p99 for whether anyone is having a bad time, and always alongside throughput — a p99 that improves as traffic drops is not an improvement.

The useful instinct at every stage is the same: find out where the time actually goes before changing anything, because the answer is rarely where it feels like it should be.`,
        },
    ],
};

// -- error -----------------------------------------------------------------

const ERROR: MockScenario = {
    key: 'error',
    label: 'Mid-stream failure',
    steps: [
        {
            kind: 'thinking',
            text: 'Straightforward request — read the file and summarise it.',
        },
        {
            kind: 'action',
            actionType: 'READ_FILE',
            title: 'Read reports/q7-close.xlsx',
            toolName: 'read_file',
            args: { path: 'reports/q7-close.xlsx' },
            result: 'Loaded 3 sheets (Summary, Detail, Adjustments)',
        },
        {
            kind: 'text',
            text: 'Reading the close report now — the Summary sheet has the headline numbers and',
        },
        {
            kind: 'error',
            message:
                'Upstream provider error: 529 overloaded_error — the model provider is at capacity. The turn was interrupted; retry in a few seconds.',
        },
    ],
};

export const SCENARIOS: MockScenario[] = [RICH, TOOLS, MEDIA, CODE, LONG, ERROR];

const BY_KEY: Record<string, MockScenario> = SCENARIOS.reduce((acc, scenario) => {
    acc[scenario.key] = scenario;
    return acc;
}, {} as Record<string, MockScenario>);

/** Keyword routing used when the scenario is left on "auto". */
const KEYWORDS: Array<{ match: RegExp; key: MockScenario['key'] }> = [
    { match: /\b(error|fail|failure|break|529|overload)\b/i, key: 'error' },
    { match: /\b(image|chart|graph|plot|picture|visuali[sz]e|attach|file|csv)\b/i, key: 'media' },
    { match: /\b(code|bug|debug|typescript|python|test|hook|refactor)\b/i, key: 'code' },
    { match: /\b(tool|repo|repository|migration|database|search the|run |grep)\b/i, key: 'tools' },
    { match: /\b(long|essay|explain in detail|deep dive|walkthrough|everything)\b/i, key: 'long' },
];

let rotation = 0;

/**
 * Pick the scenario for a turn: an explicit selection wins, otherwise route on
 * the prompt, otherwise rotate so repeated sends don't all look the same.
 */
export const selectScenario = (scenario: ScenarioKey, prompt: string): MockScenario => {
    if (scenario !== 'auto' && BY_KEY[scenario]) return BY_KEY[scenario];

    const keyword = KEYWORDS.find((entry) => entry.match.test(prompt));
    if (keyword) return BY_KEY[keyword.key];

    const rotating: MockScenario[] = [RICH, TOOLS, MEDIA, CODE];
    return rotating[rotation++ % rotating.length];
};
