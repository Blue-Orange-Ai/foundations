import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ChatSession } from '../../interfaces/ChatInterfaces';
import { SessionSidebar } from './SessionSidebar';

const session = (id: string, title: string): ChatSession => ({
    id,
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
});

const SESSIONS = [session('a', 'Rate limiting strategy'), session('b', 'Q7 revenue')];

const renderSidebar = () => {
    const onRename = vi.fn();
    const onSelect = vi.fn();
    render(
        <SessionSidebar
            sessions={SESSIONS}
            currentSessionId="a"
            open
            onStateChange={() => undefined}
            onSelect={onSelect}
            onDelete={() => undefined}
            onRename={onRename}
            onNewChat={() => undefined}
            models={[]}
            onModelChange={() => undefined}
            thinking={false}
            onToggleThinking={() => undefined}
            isDark={false}
            onToggleTheme={() => undefined}
        />,
    );
    return { onRename, onSelect };
};

const openRenameFor = (title: string) => {
    const row = screen.getByText(title).closest('.blue-orange-sidebar-body-item') as HTMLElement;
    // Row actions only render while the row is hovered.
    fireEvent.mouseOver(row);
    fireEvent.mouseEnter(row);
    const rename = row.querySelector('.blue-orange-llm-session-action') as HTMLElement;
    fireEvent.click(rename);
    return row;
};

describe('SessionSidebar', () => {
    it('renames through a dialog and leaves the conversation in the list', () => {
        // Regression: the rename editor used to render inline, and core's
        // SideBarBodyGroup drops children that are not its own item types — so the
        // row being renamed disappeared from the sidebar entirely.
        const { onRename } = renderSidebar();

        openRenameFor('Rate limiting strategy');

        expect(screen.getByText('Rename conversation')).toBeInTheDocument();
        expect(screen.getByText('Rate limiting strategy')).toBeInTheDocument();

        const input = screen.getByDisplayValue('Rate limiting strategy');
        fireEvent.change(input, { target: { value: 'Rate limits' } });
        fireEvent.click(screen.getByText('Rename'));

        expect(onRename).toHaveBeenCalledWith('a', 'Rate limits');
    });

    it('does not rename when the dialog is cancelled', () => {
        const { onRename } = renderSidebar();

        openRenameFor('Q7 revenue');
        fireEvent.change(screen.getByDisplayValue('Q7 revenue'), { target: { value: 'Something else' } });
        fireEvent.click(screen.getByText('Cancel'));

        expect(onRename).not.toHaveBeenCalled();
        expect(screen.getByText('Q7 revenue')).toBeInTheDocument();
    });

    it('does not select the conversation when its rename action is clicked', () => {
        const { onSelect } = renderSidebar();
        openRenameFor('Q7 revenue');
        expect(onSelect).not.toHaveBeenCalled();
    });
});
