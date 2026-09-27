import React, {useMemo} from "react";

import './RenderHtml.css'
import {sanitizeHtml, SanitizeHtmlOptions} from "../../utils/SanitizeHtml";

interface Props {
	/**
	 * The markup to show. It is always sanitized first: formatting is kept, and
	 * anything that could run script, load another document or post a form
	 * (scripts, event handlers, `javascript:` links, iframes, `<style>`) is
	 * removed. The container clips what is drawn to it, so nothing inside can
	 * cover the page around it.
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
	const allowClasses = sanitizeOptions?.allowClasses;

	const safeHtml = useMemo(
		() => sanitizeHtml(html, {allowStyles, allowMedia, allowSvg, allowClasses}),
		[html, allowStyles, allowMedia, allowSvg, allowClasses]
	);

	return (
		<div
			className="blue-orange-render-html"
			dangerouslySetInnerHTML={{ __html: safeHtml }}
		/>
	)
}
