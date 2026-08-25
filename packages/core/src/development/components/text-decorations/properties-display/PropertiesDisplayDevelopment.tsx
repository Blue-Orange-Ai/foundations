import React, {useState} from "react";

import './PropertiesDisplayDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Property, PropertiesDisplay} from "../../../../components/text-decorations/properties-display/PropertiesDisplay";
import {Tag} from "../../../../components/text-decorations/tag/Tag";
import {ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const DEMO_PROPERTIES: Property[] = [
	{label: "Name", value: "Ada Lovelace"},
	{label: "Email", value: "ada@blueorange.ai"},
	{label: "Department", value: "Engineering"},
	{label: "Location", value: "Melbourne, Australia"},
	{label: "Roles", value: ["Administrator", "Editor", "Reviewer", "Auditor", "Owner"]},
	{label: "Manager", value: undefined}
];

const PROPERTY_INTERFACE = {
	name: "Property",
	description: "One row in the block. The component level settings apply to every property unless the property overrides them itself.",
	props: [
		{name: "label", type: "string", required: true, description: "The name of the pair."},
		{name: "value", type: "PropertyValue", required: true, description: "Text, a node, or an array of either. Undefined, null and an empty array all fall back to emptyValue."},
		{name: "maxArrayItems", type: "number", description: "Overrides the component level maxArrayItems for this row only."},
		{name: "copyable", type: "boolean", description: "Overrides the component level copyable for this row only."},
		{name: "copyValue", type: "string", description: "Text placed on the clipboard instead of the rendered value. Ignored for array values."}
	] as Array<PropSpec>
};

const PROPERTIES_DISPLAY_PROPS: Array<PropSpec> = [
	{
		name: "properties",
		type: "Property[]",
		required: true,
		description: "The pairs to show, in the order they should be read."
	},
	{
		name: "orientation",
		type: "\"vertical\" | \"horizontal\"",
		default: "\"vertical\"",
		control: "select",
		options: [
			{label: "vertical", value: "vertical"},
			{label: "horizontal", value: "horizontal"}
		],
		description: "Vertical stacks the label above the value; horizontal puts them side by side."
	},
	{
		name: "columns",
		type: "number",
		default: "1",
		control: "slider",
		min: 1,
		max: 4,
		step: 1,
		description: "How many properties are laid out per row."
	},
	{
		name: "maxArrayItems",
		type: "number",
		default: "3",
		control: "slider",
		min: 1,
		max: 6,
		step: 1,
		description: "How many items of an array value are shown before the see more button appears."
	},
	{
		name: "seeMoreLabel",
		type: "string",
		default: "\"See more\"",
		control: "text",
		description: "What the see more button reads."
	},
	{
		name: "onSeeMore",
		type: "(property: Property) => void",
		description: "Fires with the property whose see more button was clicked."
	},
	{
		name: "emptyValue",
		type: "ReactNode",
		default: "\"-\"",
		control: "text",
		description: "Stands in for a value that is undefined, null or an empty array."
	},
	{
		name: "labelWidth",
		type: "string",
		default: "\"140px\"",
		control: "text",
		description: "How much room the label column takes when the orientation is horizontal."
	},
	{
		name: "copyable",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Makes every value copy itself on click. A single property can opt in or out with Property.copyable."
	},
	{
		name: "copyToast",
		type: "boolean | CopyToastOptions",
		default: "false",
		control: "toggle",
		description: "Raises a toast when a value is copied. True takes the defaults; an object overrides them."
	},
	{
		name: "copyIconOnly",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Leaves the value as plain selectable text and puts a copy icon beside it instead."
	},
	{
		name: "onCopy",
		type: "(value: string, property: Property) => void",
		description: "Fires with what was copied and the property it came from."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the block."
	}
];

interface Props {
}

export const PropertiesDisplayDevelopment: React.FC<Props> = ({}) => {

	const [lastSeeMore, setLastSeeMore] = useState<string>("");

	const [lastCopied, setLastCopied] = useState<string>("");

	const properties: Property[] = [
		{label: "Name", value: "Ada Lovelace"},
		{label: "Email", value: "ada@blueorange.ai"},
		{label: "Department", value: "Engineering"},
		{label: "Location", value: "Melbourne, Australia"},
		{label: "Roles", value: ["Administrator", "Editor", "Reviewer", "Auditor", "Owner"]},
		{label: "Manager", value: undefined}
	]

	const richProperties: Property[] = [
		{label: "Status", value: <Tag backgroundColor="#22c55e" textColor="white">Active</Tag>},
		{
			label: "Tags",
			value: [
				<Tag backgroundColor="#dbeafe" textColor="#1e40af">Internal</Tag>,
				<Tag backgroundColor="#dcfce7" textColor="#166534">Verified</Tag>,
				<Tag backgroundColor="#fef3c7" textColor="#92400e">Beta</Tag>,
				<Tag backgroundColor="#fee2e2" textColor="#991b1b">Legacy</Tag>
			],
			maxArrayItems: 2
		}
	]

	const copyableProperties: Property[] = [
		{label: "Name", value: "Ada Lovelace"},
		{label: "Email", value: "ada@blueorange.ai"},
		{label: "Record ID", value: "0d5f8b12...e4a9", copyValue: "0d5f8b12-4c3a-4f7e-9a11-77b6c0d2e4a9"},
		{label: "Department", value: "Engineering", copyable: false},
		{label: "Roles", value: ["Administrator", "Editor", "Reviewer", "Auditor", "Owner"]}
	]

	const onSeeMore = (property: Property) => {
		setLastSeeMore(`See more clicked for "${property.label}"`);
	}

	return (
		<ComponentDoc
			title="Properties Display"
			description="A block of label and value pairs — the detail panel beside a row, a summary at the top of a page. Values can be text, nodes or arrays, and an array longer than the limit collapses behind a see more button."
			name="PropertiesDisplay"
			previewHeight={260}
			previewCentered={false}
			imports={["Property"]}
			interfaces={[PROPERTY_INTERFACE]}
			props={PROPERTIES_DISPLAY_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<PropertiesDisplay
						properties={DEMO_PROPERTIES}
						orientation={values.orientation}
						columns={values.columns}
						maxArrayItems={values.maxArrayItems}
						seeMoreLabel={values.seeMoreLabel}
						emptyValue={values.emptyValue}
						labelWidth={values.labelWidth}
						copyable={values.copyable}
						copyToast={values.copyToast}
						copyIconOnly={values.copyIconOnly}></PropertiesDisplay>
				</div>
			)}>

			<GeneralHeading>Vertical - Single Column</GeneralHeading>
			<PropertiesDisplay properties={properties} onSeeMore={onSeeMore}></PropertiesDisplay>

			<GeneralHeading>Vertical - Three Columns</GeneralHeading>
			<PropertiesDisplay properties={properties} columns={3} onSeeMore={onSeeMore}></PropertiesDisplay>

			<GeneralHeading>Horizontal - Single Column</GeneralHeading>
			<PropertiesDisplay properties={properties} orientation="horizontal" onSeeMore={onSeeMore}></PropertiesDisplay>

			<GeneralHeading>Horizontal - Two Columns</GeneralHeading>
			<PropertiesDisplay
				properties={properties}
				orientation="horizontal"
				columns={2}
				onSeeMore={onSeeMore}
			></PropertiesDisplay>

			<GeneralHeading>Custom Array Limit</GeneralHeading>
			<PropertiesDisplay
				properties={properties}
				columns={2}
				maxArrayItems={1}
				seeMoreLabel="View all"
				onSeeMore={onSeeMore}
			></PropertiesDisplay>

			<GeneralHeading>Node Values</GeneralHeading>
			<PropertiesDisplay properties={richProperties} columns={2} onSeeMore={onSeeMore}></PropertiesDisplay>

			<GeneralHeading>Copyable Values</GeneralHeading>
			<Description>Every value copies on click and raises a toast. Individual properties opt out with
				<code> copyable: false</code>.</Description>
			<PropertiesDisplay
				properties={copyableProperties}
				orientation="horizontal"
				columns={2}
				copyable={true}
				copyToast={true}
				onCopy={(value, property) => setLastCopied(`Copied "${value}" from ${property.label}`)}
				onSeeMore={onSeeMore}
			></PropertiesDisplay>

			<GeneralHeading>Copyable - Icon Only</GeneralHeading>
			<Description>The value stays plain selectable text and a copy icon sits beside it.</Description>
			<PropertiesDisplay
				properties={copyableProperties}
				orientation="horizontal"
				columns={2}
				copyable={true}
				copyIconOnly={true}
				copyToast={true}
				onCopy={(value, property) => setLastCopied(`Copied "${value}" from ${property.label}`)}
				onSeeMore={onSeeMore}
			></PropertiesDisplay>

			<GeneralHeading>Copyable Opt In Per Property</GeneralHeading>
			<Description>Only the properties marked <code>copyable</code> are clickable.</Description>
			<PropertiesDisplay
				properties={[
					{label: "Name", value: "Ada Lovelace"},
					{label: "Record ID", value: "0d5f8b12-4c3a-4f7e-9a11-77b6c0d2e4a9", copyable: true},
					{label: "Department", value: "Engineering"}
				]}
				columns={3}
				copyToast={{location: ToastLocation.CENTRE_TOP, heading: "Record ID copied"}}
				onCopy={(value, property) => setLastCopied(`Copied "${value}" from ${property.label}`)}
			></PropertiesDisplay>

			<GeneralHeading>Callback Output</GeneralHeading>
			<div className="properties-display-development-callback">{lastSeeMore || "No see more clicked yet."}</div>
			<div className="properties-display-development-callback">{lastCopied || "Nothing copied yet."}</div>
		</ComponentDoc>
	)
}
