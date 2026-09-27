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
			const options: SanitizeHtmlOptions = {allowMedia: allowImages};
			setRenderedContent(sanitizeHtml(String(result), options));
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
