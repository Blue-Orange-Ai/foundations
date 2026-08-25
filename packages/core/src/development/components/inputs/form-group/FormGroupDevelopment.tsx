import React, {useState} from "react";

import './FormGroupDevelopment.css'
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
import {Checkbox} from "../../../../components/inputs/checkbox/Checkbox";
import {Dropdown} from "../../../../components/inputs/dropdown/basic/Dropdown";
import {DropdownItemText} from "../../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {TagInput} from "../../../../components/inputs/tags/simple/TagInput";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {InputValidationResult} from "../../../../components/inputs/validation/InputValidation";
import {FormGroup, FormActionsAlignment} from "../../../../components/inputs/form-group/FormGroup";
import {FormSection} from "../../../../components/inputs/form-group/FormSection";
import {FormRow} from "../../../../components/inputs/form-group/FormRow";
import {FormField} from "../../../../components/inputs/form-group/FormField";
import {FormActions} from "../../../../components/inputs/form-group/FormActions";
import {FormSubmitButton} from "../../../../components/inputs/form-group/FormSubmitButton";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {FormRowAlignment} from "../../../../components/inputs/form-group/FormRow";

const FORM_GROUP_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The rows, sections and actions that make up the form."
	},
	{
		name: "error",
		type: "InputValidationResult | null",
		description: "A message rendered at the foot of the form, for a failure the form cannot see itself — a rejected submission, say. Plain text and html both work."
	},
	{
		name: "summaryMessage",
		type: "string",
		control: "text",
		description: "Shown when one or more fields fail validation on submit."
	},
	{
		name: "summaryMessageHtml",
		type: "string",
		description: "The html variant of that message. It takes precedence over summaryMessage."
	},
	{
		name: "showSummary",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turn off to stop the group rendering its own summary when fields fail."
	},
	{
		name: "onSubmit",
		type: "(values: Record<string, any>) => void | Promise<void>",
		description: "Called with the values of every registered field once validation passes. Return a promise and the submit button waits on it."
	},
	{
		name: "onValidationFailed",
		type: "(errors: Array<FormFieldError>) => void",
		description: "Called with the failing fields when a submission is blocked."
	},
	{
		name: "verticalMargin",
		type: "number",
		default: "10",
		control: "slider",
		min: 0,
		max: 40,
		step: 2,
		description: "Space between each row of the body."
	},
	{
		name: "paddingTop",
		type: "number",
		default: "10",
		control: "number",
		description: "Space above the body."
	},
	{
		name: "paddingBottom",
		type: "number",
		default: "10",
		control: "number",
		description: "Space below it."
	},
	{
		name: "actionsAlignment",
		type: "FormActionsAlignment",
		default: "FormActionsAlignment.RIGHT",
		defaultValue: FormActionsAlignment.RIGHT,
		control: "select",
		options: [
			{label: "Right", value: FormActionsAlignment.RIGHT, code: "FormActionsAlignment.RIGHT"},
			{label: "Left", value: FormActionsAlignment.LEFT, code: "FormActionsAlignment.LEFT"},
			{label: "Center", value: FormActionsAlignment.CENTER, code: "FormActionsAlignment.CENTER"},
			{label: "Space between", value: FormActionsAlignment.SPACE_BETWEEN, code: "FormActionsAlignment.SPACE_BETWEEN"}
		],
		description: "Where the buttons sit along the foot of the form."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the form."
	}
];

const FORM_FIELD_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The input this field wraps."
	},
	{
		name: "name",
		type: "string",
		required: true,
		control: "text",
		value: "name",
		description: "The key the value is reported under in the object handed to onSubmit."
	},
	{
		name: "value",
		type: "any",
		description: "The current value of the wrapped component, where the field cannot read it itself."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Name",
		description: "A readable name, used in the default required message."
	},
	{
		name: "required",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Blocks submission while the value is empty."
	},
	{
		name: "requiredMessage",
		type: "string",
		control: "text",
		description: "Overrides that message."
	},
	{
		name: "requiredMessageHtml",
		type: "string",
		description: "The html variant of it."
	},
	{
		name: "validate",
		type: "InputValidateCallback<any>",
		description: "A check of your own, run after the required check passes."
	},
	{
		name: "validateOnChange",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Re-runs that check on every change, not only on blur and submit."
	},
	{
		name: "validateOnBlur",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turn off to validate only on submit."
	},
	{
		name: "showMessage",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turn off where the wrapped component renders its own validation message."
	},
	{
		name: "onValidation",
		type: "(result: InputValidationResult | null) => void",
		description: "Fires with the outcome each time the field is checked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the field."
	}
];

