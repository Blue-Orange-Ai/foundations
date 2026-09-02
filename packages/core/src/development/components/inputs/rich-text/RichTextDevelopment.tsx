import React, {useState} from "react";

import './RichTextDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {IRule, RuleEditor} from "../../../../components/rules/rule-editor/RuleEditor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {RichText} from "../../../../components/inputs/richtext/default/RichText";
import {Media} from "@blue-orange-ai/foundations-clients";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";
import {FormGroup} from "../../../../components/inputs/form-group/FormGroup";
import {FormActions} from "../../../../components/inputs/form-group/FormActions";
import {FormSubmitButton} from "../../../../components/inputs/form-group/FormSubmitButton";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const RICH_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "content",
		type: "string",
		control: "text",
		value: "<p>The depot reports every hour.</p>",
		description: "The starting content, as HTML."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		description: "Sits above the editor, and names the field in the message a failed requirement produces."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a tooltip beside the label."
	},
	{
		name: "placeholder",
		type: "string",
		control: "text",
		value: "Write a note…",
		description: "Shown while the editor is empty."
	},
	{
		name: "displayFormatting",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the formatting toolbar."
	},
	{
		name: "minEditorHeight",
		type: "number",
		default: "10",
		control: "slider",
		min: 10,
		max: 200,
		step: 10,
		description: "A floor under the editor's height, in pixels. It grows past it as content is added."
	},
	{
		name: "editorHeight",
		type: "number",
		control: "number",
		description: "Pins the editor to a fixed height instead of letting it grow."
	},
	{
		name: "singleLine",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Keeps the editor to one line, so enter can mean send rather than newline."
	},
	{
		name: "allowMentions",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turns @ into a people picker, and keeps the mention button in the footer."
	},
	{
		name: "allowEmojis",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turns : into an emoji picker, and keeps the emoji button in the footer."
	},
	{
		name: "allowFileUpload",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Keeps the attach button in the footer."
	},
	{
		name: "allowFormattingToggle",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Keeps the button that shows and hides the formatting toolbar."
	},
	{
		name: "focus",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Takes the caret when it turns on."
	},
	{
		name: "files",
		type: "Array<Media>",
		default: "[]",
		description: "Attachments the editor starts with."
	},
	{
		name: "uploadPermissions",
		type: "Array<MediaPermission>",
		description: "Who the media service should let at anything uploaded through the editor."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the editor out and stops it taking input."
	},
	{
		name: "clearState",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Change it to a new value to empty the editor — how a form resets it after a send."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Rendered inside the editor's frame, under the content — the send button usually goes here."
	},
	{
		name: "onChange",
		type: "(content: string, mentions: Array<string>, attachments: Array<Media>, filesUploading: boolean) => void",
		description: "Fires with the HTML, whoever was mentioned, whatever was attached, and whether an upload is still running."
	},
	{
		name: "onEnter",
		type: "() => void",
		description: "Fires when enter is pressed — what a single line editor sends on."
	},
	...validationProps()
];

interface Props {
}

export const RichTextDevelopment: React.FC<Props> = ({}) => {

	const startingState: RichTextState = {
		attachments: [],
		content: "",
		filesUploading: false,
		mentions: []
	}

	const generateContentStr = (state: RichTextState) => {
		return JSON.stringify(state, null, 2);
	}

	const [richTextContent, setRichTextContent] = useState(startingState);

	const [richTextContentStr, setRichTextContentStr] = useState(generateContentStr(startingState));

	const processChangeData = (content: string, mentions: string[], attachments: Media[], filesUploading: boolean) => {
		var state = richTextContent;
		state["content"] = content
		state["mentions"] = mentions
		state["attachments"] = attachments
		state["filesUploading"] = filesUploading
		setRichTextContent(state);
		setRichTextContentStr(generateContentStr(state));
	}

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Rich Text"
					description="The full editor: formatting, mentions, emojis and file attachments, built on tiptap. It reports its content as HTML together with the mentions and the media that went with it, and says whether any upload is still in flight. Give it a name and the demo puts it inside a FormGroup — which is what enforces required — so submitting it empty fails the field."
					name="RichText"
					previewHeight={280}
					previewCentered={false}
					props={RICH_TEXT_PROPS}
					preview={values => {
						const editor = (
							<RichText
								content={values.content}
								label={values.label}
								help={values.help}
								placeholder={values.placeholder}
								displayFormatting={values.displayFormatting}
								minEditorHeight={values.minEditorHeight}
								editorHeight={values.editorHeight}
								singleLine={values.singleLine}
								allowMentions={values.allowMentions}
								allowEmojis={values.allowEmojis}
								allowFileUpload={values.allowFileUpload}
								allowFormattingToggle={values.allowFormattingToggle}
								focus={values.focus}
								clearState={values.clearState}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></RichText>
						);
						// name is what registers the field with a form, so the demo only
						// grows one once there is a name to register under — which is also
						// the only thing that enforces required.
						return (
							<div style={{width: "100%"}}>
								{values.name
									? <FormGroup onSubmit={() => {}} paddingTop={0}>
										{editor}
										<FormActions>
											<FormSubmitButton text="Submit"></FormSubmitButton>
										</FormActions>
									</FormGroup>
									: editor}
							</div>
						);
					}}>
					<RichText
						minEditorHeight={10}
						content={richTextContent.content}
						files={richTextContent.attachments}
						onChange={processChangeData}></RichText>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{richTextContentStr}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}