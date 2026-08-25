import React, {ReactNode} from "react";

import './DocsTheme.css'
import './ComponentDoc.css'
import {PaddedPage} from "../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../components/text-decorations/description/Description";
import {ComponentApi, ComponentApiProps} from "./ComponentApi";

interface Props extends ComponentApiProps {
	/** The page's subject, which is usually — but not always — the component's own name. */
	title: string;
	/** What the component is for, in a sentence or two. */
	description: ReactNode;
	/** Anything else the page documents: the icon-only variant, the dropdown variant, the row that goes inside it. */
	siblings?: Array<ComponentApiProps>;
	/** The hand written examples, kept as their own section at the foot of the page. */
	children?: ReactNode;
}

/**
 * The shape every component page in this application takes: what the component
 * is, a demo whose viewport and props can both be driven from the page, the
 * code that reproduces what is on screen, the interface it comes from, and the
 * worked examples underneath.
 */
export const ComponentDoc: React.FC<Props> = ({title, description, siblings = [], children, ...api}) => {

	return (
		<PaddedPage>
			<PageHeading>{title}</PageHeading>
			<Description>{description}</Description>

			<ComponentApi {...api}></ComponentApi>

			{siblings.map(sibling => (
				<ComponentApi key={sibling.name} heading={sibling.name} {...sibling}></ComponentApi>
			))}

			{children
				? <div className="blue-orange-docs-examples">
					<GeneralHeading>Examples</GeneralHeading>
					{children}
				</div>
				: <></>}
		</PaddedPage>
	)
}
