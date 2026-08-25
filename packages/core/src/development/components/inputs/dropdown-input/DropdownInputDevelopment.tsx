import React, {useState} from "react";

import './DropdownInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {DateInput} from "../../../../components/inputs/date/datepicker/inputs/dateinput/DateInput";
import {Dropdown} from "../../../../components/inputs/dropdown/basic/Dropdown";
import {DropdownItem} from "../../../../components/inputs/dropdown/items/DropdownItem/DropdownItem";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {DropdownItemIcon} from "../../../../components/inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";
import {
	DropdownItemHeading
} from "../../../../components/inputs/dropdown/items/DropdownItemHeading/DropdownItemHeading";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const DROPDOWN_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The rows — DropdownItemText, DropdownItemIcon, DropdownItemImage, DropdownItemHeading."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"No items selected...\"",
		control: "text",
		description: "Shown while nothing is selected."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Site",
		description: "The label above the field."
	},
	{
		name: "filter",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a search box above the rows."
	},
	{
		name: "allowMultipleSelection",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets more than one row be ticked at a time."
	},
	{
		name: "closeOnClick",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Closes the popup as soon as a row is picked. Turn it off for a multiple selection."
	},
	{
		name: "contextWidth",
		type: "number | string",
		control: "text",
		description: "Width of the popup. Left off it follows the width of the field."
	},
	{
		name: "contextMaxHeight",
		type: "number",
		control: "number",
		description: "How tall the popup gets before it scrolls."
	},
	{
		name: "disabled",
		type: "boolean",
		control: "toggle",
		description: "Greys the field out and stops it opening."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "onSelection",
		type: "(item: DropdownItemObj) => void",
		description: "Fires with the row that was picked."
	},
	{
		name: "onItemsSelected",
		type: "(items: Array<DropdownItemObj>) => void",
		description: "Fires with every selected row — the one to use with multiple selection."
	},
	{
		name: "onUpdate",
		type: "(items: Array<DropdownItemObj>) => void",
		description: "Fires whenever the set of rows changes."
	},
	{
		name: "onVisibilityChange",
		type: "(visible: boolean) => void",
		description: "Fires whenever the popup opens or closes."
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
	...validationProps("DropdownItemObj")
];

interface Props {
}

export const DropdownInputDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [query, setQuery] = useState<Date>(new Date());


	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Dropdown"
					description="A select built from rows rather than options, so an item can carry an icon, an image or a heading. It filters, it can take more than one selection at a time, and it reports the whole item rather than just its value."
					name="Dropdown"
					previewHeight={200}
					previewCentered={false}
					imports={["DropdownItemText", "DropdownItemIcon", "DropdownItemHeading"]}
					props={DROPDOWN_PROPS}
					snippetChildren={() => "<DropdownItemHeading label={\"Sites\"} value={\"heading\"} selected={false}></DropdownItemHeading>\n<DropdownItemText label={\"Melbourne Depot\"} value={\"melbourne\"} selected={false}></DropdownItemText>\n<DropdownItemIcon src={\"ri-flashlight-line\"} label={\"Ballarat Substation\"} value={\"ballarat\"} selected={false}></DropdownItemIcon>"}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<Dropdown
								label={values.label}
								placeholder={values.placeholder}
								filter={values.filter}
								allowMultipleSelection={values.allowMultipleSelection}
								closeOnClick={values.closeOnClick}
								contextWidth={values.contextWidth}
								contextMaxHeight={values.contextMaxHeight}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}>
								<DropdownItemHeading label={"Sites"} value={"heading"} selected={false}></DropdownItemHeading>
								<DropdownItemText label={"Melbourne Depot"} value={"melbourne"} selected={false}></DropdownItemText>
								<DropdownItemText label={"Geelong Yard"} value={"geelong"} selected={false}></DropdownItemText>
								<DropdownItemIcon src={"ri-flashlight-line"} label={"Ballarat Substation"} value={"ballarat"} selected={false}></DropdownItemIcon>
							</Dropdown>
						</div>
					)}>
					<Dropdown>
						<DropdownItemHeading label={"Title Item"} value={"heading"} selected={false}></DropdownItemHeading>
						<DropdownItemText label={"Plain Text"} value={"plain-text"} selected={true}></DropdownItemText>
						<DropdownItemIcon src={"ri-link"} label={"Icon dropdown item"} value={"icon-text"} selected={true}></DropdownItemIcon>
					</Dropdown>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{query.toISOString()}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}