// ---------------------------------------------------------------------------
// StreamAccumulator — folds the ndjson `StreamEvent` sequence of a single
// assistant turn into an ordered list of message parts.
//
// The server emits *deltas*: each TEXT/THINKING event carries only the newest
// chunk, and tool calls arrive as an ACTION(RUNNING) then a later
// ACTION(COMPLETE|ERROR) with the same id. This class is the one place that
// reconstructs a coherent, ordered message from that stream — kept pure (no
// React) so it is trivially unit-testable and reusable by the hook.
// ---------------------------------------------------------------------------

import { StreamEvent, Usage } from '../interfaces/AgentProtocol';
import {
    ActionPart,
    actionToPart,
    MessagePart,
    ReasoningPart,
    TextPart,
} from '../interfaces/ChatInterfaces';

export class StreamAccumulator {
    private parts: MessagePart[] = [];
    private usage: Usage | null = null;
    private errorText: string | null = null;
    private provider: string | null = null;
    private model: string | null = null;

    /** Index of the text/reasoning part currently being appended to, if any. */
    private openTextIndex = -1;
    private openReasoningIndex = -1;

    /** Apply one event; returns the new parts snapshot (a fresh array). */
    apply(event: StreamEvent): MessagePart[] {
        switch (event.type) {
            case 'TEXT':
                this.appendText(event.content || '');
                this.captureMeta(event);
                break;
            case 'THINKING':
                this.appendReasoning(event.content || '');
                this.captureMeta(event);
                break;
            case 'ACTION':
                this.applyAction(event);
                // A tool call interrupts the current text/reasoning run: a
                // subsequent TEXT should start a fresh part after the action.
                this.openTextIndex = -1;
                this.openReasoningIndex = -1;
                break;
            case 'MEDIA':
                if (event.media) {
                    this.parts.push({ type: 'media', media: event.media });
                }
                this.openTextIndex = -1;
                this.openReasoningIndex = -1;
                break;
            case 'USAGE':
            case 'COMPLETE':
                if (event.usage) this.usage = event.usage;
                this.captureMeta(event);
                this.closeReasoning();
                break;
            case 'ERROR':
                this.errorText = event.content || 'The assistant returned an error.';
                this.closeReasoning();
                break;
            default:
                break;
        }
        return this.snapshot();
    }

    private captureMeta(event: StreamEvent) {
        if (event.provider) this.provider = event.provider;
        if (event.model) this.model = event.model;
    }

    private appendText(chunk: string) {
        if (!chunk) return;
        // Once real answer text begins, any open reasoning run is finished.
        this.closeReasoning();
        if (this.openTextIndex >= 0) {
            const part = this.parts[this.openTextIndex] as TextPart;
            this.parts[this.openTextIndex] = { ...part, text: part.text + chunk };
        } else {
            this.parts.push({ type: 'text', text: chunk });
            this.openTextIndex = this.parts.length - 1;
        }
    }

    private appendReasoning(chunk: string) {
        if (!chunk) return;
        if (this.openReasoningIndex >= 0) {
            const part = this.parts[this.openReasoningIndex] as ReasoningPart;
            this.parts[this.openReasoningIndex] = { ...part, text: part.text + chunk, inProgress: true };
        } else {
            this.parts.push({ type: 'reasoning', text: chunk, inProgress: true });
            this.openReasoningIndex = this.parts.length - 1;
        }
    }

    private closeReasoning() {
        if (this.openReasoningIndex >= 0) {
            const part = this.parts[this.openReasoningIndex] as ReasoningPart;
            if (part.inProgress) {
                this.parts[this.openReasoningIndex] = { ...part, inProgress: false };
            }
            this.openReasoningIndex = -1;
        }
    }

    private applyAction(event: StreamEvent) {
        if (!event.action) return;
        const incoming: ActionPart = actionToPart(event.action);
        const existingIndex = this.parts.findIndex(
            (p) => p.type === 'action' && p.id === incoming.id,
        );
        if (existingIndex >= 0) {
            const prev = this.parts[existingIndex] as ActionPart;
            // Merge: a COMPLETE event may omit fields the RUNNING event carried.
            this.parts[existingIndex] = {
                ...prev,
                ...incoming,
                title: incoming.title || prev.title,
                arguments: incoming.arguments || prev.arguments,
                detail: incoming.detail ?? prev.detail,
            };
        } else {
            this.parts.push(incoming);
        }
    }

    private snapshot(): MessagePart[] {
        return this.parts.slice();
    }

    getUsage(): Usage | null {
        return this.usage;
    }

    getError(): string | null {
        return this.errorText;
    }

    getProvider(): string | null {
        return this.provider;
    }

    getModel(): string | null {
        return this.model;
    }

    /** Called when the stream ends; finalises any open reasoning run. */
    finalise(): MessagePart[] {
        this.closeReasoning();
        return this.snapshot();
    }
}
