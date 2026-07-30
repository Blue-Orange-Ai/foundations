import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ConfigAgentDto, ToolDefinition } from '../../interfaces/AgentProtocol';
import { Attachment, ChatSession, Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import {
    ComposerConfig,
    ComposerMenuItem,
    ComposerQuickAction,
    ComposerSettingValues,
    DEFAULT_COMPOSER_SETTINGS,
    defaultSettingValues,
} from '../../interfaces/ComposerInterfaces';
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
    /**
     * Composer presentation — the "+" menu, highlighted modes, model picker,
     * generation settings and dictation. Merged over the provider's `composer`
     * config; the model picker and settings are wired up automatically unless
     * this turns them off.
     */
    composer?: ComposerConfig;
    /** Start with the sidebar open (default true). */
    sidebarOpen?: boolean;
    /**
     * Also show the model picker and thinking toggle in the sidebar footer
     * (default false — those controls live in the composer now).
     */
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
    composer,
    sidebarOpen = true,
    showModelControls = false,
    className,
}) => {
    const client = useAgentClient();
    const store = useSessionStore();
    const config = useLlmConfig();

    const composerConfig = useMemo<ComposerConfig>(
        () => ({ ...config.composer, ...composer }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(config.composer || {}), composer],
    );

    const settingItems = composerConfig.settings?.items || DEFAULT_COMPOSER_SETTINGS;

    const [models, setModels] = useState<ConfigAgentDto[]>([]);
    const [tools, setTools] = useState<ToolDefinition[]>([]);
    const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
    const [modes, setModes] = useState<string[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>(() => store.load());
    const [settingValues, setSettingValues] = useState<ComposerSettingValues>(() => ({
        ...defaultSettingValues(settingItems),
        // The provider-level `thinking` flag seeds the toggle of the same name.
        ...(config.thinking !== undefined ? { thinking: config.thinking } : {}),
        ...(composerConfig.settings?.values || {}),
    }));
    const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
    const [open, setOpen] = useState(sidebarOpen);
    const [isDark, setIsDark] = useState(Boolean(dark));

    const resolvedBranding = branding || config.welcome;
    const resolvedSuggestions = suggestions || config.suggestions;

    const thinking = Boolean(settingValues.thinking);

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

    // Load the tool registry when asked, for the composer's "+" menu.
    useEffect(() => {
        if (!config.autoLoadTools) return;
        let cancelled = false;
        client
            .getTools()
            .then((t) => {
                if (!cancelled) setTools(t.filter((tool) => tool.enabled));
            })
            .catch(() => {
                /* the tools submenu is simply omitted */
            });
        return () => {
            cancelled = true;
        };
    }, [client, config.autoLoadTools]);

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

    // Named settings map onto the chat request; anything else a consumer adds is
    // forwarded verbatim, so custom controls reach the server untouched.
    const sendDefaults = useMemo(() => {
        const known = new Set(['thinking', 'effort', 'temperature']);
        const extra: Record<string, any> = {};
        Object.keys(settingValues).forEach((id) => {
            if (!known.has(id)) extra[id] = settingValues[id];
        });
        return {
            thinking,
            effort: typeof settingValues.effort === 'string' ? settingValues.effort : undefined,
            temperature:
                typeof settingValues.temperature === 'number' ? settingValues.temperature : undefined,
            modes,
            toolIds: selectedToolIds.length > 0 ? selectedToolIds : undefined,
            systemPrompt: config.systemPrompt,
            model: currentSession.model || defaultModel,
            extra: Object.keys(extra).length > 0 ? extra : undefined,
        };
    }, [
        config.systemPrompt,
        currentSession.model,
        defaultModel,
        modes,
        selectedToolIds,
        settingValues,
        thinking,
    ]);

    const { isRunning, send, stop, regenerate } = useChat({
        client,
        session: currentSession,
        onSessionChange: handleSessionChange,
        defaults: sendDefaults,
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
            send(text, attachments);
        },
        [send],
    );

    const handleFeedback = useCallback((messageId: string, value: 'up' | 'down') => {
        setFeedback((prev) => ({ ...prev, [messageId]: prev[messageId] === value ? undefined as any : value }));
    }, []);

    const handleSettingsChange = useCallback(
        (values: ComposerSettingValues) => {
            setSettingValues(values);
            composerConfig.settings?.onChange?.(values);
        },
        [composerConfig.settings],
    );

    const setSetting = useCallback((id: string, value: boolean | number | string) => {
        setSettingValues((prev) => ({ ...prev, [id]: value }));
    }, []);

    // -- Composer wiring ---------------------------------------------------

    /** The registered tools, as a submenu of toggleable rows. */
    const toolMenuItem = useMemo<ComposerMenuItem | undefined>(() => {
        if (tools.length === 0) return undefined;
        return {
            id: 'tools',
            label: 'Add tool',
            icon: 'ri-tools-line',
            items: tools.map((tool) => ({
                id: `tool:${tool.id}`,
                label: tool.name,
                icon: 'ri-function-line',
                checked: selectedToolIds.includes(tool.id),
                value: tool,
            })),
        };
    }, [tools, selectedToolIds]);

    const handleMenuSelect = useCallback(
        (item: ComposerMenuItem) => {
            if (item.id.startsWith('tool:')) {
                const toolId = item.id.slice('tool:'.length);
                setSelectedToolIds((prev) =>
                    prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId],
                );
                return;
            }
            composerConfig.menu?.onSelect?.(item);
        },
        [composerConfig.menu],
    );

    const handleQuickAction = useCallback(
        (action: ComposerQuickAction, active: boolean) => {
            setModes((prev) => (active ? [...prev, action.id] : prev.filter((id) => id !== action.id)));
            composerConfig.onQuickAction?.(action, active);
        },
        [composerConfig],
    );

    const resolvedComposer = useMemo<ComposerConfig>(() => {
        const menuItems = [...(toolMenuItem ? [toolMenuItem] : []), ...(composerConfig.menu?.items || [])];
        // The welcome screen and the conversation render separate Composer
        // instances, so the pill state has to be driven from here — otherwise a
        // mode switched on before the first message appears to reset after it.
        const quickActions = (composerConfig.quickActions || []).map((action) => ({
            ...action,
            active: action.active !== undefined ? action.active : modes.includes(action.id),
        }));
        return {
            ...composerConfig,
            quickActions,
            menu: {
                ...composerConfig.menu,
                items: menuItems,
                onSelect: handleMenuSelect,
            },
            model: {
                models,
                value: currentSession.model || defaultModel,
                onChange: handleModelChange,
                disabled: isRunning,
                ...composerConfig.model,
            },
            settings: {
                ...composerConfig.settings,
                items: settingItems,
                values: settingValues,
                onChange: handleSettingsChange,
            },
            onQuickAction: handleQuickAction,
        };
    }, [
        composerConfig,
        currentSession.model,
        defaultModel,
        handleMenuSelect,
        handleModelChange,
        handleQuickAction,
        handleSettingsChange,
        isRunning,
        models,
        modes,
        settingItems,
        settingValues,
        toolMenuItem,
    ]);

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
                    onToggleThinking={(value) => setSetting('thinking', value)}
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
                composer={resolvedComposer}
                sidebarOpen={open}
                onToggleSidebar={() => setOpen((o) => !o)}
                feedback={feedback}
                onFeedback={handleFeedback}
            />
        </div>
    );
};
