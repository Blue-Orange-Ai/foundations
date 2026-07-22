import React from 'react';
import { MarkdownText } from '@blue-orange-ai/foundations-core';

import './MarkdownMessage.css';

interface Props {
    text: string;
}

/**
 * Renders assistant/user markdown by reusing core's `MarkdownText` — the same
 * remark/rehype/katex + highlight.js pipeline the rest of the monorepo uses, so
 * code fences, GFM tables and math all render consistently and we don't
 * duplicate the toolchain.
 */
export const MarkdownMessage: React.FC<Props> = ({ text }) => (
    <div className="blue-orange-llm-markdown">
        <MarkdownText>{text}</MarkdownText>
    </div>
);
