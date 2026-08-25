import React, {useState} from "react";

import './TagInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ColorPicker} from "../../../../components/inputs/color-picker/ColorPicker";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";
import {TagInputCallback} from "../../../../components/inputs/tags/fetch/TagInputCallback";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const DEMO_TAGS = ["Storage", "Dispatch"];

const DEMO_WHITELIST = ["Storage", "Dispatch", "Maintenance", "Fuel", "Transmission"];

const TAG_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "initialTags",
		type: "string[]",
		default: "[]",
		description: "The tags the field starts with."
	},
	{
		name: "whitelist",
		type: "string[]",
		default: "[]",
		description: "Values offered as suggestions while typing."
	},
	{
		name: "enforceWhitelist",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Refuses anything that is not on the whitelist."
	},
	{
		name: "blacklist",
		type: "string[]",
		default: "[]",
		description: "Values the field will not accept."
	},
	{
		name: "maxTags",
		type: "number",
		default: "100000",
		control: "slider",
		min: 1,
		max: 10,
		step: 1,
		value: 6,
		description: "How many tags can be added before the field stops taking them."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"Type to add tags\"",
		control: "text",
		description: "Shown while the field is empty."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Capabilities",
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
		type: "(tags: string[]) => void",
		description: "Fires with every tag in the field whenever one is added or removed."
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
	{
		name: "useWhitelist",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the field a whitelist of capabilities."
	},
	...validationProps("string[]")
];

interface Props {
}

export const TagInputDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [query, setQuery] = useState<string[]>(["William"]);
	const [callbackTags, setCallbackTags] = useState<string[]>([]);

	const mockFetchWhitelist = async (inputValue: string): Promise<string[]> => {
		await new Promise(resolve => setTimeout(resolve, 500));
		const allOptions = [
			"JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust", "Swift",
			"Kotlin", "PHP", "Scala", "Haskell", "Elixir", "Clojure", "Dart", "Lua", "Perl", "R"
		];
		return allOptions.filter(option =>
			option.toLowerCase().includes(inputValue.toLowerCase())
		);
	};

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Tag Input"
					description="A field that turns what is typed into tags. A whitelist offers suggestions — and, enforced, refuses anything not on it — while a blacklist rules values out."
					name="TagInput"
					previewHeight={200}
					previewCentered={false}
					props={TAG_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "460px"}}>
							<TagInput
								initialTags={DEMO_TAGS}
								whitelist={values.useWhitelist ? DEMO_WHITELIST : undefined}
								enforceWhitelist={values.enforceWhitelist}
								maxTags={values.maxTags}
								placeholder={values.placeholder}
								label={values.label}
								help={values.help}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></TagInput>
						</div>
					)}>
					<TagInput initialTags={query} onChange={setQuery}></TagInput>

					<div style={{marginTop: "40px"}}>
						<PageHeading>Tag Editor with Callback (Dynamic Whitelist)</PageHeading>
						<TagInputCallback
							placeholder="Type to search programming languages..."
							fetchWhitelist={mockFetchWhitelist}
							onChange={setCallbackTags}
						/>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>TagInput Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(query, null, 4)}
					</div>
					<div style={{marginTop: "20px", marginBottom: "20px"}}>TagInputCallback Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify(callbackTags, null, 4)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}