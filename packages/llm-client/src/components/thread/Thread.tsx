import React from 'react';
import { SimpleTooltip } from '@blue-orange-ai/foundations-core';

import { ConfigAgentDto } from '../../interfaces/AgentProtocol';
import { Attachment, ChatSession, Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import { MessageList } from '../messages/MessageList';
import { Composer } from '../composer/Composer';
import { ThreadWelcome } from './ThreadWelcome';
import { Suggestions } from '../suggestions/Suggestions';
import { ModelPicker } from '../model-picker/ModelPicker';
import './Thread.css';

interface Props {
    session: ChatSession;
    isRunning: boolean;
    onSend: (text: string, attachments: Attachment[]) => void;
    onStop: () => void;
    onRegenerate: (messageId: string) => void;
    onNewChat: () => void;

    models: ConfigAgentDto[];
    selectedModel?: string;
    onModelChange: (model: string) => void;

    thinkingSupported?: boolean;
    thinking: boolean;
    onToggleThinking: (value: boolean) => void;

    branding?: WelcomeBranding;
    suggestions?: Suggestion[];
    followUps?: Suggestion[];

    sidebarOpen: boolean;
    onToggleSidebar: () => void;

    feedback?: Record<string, 'up' | 'down'>;
    onFeedback?: (messageId: string, value: 'up' | 'down') => void;
}

export const Thread: React.FC<Props> = ({
    session,
    isRunning,
    onSend,
    onStop,
    onRegenerate,
    onNewChat,
    models,
    selectedModel,
    onModelChange,
    thinkingSupported,
    thinking,
    onToggleThinking,
    branding,
    suggestions,
    followUps,
    sidebarOpen,
    onToggleSidebar,
    feedback,
    onFeedback,
}) => {
    const isEmpty = session.messages.length === 0;

    const header = (
        <div className="blue-orange-llm-thread-header">
            <div className="blue-orange-llm-thread-header-left">
                {!sidebarOpen && (
                    <SimpleTooltip label="Open sidebar">
                        <button type="button" className="blue-orange-llm-header-btn" onClick={onToggleSidebar}>
                            <i className="ri-side-bar-line" />
                        </button>
                    </SimpleTooltip>
                )}
                <span className="blue-orange-llm-thread-title">{session.title || 'New chat'}</span>
            </div>
            <div className="blue-orange-llm-thread-header-right">
                {thinkingSupported && (
                    <SimpleTooltip label={thinking ? 'Extended thinking on' : 'Extended thinking off'}>
                        <button
                            type="button"
                            className={`blue-orange-llm-header-btn${
                                thinking ? ' blue-orange-llm-header-btn-active' : ''
                            }`}
                            onClick={() => onToggleThinking(!thinking)}
                        >
                            <i className="ri-brain-line" />
                        </button>
                    </SimpleTooltip>
                )}
                <ModelPicker
                    models={models}
                    value={selectedModel}
                    onChange={onModelChange}
                    disabled={isRunning}
                />
                <SimpleTooltip label="New chat">
                    <button type="button" className="blue-orange-llm-header-btn" onClick={onNewChat}>
                        <i className="ri-add-line" />
                    </button>
                </SimpleTooltip>
            </div>
        </div>
    );

    if (isEmpty) {
        return (
            <div className="blue-orange-llm-thread">
                {header}
                <div className="blue-orange-llm-thread-welcome-layout">
                    <div className="blue-orange-llm-thread-welcome-inner">
                        <ThreadWelcome
                            branding={branding}
                            onSelectSuggestion={(s) => onSend(s.prompt || s.label, [])}
                        />
                        <div className="blue-orange-llm-thread-welcome-composer">
                            <Composer
                                onSend={onSend}
                                onStop={onStop}
                                isRunning={isRunning}
                                autoFocus
                            />
                        </div>
                        {suggestions && suggestions.length > 0 && (
                            <div className="blue-orange-llm-thread-welcome-suggestions">
                                <Suggestions
                                    suggestions={suggestions}
                                    onSelect={(s) => onSend(s.prompt || s.label, [])}
                                    variant="grid"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="blue-orange-llm-thread">
            {header}
            <MessageList
                messages={session.messages}
                isRunning={isRunning}
                logo={branding?.logo}
                logoIsSvg={branding?.logoIsSvg}
                onRegenerate={onRegenerate}
                onFeedback={onFeedback}
                feedback={feedback}
            />
            <div className="blue-orange-llm-thread-composer">
                {!isRunning && followUps && followUps.length > 0 && (
                    <Suggestions
                        suggestions={followUps}
                        onSelect={(s) => onSend(s.prompt || s.label, [])}
                        variant="row"
                    />
                )}
                <Composer onSend={onSend} onStop={onStop} isRunning={isRunning} />
                <div className="blue-orange-llm-thread-disclaimer">
                    The assistant can make mistakes. Verify important information.
                </div>
            </div>
        </div>
    );
};
