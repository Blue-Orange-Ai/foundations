// ---------------------------------------------------------------------------
// useChat — the stateful bridge between a ChatSession and the streaming agent.
//
// Owns the send / stop / regenerate lifecycle for the active session: it builds
// the wire `ChatRequest` (prompt + history + attachments + model + thinking +
// tools), opens the ndjson stream via AgentClient, folds events through a
// StreamAccumulator into the assistant message's parts, and hands the updated
// session back to the caller (which persists it and refreshes the sidebar).
// ---------------------------------------------------------------------------

import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChatMessageDto, ChatRequest } from '../interfaces/AgentProtocol';
import {
    Attachment,
    ChatMessage,
    ChatSession,
    messageText,
} from '../interfaces/ChatInterfaces';
import { AgentClient } from './AgentClient';
import { StreamAccumulator } from './StreamAccumulator';
import { deriveTitle } from './SessionStore';

export interface SendOptions {
    thinking?: boolean;
    toolIds?: string[];
    systemPrompt?: string;
    model?: string;
}

const now = () => Date.now();

/** Project the completed messages of a session into the server `history` shape. */
export const buildHistory = (messages: ChatMessage[]): ChatMessageDto[] =>
    messages
        .filter((m) => m.status !== 'error' && m.status !== 'cancelled')
        .map((m) => ({
            content: messageText(m),
            attachments: (m.attachments || []).map((a) => a.uuid),
            created_at: new Date(m.createdAt).toISOString(),
            message_type: m.role === 'user' ? 'PROMPT' : 'RESPONSE',
            provider: m.provider ?? undefined,
            model: m.model ?? undefined,
        }));

interface UseChatArgs {
    client: AgentClient;
    session: ChatSession;
    /**
     * Receives every session update. `persist` is false for the high-frequency
     * streaming deltas (update React state only) and true at commit points
     * (first message, turn end, stop) where the session should be written to
     * durable storage — so we don't serialise the whole history per token.
     */
    onSessionChange: (session: ChatSession, persist: boolean) => void;
    defaults?: SendOptions;
}

export interface UseChatResult {
    isRunning: boolean;
    send: (text: string, attachments?: Attachment[], options?: SendOptions) => void;
    stop: () => void;
    regenerate: (assistantMessageId: string, options?: SendOptions) => void;
}

