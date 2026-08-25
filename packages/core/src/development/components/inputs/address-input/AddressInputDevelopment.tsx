import React, {useState} from "react";

import './AddressInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Address, Media} from "@blue-orange-ai/foundations-clients";
import {AddressInput} from "../../../../components/inputs/address/AddressInput";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const ADDRESS_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "address",
		type: "Address",
		description: "The address in the field, as the object the API speaks in."
	},
	{
		name: "onChange",
		type: "(value: Address) => void",
		description: "Fires with the whole Address object whenever any part of it changes."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Site address",
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
		default: "false",
		control: "toggle",
		description: "Greys the field out and stops it taking input."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the label."
	},
	...validationProps("Address")
];

interface Props {
}

export const AddressInputDevelopment: React.FC<Props> = ({}) => {

	const generateContentStr = (state: Address) => {
		return JSON.stringify(state, null, 2);
	}

	const [address, setAddress] = useState<Address>({
		address: "4 Kegworth Street",
		city: "Leichhardt",
		country: "Australia",
		id: "",
		postcode: "2040",
		state: "NSW"
	});

	const updateAddress = (address: Address) => {
		setAddress((prevState) => ({
			...prevState,
			...address
		}))
	}


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Address Input"
					description="A street address as one field. It reports an Address object rather than a line of text, so the parts of it stay apart."
					name="AddressInput"
					previewHeight={200}
					previewCentered={false}
					props={ADDRESS_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "460px"}}>
							<AddressInput
								label={values.label}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></AddressInput>
						</div>
					)}>
					<AddressInput
						address={address}
						onChange={updateAddress}
						label="Address Input"
					></AddressInput>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{generateContentStr(address)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}