import React from 'react';
import { SimpleTooltip } from '@blue-orange-ai/foundations-core';

import { Attachment, ChatSession, Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import { ComposerConfig } from '../../interfaces/ComposerInterfaces';
import { MessageList } from '../messages/MessageList';
import { Composer } from '../composer/Composer';
import { ThreadWelcome } from './ThreadWelcome';
import { Suggestions } from '../suggestions/Suggestions';
import './Thread.css';

interface Props {
    session: ChatSession;
    isRunning: boolean;
    onSend: (text: string, attachments: Attachment[]) => void;
    onStop: () => void;
    onRegenerate: (messageId: string) => void;

    branding?: WelcomeBranding;
    suggestions?: Suggestion[];
    followUps?: Suggestion[];
    /** How the prompt box presents itself — menus, model picker, settings, voice. */
    composer?: ComposerConfig;

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
    branding,
    suggestions,
    followUps,
    composer,
    sidebarOpen,
    onToggleSidebar,
    feedback,
    onFeedback,
}) => {
    const isEmpty = session.messages.length === 0;

    // The chat window has no header. When the sidebar is collapsed a single
    // floating button in the top-left corner reopens it.
    const floatingOpen = !sidebarOpen && (
        <SimpleTooltip label="Open sidebar">
            <button
                type="button"
                className="blue-orange-llm-floating-open"
                onClick={onToggleSidebar}
            >
                <i className="ri-side-bar-line" />
            </button>
        </SimpleTooltip>
    );

    if (isEmpty) {
        return (
            <div className="blue-orange-llm-thread">
                {floatingOpen}
                <div className="blue-orange-llm-thread-welcome-layout">
                    <div className="blue-orange-llm-thread-welcome-inner">
                        <ThreadWelcome
                            branding={branding}
                            onSelectSuggestion={(s) => onSend(s.prompt || s.label, [])}
                        />
                        <div className="blue-orange-llm-thread-welcome-composer">
                            <Composer
                                {...composer}
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
            {floatingOpen}
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
                <Composer {...composer} onSend={onSend} onStop={onStop} isRunning={isRunning} />
                <div className="blue-orange-llm-thread-disclaimer">
                    The assistant can make mistakes. Verify important information.
                </div>
            </div>
        </div>
    );
};
