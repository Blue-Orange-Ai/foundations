import React from "react";

import './RenderHtmlDevelopment.css'
import {RenderHtml} from "../../../../components/text-decorations/render-html/RenderHtml";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const RENDER_HTML_PROPS: Array<PropSpec> = [
	{
		name: "html",
		type: "string",
		required: true,
		control: "text",
		value: "<h3>Melbourne Depot</h3><p>Operational since <strong>2019</strong>.</p>",
		description: "The markup to insert. It goes in through dangerouslySetInnerHTML, so anything in it runs as written."
	}
];

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
		<ComponentDoc
			title="Render HTML"
			description="Puts a string of HTML into the page as real markup. It does no sanitising of its own, so only content you already trust should be handed to it."
			name="RenderHtml"
			previewHeight={160}
			previewCentered={false}
			props={RENDER_HTML_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<RenderHtml html={values.html}></RenderHtml>
				</div>
			)}>

			<GeneralHeading>Simple HTML</GeneralHeading>
			<RenderHtml html={simpleHtml} />

			<GeneralHeading>HTML List</GeneralHeading>
			<RenderHtml html={listHtml} />

			<GeneralHeading>Styled HTML</GeneralHeading>
			<RenderHtml html={styledHtml} />

			<GeneralHeading>HTML with Links</GeneralHeading>
			<RenderHtml html={linkHtml} />
		</ComponentDoc>
	)
}
