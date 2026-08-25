import React, {useState} from "react";

import './PassportTagInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {TagInputUsers} from "../../../../components/inputs/tags/users/TagInputUsers";
import {TagInputGroups} from "../../../../components/inputs/tags/groups/TagInputGroups";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const TAG_INPUT_USERS_PROPS: Array<PropSpec> = [
	{
		name: "initialUserIds",
		type: "string[]",
		default: "[]",
		description: "The people the field starts with, by id. Their names are looked up as it mounts."
	},
	{
		name: "maxTags",
		type: "number",
		default: "100000",
		control: "slider",
		min: 1,
		max: 10,
		step: 1,
		value: 5,
		description: "How many people can be added before the field stops taking them."
	},
	{
		name: "placeholder",
		type: "string",
		control: "text",
		value: "Search people…",
		description: "Shown while the field is empty."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Reviewers",
		description: "The label above the field."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "onChange",
		type: "(userIds: string[]) => void",
		description: "Fires with the ids of everyone in the field."
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
	...validationProps("string[]")
];

const TAG_INPUT_GROUPS_PROPS: Array<PropSpec> = [
	{
		name: "initialGroupIds",
		type: "string[]",
		default: "[]",
		description: "The groups the field starts with, by id."
	},
	{
		name: "maxTags",
		type: "number",
		default: "100000",
		control: "slider",
		min: 1,
		max: 10,
		step: 1,
		value: 5,
		description: "How many groups can be added."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"Search groups...\"",
		control: "text",
		description: "Shown while the field is empty."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Owning groups",
		description: "The label above the field."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "onChange",
		type: "(groupIds: string[]) => void",
		description: "Fires with the ids of every group in the field."
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
	...validationProps("string[]")
];

interface Props {
}

export const PassportTagInputDevelopment: React.FC<Props> = ({}) => {

	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Passport Tag Inputs"
					description="Tag fields that look people and groups up in Passport rather than taking free text. They report the ids they selected, so what comes back can be handed straight to an API."
					name="TagInputUsers"
					previewHeight={200}
					previewCentered={false}
					props={TAG_INPUT_USERS_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "460px"}}>
							<TagInputUsers
								maxTags={values.maxTags}
								placeholder={values.placeholder}
								label={values.label}
								help={values.help}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></TagInputUsers>
						</div>
					)}
					siblings={[
						{
							name: "TagInputGroups",
							description: "The same field over groups rather than people. It reports group ids.",
							props: TAG_INPUT_GROUPS_PROPS,
							previewHeight: 200,
							previewCentered: false,
							preview: values => (
								<div style={{width: "100%", maxWidth: "460px"}}>
									<TagInputGroups
										maxTags={values.maxTags}
										placeholder={values.placeholder}
										label={values.label}
										help={values.help}
										name={values.name}
										required={values.required}
										requiredMessage={values.requiredMessage}
										validateOnChange={values.validateOnChange}
										onChange={() => {}}></TagInputGroups>
								</div>
							)
						}
					]}>

					<FormHeading label="User Selection"></FormHeading>

					<div style={{marginTop: "20px"}}>
						<TagInputUsers
							label="Select Users"
							placeholder="Search for users..."
							onChange={setSelectedUserIds}
							help="Start typing to search for users from passport. Output is userIds."
						/>
					</div>

					<div style={{marginTop: "40px"}}>
						<TagInputUsers
							label="Limited Users (Max 3)"
							placeholder="Search for users..."
							maxTags={3}
							onChange={(userIds) => console.log("Limited users:", userIds)}
							help="You can select up to 3 users"
						/>
					</div>

					<div style={{marginTop: "60px"}}>
						<FormHeading label="Group Selection"></FormHeading>
					</div>

					<div style={{marginTop: "20px"}}>
						<TagInputGroups
							label="Select Groups"
							placeholder="Search for groups..."
							onChange={setSelectedGroupIds}
							help="Start typing to search for groups from passport. Output is groupIds."
						/>
					</div>

					<div style={{marginTop: "40px"}}>
						<TagInputGroups
							label="Limited Groups (Max 5)"
							placeholder="Search for groups..."
							maxTags={5}
							onChange={(groupIds) => console.log("Limited groups:", groupIds)}
							help="You can select up to 5 groups"
						/>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Selected User IDs:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(selectedUserIds, null, 4)}
					</div>
					<div style={{marginTop: "30px", marginBottom: "20px"}}>Selected Group IDs:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(selectedGroupIds, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
