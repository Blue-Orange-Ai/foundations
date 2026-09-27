import React, {Fragment, ReactNode, useMemo} from "react";

import './RenderRichText.css'
import {
	htmlToPlainTextDocument,
	isRichTextDocument,
	parseRichTextDocument,
	RichTextContent,
	RichTextMark,
	RichTextNode,
	toRichTextDocument
} from "../../inputs/richtext/document/RichTextDocument";
import {sanitizeUrl} from "../../utils/SanitizeUrl";
import {useIsClient} from "../../utils/UseIsClient";

interface Props {
	/**
	 * What the rich text editors produce: a document, a serialized document, or
	 * HTML written by an earlier version of the editor.
	 */
	content: RichTextContent;
	className?: string;
	style?: React.CSSProperties;
}

// Shows rich text without ever turning it into markup. Each block and mark the
// editors support maps to one React element and every piece of text is
// rendered as text, so a document can hold nothing that runs: an unknown node
// only contributes its children, attributes are never copied across wholesale,
// and a link keeps its href only when it is http(s), mailto, tel or ftp.

// A crafted document can nest far deeper than anything typed, which would
// overflow the stack while rendering.
const MAX_DEPTH = 100;

const LINK_PROTOCOLS = ["http:", "https:", "mailto:", "tel:", "ftp:", "ftps:"];

const asString = (value: unknown): string | undefined =>
	typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined;

const headingLevel = (value: unknown): 1 | 2 | 3 | 4 | 5 | 6 => {
	const level = Math.round(Number(value));
	return (level >= 1 && level <= 6 ? level : 1) as 1 | 2 | 3 | 4 | 5 | 6;
};

const listStart = (value: unknown): number | undefined => {
	const start = Math.round(Number(value));
	return Number.isFinite(start) && start !== 1 ? start : undefined;
};

const codeLanguage = (value: unknown): string | undefined => {
	const language = asString(value);
	return language && /^[a-z0-9_+#.\-]{1,40}$/i.test(language) ? language : undefined;
};

const textOf = (node: RichTextNode | undefined, depth: number = 0): string => {
	if (!node || typeof node !== "object" || depth > MAX_DEPTH) {
		return "";
	}
	if (typeof node.text === "string") {
		return node.text;
	}
	return Array.isArray(node.content) ? node.content.map(child => textOf(child, depth + 1)).join("") : "";
};

const applyMark = (mark: RichTextMark, children: ReactNode, key: string): ReactNode => {
	switch (mark?.type) {
		case "bold":
			return <strong key={key}>{children}</strong>;
		case "italic":
			return <em key={key}>{children}</em>;
		case "strike":
			return <s key={key}>{children}</s>;
		case "underline":
			return <u key={key}>{children}</u>;
		case "code":
			return <code key={key}>{children}</code>;
		case "subscript":
			return <sub key={key}>{children}</sub>;
		case "superscript":
			return <sup key={key}>{children}</sup>;
		case "highlight":
			return <mark key={key}>{children}</mark>;
		case "link": {
			const href = sanitizeUrl(mark.attrs?.href, {protocols: LINK_PROTOCOLS});
			if (href === undefined) {
				return <Fragment key={key}>{children}</Fragment>;
			}
			return (
				<a key={key} href={href} target="_blank" rel="noopener noreferrer nofollow ugc">{children}</a>
			);
		}
		default:
			// Formatting this renderer does not know (colours, fonts) is
			// dropped rather than guessed at.
			return <Fragment key={key}>{children}</Fragment>;
	}
};

const renderText = (node: RichTextNode, key: string): ReactNode => {
	const text = typeof node.text === "string" ? node.text : "";
	if (text === "") {
		return null;
	}
	const marks = Array.isArray(node.marks) ? node.marks.filter(mark => mark && typeof mark === "object") : [];
	// The first mark is the outermost element, matching the editor's markup.
	return marks.reduceRight<ReactNode>((children, mark, index) => applyMark(mark, children, key + "-" + index), <Fragment key={key}>{text}</Fragment>);
};

const renderChildren = (node: RichTextNode, depth: number): ReactNode => {
	if (!Array.isArray(node.content) || depth > MAX_DEPTH) {
		return null;
	}
	return node.content.map((child, index) => renderNode(child, String(index), depth + 1));
};

const renderNode = (node: RichTextNode | undefined, key: string, depth: number): ReactNode => {
	if (!node || typeof node !== "object" || depth > MAX_DEPTH) {
		return null;
	}
	switch (node.type) {
		case "text":
			return renderText(node, key);
		case "paragraph":
			return <p key={key}>{renderChildren(node, depth)}</p>;
		case "heading": {
			const Heading = ("h" + headingLevel(node.attrs?.level)) as "h1";
			return <Heading key={key}>{renderChildren(node, depth)}</Heading>;
		}
		case "bulletList":
			return <ul key={key}>{renderChildren(node, depth)}</ul>;
		case "orderedList":
			return <ol key={key} start={listStart(node.attrs?.start)}>{renderChildren(node, depth)}</ol>;
		case "listItem":
			return <li key={key}>{renderChildren(node, depth)}</li>;
		case "blockquote":
			return <blockquote key={key}>{renderChildren(node, depth)}</blockquote>;
		case "codeBlock": {
			const language = codeLanguage(node.attrs?.language);
			return (
				<pre key={key}>
					<code className={language ? "language-" + language : undefined}>{textOf(node)}</code>
				</pre>
			);
		}
		case "horizontalRule":
			return <hr key={key}/>;
		case "hardBreak":
			return <br key={key}/>;
		case "mention": {
			const id = asString(node.attrs?.id);
			const label = asString(node.attrs?.label) ?? id ?? "";
			return (
				<span
					key={key}
					className="mention"
					data-type="mention"
					data-id={id}
					data-user-id={asString(node.attrs?.userId)}>@{label}</span>
			);
		}
		case "emojimention": {
			const label = asString(node.attrs?.label) ?? asString(node.attrs?.id) ?? "";
			return <span key={key} className="emojis">{label}</span>;
		}
		default:
			// A block this renderer does not know still shows what is in it.
			if (Array.isArray(node.content)) {
				return <Fragment key={key}>{renderChildren(node, depth)}</Fragment>;
			}
			return typeof node.text === "string" ? <Fragment key={key}>{node.text}</Fragment> : null;
	}
};

export const RenderRichText: React.FC<Props> = ({content, className, style}) => {

	// Legacy HTML is parsed with the browser's inert parser. On the server, and
	// while hydrating, only its words are shown, so both render the same; the
	// client then re-renders with the formatting (see useIsClient).
	const isClient = useIsClient();

	const document = useMemo(() => {
		const isLegacyHtml = typeof content === "string" && !isRichTextDocument(content) && parseRichTextDocument(content) === undefined;
		return isLegacyHtml && !isClient ? htmlToPlainTextDocument(content as string) : toRichTextDocument(content);
	}, [content, isClient]);

	return (
		<div
			className={"blue-orange-render-rich-text" + (className ? " " + className : "")}
			style={style}>
			{renderChildren(document, 0)}
		</div>
	)
}
