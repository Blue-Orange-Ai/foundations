import React, {useState} from "react";

import './PhoneInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {PhoneInput} from "../../../../components/inputs/phone/PhoneInput";
import {Telephone} from "@blue-orange-ai/foundations-clients/lib/Passport";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";


const DEMO_TELEPHONE = {
	number: "0412345678",
	code: "AU",
	country: "Australia",
	extension: null,
	format: null
};

const PHONE_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "telephone",
		type: "Telephone",
		description: "The number and its country code together."
	},
	{
		name: "onChange",
		type: "(value: Telephone) => void",
		description: "Fires with the whole Telephone object whenever either half of it changes."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Contact number",
		description: "The label above the field."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "disabled",
		type: "boolean",
		control: "toggle",
		description: "Greys the field out and stops it taking input."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the field."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the label."
	},
	...validationProps()
];

interface Props {
}

export const PhoneInputDevelopment: React.FC<Props> = ({}) => {

	const [query, setQuery] = useState<Telephone>({
		code: "",
		country: "",
		extension: "",
		format: "",
		id: "",
		number: ""

	});

	const handleQueryChange = (telephone: Telephone) => {
		setQuery((prevState) => ({
			...prevState,
			...telephone
		}))
	}


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Phone Input"
					description="A phone number field with the country beside it. It reports a Telephone object rather than a string, so the number and its country code stay together."
					name="PhoneInput"
					previewHeight={180}
					previewCentered={false}
					props={PHONE_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<PhoneInput
								telephone={DEMO_TELEPHONE}
								label={values.label}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></PhoneInput>
						</div>
					)}>
					<PhoneInput telephone={query} onChange={handleQueryChange}></PhoneInput>
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