const FORM_ROW_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The fields in the row."
	},
	{
		name: "columns",
		type: "Array<number | string>",
		description: "Sizes each child in turn. A number is a share of the row — 2 takes twice the space of 1 — and a string is a fixed width. Children without an entry share what is left."
	},
	{
		name: "gap",
		type: "number",
		default: "10",
		control: "slider",
		min: 0,
		max: 40,
		step: 2,
		description: "Horizontal space between the fields."
	},
	{
		name: "minFieldWidth",
		type: "number",
		default: "180",
		control: "slider",
		min: 80,
		max: 400,
		step: 10,
		description: "The narrowest a field is allowed to get before the row wraps."
	},
	{
		name: "wrap",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Turn off to keep every field on one line however little room there is."
	},
	{
		name: "alignment",
		type: "FormRowAlignment",
		default: "FormRowAlignment.TOP",
		defaultValue: FormRowAlignment.TOP,
		control: "select",
		options: [
			{label: "Top", value: FormRowAlignment.TOP, code: "FormRowAlignment.TOP"},
			{label: "Center", value: FormRowAlignment.CENTER, code: "FormRowAlignment.CENTER"},
			{label: "Bottom", value: FormRowAlignment.BOTTOM, code: "FormRowAlignment.BOTTOM"}
		],
		description: "How fields of different heights line up against each other."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the row."
	}
];

const FORM_SECTION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The rows in the section."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Contact details",
		description: "The heading above the section."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "How we reach the site.",
		description: "Supporting copy under the heading."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the heading with this text behind it."
	},
	{
		name: "verticalMargin",
		type: "number",
		default: "10",
		control: "slider",
		min: 0,
		max: 40,
		step: 2,
		description: "Space between each row of the section."
	},
	{
		name: "divider",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Draws a rule above the section."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the section."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the heading."
	}
];

const FORM_SUBMIT_BUTTON_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: "Save",
		description: "The button's label."
	},
	{
		name: "buttonType",
		type: "ButtonType",
		default: "ButtonType.PRIMARY",
		defaultValue: ButtonType.PRIMARY,
		control: "select",
		options: [
			{label: "Primary", value: ButtonType.PRIMARY, code: "ButtonType.PRIMARY"},
			{label: "Secondary", value: ButtonType.SECONDARY, code: "ButtonType.SECONDARY"},
			{label: "Success", value: ButtonType.SUCCESS, code: "ButtonType.SUCCESS"},
			{label: "Danger", value: ButtonType.DANGER, code: "ButtonType.DANGER"}
		],
		description: "Which treatment the button wears."
	},
	{
		name: "size",
		type: "ButtonSize",
		description: "Small, medium or large."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class drawn beside the label."
	},
	{
		name: "iconPos",
		type: "ButtonIconPos",
		description: "Which side of the label it sits on."
	},
	{
		name: "tooltip",
		type: "string",
		control: "text",
		description: "Text shown on hover."
	},
	{
		name: "classes",
		type: "string",
		control: "text",
		description: "Extra class names put on the button."
	},
	{
		name: "isDisabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the button out and stops it submitting."
	},
	{
		name: "isLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Forces the loading state on. The button also loads by itself while the form submits."
	},
	{
		name: "isSuccess",
		type: "boolean",
		control: "toggle",
		description: "Shows the tick."
	},
	{
		name: "isError",
		type: "boolean",
		control: "toggle",
		description: "Shows the cross."
	},
	{
		name: "onSubmitted",
		type: "(result: FormGroupSubmitResult) => void",
		description: "Called with the outcome once the submission finishes."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the button."
	}
];

