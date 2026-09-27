import React from 'react';

import { Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import { Suggestions } from '../suggestions/Suggestions';
import './ThreadWelcome.css';
import { logoMarkup } from '../../services/LogoMarkup';

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
export const ThreadWelcome: React.FC<Props> = ({ branding, suggestions, onSelectSuggestion }) => {
    const svgLogo = branding?.logo && branding.logoIsSvg ? logoMarkup(branding.logo) : undefined;
    return (
    <div className="blue-orange-llm-welcome">
        <div className="blue-orange-llm-welcome-logo">
            {branding?.logo ? (
                svgLogo && 'html' in svgLogo ? (
                    <span
                        className="blue-orange-llm-welcome-logo-svg"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: svgLogo.html }}
                    />
                ) : (
                    <img src={svgLogo ? svgLogo.src : branding.logo} alt="logo" className="blue-orange-llm-welcome-logo-img" />
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
};
