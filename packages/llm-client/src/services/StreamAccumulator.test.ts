import { StreamAccumulator } from './StreamAccumulator';
import { StreamEvent } from '../interfaces/AgentProtocol';
import { ActionPart, ReasoningPart, TextPart } from '../interfaces/ChatInterfaces';

const ev = (e: Partial<StreamEvent> & { type: StreamEvent['type'] }): StreamEvent => e as StreamEvent;

describe('StreamAccumulator', () => {
    it('accumulates TEXT deltas into a single text part', () => {
        const acc = new StreamAccumulator();
        acc.apply(ev({ type: 'TEXT', content: 'Hel' }));
        acc.apply(ev({ type: 'TEXT', content: 'lo ' }));
        const parts = acc.apply(ev({ type: 'TEXT', content: 'world' }));
        expect(parts).toHaveLength(1);
        expect((parts[0] as TextPart).type).toBe('text');
        expect((parts[0] as TextPart).text).toBe('Hello world');
    });

    it('folds THINKING deltas into a reasoning part and closes it when text starts', () => {
        const acc = new StreamAccumulator();
        acc.apply(ev({ type: 'THINKING', content: 'Let me ' }));
        acc.apply(ev({ type: 'THINKING', content: 'think.' }));
        let parts = acc.apply(ev({ type: 'TEXT', content: 'Answer' }));
        const reasoning = parts[0] as ReasoningPart;
        expect(reasoning.type).toBe('reasoning');
        expect(reasoning.text).toBe('Let me think.');
        expect(reasoning.inProgress).toBe(false);
        expect((parts[1] as TextPart).text).toBe('Answer');
        parts = acc.finalise();
        expect(parts).toHaveLength(2);
    });

    it('pairs a RUNNING action with its COMPLETE by id', () => {
        const acc = new StreamAccumulator();
        acc.apply(
            ev({
                type: 'ACTION',
                action: {
                    id: 'a1',
                    action_type: 'READ_FILE',
                    title: 'Read app.yml',
                    status: 'RUNNING',
                    metadata: { arguments: { path: 'app.yml' } },
                },
            }),
        );
        const parts = acc.apply(
            ev({
                type: 'ACTION',
                action: { id: 'a1', action_type: 'READ_FILE', title: 'Read app.yml', status: 'COMPLETE', detail: 'port: 6012' },
            }),
        );
        const action = parts.find((p) => p.type === 'action') as ActionPart;
        expect(parts.filter((p) => p.type === 'action')).toHaveLength(1);
        expect(action.status).toBe('COMPLETE');
        expect(action.detail).toBe('port: 6012');
        expect(action.arguments).toEqual({ path: 'app.yml' });
    });

    it('orders interleaved reasoning, action and text parts', () => {
        const acc = new StreamAccumulator();
        acc.apply(ev({ type: 'THINKING', content: 'thinking' }));
        acc.apply(ev({ type: 'ACTION', action: { id: 't1', action_type: 'WEB_SEARCH', title: 'Search', status: 'RUNNING' } }));
        acc.apply(ev({ type: 'TEXT', content: 'first' }));
        acc.apply(ev({ type: 'ACTION', action: { id: 't2', action_type: 'WEB_FETCH', title: 'Fetch', status: 'RUNNING' } }));
        const parts = acc.apply(ev({ type: 'TEXT', content: 'second' }));
        expect(parts.map((p) => p.type)).toEqual(['reasoning', 'action', 'text', 'action', 'text']);
        expect((parts[2] as TextPart).text).toBe('first');
        expect((parts[4] as TextPart).text).toBe('second');
    });

    it('captures usage and error', () => {
        const acc = new StreamAccumulator();
        acc.apply(ev({ type: 'TEXT', content: 'hi', model: 'gpt-4o', provider: 'open-ai' }));
        acc.apply(ev({ type: 'COMPLETE', usage: { total_tokens: 42 } }));
        expect(acc.getUsage()?.total_tokens).toBe(42);
        expect(acc.getModel()).toBe('gpt-4o');
        expect(acc.getProvider()).toBe('open-ai');

        const acc2 = new StreamAccumulator();
        acc2.apply(ev({ type: 'ERROR', content: 'boom' }));
        expect(acc2.getError()).toBe('boom');
    });
});
