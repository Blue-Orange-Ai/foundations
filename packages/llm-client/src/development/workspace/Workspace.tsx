// @ts-ignore
import React, { useState } from 'react';

import './Workspace.css';
import { LlmAgentProvider } from '../../components/providers/LlmAgentProvider';
import { Assistant } from '../../components/assistant/Assistant';
import { Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';

const BRANDING: WelcomeBranding = {
    appName: 'Blue Orange AI',
    title: 'How can I help you today?',
    subtitle: 'Ask anything — I can reason, use tools and work with your files.',
};

const SUGGESTIONS: Suggestion[] = [
    { label: 'Summarise a document I upload', icon: 'ri-file-text-line' },
    { label: 'Explain a tricky concept simply', icon: 'ri-lightbulb-line' },
    { label: 'Write and debug some code', icon: 'ri-code-s-slash-line' },
    { label: 'Brainstorm ideas with me', icon: 'ri-sparkling-line' },
];

// Dev token — the llm-agent runs with a mock passport locally.
const DEV_TOKEN =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjZiZmRlYi1hMjIzLTRmOWMtODJlYy01MTY3MmUyYzY2NGUiLCJleHAiOjE3NjcyNjEyNDR9.47oAqZSYCC2gs-RZbo1XbGxthG-7L_rE5csGY0alYwsFa86LRrP-U_JZ3aTbw1qzMlsZCkO4z_2vUVM-QxGIVw';

export const Workspace: React.FC = () => {
    const [dark, setDark] = useState(false);

    return (
        <div className="workspace-main-window">
            <button
                type="button"
                className="workspace-theme-toggle"
                onClick={() => setDark((d) => !d)}
            >
                <i className={dark ? 'ri-sun-line' : 'ri-moon-line'} />
            </button>
            <LlmAgentProvider
                uri="http://localhost:6012"
                token={DEV_TOKEN}
                media={{ uri: 'http://localhost:8086', folder: 'llm-chat-attachments' }}
                welcome={BRANDING}
                suggestions={SUGGESTIONS}
                thinking
            >
                <Assistant dark={dark} />
            </LlmAgentProvider>
        </div>
    );
};
