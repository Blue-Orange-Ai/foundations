import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmailRecipientInput, isEmailRecipient } from './EmailRecipientInput';

// Tagify drives a real contenteditable that jsdom cannot fully render, so the
// chip lifecycle is exercised in the browser. Here we cover the pure validation
// rule (the "validation chain" the space delimiter kicks off) and a clean mount.
describe('EmailRecipientInput', () => {
    describe('isEmailRecipient', () => {
        it.each(['a@b.com', 'first.last@example.co.uk', 'x+tag@sub.domain.io'])(
            'accepts %s',
            (email) => expect(isEmailRecipient(email)).toBe(true)
        );

        it.each(['not-an-email', 'missing@dot', 'two @spaces.com', '@nolocal.com', ''])(
            'rejects %s',
            (email) => expect(isEmailRecipient(email)).toBe(false)
        );
    });

    it('renders its label and mounts without throwing', () => {
        render(<EmailRecipientInput label="Guests" />);
        expect(screen.getByText('Guests')).toBeInTheDocument();
    });
});
