// ---------------------------------------------------------------------------
// Development mock server.
//
// `installMockServer()` puts a fake llm-agent and a fake media service behind
// the URLs the dev workspace is configured with, by intercepting `fetch` (and
// the `XMLHttpRequest` calls BlueOrangeMedia makes for uploads) for those hosts
// only. Everything else — HMR, fonts, any other request — passes through.
//
// None of this is part of the published library: `src/development` is not
// referenced by `src/vite-entry.tsx`, so it never reaches a build.
// ---------------------------------------------------------------------------

import { handleAgentRequest } from './MockAgentServer';
import { handleMediaRequest, installMediaXhr } from './MockMediaServer';
import { clearDemoSessions, seedDemoSessions } from './demoSessions';

export interface MockServerOptions {
    /** Base URL the client is pointed at, e.g. "http://localhost:6012". */
    agentUrl: string;
    /** Base URL of the media service; omit to leave uploads unmocked. */
    mediaUrl?: string;
    /** Session namespace to seed demo history into. */
    sessionNamespace?: string;
    /** Seed demo conversations on first run (default true). */
    seed?: boolean;
}

/** Flip this in localStorage to run against a real, locally running agent. */
export const MOCK_DISABLED_KEY = 'blue-orange-llm-mock-disabled';

export const isMockDisabled = (): boolean => {
    try {
        return localStorage.getItem(MOCK_DISABLED_KEY) === 'true';
    } catch {
        return false;
    }
};

export const setMockDisabled = (disabled: boolean): void => {
    try {
        localStorage.setItem(MOCK_DISABLED_KEY, disabled ? 'true' : 'false');
    } catch {
        /* dev convenience only */
    }
};

const trimSlash = (value: string): string => value.replace(/\/+$/, '');

const urlOf = (input: RequestInfo | URL): string | null => {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.toString();
    return null; // A `Request` object — nothing the mocked clients produce.
};

const notFound = (path: string): Response =>
    new Response(JSON.stringify({ detail: `Mock server has no route for ${path}` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });

const INSTALLED_FLAG = '__blueOrangeLlmMockServer';

/** In a browser this is `window`; kept explicit so the mock is testable. */
type Scope = Record<string, any>;

const globalScope = (): Scope => (typeof globalThis !== 'undefined' ? globalThis : window) as unknown as Scope;

/**
 * Install the mock server. Idempotent across hot reloads; returns an uninstall
 * function that restores the original `fetch` / `XMLHttpRequest`.
 */
export const installMockServer = (options: MockServerOptions): (() => void) => {
    const scope = globalScope();
    const anyWindow = scope;
    if (anyWindow[INSTALLED_FLAG]) return anyWindow[INSTALLED_FLAG] as () => void;

    if (isMockDisabled()) {
        // eslint-disable-next-line no-console
        console.info('[mock] disabled — requests go to the real services. Re-enable it in the Mock server panel.');
        return () => undefined;
    }

    const agentUrl = trimSlash(options.agentUrl);
    const mediaUrl = options.mediaUrl ? trimSlash(options.mediaUrl) : undefined;

    const originalFetch: typeof fetch = scope.fetch.bind(scope);
    const restoreXhr = mediaUrl ? installMediaXhr(mediaUrl, scope) : () => undefined;

    const mockFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = urlOf(input);

        if (url && url.startsWith(agentUrl)) {
            const path = url.slice(agentUrl.length).split('?')[0];
            const response = handleAgentRequest(path, init);
            return Promise.resolve(response || notFound(path));
        }

        if (url && mediaUrl && url.startsWith(mediaUrl)) {
            const path = url.slice(mediaUrl.length).split('?')[0];
            const response = handleMediaRequest(mediaUrl, path, init);
            return Promise.resolve(response || notFound(path));
        }

        return originalFetch(input, init);
    };

    scope.fetch = mockFetch;
    // Under jsdom `window` and `globalThis` are separate objects; patch both so
    // whichever one the caller reaches resolves to the mock.
    if (typeof window !== 'undefined' && (window as unknown as Scope) !== scope) {
        (window as unknown as Scope).fetch = mockFetch;
    }

    if (options.seed !== false) {
        try {
            if (seedDemoSessions(options.sessionNamespace)) {
                // eslint-disable-next-line no-console
                console.info('[mock] seeded demo conversation history');
            }
        } catch {
            /* localStorage unavailable — the sidebar just starts empty */
        }
    }

    // eslint-disable-next-line no-console
    console.info(
        `[mock] agent at ${agentUrl}${mediaUrl ? `, media at ${mediaUrl}` : ''} — streaming chat, models, tools and uploads are simulated.`,
    );

    const uninstall = () => {
        scope.fetch = originalFetch;
        if (typeof window !== 'undefined' && (window as unknown as Scope) !== scope) {
            (window as unknown as Scope).fetch = originalFetch;
        }
        restoreXhr();
        delete anyWindow[INSTALLED_FLAG];
    };
    anyWindow[INSTALLED_FLAG] = uninstall;
    return uninstall;
};

export { clearDemoSessions, seedDemoSessions };
export * from './MockSettings';
export { SCENARIOS } from './scenarios';
export { MOCK_MODELS, MOCK_TOOLS, MOCK_WORKFLOWS } from './MockAgentServer';
