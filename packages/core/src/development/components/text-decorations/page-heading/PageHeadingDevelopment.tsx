import React from "react";

import './PageHeadingDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const PAGE_HEADING_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		control: "text",
		value: "Fleet overview",
		hideFromSnippet: true,
		description: "The heading text, or any node that should sit in the heading."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the h1."
	}
];

interface Props {
}

export const PageHeadingDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Page Heading"
			description="The h1 at the top of a page. There should be one of them, and Description usually sits directly underneath it."
			name="PageHeading"
			previewHeight={110}
			snippetChildren={values => values.children}
			props={PAGE_HEADING_PROPS}
			preview={values => (
				<PageHeading>{values.children}</PageHeading>
			)}>

			<GeneralHeading>Examples</GeneralHeading>

			<PageHeading>Default Page Heading</PageHeading>
			<Description>This is the standard page heading style.</Description>

			<PageHeading style={{color: "#3b82f6"}}>Blue Page Heading</PageHeading>
			<Description>A page heading with custom blue color.</Description>

			<PageHeading style={{fontSize: "2.5rem"}}>Large Page Heading</PageHeading>
			<Description>A page heading with increased font size.</Description>

			<PageHeading style={{textAlign: "center"}}>Centered Page Heading</PageHeading>
			<Description style={{textAlign: "center"}}>A centered page heading.</Description>
		</ComponentDoc>
	)
}
