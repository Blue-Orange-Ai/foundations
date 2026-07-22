import React from 'react';

import { Suggestion } from '../../interfaces/ChatInterfaces';
import './Suggestions.css';

interface Props {
    suggestions: Suggestion[];
    onSelect: (suggestion: Suggestion) => void;
    variant?: 'grid' | 'row';
}

/**
 * Starter-prompt chips. Rendered as a grid on the welcome screen and as a
 * compact row of follow-ups elsewhere.
 */
export const Suggestions: React.FC<Props> = ({ suggestions, onSelect, variant = 'grid' }) => {
    if (!suggestions.length) return null;
    return (
        <div className={`blue-orange-llm-suggestions blue-orange-llm-suggestions-${variant}`}>
            {suggestions.map((suggestion, index) => (
                <button
                    type="button"
                    key={index}
                    className="blue-orange-llm-suggestion"
                    onClick={() => onSelect(suggestion)}
                >
                    {suggestion.icon && <i className={`${suggestion.icon} blue-orange-llm-suggestion-icon`} />}
                    <span className="blue-orange-llm-suggestion-label">{suggestion.label}</span>
                </button>
            ))}
        </div>
    );
};
