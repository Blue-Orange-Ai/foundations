import React, {useState} from "react";

import './ArrayInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {ArrayInput} from "../../../../components/inputs/array-input/ArrayInput";
import {Address, Telephone} from "@blue-orange-ai/foundations-clients";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const DEMO_ARRAY_VALUE = ["Storage", "Dispatch"];

const ARRAY_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "(string | number)[] | string[][] | Address[] | Telephone[]",
		default: "[]",
		description: "The list. Which of those shapes it takes follows from the variant."
	},
	{
		name: "variant",
		type: "'list' | 'tag-list' | 'textarea-list' | 'address-list' | 'phone-list'",
		default: "'list'",
		defaultValue: "list",
		control: "select",
		options: [
			{label: "list", value: "list"},
			{label: "tag-list", value: "tag-list"},
			{label: "textarea-list", value: "textarea-list"},
			{label: "address-list", value: "address-list"},
			{label: "phone-list", value: "phone-list"}
		],
		description: "What each entry is edited with."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Capabilities",
		description: "The label above the field."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Shown in an empty entry."
	},
	{
		name: "isNumber",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Restricts entries to digits."
	},
	{
		name: "whitelist",
		type: "string[]",
		description: "Values offered as suggestions by the tag-list variant."
	},
	{
		name: "enforceWhitelist",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Refuses anything that is not on the whitelist."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the field out and stops entries being added or removed."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "onChange",
		type: "(value: ArrayInputValue) => void",
		description: "Fires with the whole list whenever any entry changes."
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
	...validationProps("ArrayInputValue")
];

interface Props {
}

export const ArrayInputDevelopment: React.FC<Props> = ({}) => {

	const [textItems, setTextItems] = useState<(string | number)[]>(["Item 1", "Item 2", "Item 3"]);
	const [numberItems, setNumberItems] = useState<(string | number)[]>([10, 20, 30]);
	const [noLabelItems, setNoLabelItems] = useState<(string | number)[]>(["No label example"]);
	const [tagListItems, setTagListItems] = useState<string[][]>([
		["frontend", "react"],
		["backend", "node"]
	]);
	const [tagListWithWhitelist, setTagListWithWhitelist] = useState<string[][]>([
		["React"]
	]);
	const [textareaItems, setTextareaItems] = useState<(string | number)[]>(["First paragraph of text...", "Second paragraph with more content..."]);
	const [addressItems, setAddressItems] = useState<Address[]>([
		{address: '123 Main St', city: 'Sydney', state: 'NSW', postcode: '2000', country: 'Australia'},
		{address: '456 Oak Ave', city: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia'}
	]);
	const [phoneItems, setPhoneItems] = useState<Telephone[]>([
		{code: 'AU', country: 'Australia', extension: '+61', format: '', number: '412345678'},
		{code: 'US', country: 'United States', extension: '+1', format: '', number: '5551234567'}
	]);
	const frameworkWhitelist = ["React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Remix", "Astro"];

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Array Input"
					description="A field for a list of values. The variant decides what each entry looks like — a line, a tag, a paragraph, an address or a phone number — and the whole list comes back through one onChange."
					name="ArrayInput"
					previewHeight={240}
					previewCentered={false}
					props={ARRAY_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "460px"}}>
							<ArrayInput
								value={DEMO_ARRAY_VALUE}
								label={values.label}
								placeholder={values.placeholder}
								variant={values.variant}
								isNumber={values.isNumber}
								disabled={values.disabled}
								help={values.help}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></ArrayInput>
						</div>
					)}>
					<div style={{display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px"}}>
						<ArrayInput
							label="Text Array (Required)"
							value={textItems}
							onChange={(value) => setTextItems(value as (string | number)[])}
							placeholder="Enter text..."
							required={true}
							help="This is a text array input with required flag"
						/>
						<ArrayInput
							label="Number Array"
							value={numberItems}
							onChange={(value) => setNumberItems(value as (string | number)[])}
							placeholder="Enter number..."
							isNumber={true}
							help="This is a number array input"
						/>
						<ArrayInput
							value={noLabelItems}
							onChange={(value) => setNoLabelItems(value as (string | number)[])}
							placeholder="No label input..."
						/>
						<ArrayInput
							label="Tag List (array of tag groups)"
							value={tagListItems}
							onChange={(val) => setTagListItems(val as string[][])}
							placeholder="Add tags..."
							variant="tag-list"
							help="Each row is a group of tags"
						/>
						<ArrayInput
							label="Tag List with Whitelist"
							value={tagListWithWhitelist}
							onChange={(val) => setTagListWithWhitelist(val as string[][])}
							placeholder="Select frameworks..."
							variant="tag-list"
							whitelist={frameworkWhitelist}
							enforceWhitelist={true}
							help="Only whitelist values are allowed"
						/>
						<ArrayInput
							label="Textarea List"
							value={textareaItems}
							onChange={(value) => setTextareaItems(value as (string | number)[])}
							placeholder="Enter text..."
							variant="textarea-list"
							help="Each row is a textarea for longer content"
						/>
						<ArrayInput
							label="Address List"
							value={addressItems}
							onChange={(val) => setAddressItems(val as Address[])}
							variant="address-list"
							help="Each row is a full address input"
						/>
						<ArrayInput
							label="Phone List"
							value={phoneItems}
							onChange={(val) => setPhoneItems(val as Telephone[])}
							variant="phone-list"
							help="Each row is a phone number input"
						/>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						<div style={{marginBottom: "16px"}}>
							<strong>Text Array:</strong>
							<br />
							{JSON.stringify(textItems, null, 2)}
						</div>
						<div style={{marginBottom: "16px"}}>
							<strong>Number Array:</strong>
							<br />
							{JSON.stringify(numberItems, null, 2)}
						</div>
						<div style={{marginBottom: "16px"}}>
							<strong>No Label Array:</strong>
							<br />
							{JSON.stringify(noLabelItems, null, 2)}
						</div>
						<div style={{marginBottom: "16px"}}>
							<strong>Tag List:</strong>
							<br />
							{JSON.stringify(tagListItems, null, 2)}
						</div>
						<div style={{marginBottom: "16px"}}>
							<strong>Tag List with Whitelist:</strong>
							<br />
							{JSON.stringify(tagListWithWhitelist, null, 2)}
						</div>
						<div style={{marginBottom: "16px"}}>
							<strong>Textarea List:</strong>
							<br />
							{JSON.stringify(textareaItems, null, 2)}
						</div>
						<div style={{marginBottom: "16px"}}>
							<strong>Address List:</strong>
							<br />
							{JSON.stringify(addressItems, null, 2)}
						</div>
						<div>
							<strong>Phone List:</strong>
							<br />
							{JSON.stringify(phoneItems, null, 2)}
						</div>
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
