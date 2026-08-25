import React, {useState} from "react";

import './CheckboxInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const CHECKBOX_PROPS: Array<PropSpec> = [
	{
		name: "checked",
		type: "boolean",
		default: "false",
		control: "toggle",
		value: true,
		description: "Whether the box is ticked."
	},
	{
		name: "onCheckboxChange",
		type: "(checked: boolean) => void",
		description: "Fires with what the box has become."
	},
	{
		name: "readonly",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Shows the state without letting it be changed."
	},
	{
		name: "update",
		type: "Date",
		description: "Stamp it with a new date to make the box re-read `checked`, for a value that was changed from somewhere else."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the box."
	},
	...validationProps("boolean")
];

interface Props {
}

export const CheckboxInputDevelopment: React.FC<Props> = ({}) => {

	const [checked, setChecked] = useState(false);


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Checkbox"
					description="A box that is ticked or not. It is controlled — `checked` is the parent's to hold — and it takes the same name and validation props as every other input, so it can sit inside a FormGroup."
					name="Checkbox"
					previewHeight={120}
					props={CHECKBOX_PROPS}
					preview={values => (
						<Checkbox
							checked={values.checked}
							readonly={values.readonly}
							name={values.name}
							required={values.required}
							requiredMessage={values.requiredMessage}
							validateOnChange={values.validateOnChange}
							onCheckboxChange={() => {}}></Checkbox>
					)}>
					<Checkbox
						checked={checked}
						onCheckboxChange={setChecked}
					></Checkbox>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(checked)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}