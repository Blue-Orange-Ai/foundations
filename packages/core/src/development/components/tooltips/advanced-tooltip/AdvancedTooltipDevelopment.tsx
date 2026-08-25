import React from "react";

import './AdvancedTooltipDevelopment.css'
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {AdvancedTooltip, ToolTipTrigger} from "../../../../components/tooltips/advanced-tooltip/AdvancedTooltip";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const ADVANCED_TOOLTIP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Whatever the tooltip is attached to."
	},
	{
		name: "tooltipComponent",
		type: "React.ReactNode",
		description: "What the tooltip holds. It is mounted as React, so it can be anything — and it stays interactive."
	},
	{
		name: "trigger",
		type: "ToolTipTrigger",
		default: "ToolTipTrigger.CLICK",
		defaultValue: ToolTipTrigger.CLICK,
		control: "select",
		options: [
			{label: "Click", value: ToolTipTrigger.CLICK, code: "ToolTipTrigger.CLICK"},
			{label: "Mouse enter", value: ToolTipTrigger.MOUSE_ENTER, code: "ToolTipTrigger.MOUSE_ENTER"}
		],
		description: "What opens it. MOUSE_ENTER also opens it on focus, so it can be reached from the keyboard."
	}
];

interface Props {
}

export const AdvancedTooltipDevelopment: React.FC<Props> = ({}) => {


	return (
		<ComponentDoc
			title="Advanced Tooltip"
			description="A tooltip whose content is a React node rather than a line of text, mounted into its own root — so it can hold a button, a form, a chart. It stays interactive, which is what makes it different from SimpleTooltip."
			name="AdvancedTooltip"
			previewHeight={160}
			imports={["ToolTipTrigger"]}
			props={ADVANCED_TOOLTIP_PROPS}
			snippetChildren={() => "<Button text={\"Open the tooltip\"} buttonType={ButtonType.PRIMARY}></Button>"}
			preview={values => (
				<AdvancedTooltip
					trigger={values.trigger}
					tooltipComponent={
						<Button
							text={"A button in a tooltip"}
							buttonType={ButtonType.PRIMARY}></Button>
					}>
					<Button text={"Open the tooltip"} buttonType={ButtonType.SECONDARY}></Button>
				</AdvancedTooltip>
			)}>
			<AdvancedTooltip tooltipComponent={<Button text={"Tooltip Button"} buttonType={ButtonType.PRIMARY} onClick={() => console.log("Hello tooltip")}></Button>}>
				<Button text={"Nothing Button"} buttonType={ButtonType.PRIMARY}></Button>
			</AdvancedTooltip>
		</ComponentDoc>
	)
}