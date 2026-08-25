import React, {useState} from "react";

import './ValidationDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {Input} from "../../../../components/inputs/input/Input";
import {TextArea} from "../../../../components/inputs/textarea/TextArea";
import {PhoneInput} from "../../../../components/inputs/phone/PhoneInput";
import {Dropdown} from "../../../../components/inputs/dropdown/basic/Dropdown";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {Toggle} from "../../../../components/inputs/toggle/Toggle";
import {InputValidateCallback, InputValidationResult} from "../../../../components/inputs/validation/InputValidation";
import {DropdownItemObj} from "../../../../components/interfaces/AppInterfaces";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {InputValidationMessage} from "../../../../components/inputs/validation/InputValidationMessage";

const VALIDATION_RESULT_INTERFACE = {
	name: "InputValidationResult",
	description: "What a validate callback resolves with. An error state blocks a FormGroup from submitting; a success state clears the field.",
	props: [
		{name: "state", type: "\"success\" | \"error\"", required: true, description: "Whether the value passed."},
		{name: "message", type: "string", description: "Plain text rendered under the input."},
		{name: "messageHtml", type: "string", description: "An html message, rendered through RenderHtml. It takes precedence over message."}
	] as Array<PropSpec>
};

const VALIDATE_CALLBACK_INTERFACE = {
	name: "InputValidateCallback<T>",
	description: "The signature every input's `validate` prop takes: (value: T) => Promise<InputValidationResult>. It is async, so a check can go to the server — a name that has to be unique, say — without the input having to know that it did.",
	props: [
		{name: "value", type: "T", required: true, description: "Whatever the input currently holds. T is the input's own value type — a string, a boolean, an array."}
	] as Array<PropSpec>
};

const VALIDATION_MESSAGE_PROPS: Array<PropSpec> = [
	{
		name: "result",
		type: "InputValidationResult | null",
		required: true,
		description: "The outcome to render. Null, or a result with no message, renders nothing — so it can be left in place unconditionally."
	},
	{
		name: "value",
		type: "string",
		control: "text",
		value: "Me",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — what the field starts with. Under three characters fails the check."
	},
	{
		name: "required",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — adds the required check in front of the custom one."
	},
	{
		name: "validateOnChange",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — runs the check on every keystroke rather than on blur."
	}
];

interface Props {
}

interface LogEntry {
	field: string;
	result: InputValidationResult;
}

