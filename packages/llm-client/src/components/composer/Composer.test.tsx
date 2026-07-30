import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ConfigAgentDto } from '../../interfaces/AgentProtocol';
import { ComposerSettingValues } from '../../interfaces/ComposerInterfaces';
import { LlmAgentProvider } from '../providers/LlmAgentProvider';
import { Composer } from './Composer';

const MODELS: ConfigAgentDto[] = [
    {
        name: 'claude-opus-5',
        provider: 'anthropic',
        display_name: 'Claude Opus 5',
        description: '',
        text: true,
        images: true,
        default: true,
    },
    {
        name: 'gpt-4.1',
        provider: 'openai',
        display_name: 'GPT-4.1',
        description: '',
        text: true,
        images: true,
        default: false,
    },
];

const renderComposer = (props: Partial<React.ComponentProps<typeof Composer>> = {}) => {
    const onSend = vi.fn();
    const utils = render(
        <LlmAgentProvider uri="http://agent.test" autoLoadModels={false}>
            <Composer onSend={onSend} isRunning={false} {...props} />
        </LlmAgentProvider>,
    );
    return { ...utils, onSend };
};

const type = (value: string) => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value } });
};

/**
 * Core's ContextMenu ignores clicks for the first 500ms after mount (its
 * double-click guard), so menu tests have to wait that out.
 */
const settleMenu = () => new Promise((resolve) => setTimeout(resolve, 550));

describe('Composer', () => {
    it('puts the controls under the message, not inline with it', () => {
        const { container } = renderComposer({
            model: { models: MODELS, value: 'claude-opus-5' },
            menu: { items: [{ id: 'skill', label: 'Add skill' }] },
        });

        // The stacked layout is a message block followed by a control row.
        expect(container.querySelector('.blue-orange-llm-composer-message')).toBeInTheDocument();
        const controls = container.querySelector('.blue-orange-llm-composer-controls');
        expect(controls).toBeInTheDocument();
        expect(controls?.querySelector('.blue-orange-llm-composer-plus')).toBeInTheDocument();
        expect(screen.getByLabelText('Model: Claude Opus 5')).toBeInTheDocument();
        expect(screen.getByLabelText('Send')).toBeInTheDocument();
    });

    it('sends on Enter and clears the box', () => {
        const { onSend } = renderComposer();
        type('hello there');
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

        expect(onSend).toHaveBeenCalledWith('hello there', []);
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('opens the "+" menu with the supplied rows', async () => {
        renderComposer({
            attachments: { enabled: true },
            menu: {
                items: [
                    { id: 'tools', label: 'Add tool', items: [{ id: 'tool:a', label: 'web_search' }] },
                    { id: 'skill', label: 'Add skill' },
                ],
            },
        });

        await settleMenu();
        fireEvent.click(screen.getByLabelText('Add files, tools and skills'));
        expect(screen.getByText('Add photos and files')).toBeInTheDocument();
        expect(screen.getByText('Add tool')).toBeInTheDocument();
        expect(screen.getByText('Add skill')).toBeInTheDocument();
    });

    it('reports menu selections that are not the file picker', async () => {
        const onSelect = vi.fn();
        renderComposer({ menu: { items: [{ id: 'connect', label: 'Connect an app' }], onSelect } });

        await settleMenu();
        fireEvent.click(screen.getByLabelText('Add files, tools and skills'));
        fireEvent.click(screen.getByText('Connect an app'));

        expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'connect' }));
    });

    it('toggles a highlighted mode and reports it', () => {
        const onQuickAction = vi.fn();
        renderComposer({
            quickActions: [{ id: 'research', label: 'Research', icon: 'ri-telescope-line' }],
            onQuickAction,
        });

        const pill = screen.getByText('Research').closest('button') as HTMLButtonElement;
        expect(pill.className).not.toContain('pill-active');

        fireEvent.click(pill);
        expect(onQuickAction).toHaveBeenCalledWith(expect.objectContaining({ id: 'research' }), true);
        expect(
            (screen.getByText('Research').closest('button') as HTMLButtonElement).className,
        ).toContain('pill-active');
    });

    it('renders the declared settings and reports changes', () => {
        const onChange = vi.fn<[ComposerSettingValues], void>();
        renderComposer({
            settings: {
                items: [
                    { id: 'thinking', label: 'Extended thinking', type: 'toggle', defaultValue: false },
                    {
                        id: 'effort',
                        label: 'Reasoning effort',
                        type: 'select',
                        options: [
                            { label: 'Low', value: 'low' },
                            { label: 'High', value: 'high' },
                        ],
                        defaultValue: 'low',
                    },
                ],
                onChange,
            },
        });

        fireEvent.click(screen.getByLabelText('Generation settings'));
        expect(screen.getByText('Extended thinking')).toBeInTheDocument();

        fireEvent.click(screen.getByText('High'));
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ effort: 'high' }));
    });

    it('hides the microphone when the browser cannot dictate', () => {
        // jsdom has no SpeechRecognition, which is the unsupported case.
        renderComposer();
        expect(screen.queryByLabelText('Dictate a message')).not.toBeInTheDocument();
    });

    it('can still show a disabled microphone when asked to', () => {
        renderComposer({ voice: { hideWhenUnsupported: false } });
        const mic = screen.getByLabelText('Dictate a message');
        expect(mic).toBeInTheDocument();
        expect(mic).toBeDisabled();
    });

    it('swaps send for stop while a turn is streaming', () => {
        const onStop = vi.fn();
        renderComposer({ isRunning: true, onStop });

        expect(screen.queryByLabelText('Send')).not.toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Stop'));
        expect(onStop).toHaveBeenCalled();
    });

    it('keeps everything on one row in the inline layout', () => {
        const { container } = renderComposer({ layout: 'inline' });
        expect(container.querySelector('.blue-orange-llm-composer-row')).toBeInTheDocument();
        expect(container.querySelector('.blue-orange-llm-composer-controls')).not.toBeInTheDocument();
    });
});
