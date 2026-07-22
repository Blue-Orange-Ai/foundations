// ---------------------------------------------------------------------------
// SessionStore — client-side persistence of chat sessions.
//
// The llm-agent service is stateless between turns: it never stores a
// conversation, it just accepts a `history` array on each `/chat` call. So the
// "sessions / history" concept lives entirely on the client. This store keeps
// the list of sessions (and their full message trees) in localStorage, keyed by
// a namespace so multiple deployments on the same origin don't collide.
// ---------------------------------------------------------------------------

import { ChatSession } from '../interfaces/ChatInterfaces';

const DEFAULT_NAMESPACE = 'blue-orange-llm-sessions';

export class SessionStore {
    private key: string;

    constructor(namespace: string = DEFAULT_NAMESPACE) {
        this.key = namespace;
    }

    private safeParse(raw: string | null): ChatSession[] {
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? (parsed as ChatSession[]) : [];
        } catch {
            return [];
        }
    }

    load(): ChatSession[] {
        if (typeof localStorage === 'undefined') return [];
        const sessions = this.safeParse(localStorage.getItem(this.key));
        // Most-recently-updated first.
        return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    saveAll(sessions: ChatSession[]): void {
        if (typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(this.key, JSON.stringify(sessions));
        } catch {
            // Quota exceeded or serialisation failure — drop silently rather
            // than crash the UI. History is best-effort.
        }
    }

    upsert(session: ChatSession): ChatSession[] {
        const sessions = this.load();
        const idx = sessions.findIndex((s) => s.id === session.id);
        if (idx >= 0) {
            sessions[idx] = session;
        } else {
            sessions.unshift(session);
        }
        this.saveAll(sessions);
        return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    remove(sessionId: string): ChatSession[] {
        const sessions = this.load().filter((s) => s.id !== sessionId);
        this.saveAll(sessions);
        return sessions;
    }

    clear(): void {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(this.key);
    }
}

// -- Date bucketing for the history sidebar --------------------------------

export type HistoryBucket = 'Today' | 'Yesterday' | 'Previous 7 days' | 'Previous 30 days' | 'Older';

export const bucketForTimestamp = (timestamp: number, now: number = Date.now()): HistoryBucket => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startMs = startOfToday.getTime();

    if (timestamp >= startMs) return 'Today';
    if (timestamp >= startMs - oneDay) return 'Yesterday';
    if (timestamp >= startMs - 7 * oneDay) return 'Previous 7 days';
    if (timestamp >= startMs - 30 * oneDay) return 'Previous 30 days';
    return 'Older';
};

export const HISTORY_BUCKET_ORDER: HistoryBucket[] = [
    'Today',
    'Yesterday',
    'Previous 7 days',
    'Previous 30 days',
    'Older',
];

/** Derive a short session title from its first user message. */
export const deriveTitle = (text: string): string => {
    const trimmed = (text || '').trim().replace(/\s+/g, ' ');
    if (!trimmed) return 'New chat';
    return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
};
