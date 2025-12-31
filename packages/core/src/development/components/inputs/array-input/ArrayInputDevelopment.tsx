import React, {useState} from "react";

import './ArrayInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {ArrayInput} from "../../../../components/inputs/array-input/ArrayInput";
import {Address, Telephone} from "@blue-orange-ai/foundations-clients";

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
				<PaddedPage>
					<PageHeading>Array Input Editor</PageHeading>
					<div style={{display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px"}}>
						<ArrayInput
							label="Text Array (Required)"
							value={textItems}
							onChange={setTextItems}
							placeholder="Enter text..."
							required={true}
							help="This is a text array input with required flag"
						/>
						<ArrayInput
							label="Number Array"
							value={numberItems}
							onChange={setNumberItems}
							placeholder="Enter number..."
							isNumber={true}
							help="This is a number array input"
						/>
						<ArrayInput
							value={noLabelItems}
							onChange={setNoLabelItems}
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
							onChange={setTextareaItems}
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
				</PaddedPage>
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
