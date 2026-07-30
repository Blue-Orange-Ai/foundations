// @ts-ignore
import React, { useMemo, useState } from 'react';

import './Workspace.css';
import { LlmAgentProvider } from '../../components/providers/LlmAgentProvider';
import { Assistant } from '../../components/assistant/Assistant';
import { Suggestion, WelcomeBranding } from '../../interfaces/ChatInterfaces';
import { ComposerConfig, ComposerQuickAction } from '../../interfaces/ComposerInterfaces';
import { installMockServer } from '../mock';
import { BRAND_LOGO_SVG } from '../mock/mockAssets';
import { MockServerPanel } from './MockServerPanel';

const AGENT_URI = 'http://localhost:6012';
const MEDIA_URI = 'http://localhost:8086';
const SESSION_NAMESPACE = 'blue-orange-llm-sessions';

// Dev token — ignored by the mock server, used when pointing at a real
// llm-agent running locally with a mock passport.
const DEV_TOKEN =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjZiZmRlYi1hMjIzLTRmOWMtODJlYy01MTY3MmUyYzY2NGUiLCJleHAiOjE3NjcyNjEyNDR9.47oAqZSYCC2gs-RZbo1XbGxthG-7L_rE5csGY0alYwsFa86LRrP-U_JZ3aTbw1qzMlsZCkO4z_2vUVM-QxGIVw';

// Stand up the simulated llm-agent + media services before anything renders, so
// the dev environment is fully functional without either running locally. Turn
// it off from the "Mock server" panel to talk to the real services instead.
installMockServer({
    agentUrl: AGENT_URI,
    mediaUrl: MEDIA_URI,
    sessionNamespace: SESSION_NAMESPACE,
});

const BRANDING: WelcomeBranding = {
    appName: 'Blue Orange AI',
    logo: BRAND_LOGO_SVG,
    logoIsSvg: true,
    title: 'How can I help you today?',
    subtitle: 'Ask anything — I can reason, use tools and work with your files.',
};

const SUGGESTIONS: Suggestion[] = [
    { label: 'Summarise a document I upload', icon: 'ri-file-text-line' },
    {
        label: 'Explain a tricky concept simply',
        prompt: 'Explain the difference between REST and gRPC, with a comparison table.',
        icon: 'ri-lightbulb-line',
    },
    {
        label: 'Write and debug some code',
        prompt: 'This polling hook leaks timers — find the bug and write a test for it.',
        icon: 'ri-code-s-slash-line',
    },
    {
        label: 'Chart something for me',
        prompt: 'Chart actual revenue against forecast for the last seven quarters.',
        icon: 'ri-line-chart-line',
    },
];

const FOLLOW_UPS: Suggestion[] = [
    { label: 'Go deeper', prompt: 'Give me the long version — walk through it in detail.', icon: 'ri-add-line' },
    { label: 'Check the repo', prompt: 'Check what the repository actually does — read the config and run the tests.', icon: 'ri-git-repository-line' },
    { label: 'Show a chart', prompt: 'Chart that for me and attach the underlying numbers.', icon: 'ri-line-chart-line' },
];

// Skills have no server-side registry — a deployment supplies its own list.
const SKILLS = [
    { id: 'report-builder', label: 'Report builder', icon: 'ri-file-chart-line' },
    { id: 'sql-analyst', label: 'SQL analyst', icon: 'ri-database-2-line' },
    { id: 'code-reviewer', label: 'Code reviewer', icon: 'ri-git-pull-request-line' },
    { id: 'meeting-notes', label: 'Meeting notes', icon: 'ri-mic-2-line' },
];

const QUICK_ACTIONS: ComposerQuickAction[] = [
    {
        id: 'research',
        label: 'Research',
        icon: 'ri-telescope-line',
        tooltip: 'Search sources and cite them before answering',
    },
];

export const Workspace: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);

    // Menu rows beyond the built-in attach entry and the auto-loaded tool list:
    // a skills submenu (checkable) plus a couple of one-shot actions.
    const composer = useMemo<ComposerConfig>(
        () => ({
            placeholder: 'Message the assistant…',
            quickActions: QUICK_ACTIONS,
            voice: { language: 'en-GB' },
            attachments: { accept: 'all', multiple: true, maxSizeMb: 25 },
            menu: {
                items: [
                    {
                        id: 'skills',
                        label: 'Add skill',
                        icon: 'ri-shapes-line',
                        items: SKILLS.map((skill) => ({
                            id: `skill:${skill.id}`,
                            label: skill.label,
                            icon: skill.icon,
                            checked: skills.includes(skill.id),
                        })),
                    },
                    {
                        id: 'connect-app',
                        label: 'Connect an app',
                        icon: 'ri-plug-line',
                        separatorBefore: true,
                    },
                    { id: 'screenshot', label: 'Take a screenshot', icon: 'ri-camera-line' },
                ],
                onSelect: (item) => {
                    if (item.id.startsWith('skill:')) {
                        const id = item.id.slice('skill:'.length);
                        setSkills((prev) =>
                            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
                        );
                        return;
                    }
                    // eslint-disable-next-line no-console
                    console.info('[workspace] composer menu selection', item.id);
                },
            },
        }),
        [skills],
    );

    return (
        <div className="workspace-main-window">
            <LlmAgentProvider
                uri={AGENT_URI}
                token={DEV_TOKEN}
                media={{ uri: MEDIA_URI, folder: 'llm-chat-attachments' }}
                welcome={BRANDING}
                suggestions={SUGGESTIONS}
                sessionNamespace={SESSION_NAMESPACE}
                autoLoadTools
                thinking
            >
                <Assistant dark={dark} followUps={FOLLOW_UPS} composer={composer} />
            </LlmAgentProvider>
            <MockServerPanel sessionNamespace={SESSION_NAMESPACE} />
        </div>
    );
};
