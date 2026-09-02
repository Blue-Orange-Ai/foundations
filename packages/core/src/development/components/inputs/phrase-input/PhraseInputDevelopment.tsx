import React, {useState} from "react";

import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {PhraseInput} from "../../../../components/inputs/phrase/PhraseInput";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const PHRASE_PROPS: Array<PropSpec> = [
	{
		name: "phrase",
		type: "string",
		required: true,
		control: "text",
		value: "DELETE",
		description: "The phrase the user has to type out, and the phrase previewed in the field."
	},
	{
		name: "value",
		type: "string | null",
		control: "text",
		description: "What is in the field."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Type DELETE to confirm",
		description: "The label above the field."
	},
	{
		name: "placeholder",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Shown while the field is empty and the preview is not up."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "ignoreCase",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Matches the phrase whatever case it is typed in."
	},
	{
		name: "mismatchMessage",
		type: "string",
		control: "text",
		description: "Shown once a character has been typed that the phrase does not have."
	},
	{
		name: "incompleteMessage",
		type: "string",
		control: "text",
		description: "Shown on blur when what is typed matches so far but stops short of the phrase."
	},
	{
		name: "isInvalid",
		type: "boolean",
		control: "toggle",
		description: "Puts the field in its error state from the outside, for a failure the field cannot see itself."
	},
	{
		name: "disabled",
		type: "boolean",
		control: "toggle",
		description: "Greys the field out and stops it taking input."
	},
	{
		name: "focus",
		type: "boolean",
		control: "toggle",
		description: "Takes the caret when it turns on."
	},
	{
		name: "onChange",
		type: "(value: string) => void",
		description: "Fires on every keystroke."
	},
	{
		name: "onMatchChange",
		type: "(matched: boolean) => void",
		description: "Fires when the field starts, or stops, holding the phrase exactly — what a confirm button hangs off."
	},
	{
		name: "onInvalid",
		type: "(value: string) => void",
		description: "Fires the moment a wrong character lands and the preview is dropped."
	},
	{
		name: "focusIn",
		type: "() => void",
		description: "Fires when the field takes the caret."
	},
	{
		name: "focusOut",
		type: "() => void",
		description: "Fires when the field loses it."
	},
	{
		name: "enterEvent",
		type: "() => void",
		description: "Fires when enter is pressed in the field."
	},
	{
		name: "name",
		type: "string",
		control: "text",
		description: "Registers the input with a surrounding FormGroup under this key, which is what the group reports its value under."
	},
	{
		name: "required",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks the field as one that has to be filled in, and fails validation while it is empty."
	},
	{
		name: "requiredMessage",
		type: "string",
		control: "text",
		description: "Overrides the message shown when a required field is left empty."
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
	}
];

interface Props {
}

export const PhraseInputDevelopment: React.FC<Props> = ({}) => {

	const [typed, setTyped] = useState("");
	const [matched, setMatched] = useState(false);
	const [lastInvalid, setLastInvalid] = useState<string | null>(null);

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Phrase Input"
					description="A field that only accepts one answer: the phrase it is given. The phrase is previewed behind the caret and eaten away as it is typed correctly, and the moment a wrong character lands the preview is dropped and the field reports itself invalid. Unlike the other inputs it takes no validate callback — matching the phrase is the only thing it checks."
					name="PhraseInput"
					previewHeight={180}
					previewCentered={false}
					props={PHRASE_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<PhraseInput
								phrase={values.phrase}
								value={values.value}
								label={values.label}
								placeholder={values.placeholder}
								help={values.help}
								ignoreCase={values.ignoreCase}
								mismatchMessage={values.mismatchMessage}
								incompleteMessage={values.incompleteMessage}
								isInvalid={values.isInvalid}
								disabled={values.disabled}
								focus={values.focus}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}></PhraseInput>
						</div>
					)}>
					<div style={{width: "100%", maxWidth: "420px"}}>
						<PhraseInput
							phrase="delete this workspace"
							label="Type delete this workspace to confirm"
							ignoreCase={true}
							onChange={setTyped}
							onMatchChange={setMatched}
							onInvalid={setLastInvalid}></PhraseInput>
						<div style={{marginTop: "15px"}}>
							<Button text={"Delete workspace"} buttonType={ButtonType.DANGER} isDisabled={!matched}></Button>
						</div>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Output:</div>
					<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
						{JSON.stringify({typed: typed, matched: matched, lastInvalid: lastInvalid}, null, 2)}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
