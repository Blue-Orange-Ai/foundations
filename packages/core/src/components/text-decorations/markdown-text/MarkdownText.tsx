import React, {useEffect, useState, useRef} from "react";
import hljs from "highlight.js";
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

import './MarkdownText.css';
import {sanitizeHtml, SanitizeHtmlOptions} from "../../utils/SanitizeHtml";
import 'highlight.js/styles/atom-one-dark.css';

// What remark-gfm renders for `- [x]` and `- [ ]`. Raw HTML written in the
// markdown never reaches the output, so only task lists produce this.
const TASK_CHECKBOX = /<input type="checkbox"( checked)? disabled>/g;

interface Props {
	children: string;
	enableMath?: boolean;
	enableGfm?: boolean;
	enableCodeHighlighting?: boolean;
	/**
	 * Shows images the markdown links to. Turn it off for text an attacker can
	 * steer, such as a language model's reply: an image is fetched as soon as
	 * it is shown, so its URL can carry data out without anyone clicking.
	 */
	allowImages?: boolean;
	className?: string;
}

export const MarkdownText: React.FC<Props> = ({
	children,
	enableMath = true,
	enableGfm = true,
	enableCodeHighlighting = true,
	allowImages = true,
	className = ""
}) => {
	const [renderedContent, setRenderedContent] = useState<string>("");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const renderMarkdown = async () => {
			let processor: any = unified().use(remarkParse);

			if (enableGfm) {
				processor = processor.use(remarkGfm);
			}
			if (enableMath) {
				processor = processor.use(remarkMath);
			}

			processor = processor.use(remarkRehype);

			if (enableMath) {
				processor = processor.use(rehypeKatex);
			}

			processor = processor.use(rehypeStringify);

			const result = await processor.process(children);
			// Markdown drops raw HTML, but links and images keep whatever URL
			// was written — `[x](javascript:...)` included — so the output is
			// sanitized before it reaches the page.
			// Task list checkboxes are the one form control markdown makes; the
			// sanitizer drops form controls, so they are shown as glyphs.
			const html = String(result).replace(TASK_CHECKBOX, (_match, checked) => checked ? "\u2611" : "\u2610");
			const options: SanitizeHtmlOptions = {allowMedia: allowImages};
			setRenderedContent(sanitizeHtml(html, options));
		};

		renderMarkdown();
	}, [children, enableMath, enableGfm, allowImages]);

	useEffect(() => {
		if (enableCodeHighlighting && renderedContent && containerRef.current) {
			const codeBlocks = containerRef.current.querySelectorAll('pre code');
			codeBlocks.forEach((block) => {
				hljs.highlightElement(block as HTMLElement);
			});
		}
	}, [renderedContent, enableCodeHighlighting]);

	return (
		<div
			ref={containerRef}
			className={`blue-orange-markdown-text ${className}`.trim()}
			dangerouslySetInnerHTML={{__html: renderedContent}}
		/>
	);
};
