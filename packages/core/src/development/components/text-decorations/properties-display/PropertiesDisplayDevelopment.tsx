import React, {useState} from "react";

import './PropertiesDisplayDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Property, PropertiesDisplay} from "../../../../components/text-decorations/properties-display/PropertiesDisplay";
import {Tag} from "../../../../components/text-decorations/tag/Tag";
import {ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";

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
		<PaddedPage>
			<PageHeading>Properties Display</PageHeading>
			<Description>Displays key value pairs vertically or horizontally across a configurable number of
				columns. Array values are comma joined and truncated with a see more button.</Description>

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
		</PaddedPage>
	)
}