/**
 * Small helper so validators sleep briefly — simulating an async server round
 * trip so the demos exercise the real promise flow, not an instant return.
 */
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ValidationDevelopment: React.FC<Props> = ({}) => {

	// ── Demo field state ───────────────────────────────────────────
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [phone, setPhone] = useState("");
	const [dropdownSelection, setDropdownSelection] = useState<string>("");
	const [terms, setTerms] = useState(false);
	const [marketing, setMarketing] = useState(false);

	// Rolling log of the most recent validation results, newest first.
	const [log, setLog] = useState<LogEntry[]>([]);

	const record = (field: string, result: InputValidationResult): InputValidationResult => {
		setLog((prev) => [{field, result}, ...prev].slice(0, 10));
		return result;
	};

	// ── Validators ─────────────────────────────────────────────────

	// Runs on blur (the default). Plain-text success / error message.
	const validateEmail: InputValidateCallback<string> = async (value) => {
		const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
		return record("Email (on blur)", valid
			? {state: "success", message: "That email address looks good."}
			: {state: "error", message: "Please enter a valid email address, e.g. name@company.com."});
	};

	// Runs on every keystroke (validateOnChange). Uses an HTML message so it is
	// rendered through the RenderHtml text decoration. It also simulates an async
	// availability check with a short delay.
	const validateUsername: InputValidateCallback<string> = async (value) => {
		if (value.length < 5) {
			const remaining = 5 - value.length;
			return record("Username (on keystroke)", {
				state: "error",
				messageHtml: `<span>Username must be at least 5 characters — <b>${remaining}</b> more to go.</span>`
			});
		}
		await delay(250); // pretend we hit a "is this username taken?" endpoint
		const taken = value.toLowerCase() === "admin";
		return record("Username (on keystroke)", taken
			? {state: "error", messageHtml: "<span>That username is already <b>taken</b>. Try another.</span>"}
			: {state: "success", messageHtml: "<span style=\"display:inline-flex;align-items:center;gap:4px;\"><i class=\"ri-checkbox-circle-fill\"></i> Nice — that username is available.</span>"});
	};

	// Runs on blur. Demonstrates an upper bound with a plain message.
	const validateBio: InputValidateCallback<string> = async (value) => {
		return record("Bio (on blur)", value.length > 120
			? {state: "error", message: `Keep it under 120 characters (currently ${value.length}).`}
			: {state: "success", message: "Looks good."});
	};

	// Composite input — PhoneInput hands the validator the combined phone string.
	const validatePhone: InputValidateCallback<string> = async (value) => {
		const digits = value.replace(/\D/g, "");
		return record("Phone (on blur)", digits.length >= 7
			? {state: "success", message: "Phone number accepted."}
			: {state: "error", message: "Please enter a full phone number."});
	};

	// Selection input — validates the chosen dropdown item.
	const validateDropdown: InputValidateCallback<DropdownItemObj> = async (item) => {
		return record("Plan (dropdown)", item && item.reference
			? {state: "success", message: `You selected "${item.label}".`}
			: {state: "error", message: "Please choose a plan."});
	};

	// Collection input — validates the list of tags.
	const validateTags: InputValidateCallback<string[]> = async (value) => {
		return record("Skills (tags)", value.length >= 2
			? {state: "success", message: `${value.length} skills added.`}
			: {state: "error", messageHtml: "<span>Add at least <b>two</b> skills.</span>"});
	};

	// Boolean input — a checkbox that must be ticked.
	const validateTerms: InputValidateCallback<boolean> = async (checked) => {
		return record("Terms (checkbox)", checked
			? {state: "success", message: "Thanks for accepting the terms."}
			: {state: "error", message: "You must accept the terms to continue."});
	};

	// Boolean input — a toggle that must be on.
	const validateMarketing: InputValidateCallback<boolean> = async (checked) => {
		return record("Notifications (toggle)", checked
			? {state: "success", message: "Notifications are on."}
			: {state: "error", message: "Turn notifications on to receive updates."});
	};

	// ── Code snippets for the documentation ────────────────────────
	const typeSnippet = `// A validate callback resolves with this shape:
interface InputValidationResult {
    state: "success" | "error";   // string enum — controls the error styling
    message?: string;             // plain text, rendered red on error
    messageHtml?: string;         // HTML, rendered via the RenderHtml decoration
}

// The prop every input now accepts:
type InputValidateCallback<T = string> =
    (value: T) => Promise<InputValidationResult>;`;

	const usageSnippet = `// Validates on blur (the default):
<Input
    label="Email"
    value={email}
    onChange={setEmail}
    validate={async (value) => {
        const ok = /.+@.+\\..+/.test(value);
        return ok
            ? { state: "success", message: "Looks good." }
            : { state: "error", message: "Enter a valid email." };
    }}
/>

// Opt into validating on every keystroke:
<Input
    label="Username"
    value={username}
    onChange={setUsername}
    validateOnChange
    validate={checkUsername}
/>`;

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Input Validation"
					description="How every input in the library checks itself. Give one a `validate` callback and it runs on blur — or on every keystroke with `validateOnChange` — and renders whatever it resolves with underneath. The same callback shape is what FormField and FormGroup speak in, so a check written once works standalone and in a form."
					name="InputValidationMessage"
					previewHeight={200}
					previewCentered={false}
					imports={["InputValidationResult"]}
					interfaces={[VALIDATION_RESULT_INTERFACE, VALIDATE_CALLBACK_INTERFACE]}
					props={VALIDATION_MESSAGE_PROPS}
					usage={values => "import {Input, InputValidateCallback, InputValidationResult} from \"@blue-orange-ai/foundations-core\";\n\nconst validateSiteName: InputValidateCallback<string> = async (value) => {\n\tif (value.trim().length < 3) {\n\t\treturn {state: \"error\", message: \"A site name needs at least three characters.\"};\n\t}\n\treturn {state: \"success\"};\n}\n\n<Input\n\tlabel={\"Site name\"}\n\tvalidate={validateSiteName}\n\tvalidateOnChange={" + Boolean(values.validateOnChange) + "}\n\trequired={" + Boolean(values.required) + "}></Input>"}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<Input
								label="Site name"
								value={values.value}
								required={values.required}
								validateOnChange={values.validateOnChange}
								validate={async (value: string) => value.trim().length < 3
									? {state: "error", message: "A site name needs at least three characters."}
									: {state: "success"}}></Input>
						</div>
					)}>


					<GeneralHeading>The <code>validate</code> prop</GeneralHeading>
					<Paragraph>
						<code>validate</code> is a function that receives the input's current value and returns a
						<code> Promise</code>. Because it is a promise you can do anything asynchronous inside it —
						call an API, check a username is free, debounce against a server — and the UI updates when the
						promise resolves. The value type matches the input: a <code>string</code> for text fields,
						<code> string[]</code> for tags, <code>boolean</code> for a checkbox or toggle, and the selected
						item for a dropdown.
					</Paragraph>
					<CodeBlock value={{code: typeSnippet, lang: "typescript", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>When it runs</GeneralHeading>
					<Paragraph>
						By default validation runs on the <b>blur</b> event — when the user leaves the field. Pass the
						optional <code>validateOnChange</code> prop to <b>also</b> run it on every keystroke / value
						change, which is useful for live availability checks or character counters. Blur validation
						always runs whenever a <code>validate</code> callback is present.
					</Paragraph>

					<GeneralHeading>The result object</GeneralHeading>
					<Paragraph>
						The promise resolves with an object whose <code>state</code> is the string <code>"success"</code>
						or <code>"error"</code>. On <code>"error"</code> the field gets a red outline and the label goes
						red. If <code>messageHtml</code> is present it is rendered with the RenderHtml text decoration
						(so you can include markup, icons or links); otherwise the plain <code>message</code> string is
						shown underneath in the state colour. The reds and greens come from CSS variables
						(<code>--blue-orange-light/dark-input-error-color</code> and friends) so they adapt to light and
						dark themes.
					</Paragraph>

					<GeneralHeading>Usage</GeneralHeading>
					<CodeBlock value={{code: usageSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>Live examples</GeneralHeading>
					<Paragraph>
						Try these — the panel on the right logs every result as it resolves. Leave a field (blur) or,
						where noted, type into it to trigger validation.
					</Paragraph>

					<div className="validation-demo-grid">

						<div className="validation-demo-item">
							<div className="validation-demo-title">Text · validates on blur</div>
							<Input
								label="Email"
								placeholder="name@company.com"
								value={email}
								onChange={setEmail}
								validate={validateEmail}
							></Input>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Text · validates on keystroke · HTML message</div>
							<Input
								label="Username"
								placeholder="Pick a username (try 'admin')"
								value={username}
								onChange={setUsername}
								validateOnChange={true}
								validate={validateUsername}
							></Input>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Text area · max length on blur</div>
							<TextArea
								label="Short bio"
								placeholder="Tell us about yourself…"
								value={bio}
								onChange={setBio}
								validate={validateBio}
							></TextArea>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Composite · phone number on blur</div>
							<PhoneInput
								label="Phone"
								onChange={(t) => setPhone(t.number ?? "")}
								validate={validatePhone}
							></PhoneInput>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Selection · dropdown must have a choice</div>
							<Dropdown
								label="Plan"
								placeholder="Choose a plan"
								onSelection={(item) => setDropdownSelection(item.label)}
								validate={validateDropdown}
							>
								<DropdownItemText label={"Starter"} value={"starter"} selected={false}></DropdownItemText>
								<DropdownItemText label={"Growth"} value={"growth"} selected={false}></DropdownItemText>
								<DropdownItemText label={"Enterprise"} value={"enterprise"} selected={false}></DropdownItemText>
							</Dropdown>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Collection · at least two tags</div>
							<TagInput
								label="Skills"
								placeholder="Add a skill and press enter"
								onChange={setTags}
								validate={validateTags}
							></TagInput>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Boolean · checkbox must be ticked</div>
							<div className="validation-demo-inline">
								<Checkbox
									checked={terms}
									onCheckboxChange={setTerms}
									validate={validateTerms}
								></Checkbox>
								<span>I accept the terms and conditions</span>
							</div>
						</div>

						<div className="validation-demo-item">
							<div className="validation-demo-title">Boolean · toggle must be on</div>
							<div className="validation-demo-inline">
								<Toggle
									checked={marketing}
									onChange={setMarketing}
									validate={validateMarketing}
								></Toggle>
								<span>Email notifications</span>
							</div>
						</div>

					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Validation results (newest first):</div>
					{log.length === 0 &&
						<div style={{opacity: 0.6, fontFamily: "monospace"}}>
							No validation has run yet. Interact with a field on the left.
						</div>
					}
					{log.map((entry, index) => (
						<div key={index} className={`validation-log-entry validation-log-entry-${entry.result.state}`}>
							<div className="validation-log-field">{entry.field}</div>
							<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.75rem"}}>
								{JSON.stringify(entry.result, null, 2)}
							</div>
						</div>
					))}
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
