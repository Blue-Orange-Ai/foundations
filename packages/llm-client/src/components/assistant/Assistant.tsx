import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ConfigAgentDto } from '../../interfaces/AgentProtocol';
import { Attachment, ChatSession, Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import {
    useAgentClient,
    useLlmConfig,
    useSessionStore,
} from '../providers/LlmAgentProvider';
import { useChat } from '../../services/useChat';
import { SessionSidebar } from '../sidebar/SessionSidebar';
import { Thread } from '../thread/Thread';
import '../llm-theme.css';
import './Assistant.css';

export interface AssistantProps {
    /** Force dark theme regardless of an ancestor `.dark` class. */
    dark?: boolean;
    /** Override branding from provider config. */
    branding?: WelcomeBranding;
    /** Override suggestions from provider config. */
    suggestions?: Suggestion[];
    /** Follow-up chips shown above the composer during a conversation. */
    followUps?: Suggestion[];
    /** Start with the sidebar open (default true). */
    sidebarOpen?: boolean;
    /** Show the model picker + thinking toggle (default true). */
    showModelControls?: boolean;
    className?: string;
}

const now = () => Date.now();

/**
 * The full assistant experience: a sessions/history sidebar next to a chat
 * thread. New conversations open on a centred welcome screen (logo, greeting,
 * suggestions, composer); sending the first message promotes the session into
 * persisted history. All server I/O flows through the AgentClient in context.
 */
export const Assistant: React.FC<AssistantProps> = ({
    dark,
    branding,
    suggestions,
    followUps,
    sidebarOpen = true,
    showModelControls = true,
    className,
}) => {
    const client = useAgentClient();
    const store = useSessionStore();
    const config = useLlmConfig();

    const [models, setModels] = useState<ConfigAgentDto[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>(() => store.load());
    const [thinking, setThinking] = useState<boolean>(Boolean(config.thinking));
    const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
    const [open, setOpen] = useState(sidebarOpen);
    const [isDark, setIsDark] = useState(Boolean(dark));

    const resolvedBranding = branding || config.welcome;
    const resolvedSuggestions = suggestions || config.suggestions;

    const defaultModel = useMemo(() => {
        if (config.defaultModel) return config.defaultModel;
        const flagged = models.find((m) => m.default);
        return flagged?.name || models[0]?.name;
    }, [config.defaultModel, models]);

    const createSession = useCallback(
        (): ChatSession => ({
            id: uuidv4(),
            title: 'New chat',
            messages: [],
            createdAt: now(),
            updatedAt: now(),
            model: defaultModel,
        }),
        [defaultModel],
    );

    const [currentSession, setCurrentSession] = useState<ChatSession>(() => createSession());

    // Load available models once.
    useEffect(() => {
        if (config.autoLoadModels === false) return;
        let cancelled = false;
        client
            .getModels()
            .then((m) => {
                if (!cancelled) setModels(m);
            })
            .catch(() => {
                /* discovery is best-effort; the picker just stays empty */
            });
        return () => {
            cancelled = true;
        };
    }, [client, config.autoLoadModels]);

    // Once a default model is known, apply it to a pristine session.
    useEffect(() => {
        if (defaultModel && currentSession.messages.length === 0 && !currentSession.model) {
            setCurrentSession((s) => ({ ...s, model: defaultModel }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultModel]);

    const handleSessionChange = useCallback(
        (updated: ChatSession, persist: boolean) => {
            setCurrentSession(updated);
            // Only write to storage at commit points (persist === true), and only
            // once a conversation actually has content — streaming deltas update
            // React state alone to avoid serialising history on every token.
            if (persist && updated.messages.length > 0) {
                const next = store.upsert(updated);
                setSessions(next);
            }
        },
        [store],
    );

    const { isRunning, send, stop, regenerate } = useChat({
        client,
        session: currentSession,
        onSessionChange: handleSessionChange,
        defaults: {
            thinking,
            systemPrompt: config.systemPrompt,
            model: currentSession.model || defaultModel,
        },
    });

    const handleNewChat = useCallback(() => {
        if (isRunning) stop();
        setCurrentSession(createSession());
    }, [createSession, isRunning, stop]);

    const handleSelect = useCallback(
        (sessionId: string) => {
            if (sessionId === currentSession.id) return;
            if (isRunning) stop();
            const found = store.load().find((s) => s.id === sessionId);
            if (found) setCurrentSession(found);
        },
        [currentSession.id, isRunning, stop, store],
    );

    const handleDelete = useCallback(
        (sessionId: string) => {
            const next = store.remove(sessionId);
            setSessions(next);
            if (sessionId === currentSession.id) {
                setCurrentSession(createSession());
            }
        },
        [createSession, currentSession.id, store],
    );

    const handleRename = useCallback(
        (sessionId: string, title: string) => {
            const target = store.load().find((s) => s.id === sessionId);
            if (!target) return;
            const updated = { ...target, title, updatedAt: now() };
            const next = store.upsert(updated);
            setSessions(next);
            if (sessionId === currentSession.id) {
                setCurrentSession((s) => ({ ...s, title }));
            }
        },
        [currentSession.id, store],
    );

    const handleModelChange = useCallback((model: string) => {
        setCurrentSession((s) => ({ ...s, model }));
    }, []);

    const handleSend = useCallback(
        (text: string, attachments: Attachment[]) => {
            send(text, attachments, { model: currentSession.model || defaultModel });
        },
        [send, currentSession.model, defaultModel],
    );

    const handleFeedback = useCallback((messageId: string, value: 'up' | 'down') => {
        setFeedback((prev) => ({ ...prev, [messageId]: prev[messageId] === value ? undefined as any : value }));
    }, []);

    return (
        <div className={`blue-orange-llm${isDark ? ' dark' : ''}${className ? ` ${className}` : ''}`}>
            {open && (
                <SessionSidebar
                    sessions={sessions}
                    currentSessionId={currentSession.id}
                    open={open}
                    onStateChange={setOpen}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    onNewChat={handleNewChat}
                    brandingTitle={resolvedBranding?.appName}
                    brandingLogo={resolvedBranding?.logo}
                    brandingLogoIsSvg={resolvedBranding?.logoIsSvg}
                    models={showModelControls ? models : []}
                    selectedModel={currentSession.model || defaultModel}
                    onModelChange={handleModelChange}
                    modelPickerDisabled={isRunning}
                    thinkingSupported={showModelControls}
                    thinking={thinking}
                    onToggleThinking={setThinking}
                    isDark={isDark}
                    onToggleTheme={() => setIsDark((d) => !d)}
                />
            )}
            <Thread
                session={currentSession}
                isRunning={isRunning}
                onSend={handleSend}
                onStop={stop}
                onRegenerate={regenerate}
                branding={resolvedBranding}
                suggestions={resolvedSuggestions}
                followUps={followUps}
                sidebarOpen={open}
                onToggleSidebar={() => setOpen((o) => !o)}
                feedback={feedback}
                onFeedback={handleFeedback}
            />
        </div>
    );
};
