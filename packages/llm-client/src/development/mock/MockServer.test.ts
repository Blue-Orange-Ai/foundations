// Guards the development mock server: the dev environment is only useful if the
// fake agent still speaks the protocol `AgentClient` expects (ndjson framing,
// action lifecycles, usage, in-band errors, abort) and the fake storage service
// still satisfies the real `BlueOrangeMedia` upload flow.

import { BlueOrangeMedia } from '@blue-orange-ai/foundations-clients';

import { ChatRequest, StreamEvent } from '../../interfaces/AgentProtocol';
import { AgentClient } from '../../services/AgentClient';
import { installMockServer, setMockSettings } from './index';

const AGENT_URL = 'http://mock-agent.test';
const MEDIA_URL = 'http://mock-media.test';

let uninstall: () => void;
let client: AgentClient;

const runChat = (request: ChatRequest, abortAfterMs?: number): Promise<StreamEvent[]> =>
    new Promise((resolve, reject) => {
        const events: StreamEvent[] = [];
        const handle = client.chat(request, {
            onEvent: (event) => events.push(event),
            onDone: () => resolve(events),
            onError: reject,
        });
        if (abortAfterMs !== undefined) setTimeout(() => handle.abort(), abortAfterMs);
    });

beforeEach(() => {
    localStorage.clear();
    uninstall = installMockServer({ agentUrl: AGENT_URL, mediaUrl: MEDIA_URL, seed: false });
    setMockSettings({ scenario: 'tools', latency: 'instant' });
    client = new AgentClient({ baseUrl: AGENT_URL });
});

afterEach(() => {
    uninstall();
});

describe('mock agent server', () => {
    it('serves model, tool and workflow discovery', async () => {
        const [models, tools, workflows] = await Promise.all([
            client.getModels(),
            client.getTools(),
            client.getWorkflows(),
        ]);

        expect(models.length).toBeGreaterThan(1);
        expect(models.filter((m) => m.default)).toHaveLength(1);
        expect(tools.some((t) => t.name === 'web_search')).toBe(true);
        expect(workflows.some((w) => w.id === 'onboarding')).toBe(true);
    });

    it('404s on a route the real service would not have either', async () => {
        await expect(client.getWorkflowRun('onboarding', 'nope')).resolves.toBeTruthy();
        const response = await fetch(`${AGENT_URL}/does-not-exist`);
        expect(response.status).toBe(404);
    });

    it('streams a scripted turn: thinking, paired actions, text and usage', async () => {
        const events = await runChat({ prompt: 'check the repo', thinking: true });

        expect(events.some((e) => e.type === 'THINKING')).toBe(true);
        expect(events.some((e) => e.type === 'TEXT')).toBe(true);

        // Every action arrives as RUNNING first, then resolves once, by id.
        const actions = events.filter((e) => e.type === 'ACTION');
        const running = actions.filter((e) => e.action?.status === 'RUNNING');
        const resolved = actions.filter((e) => e.action?.status !== 'RUNNING');
        expect(running.length).toBeGreaterThan(2);
        expect(resolved).toHaveLength(running.length);
        expect(new Set(resolved.map((e) => e.action?.id))).toEqual(new Set(running.map((e) => e.action?.id)));
        expect(resolved.some((e) => e.action?.status === 'ERROR')).toBe(true);

        const last = events[events.length - 1];
        expect(last.type).toBe('COMPLETE');
        expect(last.usage?.total_tokens).toBeGreaterThan(0);
        expect(last.model).toBe('claude-opus-5');
    });

    it('honours the thinking flag', async () => {
        const events = await runChat({ prompt: 'check the repo', thinking: false });
        expect(events.some((e) => e.type === 'THINKING')).toBe(false);
        expect(events.some((e) => e.type === 'TEXT')).toBe(true);
    });

    it('reports the selected model back on every event', async () => {
        const events = await runChat({ prompt: 'check the repo', model: 'gemini-2.5-pro' });
        expect(events.every((e) => e.model === 'gemini-2.5-pro')).toBe(true);
        expect(events[0].provider).toBe('google');
    });

    it('emits an in-band ERROR and no COMPLETE for the failure scenario', async () => {
        setMockSettings({ scenario: 'error' });
        const events = await runChat({ prompt: 'summarise the close report' });

        expect(events[events.length - 1].type).toBe('ERROR');
        expect(events.some((e) => e.type === 'COMPLETE')).toBe(false);
    });

    it('emits generated media for the media scenario', async () => {
        setMockSettings({ scenario: 'media' });
        const events = await runChat({ prompt: 'chart revenue' });

        const media = events.filter((e) => e.type === 'MEDIA');
        expect(media.length).toBeGreaterThan(1);
        expect(media[0].media?.media_type).toBe('IMAGE');
        expect(media[0].media?.url).toContain('data:image/svg+xml');
    });

    it('unwinds the stream when the caller aborts', async () => {
        setMockSettings({ latency: 'slow' });
        const events = await runChat({ prompt: 'check the repo' }, 40);

        // onDone (not onError) is what AgentClient reports for an abort, and the
        // turn stops well before its scripted end.
        expect(events.some((e) => e.type === 'COMPLETE')).toBe(false);
        expect(events.length).toBeLessThan(20);
    });

    it('advances a workflow and ends with a terminal state line', async () => {
        const states: any[] = [];
        const events: StreamEvent[] = [];
        await new Promise<void>((resolve, reject) => {
            client.advanceWorkflow(
                'onboarding',
                { conversation_id: 'conv-1' },
                {
                    onEvent: (event) => events.push(event),
                    onState: (state) => states.push(state),
                    onDone: () => resolve(),
                    onError: reject,
                },
            );
        });

        expect(events.some((e) => e.type === 'TEXT')).toBe(true);
        expect(states).toHaveLength(1);
        expect(states[0].status).toBe('WAITING');
        expect(states[0].current_node).toBe('verify_domain');
    });
});

describe('mock media server', () => {
    it('satisfies a real BlueOrangeMedia upload, with progress', async () => {
        const media = new BlueOrangeMedia(MEDIA_URL);
        const file = new File(['region,revenue\nEMEA,1284000\n'], 'results.csv', { type: 'text/csv' });
        const progress: number[] = [];

        const uploaded = await media.uploadFile(file, false, 'llm-chat-attachments', [], (pct) =>
            progress.push(pct),
        );

        expect(uploaded.uuid).toBeTruthy();
        expect(uploaded.filename).toBe('results.csv');
        expect(uploaded.folder).toBe('llm-chat-attachments');
        expect(uploaded.url.startsWith('data:')).toBe(true);
        expect(progress.length).toBeGreaterThan(1);
        expect(progress[progress.length - 1]).toBe(100);
    });

    it('resolves a stored media id back to a displayable URL', async () => {
        const media = new BlueOrangeMedia(MEDIA_URL);
        const file = new File(['hello'], 'note.txt', { type: 'text/plain' });
        const uploaded = await media.uploadFile(file, false, 'llm-chat-attachments', [], () => undefined);

        const url = await media.getUrlFromMediaId(uploaded.id as number, 60);
        expect(url).toBe(uploaded.url);
    });

    it('leaves requests to other hosts alone', async () => {
        const xhr = new XMLHttpRequest();
        // A non-mock URL must reach the real implementation: opening then aborting
        // is only valid if `open` actually opened a request.
        xhr.open('GET', 'http://example.invalid/whatever');
        expect(xhr.readyState).toBe(1);
        xhr.abort();
    });
});
