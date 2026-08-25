import React, {useState} from "react";

import './AccordionDevelopment.css'
import {Accordion} from "../../../components/accordion/accordion/Accordion";
import {AccordionHeader} from "../../../components/accordion/accordion-header/AccordionHeader";
import {AccordionBody} from "../../../components/accordion/accordion-body/AccordionBody";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";


const ACCORDION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "An AccordionHeader and an AccordionBody. Anything else among the children is ignored."
	},
	{
		name: "opened",
		type: "boolean",
		required: true,
		control: "toggle",
		value: false,
		description: "Whether the body is showing. The component is controlled, so this is the parent's to hold."
	}
];

const ACCORDION_HEADER_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "Whatever should stay visible. Put the toggle's click handler on it yourself."
	}
];

const ACCORDION_BODY_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "ReactNode",
		required: true,
		description: "Whatever is revealed when the accordion opens."
	}
];

interface Props {
}

export const AccordionDevelopment: React.FC<Props> = ({}) => {


	const [opened, setOpened] = useState<boolean>(true)

	return (
		<ComponentDoc
			title="Accordion"
			description="A section that opens and closes, animating its own height as it goes. It does not own the open state — AccordionHeader is whatever should toggle it, and the parent decides what `opened` is."
			name="Accordion"
			previewHeight={180}
			previewCentered={false}
			imports={["AccordionHeader", "AccordionBody"]}
			props={ACCORDION_PROPS}
			snippetChildren={() => "<AccordionHeader>\n\t<div onClick={() => setOpened(!opened)}>Delivery details</div>\n</AccordionHeader>\n<AccordionBody>\n\t<p>Everything inside the body is measured so the height can be animated.</p>\n</AccordionBody>"}
			preview={values => (
				<div style={{width: "100%"}}>
					<Accordion opened={values.opened}>
						<AccordionHeader>
							<div className="blue-orange-accordion-development-header">Delivery details</div>
						</AccordionHeader>
						<AccordionBody>
							<p style={{margin: "8px 0"}}>
								The body is measured when it opens, so it animates to whatever height its
								content needs rather than to a fixed one.
							</p>
						</AccordionBody>
					</Accordion>
				</div>
			)}
			siblings={[
				{
					name: "AccordionHeader",
					description: "Marks which of the children is the part that is always visible. It renders its children as they are and adds nothing of its own — including the click handler, which is yours to put on.",
					props: ACCORDION_HEADER_PROPS,
					previewHeight: 110,
					snippetChildren: () => "<div onClick={() => setOpened(!opened)}>Delivery details</div>",
					preview: () => (
						<AccordionHeader>
							<div className="blue-orange-accordion-development-header">Delivery details</div>
						</AccordionHeader>
					)
				},
				{
					name: "AccordionBody",
					description: "Marks the part that is revealed. Like the header it renders its children untouched; the Accordion around it does the measuring and the animating.",
					props: ACCORDION_BODY_PROPS,
					previewHeight: 110,
					snippetChildren: () => "<p>Everything inside the body is measured so the height can be animated.</p>",
					preview: () => (
						<AccordionBody>
							<p style={{margin: 0}}>Everything inside the body is measured so the height can be animated.</p>
						</AccordionBody>
					)
				}
			]}>
			<Accordion opened={opened}>
				<AccordionHeader>
					<div className="blue-orange-accordion-development-header" onClick={() => setOpened(!opened)}>Accordion Header</div>
				</AccordionHeader>
				<AccordionBody>
					<div className="blue-orange-accordion-development-body">
						<div>Body 1</div>
						<div>Body 2</div>
						<div>Body 3</div>
						<div>Body 4</div>
						<div>Body 5</div>
					</div>
				</AccordionBody>
			</Accordion>
		</ComponentDoc>
	)
}