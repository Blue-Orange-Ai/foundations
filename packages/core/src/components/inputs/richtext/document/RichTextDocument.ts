import {AnyExtension, elementFromString, getSchema} from "@tiptap/core";
import {DOMParser as ProseMirrorDOMParser, Schema} from "@tiptap/pm/model";
import {StarterKit} from "@tiptap/starter-kit";
import {SafeLink} from "../extensions/SafeLink";
import CustomMention from "../mention-extension/MentionExtension";
import {EmojiMention} from "../extensions/EmojiMention";

// The rich text editors describe what was written as a TipTap (ProseMirror)
// document: plain JSON naming each block, its text and its formatting. That is
// what should be stored and passed around, rather than the editor's HTML —
// JSON can be rendered with React (see RenderRichText), which only ever
// creates the elements it knows about and escapes every piece of text, so
// nothing a writer or a tampered request puts in it can run in a reader's
// browser. HTML, by contrast, has to be trusted or sanitized every time it is
// shown.
//
// Content written before the editors produced JSON is still HTML. It is read
// by parsing it against the editor's own schema in an inert document: only the
// blocks, marks and attributes the editor supports survive, so the result is
// the same safe JSON.

export interface RichTextMark {
	type: string;
	attrs?: Record<string, any>;
	[key: string]: any;
}

export interface RichTextNode {
	type?: string;
	attrs?: Record<string, any>;
	content?: Array<RichTextNode>;
	marks?: Array<RichTextMark>;
	text?: string;
	[key: string]: any;
}

/** A whole document, as returned by the editor's getJSON(). */
export interface RichTextDocument extends RichTextNode {
	type: "doc";
	content?: Array<RichTextNode>;
}

/** Anything the rich text components accept as content. */
export type RichTextContent = RichTextDocument | string | null | undefined;

/** The extensions the editors are built from, without their interactive parts. */
export const richTextSchemaExtensions = (): AnyExtension[] => [
	StarterKit,
	SafeLink,
	CustomMention,
	EmojiMention,
];

let schema: Schema | undefined;

const getRichTextSchema = (): Schema => {
	if (!schema) {
		schema = getSchema(richTextSchemaExtensions());
	}
	return schema;
};

export const emptyRichTextDocument = (): RichTextDocument => ({type: "doc", content: [{type: "paragraph"}]});

export const isRichTextDocument = (value: unknown): value is RichTextDocument => {
	if (value === null || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}
	const candidate = value as RichTextNode;
	return candidate.type === "doc" && (candidate.content === undefined || Array.isArray(candidate.content));
};

// A stored document is JSON anyone could have written. JSON.parse turns a
// `"__proto__"` key into an ordinary own property, and TipTap's attribute
// merging (GHSA-cp6q-959q-f8rh) can promote such a key into a real prototype,
// so these keys are dropped from every document before it reaches an editor.
const PROTOTYPE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const withoutPrototypeKeys = (key: string, value: unknown): unknown =>
	PROTOTYPE_KEYS.has(key) ? undefined : value;

/** A copy of a JSON value with the prototype keys removed at every level. */
const cleanJson = (value: unknown, depth: number = 0): unknown => {
	if (value === null || typeof value !== "object" || depth > 1000) {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map(item => cleanJson(item, depth + 1));
	}
	const copy: Record<string, unknown> = {};
	Object.keys(value).forEach(key => {
		if (!PROTOTYPE_KEYS.has(key)) {
			copy[key] = cleanJson((value as Record<string, unknown>)[key], depth + 1);
		}
	});
	return copy;
};

/**
 * Reads a document that was stored as a JSON string. Returns undefined for
 * anything else — including HTML, which is left to htmlToRichTextDocument.
 */
export const parseRichTextDocument = (value: string | null | undefined): RichTextDocument | undefined => {
	if (typeof value !== "string") {
		return undefined;
	}
	const trimmed = value.trim();
	if (!trimmed.startsWith("{")) {
		return undefined;
	}
	try {
		const parsed = JSON.parse(trimmed, withoutPrototypeKeys);
		return isRichTextDocument(parsed) ? parsed : undefined;
	} catch (e) {
		return undefined;
	}
};

/** The string form a document is stored in, e.g. a comment's text. */
export const serializeRichTextDocument = (document: RichTextDocument): string => JSON.stringify(document);

/** True when the string holds a serialized document rather than HTML or plain text. */
export const isSerializedRichTextDocument = (value: unknown): boolean =>
	typeof value === "string" && parseRichTextDocument(value) !== undefined;

/**
 * Converts HTML written by an earlier version of the editor into a document.
 * The HTML is parsed in an inert document (nothing in it loads or runs) and
 * read against the editor's schema, so anything the editor could not have
 * produced — scripts, handlers, styles, unknown tags, unsafe links — is left
 * behind.
 */
export const htmlToRichTextDocument = (html: string | null | undefined): RichTextDocument => {
	if (!html || html.trim() === "") {
		return emptyRichTextDocument();
	}
	if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
		return htmlToPlainTextDocument(html);
	}
	try {
		const parsed = ProseMirrorDOMParser.fromSchema(getRichTextSchema()).parse(elementFromString(html)).toJSON();
		return isRichTextDocument(parsed) ? parsed : emptyRichTextDocument();
	} catch (e) {
		return emptyRichTextDocument();
	}
};

/**
 * Legacy HTML reduced to its words without parsing it — for when there is no
 * inert parser to read it with (the server). The same input always gives the
 * same document, wherever it runs.
 */
