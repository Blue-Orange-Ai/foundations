import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// getModels() fires on mount; there is no server in the test env, so stub fetch
// to reject and confirm the UI still renders its welcome state gracefully.
beforeAll(() => {
    (global as any).fetch = jest.fn(() => Promise.reject(new Error('no server')));
});

test('renders the assistant welcome screen', async () => {
    render(<App />);
    expect(
        await screen.findByRole('heading', { name: /How can I help you today\?/i }),
    ).toBeInTheDocument();
});
