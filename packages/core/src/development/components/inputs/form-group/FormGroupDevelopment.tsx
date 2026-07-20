import React, {useState} from "react";

import './FormGroupDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
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
import {FormGroup} from "../../../../components/inputs/form-group/FormGroup";
import {FormSection} from "../../../../components/inputs/form-group/FormSection";
import {FormRow} from "../../../../components/inputs/form-group/FormRow";
import {FormField} from "../../../../components/inputs/form-group/FormField";
import {FormActions} from "../../../../components/inputs/form-group/FormActions";
import {FormSubmitButton} from "../../../../components/inputs/form-group/FormSubmitButton";

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
				<PaddedPage>
					<PageHeading>Form Group</PageHeading>

					<Paragraph>
						<code>FormGroup</code> renders a form from its children rather than from a configuration prop,
						in the same way the sidebar is built. You compose it out of sections and rows, drop any number
						of buttons into the actions slot, and the group takes care of running the requirement checks
						and validators of every input before it hands you the values.
					</Paragraph>

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
				</PaddedPage>
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
