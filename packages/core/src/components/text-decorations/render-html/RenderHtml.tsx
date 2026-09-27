import React, {useMemo} from "react";

import './RenderHtml.css'
import {sanitizeHtml, SanitizeHtmlOptions} from "../../utils/SanitizeHtml";

interface Props {
	/**
	 * The markup to show. It is always sanitized first: formatting is kept, and
	 * anything that could run script, load another document, post a form or
	 * escape the container (scripts, event handlers, `javascript:` links,
	 * iframes, `<style>`, fixed positioning) is removed.
	 */
	html: string;
	/** Narrows what is kept — e.g. `{allowStyles: false}` for text written by other users. */
	sanitizeOptions?: SanitizeHtmlOptions;
}

// For content written in the rich text editors prefer RenderRichText, which
// renders the editor's JSON document without going through markup at all.
export const RenderHtml: React.FC<Props> = ({html, sanitizeOptions}) => {

	const allowStyles = sanitizeOptions?.allowStyles;
	const allowMedia = sanitizeOptions?.allowMedia;
	const allowSvg = sanitizeOptions?.allowSvg;

	const safeHtml = useMemo(
		() => sanitizeHtml(html, {allowStyles, allowMedia, allowSvg}),
		[html, allowStyles, allowMedia, allowSvg]
	);

	return (
		<div
			className="blue-orange-render-html"
			dangerouslySetInnerHTML={{ __html: safeHtml }}
		/>
	)
}
