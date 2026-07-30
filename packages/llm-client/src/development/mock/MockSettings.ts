// ---------------------------------------------------------------------------
// Live settings for the development mock server.
//
// The mock reads these at request time, so the dev panel can change the
// scripted response or the simulated latency between turns without a reload.
// Values persist in localStorage so a refresh keeps the chosen setup.
// ---------------------------------------------------------------------------

export type ScenarioKey = 'auto' | 'rich' | 'tools' | 'media' | 'code' | 'long' | 'error';

export type LatencyKey = 'instant' | 'normal' | 'slow';

export interface MockSettings {
    /** Which scripted answer the next turn replies with ('auto' = pick from the prompt). */
    scenario: ScenarioKey;
    /** How fast the fake stream arrives. */
    latency: LatencyKey;
}

const STORAGE_KEY = 'blue-orange-llm-mock-settings';

const DEFAULTS: MockSettings = { scenario: 'auto', latency: 'normal' };

let settings: MockSettings = load();

const listeners = new Set<(settings: MockSettings) => void>();

function load(): MockSettings {
    if (typeof localStorage === 'undefined') return { ...DEFAULTS };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULTS };
        return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<MockSettings>) };
    } catch {
        return { ...DEFAULTS };
    }
}

export const getMockSettings = (): MockSettings => settings;

export const setMockSettings = (patch: Partial<MockSettings>): MockSettings => {
    settings = { ...settings, ...patch };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        /* dev convenience only — ignore quota/serialisation failures */
    }
    listeners.forEach((listener) => listener(settings));
    return settings;
};

export const subscribeMockSettings = (listener: (settings: MockSettings) => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

/** Per-step delays, in milliseconds, for each latency profile. */
export const LATENCY_PROFILE: Record<LatencyKey, { firstByte: number; chunk: number; action: number }> = {
    instant: { firstByte: 20, chunk: 0, action: 60 },
    normal: { firstByte: 320, chunk: 22, action: 750 },
    slow: { firstByte: 1200, chunk: 70, action: 2200 },
};
