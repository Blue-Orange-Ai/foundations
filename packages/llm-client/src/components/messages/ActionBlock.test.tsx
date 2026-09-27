import React from 'react';
import { render } from '@testing-library/react';
import { ActionBlock } from './ActionBlock';

const part = (status: any): any => ({ type: 'action', id: 'a1', title: 'Search', status, kind: 'CUSTOM' });

describe('ActionBlock', () => {

    it('uses the status for its class name', () => {
        const { container } = render(<ActionBlock part={part('RUNNING')} />);
        expect(container.querySelector('.blue-orange-llm-action')!.className).toContain('blue-orange-llm-action-running');
    });

    it('ignores a status it does not know rather than adding its classes', () => {
        const { container } = render(<ActionBlock part={part('running blue-orange-modal-window blue-orange-modal-window-open')} />);
        const className = container.querySelector('.blue-orange-llm-action')!.className;
        expect(className).not.toContain('modal');
        expect(className).toContain('blue-orange-llm-action-complete');
    });

    it('survives a missing status', () => {
        expect(() => render(<ActionBlock part={part(undefined)} />)).not.toThrow();
    });
});
