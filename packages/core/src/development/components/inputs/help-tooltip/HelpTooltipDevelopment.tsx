import React from "react";

import './HelpTooltipDevelopment.css'
import {HelpIcon} from "../../../../components/inputs/help/HelpIcon";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const HELP_ICON_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Runs are grouped by the day they started, in your own timezone.",
		description: "The text shown on hover."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the icon."
	}
];

interface Props {
}

export const HelpTooltipDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Help Icon"
			description="The small question mark that sits beside a field's label and explains it on hover. Every input in the library puts one up for you when it is given a `help` prop — this is the same icon on its own, for a label the library does not render."
			name="HelpIcon"
			previewHeight={120}
			props={HELP_ICON_PROPS}
			preview={values => (
				<HelpIcon label={values.label}></HelpIcon>
			)}>
			<div className="blue-orange-help-tooltip-development">
				<div className="blue-orange-help-tooltip-development-row">
					<div>Hover the icon</div>
					<HelpIcon label={"This tooltip is provided by HelpIcon (tippy.js)"}></HelpIcon>
				</div>
				<div className="blue-orange-help-tooltip-development-row">
					<div>Custom size</div>
					<HelpIcon label={"Custom size via style prop"} style={{height: "28px", width: "28px"}}></HelpIcon>
				</div>
			</div>
		</ComponentDoc>
	)
}
