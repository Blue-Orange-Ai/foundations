import React from 'react';
import { render } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';
import { MessageReactions } from './reactions/MessageReactions';
import { ChatUserStatus, IChatMessage, IChatUser } from '../../../interfaces/ChatInterfaces';

const sender: IChatUser = {
    user: { id: 'u2', name: 'Other' } as any,
    status: ChatUserStatus.ONLINE,
};

const message = (content: string, extra: Partial<IChatMessage> = {}): IChatMessage => ({
    id: 'm1',
    content,
    sender,
    timestamp: new Date(),
    reactions: [],
    ...extra,
});

const payload = '<p>hi<img src="x" onerror="window.__xss = 1"></p><script>window.__xss = 1</script><a href="javascript:window.__xss = 1">link</a>';

describe('ChatMessage', () => {

    afterEach(() => {
        delete (window as any).__xss;
    });

    it('renders a message stored as a document', () => {
        const content = JSON.stringify({
            type: 'doc',
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }] },
                { type: 'paragraph' },
            ],
        });
        const { container } = render(<ChatMessage message={message(content)} currentUserId="u1" />);
        const body = container.querySelector('.blue-orange-chat-message-content') as HTMLElement;
        expect(body.querySelector('strong')!.textContent).toBe('Hello');
        // The trailing empty paragraph Enter leaves behind is not shown.
        expect(body.querySelectorAll('p').length).toBe(1);
    });

    it('renders a legacy HTML message without running anything in it', () => {
        const { container } = render(<ChatMessage message={message(payload)} currentUserId="u1" />);
        const body = container.querySelector('.blue-orange-chat-message-content') as HTMLElement;
        expect(body.textContent).toContain('hi');
        expect(body.querySelector('img, script, a')).toBeNull();
        expect((window as any).__xss).toBeUndefined();
    });

    it('renders a quoted reply without running anything in it', () => {
        const { container } = render(
            <ChatMessage message={message('<p>reply</p>', { replyTo: message(payload, { id: 'm0' }) })} currentUserId="u1" />
        );
        const quoted = container.querySelector('.blue-orange-chat-message-linked') as HTMLElement;
        expect(quoted.textContent).toContain('hi');
        expect(quoted.querySelector('img, script, a')).toBeNull();
        expect((window as any).__xss).toBeUndefined();
    });
});

describe('MessageReactions', () => {

    afterEach(() => {
        delete (window as any).__xss;
    });

    it('shows emoji stored as character references', () => {
        const { container } = render(
            <MessageReactions reactions={[{ emoji: '&#x1F44D;', userIds: ['u1'] }]} currentUserId="u1" />
        );
        expect(container.querySelector('.blue-orange-chat-reactions-emoji')!.textContent).toBe('\u{1F44D}');
    });

    it('shows a crafted reaction as text', () => {
        const emoji = '<img src="x" onerror="window.__xss = 1">';
        const { container } = render(<MessageReactions reactions={[{ emoji, userIds: ['u2'] }]} currentUserId="u1" />);
        const pill = container.querySelector('.blue-orange-chat-reactions-emoji') as HTMLElement;
        expect(pill.querySelector('img')).toBeNull();
        expect(pill.textContent).toBe(emoji);
        expect((window as any).__xss).toBeUndefined();
    });
});
