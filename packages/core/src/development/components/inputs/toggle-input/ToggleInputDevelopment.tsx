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
							disabled={values.disabled}
							name={values.name}
							required={values.required}
							requiredMessage={values.requiredMessage}
							validateOnChange={values.validateOnChange}
							onChange={() => {}}></Toggle>
					)}>
					<Toggle checked={query} onChange={setQuery}></Toggle>
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