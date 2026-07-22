import React from 'react';

import { Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import { Suggestions } from '../suggestions/Suggestions';
import './ThreadWelcome.css';

interface Props {
    branding?: WelcomeBranding;
    suggestions?: Suggestion[];
    onSelectSuggestion: (suggestion: Suggestion) => void;
}

/**
 * The empty-state hero shown for a fresh session: centred logo, greeting and a
 * grid of starter prompts — the composer sits directly beneath it (mounted by
 * the Thread) so a new conversation starts in the middle of the screen.
 */
export const ThreadWelcome: React.FC<Props> = ({ branding, suggestions, onSelectSuggestion }) => (
    <div className="blue-orange-llm-welcome">
        <div className="blue-orange-llm-welcome-logo">
            {branding?.logo ? (
                branding.logoIsSvg ? (
                    <span
                        className="blue-orange-llm-welcome-logo-svg"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: branding.logo }}
                    />
                ) : (
                    <img src={branding.logo} alt="logo" className="blue-orange-llm-welcome-logo-img" />
                )
            ) : (
                <i className="ri-sparkling-2-fill" />
            )}
        </div>
        <h1 className="blue-orange-llm-welcome-title">{branding?.title || 'How can I help you today?'}</h1>
        {branding?.subtitle && <p className="blue-orange-llm-welcome-subtitle">{branding.subtitle}</p>}

        {suggestions && suggestions.length > 0 && (
            <div className="blue-orange-llm-welcome-suggestions">
                <Suggestions suggestions={suggestions} onSelect={onSelectSuggestion} variant="grid" />
            </div>
        )}
    </div>
);
