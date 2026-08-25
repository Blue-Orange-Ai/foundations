import React from "react";

import './SimpleTooltipDevelopment.css'
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {SimpleTooltip} from "../../../../components/tooltips/simple-tooltip/SimpleTooltip";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const SIMPLE_TOOLTIP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Whatever the tooltip is attached to."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Saves the run and closes the drawer",
		description: "The text shown on hover. Nothing is attached at all when it is left off."
	}
];

interface Props {
}

export const SimpleTooltipDevelopment: React.FC<Props> = ({}) => {


	return (
		<ComponentDoc
			title="Simple Tooltip"
			description="A line of text on hover. It wraps whatever it is given and needs nothing else — where the tooltip has to hold a control rather than a sentence, reach for AdvancedTooltip instead."
			name="SimpleTooltip"
			previewHeight={140}
			props={SIMPLE_TOOLTIP_PROPS}
			snippetChildren={() => "<Button text={\"Hover me\"} buttonType={ButtonType.PRIMARY}></Button>"}
			preview={values => (
				<SimpleTooltip label={values.label}>
					<Button text={"Hover me"} buttonType={ButtonType.PRIMARY}></Button>
				</SimpleTooltip>
			)}>
			<SimpleTooltip label={"This is where the simple tooltip text goes"}>
				<Button text={"Nothing Button"} buttonType={ButtonType.PRIMARY}></Button>
			</SimpleTooltip>
		</ComponentDoc>
	)
}