const FORM_ACTIONS_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The buttons at the foot of the form."
	}
];

interface Props {
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const FormGroupDevelopment: React.FC<Props> = ({}) => {

	// ── Demo field state ───────────────────────────────────────────
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [seats, setSeats] = useState("");
	const [line1, setLine1] = useState("");
	const [city, setCity] = useState("");
	const [postcode, setPostcode] = useState("");
	const [notes, setNotes] = useState("");
	const [terms, setTerms] = useState(false);

	// The dynamic form level message — anything the caller wants at the bottom.
	const [formError, setFormError] = useState<InputValidationResult | null>(null);

	const [submitted, setSubmitted] = useState<Record<string, any> | null>(null);

	const handleSubmit = async (values: Record<string, any>) => {
		setFormError(null);
		await delay(600); // pretend we are posting to a server
		if (values.email && String(values.email).endsWith("@example.com")) {
			// A server side failure rendered as html at the bottom of the form.
			setFormError({
				state: "error",
				messageHtml: "<span><b>We could not save this.</b> The domain <code>example.com</code> is blocked — " +
					"<a href=\"#\">use a work address</a> instead.</span>"
			});
			return;
		}
		setSubmitted(values);
	};

	// ── Code snippets ──────────────────────────────────────────────
	const structureSnippet = `<FormGroup onSubmit={save} error={formError}>

    <FormSection label="Contact" description="How we reach you">
        <FormRow>                                  {/* side by side, wraps when tight */}
            <Input name="firstName" label="First name" value={firstName} onChange={setFirstName} required/>
            <Input name="lastName" label="Last name" value={lastName} onChange={setLastName} required/>
        </FormRow>
        <Input name="email" label="Email" value={email} onChange={setEmail} required validate={checkEmail}/>
    </FormSection>

    <FormActions>                                  {/* any number of buttons */}
        <Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={cancel}/>
        <FormSubmitButton text="Save"/>
    </FormActions>

</FormGroup>`;

	const errorSnippet = `// Plain text
setFormError({state: "error", message: "We could not save this."});

// Or html — rendered through the RenderHtml decoration
setFormError({
    state: "error",
    messageHtml: "<span><b>Failed.</b> <a href='/help'>What now?</a></span>"
});

// Clear it
setFormError(null);`;

	const columnsSnippet = `<FormRow columns={[2, 1, "160px"]}>
    <Input name="line1" label="Address" .../>      {/* twice the space  */}
    <Input name="city" label="City" .../>          {/* even share       */}
    <Input name="postcode" label="Postcode" .../>  {/* fixed 160px      */}
</FormRow>`;

	const fieldSnippet = `// Only needed for something that is not an input from this library.
<FormField name="terms" label="The terms" value={terms} required
           requiredMessage="You must accept the terms to continue.">
    <div className="my-inline-row">
        <Checkbox checked={terms} onCheckboxChange={setTerms}/>
        <span>I accept the terms and conditions</span>
    </div>
</FormField>`;

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Form Group"
					description="The form itself. Fields register with it by name, it validates them all on submit, and hands their values over as one object. FormRow lays them out, FormSection groups them, and FormSubmitButton drives the submission and shows how it went."
					name="FormGroup"
					previewHeight={320}
					previewCentered={false}
					imports={["FormField", "FormRow", "FormActions", "FormSubmitButton", "FormActionsAlignment"]}
					props={FORM_GROUP_PROPS}
					snippetChildren={() => "<FormRow>\n\t<FormField name={\"name\"} label={\"Name\"} required={true}>\n\t\t<Input label={\"Name\"}></Input>\n\t</FormField>\n\t<FormField name={\"email\"} label={\"Email\"}>\n\t\t<Input label={\"Email\"} isEmail={true}></Input>\n\t</FormField>\n</FormRow>\n<FormActions>\n\t<FormSubmitButton text={\"Save\"}></FormSubmitButton>\n</FormActions>"}
					preview={values => (
						<div style={{width: "100%", maxWidth: "560px"}}>
							<FormGroup
								verticalMargin={values.verticalMargin}
								paddingTop={values.paddingTop}
								paddingBottom={values.paddingBottom}
								actionsAlignment={values.actionsAlignment}
								showSummary={values.showSummary}
								summaryMessage={values.summaryMessage}
								onSubmit={() => {}}>
								<FormRow>
									<FormField name="name" label="Name" required={true}>
										<Input label="Name"></Input>
									</FormField>
									<FormField name="email" label="Email">
										<Input label="Email" isEmail={true}></Input>
									</FormField>
								</FormRow>
								<FormActions>
									<FormSubmitButton text="Save"></FormSubmitButton>
								</FormActions>
							</FormGroup>
						</div>
					)}
					siblings={[
						{
							name: "FormField",
							description: "Registers one input with the form. It carries the name the value is reported under, the required check, and — unless the input renders its own — the validation message.",
							props: FORM_FIELD_PROPS,
							previewHeight: 200,
							previewCentered: false,
							imports: ["FormGroup"],
							snippetChildren: () => "<Input label={\"Name\"}></Input>",
							preview: values => (
								<div style={{width: "100%", maxWidth: "460px"}}>
									<FormGroup>
										<FormField
											name={values.name}
											label={values.label}
											required={values.required}
											requiredMessage={values.requiredMessage}
											validateOnChange={values.validateOnChange}
											validateOnBlur={values.validateOnBlur}
											showMessage={values.showMessage}>
											<Input label={values.label}></Input>
										</FormField>
									</FormGroup>
								</div>
							)
						},
						{
							name: "FormRow",
							description: "Lays a run of fields across the form. `columns` sizes each one in turn, and the row wraps rather than squeezing a field below the width it needs.",
							props: FORM_ROW_PROPS,
							previewHeight: 200,
							previewCentered: false,
							imports: ["FormGroup", "FormField"],
							snippetChildren: () => "<FormField name={\"name\"}>\n\t<Input label={\"Name\"}></Input>\n</FormField>\n<FormField name={\"email\"}>\n\t<Input label={\"Email\"}></Input>\n</FormField>",
							preview: values => (
								<div style={{width: "100%", maxWidth: "520px"}}>
									<FormGroup>
										<FormRow
											gap={values.gap}
											minFieldWidth={values.minFieldWidth}
											wrap={values.wrap}
											alignment={values.alignment}>
											<FormField name="name"><Input label="Name"></Input></FormField>
											<FormField name="email"><Input label="Email"></Input></FormField>
										</FormRow>
									</FormGroup>
								</div>
							)
						},
						{
							name: "FormSection",
							description: "A titled block of rows, with an optional rule above it — how a long form is broken into parts that read as parts.",
							props: FORM_SECTION_PROPS,
							previewHeight: 240,
							previewCentered: false,
							imports: ["FormGroup", "FormField"],
							snippetChildren: () => "<FormField name={\"name\"}>\n\t<Input label={\"Name\"}></Input>\n</FormField>",
							preview: values => (
								<div style={{width: "100%", maxWidth: "520px"}}>
									<FormGroup>
										<FormSection
											label={values.label}
											description={values.description}
											help={values.help}
											divider={values.divider}
											verticalMargin={values.verticalMargin}>
											<FormField name="name"><Input label="Name"></Input></FormField>
										</FormSection>
									</FormGroup>
								</div>
							)
						},
						{
							name: "FormSubmitButton",
							description: "The button that submits the form. It loads while the submission runs and reports the outcome, so a form does not have to hold that state itself.",
							props: FORM_SUBMIT_BUTTON_PROPS,
							previewHeight: 160,
							previewCentered: false,
							imports: ["FormGroup", "FormActions"],
							preview: values => (
								<div style={{width: "100%", maxWidth: "460px"}}>
									<FormGroup onSubmit={() => {}}>
										<FormActions>
											<FormSubmitButton
												text={values.text}
												buttonType={values.buttonType}
												icon={values.icon}
												isDisabled={values.isDisabled}
												isLoading={values.isLoading}></FormSubmitButton>
										</FormActions>
									</FormGroup>
								</div>
							)
						},
						{
							name: "FormActions",
							description: "Marks the buttons at the foot of the form, so the group can align them together.",
							props: FORM_ACTIONS_PROPS,
							previewHeight: 140,
							previewCentered: false,
							snippetChildren: () => "<FormSubmitButton text={\"Save\"}></FormSubmitButton>",
							preview: () => (<span style={{opacity: 0.7, fontSize: "0.875rem"}}>A wrapper the group reads — see the demo above.</span>)
						}
					]}>


					<GeneralHeading>Structure</GeneralHeading>
					<Paragraph>
						<code>FormSection</code> groups related inputs under a heading. <code>FormRow</code> places its
						children side by side and wraps them onto a new line when there is not enough space. Anything
						inside <code>FormActions</code> is pulled out and rendered in the action bar at the bottom.
						Everything else is rendered in the body in the order you wrote it.
					</Paragraph>
					<CodeBlock value={{code: structureSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>Inputs join the form themselves</GeneralHeading>
					<Paragraph>
						There is no wrapper component and nothing to repeat. Give any input in this library a
						<code> name</code> and it registers itself with the surrounding group through context — the
						group then enforces that input's existing <code>required</code> flag, runs its existing
						<code> validate</code> callback and reads its value on submission. The
						<code> label</code> it already renders is reused for the message. Outside a form group an input
						behaves exactly as it always has, so this changes nothing for existing code.
					</Paragraph>
					<Paragraph>
						<code>onSubmit</code> receives an object keyed by each input's <code>name</code>. Submission is
						blocked until everything passes, and inputs that unmount (a conditional branch, a step that is
						no longer shown) drop out of the form automatically.
					</Paragraph>

					<GeneralHeading>Requirements and validation</GeneralHeading>
					<Paragraph>
						<code>required</code> runs first and treats blank strings, empty arrays, empty objects,
						<code> null</code> and <code>false</code> as empty, so it works for text fields, tags,
						dropdowns and checkboxes alike. Pass <code>requiredMessage</code> to override the default
						wording. Only if that passes does the <code>validate</code> callback run — the same async
						callback documented on the Validation page, resolving with a <code>state</code> of
						<code> "success"</code> or <code>"error"</code> plus a <code>message</code> or
						<code> messageHtml</code>. It runs on blur, on submission, and on every change when
						<code> validateOnChange</code> is set.
					</Paragraph>

					<GeneralHeading>Sizing fields in a row</GeneralHeading>
					<Paragraph>
						Fields share a row evenly by default and wrap once they can no longer hold
						<code> minFieldWidth</code>. Pass <code>columns</code> to size them: a number is a share of the
						row, a string is a fixed css width.
					</Paragraph>
					<CodeBlock value={{code: columnsSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>The form level message</GeneralHeading>
					<Paragraph>
						The <code>error</code> prop renders a dynamic message directly above the buttons and accepts
						plain text or html. It is a normal prop, so it can be swapped at any time — typically after a
						server rejects a submission. When inputs fail their own validation the group also renders a
						short summary in the same place, which the <code>error</code> prop overrides while it is set
						(pass <code>showSummary=&#123;false&#125;</code> to turn the summary off entirely).
					</Paragraph>
					<CodeBlock value={{code: errorSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>FormField — the escape hatch</GeneralHeading>
					<Paragraph>
						<code>FormField</code> exists for the things this library does not provide: a third party
						component, or a composition of your own that needs a single requirement across it. It wraps
						any children, never inspects them, and takes the same <code>name</code>,
						<code> value</code>, <code>required</code> and <code>validate</code> props the inputs do. You
						do not need it for the inputs in this library.
					</Paragraph>
					<CodeBlock value={{code: fieldSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>Live example</GeneralHeading>
					<Paragraph>
						Submit with fields empty to see the requirement checks and the summary. Enter an email ending
						in <code>@example.com</code> to see a server side html error at the bottom. Narrow the window
						to watch the rows wrap.
					</Paragraph>

					<div className="form-group-demo-cont">
						<FormGroup
							onSubmit={handleSubmit}
							error={formError}
							onValidationFailed={() => setSubmitted(null)}>

							<FormSection label="Contact" description="How we get hold of you.">
								<FormRow>
									<Input
										name="firstName"
										label="First name"
										value={firstName}
										onChange={setFirstName}
										required={true}></Input>
									<Input
										name="lastName"
										label="Last name"
										value={lastName}
										onChange={setLastName}
										required={true}></Input>
								</FormRow>
								<Input
									name="email"
									label="Email"
									placeholder="name@company.com"
									value={email}
									onChange={setEmail}
									required={true}
									validate={async (value) => (
										/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
											? {state: "success"}
											: {state: "error", message: "Enter a valid email address, e.g. name@company.com."}
									)}></Input>
							</FormSection>

							<FormSection label="Subscription" divider={true}>
								<FormRow columns={[1, "140px"]}>
									<Dropdown
										name="plan"
										label="Plan"
										placeholder="Choose a plan"
										required={true}
										requiredMessage="Pick a plan to continue.">
										<DropdownItemText label={"Starter"} value={"starter"} selected={false}></DropdownItemText>
										<DropdownItemText label={"Growth"} value={"growth"} selected={false}></DropdownItemText>
										<DropdownItemText label={"Enterprise"} value={"enterprise"} selected={false}></DropdownItemText>
									</Dropdown>
									<Input name="seats" label="Seats" isNumber={true} value={seats} onChange={setSeats}></Input>
								</FormRow>
								<TagInput
									name="skills"
									label="Skills"
									placeholder="Add a skill and press enter"
									validate={async (value: string[]) => (
										value.length >= 2
											? {state: "success"}
											: {state: "error", messageHtml: "<span>Add at least <b>two</b> skills.</span>"}
									)}></TagInput>
							</FormSection>

							<FormSection label="Billing address" divider={true}>
								<Input name="line1" label="Address line 1" value={line1} onChange={setLine1} required={true}></Input>
								<FormRow columns={[2, "160px"]} minFieldWidth={160}>
									<Input name="city" label="City" value={city} onChange={setCity} required={true}></Input>
									<Input name="postcode" label="Postcode" value={postcode} onChange={setPostcode} required={true}></Input>
								</FormRow>
							</FormSection>

							<FormSection label="Anything else" divider={true}>
								<TextArea name="notes" label="Notes" placeholder="Optional" value={notes} onChange={setNotes}></TextArea>
								<FormField
									name="terms"
									label="The terms"
									value={terms}
									required={true}
									requiredMessage="You must accept the terms to continue.">
									<div className="form-group-demo-inline">
										<Checkbox checked={terms} onCheckboxChange={setTerms}></Checkbox>
										<span>I accept the terms and conditions</span>
									</div>
								</FormField>
							</FormSection>

							<FormActions>
								<Button
									text="Reset"
									buttonType={ButtonType.SECONDARY}
									onClick={() => {
										setFirstName(""); setLastName(""); setEmail(""); setSeats("");
										setLine1(""); setCity(""); setPostcode(""); setNotes("");
										setTerms(false); setFormError(null); setSubmitted(null);
									}}></Button>
								<FormSubmitButton text="Save" buttonType={ButtonType.PRIMARY} icon="ri-save-line"></FormSubmitButton>
							</FormActions>

						</FormGroup>
					</div>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Submitted values:</div>
					{submitted === null &&
						<div style={{opacity: 0.6, fontFamily: "monospace"}}>
							Nothing submitted yet — the form has not passed validation.
						</div>
					}
					{submitted !== null &&
						<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.75rem"}}>
							{JSON.stringify(submitted, null, 2)}
						</div>
					}
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
