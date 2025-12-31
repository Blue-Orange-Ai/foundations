import React from "react";

import './RenderHtmlDevelopment.css'
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {RenderHtml} from "../../../../components/text-decorations/render-html/RenderHtml";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";

interface Props {
}

export const RenderHtmlDevelopment: React.FC<Props> = ({}) => {

	const simpleHtml = "<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>";
	
	const listHtml = `
		<ul>
			<li>First item</li>
			<li>Second item</li>
			<li>Third item</li>
		</ul>
	`;

	const styledHtml = `
		<div style="padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
			<h3 style="margin: 0 0 8px 0; color: #1f2937;">Styled Container</h3>
			<p style="margin: 0; color: #6b7280;">This HTML has inline styles applied.</p>
		</div>
	`;

	const linkHtml = '<p>Visit <a href="https://example.com" target="_blank">Example Website</a> for more info.</p>';

	return (
		<PaddedPage>
			<PageHeading>Render HTML Text Decoration</PageHeading>
			<Description>Renders raw HTML strings as React components. Use with caution for trusted content only.</Description>

			<GeneralHeading>Simple HTML</GeneralHeading>
			<RenderHtml html={simpleHtml} />

			<GeneralHeading>HTML List</GeneralHeading>
			<RenderHtml html={listHtml} />

			<GeneralHeading>Styled HTML</GeneralHeading>
			<RenderHtml html={styledHtml} />

			<GeneralHeading>HTML with Links</GeneralHeading>
			<RenderHtml html={linkHtml} />
		</PaddedPage>
	)
}
