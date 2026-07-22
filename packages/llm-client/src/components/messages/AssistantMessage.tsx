import React, { useState } from 'react';
import { SimpleTooltip } from '@blue-orange-ai/foundations-core';

import { ChatMessage, messageText } from '../../interfaces/ChatInterfaces';
import { MessageParts } from './MessageParts';
import './Message.css';

interface Props {
    message: ChatMessage;
    isLast: boolean;
    logo?: string;
    logoIsSvg?: boolean;
    onRegenerate?: (messageId: string) => void;
    onFeedback?: (messageId: string, value: 'up' | 'down') => void;
    feedback?: 'up' | 'down';
}

/** A "typing" placeholder shown before the first delta of a streaming turn. */
const TypingDots: React.FC = () => (
    <div className="blue-orange-llm-typing" aria-label="Assistant is typing">
        <span />
        <span />
        <span />
    </div>
);

export const AssistantMessage: React.FC<Props> = ({
    message,
    isLast,
    logo,
    logoIsSvg,
    onRegenerate,
    onFeedback,
    feedback,
}) => {
    const [copied, setCopied] = useState(false);
    const streaming = message.status === 'streaming';
    const isEmpty = message.parts.length === 0;

    const copy = () => {
        const text = messageText(message);
        if (!text) return;
        navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const showFooter = !streaming && !isEmpty && message.status !== 'cancelled';
    const tokens = message.usage?.total_tokens;

    return (
        <div className="blue-orange-llm-message blue-orange-llm-message-assistant">
            <div className="blue-orange-llm-message-avatar blue-orange-llm-message-avatar-assistant">
                {logo ? (
                    logoIsSvg ? (
                        <span
                            className="blue-orange-llm-avatar-logo"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: logo }}
                        />
                    ) : (
                        <img src={logo} alt="assistant" className="blue-orange-llm-avatar-logo-img" />
                    )
                ) : (
                    <i className="ri-sparkling-2-fill" />
                )}
            </div>

            <div className="blue-orange-llm-message-body">
                <div className="blue-orange-llm-message-content">
                    {isEmpty && streaming ? <TypingDots /> : <MessageParts parts={message.parts} />}
                    {message.status === 'cancelled' && (
                        <div className="blue-orange-llm-message-note">
                            <i className="ri-stop-circle-line" /> Generation stopped.
                        </div>
                    )}
                    {message.status === 'error' && (
                        <div className="blue-orange-llm-message-error">
                            <i className="ri-error-warning-line" /> {message.error || 'Something went wrong.'}
                        </div>
                    )}
                </div>

                {showFooter && (
                    <div className="blue-orange-llm-message-actions">
                        <SimpleTooltip label={copied ? 'Copied' : 'Copy'}>
                            <button type="button" className="blue-orange-llm-icon-btn" onClick={copy}>
                                <i className={copied ? 'ri-check-line' : 'ri-clipboard-line'} />
                            </button>
                        </SimpleTooltip>

                        {onRegenerate && (
                            <SimpleTooltip label="Regenerate">
                                <button
                                    type="button"
                                    className="blue-orange-llm-icon-btn"
                                    onClick={() => onRegenerate(message.id)}
                                >
                                    <i className="ri-refresh-line" />
                                </button>
                            </SimpleTooltip>
                        )}

                        {onFeedback && (
                            <>
                                <SimpleTooltip label="Good response">
                                    <button
                                        type="button"
                                        className={`blue-orange-llm-icon-btn${
                                            feedback === 'up' ? ' blue-orange-llm-icon-btn-active' : ''
                                        }`}
                                        onClick={() => onFeedback(message.id, 'up')}
                                    >
                                        <i className={feedback === 'up' ? 'ri-thumb-up-fill' : 'ri-thumb-up-line'} />
                                    </button>
                                </SimpleTooltip>
                                <SimpleTooltip label="Bad response">
                                    <button
                                        type="button"
                                        className={`blue-orange-llm-icon-btn${
                                            feedback === 'down' ? ' blue-orange-llm-icon-btn-active' : ''
                                        }`}
                                        onClick={() => onFeedback(message.id, 'down')}
                                    >
                                        <i
                                            className={
                                                feedback === 'down' ? 'ri-thumb-down-fill' : 'ri-thumb-down-line'
                                            }
                                        />
                                    </button>
                                </SimpleTooltip>
                            </>
                        )}

                        {(message.model || tokens) && (
                            <span className="blue-orange-llm-message-meta">
                                {message.model}
                                {message.model && tokens ? ' · ' : ''}
                                {tokens ? `${tokens} tokens` : ''}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
