import React, {useState} from "react";

import './RichTextPromptDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {Media} from "@blue-orange-ai/foundations-clients";
import {RichTextPrompt} from "../../../../components/inputs/richtext/prompt/RichTextPrompt";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

interface RichTextState {
	content: string,
	mentions: string[],
	attachments: Media[],
	filesUploading: boolean
}

const RICH_TEXT_PROMPT_PROPS: Array<PropSpec> = [
	{
		name: "content",
		type: "string",
		control: "text",
		description: "The starting content, as HTML."
	},
	{
		name: "placeholder",
		type: "string",
		control: "text",
		value: "Add a comment…",
		description: "Shown while the prompt is empty."
	},
	{
		name: "allowMentions",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turns @ into a people picker."
	},
	{
		name: "allowEmojis",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turns : into an emoji picker."
	},
	{
		name: "showClose",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a close button beside send — for a prompt that was opened to reply to something."
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
		description: "Attachments the prompt starts with."
	},
	{
		name: "uploadPermissions",
		type: "Array<MediaPermission>",
		description: "Who the media service should let at anything uploaded through the prompt."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the prompt out and stops it taking input."
	},
	{
		name: "clearState",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Change it to a new value to empty the prompt after a send."
	},
	{
		name: "onChange",
		type: "(content: string, mentions: Array<string>, attachments: Array<Media>, filesUploading: boolean) => void",
		description: "Fires with the HTML, whoever was mentioned, whatever was attached, and whether an upload is still running."
	},
	{
		name: "onSend",
		type: "() => void",
		description: "Fires when the send button is used."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires when the close button is used."
	}
];

interface Props {
}

export const RichTextPromptDevelopment: React.FC<Props> = ({}) => {

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
					title="Rich Text Prompt"
					description="The editor as a prompt bar — the comment box at the foot of a thread, the message box in a chat. It keeps the mentions, the emojis and the attachments but drops the formatting toolbar for a send button."
					name="RichTextPrompt"
					previewHeight={240}
					previewCentered={false}
					props={RICH_TEXT_PROMPT_PROPS}
					preview={values => (
						<div style={{width: "100%"}}>
							<RichTextPrompt
								content={values.content}
								placeholder={values.placeholder}
								allowMentions={values.allowMentions}
								allowEmojis={values.allowEmojis}
								showClose={values.showClose}
								disabled={values.disabled}
								onChange={() => {}}></RichTextPrompt>
						</div>
					)}>
					<RichTextPrompt
						placeholder={"Add comment ..."}
						content={richTextContent.content}
						files={richTextContent.attachments}
						onChange={processChangeData}
						onSend={() => console.log("Send Event Received")}
					></RichTextPrompt>
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