export const htmlToPlainTextDocument = (html: string | null | undefined): RichTextDocument =>
	plainTextToRichTextDocument((html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());

/** A document holding the text as written, one paragraph per line. */
export const plainTextToRichTextDocument = (text: string | null | undefined): RichTextDocument => {
	if (!text) {
		return emptyRichTextDocument();
	}
	return {
		type: "doc",
		content: text.split(/\r?\n/).map(line => line === ""
			? {type: "paragraph"}
			: {type: "paragraph", content: [{type: "text", text: line}]})
	};
};

/**
 * Whatever form content arrives in — a document, a serialized document, or
 * legacy HTML — as a document.
 */
export const toRichTextDocument = (content: RichTextContent): RichTextDocument => {
	if (isRichTextDocument(content)) {
		return content;
	}
	if (typeof content !== "string") {
		return emptyRichTextDocument();
	}
	return parseRichTextDocument(content) ?? htmlToRichTextDocument(content);
};

const MAX_DEPTH = 200;

export interface EditorContentOptions {
	/** The editor has the mention extension. When it does not, mentions become plain `@name` text. */
	allowMentions?: boolean;
	/** The editor has the emoji extension. When it does not, emoji nodes become plain text. */
	allowEmojis?: boolean;
}

const inlineNodeText = (node: RichTextNode): string => {
	const label = node.attrs?.label ?? node.attrs?.id;
	const text = typeof label === "string" ? label : "";
	return node.type === "mention" ? "@" + text : text;
};

// TipTap throws a whole JSON document away when any node in it is one its
// schema does not have, so nodes an editor was built without are turned into
// their text first.
const fitToEditor = (node: RichTextNode, options: EditorContentOptions, depth: number): RichTextNode => {
	if (depth > MAX_DEPTH || !Array.isArray(node.content)) {
		return node;
	}
	return {
		...node,
		content: node.content
			.filter(child => child && typeof child === "object")
			.map(child => {
				if ((child.type === "mention" && options.allowMentions === false) ||
					(child.type === "emojimention" && options.allowEmojis === false)) {
					return {type: "text", text: inlineNodeText(child), ...(child.marks ? {marks: child.marks} : {})};
				}
				return fitToEditor(child, options, depth + 1);
			})
			.filter(child => child.type !== "text" || (typeof child.text === "string" && child.text !== ""))
	};
};

/**
 * What to hand an editor as its content. A document, or a serialized one, is
 * given back as JSON (the editor would otherwise show a serialized document as
 * text). Legacy HTML is passed on as it is: the editor parses it against its
 * own schema in an inert document, which keeps only what it supports.
 */
export const toEditorContent = (content: RichTextContent, options: EditorContentOptions = {}): RichTextDocument | string => {
	const document = isRichTextDocument(content)
		? cleanJson(content) as RichTextDocument
		: typeof content === "string" ? parseRichTextDocument(content) : undefined;
	if (document) {
		return fitToEditor(document, options, 0) as RichTextDocument;
	}
	return typeof content === "string" ? content : "";
};

const walk = (node: RichTextNode | undefined, visit: (node: RichTextNode) => void, depth: number = 0) => {
	if (!node || typeof node !== "object" || depth > MAX_DEPTH) {
		return;
	}
	visit(node);
	if (Array.isArray(node.content)) {
		node.content.forEach(child => walk(child, visit, depth + 1));
	}
};

/** The ids of every user mentioned in the document, in order, without repeats. */
export const richTextMentions = (content: RichTextContent): string[] => {
	const mentions: string[] = [];
	walk(toRichTextDocument(content), node => {
		if (node.type !== "mention") {
			return;
		}
		const userId = node.attrs?.userId;
		if (typeof userId === "string" && userId !== "" && !mentions.includes(userId)) {
			mentions.push(userId);
		}
	});
	return mentions;
};

const BLOCK_TYPES = new Set(["paragraph", "heading", "blockquote", "codeBlock", "listItem", "horizontalRule"]);

/** The words of the document, one line per block — for previews, notifications and search. */
export const richTextToPlainText = (content: RichTextContent): string => {
	const lines: string[] = [];
	let current = "";
	const flush = () => {
		lines.push(current);
		current = "";
	};
	const visit = (node: RichTextNode | undefined, depth: number) => {
		if (!node || typeof node !== "object" || depth > MAX_DEPTH) {
			return;
		}
		if (node.type === "text" && typeof node.text === "string") {
			current += node.text;
			return;
		}
		if (node.type === "hardBreak") {
			flush();
			return;
		}
		if (node.type === "mention" || node.type === "emojimention") {
			const label = node.attrs?.label ?? node.attrs?.id;
			current += (node.type === "mention" ? "@" : "") + (typeof label === "string" ? label : "");
			return;
		}
		const isBlock = BLOCK_TYPES.has(node.type ?? "");
		if (isBlock && current !== "") {
			flush();
		}
		if (Array.isArray(node.content)) {
			node.content.forEach(child => visit(child, depth + 1));
		}
		if (isBlock && current !== "") {
			flush();
		}
	};
	visit(toRichTextDocument(content), 0);
	if (current !== "") {
		flush();
	}
	return lines.join("\n").trim();
};

/** True when the document holds nothing a reader would see. */
export const isRichTextDocumentEmpty = (content: RichTextContent): boolean => {
	let empty = true;
	walk(toRichTextDocument(content), node => {
		if (!empty) {
			return;
		}
		if (node.type === "text" && typeof node.text === "string" && node.text.trim() !== "") {
			empty = false;
		} else if (node.type === "mention" || node.type === "emojimention" || node.type === "horizontalRule" || node.type === "image") {
			empty = false;
		}
	});
	return empty;
};