export const useChat = ({ client, session, onSessionChange, defaults }: UseChatArgs): UseChatResult => {
    const [isRunning, setIsRunning] = useState(false);
    const abortRef = useRef<(() => void) | null>(null);
    // Always read the freshest session inside async callbacks.
    const sessionRef = useRef(session);
    sessionRef.current = session;

    const patchSession = useCallback(
        (updater: (s: ChatSession) => ChatSession, persist = false) => {
            const next = updater(sessionRef.current);
            sessionRef.current = next;
            onSessionChange(next, persist);
        },
        [onSessionChange],
    );

    const runTurn = useCallback(
        (priorMessages: ChatMessage[], request: ChatRequest, assistantId: string) => {
            const accumulator = new StreamAccumulator();
            setIsRunning(true);

            const finish = (status: ChatMessage['status']) => {
                setIsRunning(false);
                abortRef.current = null;
                patchSession((s) => ({
                    ...s,
                    updatedAt: now(),
                    messages: s.messages.map((m) =>
                        m.id === assistantId
                            ? {
                                  ...m,
                                  parts: accumulator.finalise(),
                                  status: accumulator.getError() ? 'error' : status,
                                  error: accumulator.getError() || undefined,
                                  usage: accumulator.getUsage(),
                                  provider: accumulator.getProvider(),
                                  model: accumulator.getModel() || m.model,
                              }
                            : m,
                    ),
                }), true);
            };

            const handle = client.chat(request, {
                onEvent: (event) => {
                    const parts = accumulator.apply(event);
                    patchSession((s) => ({
                        ...s,
                        messages: s.messages.map((m) =>
                            m.id === assistantId
                                ? {
                                      ...m,
                                      parts,
                                      usage: accumulator.getUsage(),
                                      provider: accumulator.getProvider() || m.provider,
                                      model: accumulator.getModel() || m.model,
                                  }
                                : m,
                        ),
                    }));
                },
                onDone: () => finish('complete'),
                onError: (err) => {
                    accumulator.apply({ type: 'ERROR', content: err.message });
                    finish('error');
                },
            });
            abortRef.current = handle.abort;
        },
        [client, patchSession],
    );

    const send = useCallback(
        (text: string, attachments?: Attachment[], options?: SendOptions) => {
            const trimmed = text.trim();
            const readyAttachments = (attachments || []).filter((a) => a.uuid && !a.error);
            if ((!trimmed && readyAttachments.length === 0) || isRunning) return;

            const opts = { ...defaults, ...options };
            const model = opts.model || sessionRef.current.model;
            const userMessage: ChatMessage = {
                id: uuidv4(),
                role: 'user',
                parts: trimmed ? [{ type: 'text', text: trimmed }] : [],
                attachments: readyAttachments,
                status: 'complete',
                createdAt: now(),
            };
            const assistantMessage: ChatMessage = {
                id: uuidv4(),
                role: 'assistant',
                parts: [],
                status: 'streaming',
                createdAt: now(),
                model,
            };

            const priorMessages = sessionRef.current.messages;
            const isFirst = priorMessages.length === 0;

            patchSession(
                (s) => ({
                    ...s,
                    title: isFirst && trimmed ? deriveTitle(trimmed) : s.title,
                    updatedAt: now(),
                    messages: [...s.messages, userMessage, assistantMessage],
                }),
                true,
            );

            const request: ChatRequest = {
                prompt: trimmed,
                model,
                attachments: readyAttachments.map((a) => a.uuid),
                history: buildHistory(priorMessages),
                thinking: opts.thinking,
                tool_ids: opts.toolIds,
                system_prompt: opts.systemPrompt,
            };
            runTurn(priorMessages, request, assistantMessage.id);
        },
        [defaults, isRunning, patchSession, runTurn],
    );

    const stop = useCallback(() => {
        abortRef.current?.();
        abortRef.current = null;
        setIsRunning(false);
        patchSession(
            (s) => ({
                ...s,
                messages: s.messages.map((m) =>
                    m.status === 'streaming' ? { ...m, status: 'cancelled' } : m,
                ),
            }),
            true,
        );
    }, [patchSession]);

    const regenerate = useCallback(
        (assistantMessageId: string, options?: SendOptions) => {
            if (isRunning) return;
            const messages = sessionRef.current.messages;
            const idx = messages.findIndex((m) => m.id === assistantMessageId);
            if (idx < 0) return;

            // The prompt that produced this assistant turn is the message before it.
            const priorMessages = messages.slice(0, idx - 1 >= 0 ? idx - 1 : 0);
            const userMessage = idx > 0 ? messages[idx - 1] : undefined;
            if (!userMessage || userMessage.role !== 'user') return;

            const opts = { ...defaults, ...options };
            const model = opts.model || sessionRef.current.model;

            // Reset the assistant message to a fresh streaming placeholder and
            // drop anything after it.
            patchSession(
                (s) => ({
                    ...s,
                    updatedAt: now(),
                    messages: s.messages.slice(0, idx + 1).map((m) =>
                        m.id === assistantMessageId
                            ? { ...m, parts: [], status: 'streaming', error: undefined, usage: null, model }
                            : m,
                    ),
                }),
                true,
            );

            const request: ChatRequest = {
                prompt: messageText(userMessage),
                model,
                attachments: (userMessage.attachments || []).map((a) => a.uuid),
                history: buildHistory(priorMessages),
                thinking: opts.thinking,
                tool_ids: opts.toolIds,
                system_prompt: opts.systemPrompt,
            };
            runTurn(priorMessages, request, assistantMessageId);
        },
        [defaults, isRunning, patchSession, runTurn],
    );

    return { isRunning, send, stop, regenerate };
};
