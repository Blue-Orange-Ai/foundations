import React, {useState} from "react";

import './ToggleInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Toggle} from "../../../../components/inputs/toggle/Toggle";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const TOGGLE_PROPS: Array<PropSpec> = [
	{
		name: "checked",
		type: "boolean",
		default: "false",
		control: "toggle",
		value: true,
		description: "Whether the switch is on."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Email notifications",
		description: "The label for the switch."
	},
	{
		name: "text",
		type: "string",
		control: "text",
		description: "Optional text sat to the right of the switch. Clicking it flips the switch."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "labelPosition",
		type: "ToggleLabelPosition",
		default: "\"top\"",
		control: "select",
		options: [
			{label: "top", value: "top"},
			{label: "left", value: "left"}
		],
		description: "\"top\" stacks the label above the switch like every other input. \"left\" puts them on one row, pushed to either end of the full width of the container, which is how a switch usually sits in a form."
	},
	{
		name: "onChange",
		type: "(checked: boolean) => void",
		description: "Fires with what the switch has become."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the switch out and stops it responding."
	},
	{
		name: "update",
		type: "Date",
		description: "Stamp it with a new date to make the switch re-read `checked`, for a value that was changed from somewhere else."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the switch."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	{
		name: "textStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the text beside the switch."
	},
	...validationProps("boolean")
];

interface Props {
}

export const ToggleInputDevelopment: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<boolean>(false);


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Toggle"
					description="A switch for a setting that takes effect as soon as it is flipped. Where a checkbox belongs in a form that is submitted, a toggle belongs where the change is the action."
					name="Toggle"
					previewHeight={120}
					props={TOGGLE_PROPS}
					preview={values => (
						<Toggle
							checked={values.checked}
							label={values.label}
							text={values.text}
							help={values.help}
							labelPosition={values.labelPosition}
							disabled={values.disabled}
							name={values.name}
							required={values.required}
							requiredMessage={values.requiredMessage}
							validateOnChange={values.validateOnChange}
							onChange={() => {}}></Toggle>
					)}>
					<div className="workspace-toggle-example-form">
						<Toggle
							checked={query}
							label="Email notifications"
							help="We will let you know when something needs your attention."
							labelPosition="left"
							onChange={setQuery}></Toggle>
						<Toggle
							checked={query}
							label="Email notifications"
							text={query ? "On" : "Off"}
							onChange={setQuery}></Toggle>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(query, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}