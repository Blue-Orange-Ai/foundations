import { buildHistory } from './useChat';
import { bucketForTimestamp, deriveTitle } from './SessionStore';
import { ChatMessage } from '../interfaces/ChatInterfaces';

const msg = (over: Partial<ChatMessage>): ChatMessage => ({
    id: over.id || 'm',
    role: over.role || 'user',
    parts: over.parts || [],
    status: over.status || 'complete',
    createdAt: over.createdAt || 0,
    ...over,
});

describe('buildHistory', () => {
    it('projects messages onto the server PROMPT/RESPONSE shape with attachments', () => {
        const history = buildHistory([
            msg({ role: 'user', parts: [{ type: 'text', text: 'hi' }], attachments: [{ uuid: 'u1', filename: 'a.png' }] }),
            msg({
                role: 'assistant',
                parts: [
                    { type: 'reasoning', text: 'hmm', inProgress: false },
                    { type: 'text', text: 'hello' },
                ],
                model: 'gpt-4o',
            }),
        ]);
        expect(history).toHaveLength(2);
        expect(history[0].message_type).toBe('PROMPT');
        expect(history[0].content).toBe('hi');
        expect(history[0].attachments).toEqual(['u1']);
        // reasoning parts are excluded from history content — only answer text.
        expect(history[1].message_type).toBe('RESPONSE');
        expect(history[1].content).toBe('hello');
    });

    it('drops errored and cancelled messages', () => {
        const history = buildHistory([
            msg({ role: 'user', parts: [{ type: 'text', text: 'q' }] }),
            msg({ role: 'assistant', status: 'error', parts: [{ type: 'text', text: 'partial' }] }),
        ]);
        expect(history).toHaveLength(1);
        expect(history[0].content).toBe('q');
    });
});

describe('bucketForTimestamp', () => {
    const now = new Date('2026-07-22T12:00:00Z').getTime();
    const day = 24 * 60 * 60 * 1000;
    it('buckets by recency', () => {
        expect(bucketForTimestamp(now, now)).toBe('Today');
        expect(bucketForTimestamp(now - day, now)).toBe('Yesterday');
        expect(bucketForTimestamp(now - 4 * day, now)).toBe('Previous 7 days');
        expect(bucketForTimestamp(now - 20 * day, now)).toBe('Previous 30 days');
        expect(bucketForTimestamp(now - 90 * day, now)).toBe('Older');
    });
});

describe('deriveTitle', () => {
    it('truncates long prompts and collapses whitespace', () => {
        expect(deriveTitle('  hello   world ')).toBe('hello world');
        expect(deriveTitle('')).toBe('New chat');
        expect(deriveTitle('x'.repeat(60)).endsWith('…')).toBe(true);
    });
});
