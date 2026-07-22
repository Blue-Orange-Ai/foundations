// ---------------------------------------------------------------------------
// LlmAgentProvider — the single configuration + dependency root for the chat UI.
//
// Mirrors the SearchProvider pattern used elsewhere in the monorepo: construct
// the transport clients once, expose them (plus static config) through context,
// and offer typed hooks. Everything a consumer needs to stand up the assistant
// is passed here — the base URL, auth, media settings, branding, suggestions
// and default model.
// ---------------------------------------------------------------------------

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { BlueOrangeMedia, MediaPermission } from '@blue-orange-ai/foundations-clients';

import { AgentClient } from '../../services/AgentClient';
import { SessionStore } from '../../services/SessionStore';
import { Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';

export interface MediaConfig {
    /** Base URL of the media service (BlueOrangeMedia). */
    uri: string;
    /** Auth cookie name BlueOrangeMedia reads. Defaults to "authorization". */
    authCookie?: string;
    /** Folder uploaded attachments are stored under. */
    folder?: string;
    /** Whether uploaded attachments are public. */
    public?: boolean;
    /** Permissions applied to uploaded attachments. */
    permissions?: MediaPermission[];
}

export interface LlmAgentConfig {
    /** Base URL of the llm-agent service, e.g. "http://localhost:6012". */
    uri: string;
    /** Bearer token for the Authorization header (passport auth). */
    token?: string;
    /** Extra headers merged into every agent request. */
    headers?: Record<string, string>;
    /** Media service configuration; required to enable attachments. */
    media?: MediaConfig;
    /** Default model `name` (matches ConfigAgentDto.name from /config/models). */
    defaultModel?: string;
    /** Enable extended "thinking" by default. */
    thinking?: boolean;
    /** System prompt override applied to every turn. */
    systemPrompt?: string;
    /** Branding shown on the centred welcome screen. */
    welcome?: WelcomeBranding;
    /** Starter prompts shown on the welcome screen. */
    suggestions?: Suggestion[];
    /** localStorage namespace for persisted sessions. */
    sessionNamespace?: string;
    /** Fetch available models from /config/models on mount (default true). */
    autoLoadModels?: boolean;
    /** Fetch available tools from /tools on mount (default false). */
    autoLoadTools?: boolean;
}

interface LlmAgentContextValue {
    client: AgentClient;
    media?: BlueOrangeMedia;
    sessionStore: SessionStore;
    config: LlmAgentConfig;
}

const LlmAgentContext = createContext<LlmAgentContextValue | null>(null);

interface LlmAgentProviderProps extends LlmAgentConfig {
    children: ReactNode;
}

export const LlmAgentProvider: React.FC<LlmAgentProviderProps> = (props) => {
    const { children, ...config } = props;

    const client = useMemo(
        () => new AgentClient({ baseUrl: config.uri, token: config.token, headers: config.headers }),
        // Recreate only when transport-relevant config changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [config.uri, config.token, JSON.stringify(config.headers || {})],
    );

    const media = useMemo(() => {
        if (!config.media?.uri) return undefined;
        return new BlueOrangeMedia(config.media.uri, config.media.authCookie || 'authorization');
    }, [config.media?.uri, config.media?.authCookie]);

    const sessionStore = useMemo(
        () => new SessionStore(config.sessionNamespace),
        [config.sessionNamespace],
    );

    const value = useMemo<LlmAgentContextValue>(
        () => ({ client, media, sessionStore, config }),
        // config is stable enough for our needs; stringify guards deep changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [client, media, sessionStore, JSON.stringify(config)],
    );

    return <LlmAgentContext.Provider value={value}>{children}</LlmAgentContext.Provider>;
};

const useCtx = (): LlmAgentContextValue => {
    const ctx = useContext(LlmAgentContext);
    if (!ctx) {
        throw new Error('LLM client components must be used within an <LlmAgentProvider>.');
    }
    return ctx;
};

export const useAgentClient = (): AgentClient => useCtx().client;
export const useMediaClient = (): BlueOrangeMedia | undefined => useCtx().media;
export const useSessionStore = (): SessionStore => useCtx().sessionStore;
export const useLlmConfig = (): LlmAgentConfig => useCtx().config;
