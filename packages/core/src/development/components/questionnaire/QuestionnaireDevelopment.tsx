import React, {useState} from "react";

import './QuestionnaireDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Questionnaire} from "../../../components/questionnaire/questionnaire/Questionnaire";
import {QuestionnaireItem} from "../../../components/questionnaire/questionnaire-item/QuestionnaireItem";
import {
	QuestionnaireAnswers,
	QuestionnaireProgress,
	QuestionnaireShortcut,
	QuestionnaireSize
} from "../../../components/questionnaire/questionnaire/QuestionnaireTypes";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec, InterfaceDoc} from "../../framework/PropSpec";

const QUESTIONNAIRE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The QuestionnaireItem entries, in the order they are asked."
	},
	{
		name: "answers",
		type: "QuestionnaireAnswers",
		description: "The answers so far. Supplying them hands the answers to the caller to hold, which is what a questionnaire that survives a reload needs."
	},
	{
		name: "activeItem",
		type: "string",
		description: "The question being asked. Updating it moves the questionnaire from the outside."
	},
	{
		name: "onAnswerChange",
		type: "(uuid: string, answer: QuestionnaireAnswer, answers: QuestionnaireAnswers) => void",
		description: "Fires whenever an answer changes, with that answer and the whole set."
	},
	{
		name: "onItemChange",
		type: "(uuid: string, index: number) => void",
		description: "Fires when the question being asked changes."
	},
	{
		name: "onSubmit",
		type: "(answers: QuestionnaireAnswers) => void",
		description: "Fires with every answer once the last question is finished."
	},
	{
		name: "onCancel",
		type: "() => void",
		description: "Shows a cancel button in the footer when supplied."
	},
	{
		name: "size",
		type: "QuestionnaireSize",
		default: "QuestionnaireSize.MEDIUM",
		defaultValue: QuestionnaireSize.MEDIUM,
		control: "select",
		options: [
			{label: "Small", value: QuestionnaireSize.SMALL, code: "QuestionnaireSize.SMALL"},
			{label: "Medium", value: QuestionnaireSize.MEDIUM, code: "QuestionnaireSize.MEDIUM"},
			{label: "Large", value: QuestionnaireSize.LARGE, code: "QuestionnaireSize.LARGE"}
		],
		description: "How large the question and its choices are set."
	},
	{
		name: "progress",
		type: "QuestionnaireProgress",
		default: "QuestionnaireProgress.BOTH",
		defaultValue: QuestionnaireProgress.BOTH,
		control: "select",
		options: [
			{label: "Both", value: QuestionnaireProgress.BOTH, code: "QuestionnaireProgress.BOTH"},
			{label: "Count", value: QuestionnaireProgress.COUNT, code: "QuestionnaireProgress.COUNT"},
			{label: "Bar", value: QuestionnaireProgress.BAR, code: "QuestionnaireProgress.BAR"},
			{label: "None", value: QuestionnaireProgress.NONE, code: "QuestionnaireProgress.NONE"}
		],
		description: "What is shown above the question — the count, the rail, both, or neither."
	},
	{
		name: "countLabel",
		type: "(index: number, total: number) => string",
		description: "Overrides the wording of the count. The default reads \"Question 2 of 5\"."
	},
	{
		name: "shortcut",
		type: "QuestionnaireShortcut",
		default: "QuestionnaireShortcut.LETTER",
		defaultValue: QuestionnaireShortcut.LETTER,
		control: "select",
		options: [
			{label: "Letter", value: QuestionnaireShortcut.LETTER, code: "QuestionnaireShortcut.LETTER"},
			{label: "Number", value: QuestionnaireShortcut.NUMBER, code: "QuestionnaireShortcut.NUMBER"},
			{label: "None", value: QuestionnaireShortcut.NONE, code: "QuestionnaireShortcut.NONE"}
		],
		description: "The key offered beside each choice."
	},
	{
		name: "autoAdvance",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Moves to the next question as soon as a single choice question is answered."
	},
	{
		name: "autoAdvanceDelay",
		type: "number",
		default: "250",
		control: "slider",
		min: 0,
		max: 1000,
		step: 50,
		description: "How long the picked choice is left on screen before the flow moves on."
	},
	{
		name: "allowBack",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Lets an answer already given be gone back to."
	},
	{
		name: "bordered",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the panel the question sits in."
	},
	{
		name: "animate",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Slides each question in as it is reached."
	},
	{
		name: "showFooter",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Whether the built in navigation is drawn at all."
	},
	{
		name: "footer",
		type: "React.ReactNode",
		description: "Replaces the built in footer — for questionnaires that drive themselves."
	},
	{
		name: "backLabel",
		type: "string",
		default: "\"Back\"",
		control: "text",
		description: "What the back button reads."
	},
	{
		name: "skipLabel",
		type: "string",
		default: "\"Skip\"",
		control: "text",
		description: "What the skip button on an optional question reads."
	},
	{
		name: "nextLabel",
		type: "string",
		default: "\"Next\"",
		control: "text",
		description: "What the forward button reads on every question but the last."
	},
	{
		name: "submitLabel",
		type: "string",
		default: "\"Submit\"",
		control: "text",
		description: "What the forward button reads on the last question."
	},
	{
		name: "cancelLabel",
		type: "string",
		default: "\"Cancel\"",
		description: "What the cancel button reads."
	},
	{
		name: "submitLoading",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Shows the submit button working, e.g. while the answers are being sent."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		description: "Extra class names put on the questionnaire."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the questionnaire."
	}
];

const QUESTIONNAIRE_ITEM_PROPS: Array<PropSpec> = [
	{
		name: "uuid",
		type: "string",
		required: true,
		description: "Identifies the item, and is the key its answer is recorded under."
	},
	{
		name: "prompt",
		type: "string",
		required: true,
		control: "text",
		value: "How often do you deploy?",
		description: "The question itself."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "So we know how much of the pipeline to show you by default.",
		description: "The sentence underneath the question — what is being asked for, and why."
	},
	{
		name: "choices",
		type: "Array<QuestionnaireChoice>",
		description: "The fixed answers on offer. Leave it out for a question answered only in prose."
	},
	{
		name: "multiple",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets more than one choice be picked, which turns the rows into checkboxes."
	},
	{
		name: "freeform",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Adds a row that opens a text field, for an answer none of the choices covers."
	},
	{
		name: "freeformLabel",
		type: "string",
		default: "\"Something else\"",
		control: "text",
		description: "What the freeform row reads."
	},
	{
		name: "freeformPlaceholder",
		type: "string",
		default: "\"Tell us more…\"",
		description: "The placeholder of the freeform field."
	},
	{
		name: "optional",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Lets the question be passed over, which puts a skip button in the footer."
	},
	{
		name: "requiredMessage",
		type: "string",
		control: "text",
		description: "Overrides the message shown when the question is left unanswered."
	},
	{
		name: "enabled",
		type: "boolean",
		default: "true",
		description: "Whether the question is asked at all. Turning it off drops it from the count and skips over it."
	},
	{
		name: "validate",
		type: "(answer: QuestionnaireAnswer) => string | undefined",
		description: "Checks the answer when the flow tries to move on. Return a message to hold the flow where it is, or nothing to let it through."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Anything else the question needs, rendered under the choices."
	}
];

const INTERFACES: Array<InterfaceDoc> = [
	{
		name: "QuestionnaireChoice",
		description: "One of the fixed answers offered by a question.",
		props: [
			{name: "uuid", type: "string", required: true, description: "Identifies the choice, and is what the answer is recorded as."},
			{name: "label", type: "string", required: true, description: "The line the choice reads."},
			{name: "hint", type: "string", description: "The sentence underneath the label explaining what picking this means."},
			{name: "icon", type: "string", description: "A remixicon class rendered before the label."},
			{name: "disabled", type: "boolean", default: "false", description: "Greys the choice out and takes it out of the keyboard order."}
		]
	},
	{
		name: "QuestionnaireAnswer",
		description: "What one question was answered with. The answers are keyed by the uuid of the question they belong to.",
		props: [
			{name: "choices", type: "string[]", required: true, description: "The uuids of the choices picked. A freeform answer sits here as QUESTIONNAIRE_FREEFORM_UUID."},
			{name: "text", type: "string", required: true, description: "What was written in the freeform field, when the question has one."},
			{name: "skipped", type: "boolean", required: true, description: "Set when the question was passed over rather than answered."}
		]
	}
];

const ROLE_CHOICES = [
	{uuid: "engineer", label: "Engineer", hint: "You build and ship the services.", icon: "ri-terminal-box-line"},
	{uuid: "operator", label: "Operator", hint: "You keep what is shipped running.", icon: "ri-server-line"},
	{uuid: "analyst", label: "Analyst", hint: "You read what comes out the other end.", icon: "ri-line-chart-line"}
];

interface Props {
}

export const QuestionnaireDevelopment: React.FC<Props> = ({}) => {

	const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

	const [submitted, setSubmitted] = useState<QuestionnaireAnswers | null>(null);

	// The branching example: the follow up is only asked of an engineer.
	const [role, setRole] = useState("");

	return (
		<ComponentDoc
			title="Questionnaire"
			description="A set of questions asked one at a time — the prompt, the answers on offer, and the navigation that carries the reader through them. It is the shape a survey, an onboarding interview or a triage form wants: the questions are few enough to read, and each one deserves the whole panel rather than a row of a form."
			name="Questionnaire"
			previewHeight={420}
			previewCentered={false}
			imports={["QuestionnaireItem"]}
			props={QUESTIONNAIRE_PROPS}
			interfaces={INTERFACES}
			snippetChildren={() => "<QuestionnaireItem\n\tuuid={\"role\"}\n\tprompt={\"What do you do day to day?\"}\n\tchoices={ROLE_CHOICES}\n></QuestionnaireItem>\n<QuestionnaireItem\n\tuuid={\"notes\"}\n\tprompt={\"Anything else we should know?\"}\n\toptional={true}\n\tfreeform={true}\n></QuestionnaireItem>"}
			preview={values => (
				<div className="blue-orange-questionnaire-development-stage">
					<Questionnaire
						size={values.size}
						progress={values.progress}
						shortcut={values.shortcut}
						autoAdvance={values.autoAdvance}
						autoAdvanceDelay={values.autoAdvanceDelay}
						allowBack={values.allowBack}
						bordered={values.bordered}
						animate={values.animate}
						showFooter={values.showFooter}
						backLabel={values.backLabel}
						skipLabel={values.skipLabel}
						nextLabel={values.nextLabel}
						submitLabel={values.submitLabel}
						submitLoading={values.submitLoading}>
						<QuestionnaireItem
							uuid="role"
							prompt="What do you do day to day?"
							description="So we know which parts of the console to lead with."
							choices={ROLE_CHOICES}
						></QuestionnaireItem>
						<QuestionnaireItem
							uuid="tools"
							prompt="Where do you spend most of your time?"
							multiple={true}
							choices={[
								{uuid: "console", label: "The console"},
								{uuid: "cli", label: "The CLI"},
								{uuid: "api", label: "The API"}
							]}
						></QuestionnaireItem>
						<QuestionnaireItem
							uuid="notes"
							prompt="Anything else we should know?"
							optional={true}
							freeform={true}
						></QuestionnaireItem>
					</Questionnaire>
				</div>
			)}
			siblings={[
				{
					name: "QuestionnaireItem",
					description: "Declares one question. Like WizardStage it renders nothing itself — Questionnaire reads its props and renders it when it is the question being asked.",
					props: QUESTIONNAIRE_ITEM_PROPS,
					previewHeight: 400,
					previewCentered: false,
					imports: ["Questionnaire"],
					preview: values => (
						<div className="blue-orange-questionnaire-development-stage">
							<Questionnaire progress={QuestionnaireProgress.NONE} showFooter={false}>
								<QuestionnaireItem
									uuid="preview"
									prompt={values.prompt}
									description={values.description}
									multiple={values.multiple}
									freeform={values.freeform}
									freeformLabel={values.freeformLabel}
									optional={values.optional}
									requiredMessage={values.requiredMessage}
									choices={[
										{uuid: "daily", label: "Several times a day"},
										{uuid: "weekly", label: "Once a week or so"},
										{uuid: "rarely", label: "Only when we have to"}
									]}
								></QuestionnaireItem>
							</Questionnaire>
						</div>
					)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<Description>Three questions: one choice, one with several, and an optional one answered in prose.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire
					onSubmit={given => setSubmitted(given)}
					onAnswerChange={(uuid, answer, given) => setAnswers(given)}>
					<QuestionnaireItem
						uuid="role"
						prompt="What do you do day to day?"
						description="So we know which parts of the console to lead with."
						choices={ROLE_CHOICES}
					></QuestionnaireItem>
					<QuestionnaireItem
						uuid="tools"
						prompt="Where do you spend most of your time?"
						description="Pick as many as apply."
						multiple={true}
						choices={[
							{uuid: "console", label: "The console", hint: "Clicking through the interface."},
							{uuid: "cli", label: "The CLI", hint: "Scripting against the commands."},
							{uuid: "api", label: "The API", hint: "Calling the endpoints directly."},
							{uuid: "sdk", label: "The SDK", hint: "Building on top of the client libraries."}
						]}
					></QuestionnaireItem>
					<QuestionnaireItem
						uuid="notes"
						prompt="Anything else we should know?"
						description="Skip it if nothing comes to mind."
						optional={true}
						freeform={true}
						freeformPlaceholder="What would you fix first?"
					></QuestionnaireItem>
				</Questionnaire>
			</div>
			<Description>{"Answered so far: " + JSON.stringify(answers)}</Description>
			{submitted && <Description>{"Submitted: " + JSON.stringify(submitted)}</Description>}

			<GeneralHeading>Answered in prose</GeneralHeading>
			<Description>A question with no choices at all is answered in the field itself — there is no row worth picking first.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire progress={QuestionnaireProgress.NONE} submitLabel="Send">
					<QuestionnaireItem
						uuid="feedback"
						prompt="What went wrong?"
						description="As much or as little as you like — it goes straight to the team that owns it."
						freeform={true}
						freeformPlaceholder="The deploy hung at the health check…"
						requiredMessage="Tell us what happened before you send it."
					></QuestionnaireItem>
				</Questionnaire>
			</div>

			<GeneralHeading>A choice none of the answers covers</GeneralHeading>
			<Description>The freeform row sits under the fixed answers and opens a field when it is picked. Picking it and writing nothing still counts as unanswered.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire progress={QuestionnaireProgress.NONE} submitLabel="Save">
					<QuestionnaireItem
						uuid="source"
						prompt="How did you hear about us?"
						freeform={true}
						freeformLabel="Somewhere else"
						freeformPlaceholder="Where?"
						choices={[
							{uuid: "search", label: "A search engine"},
							{uuid: "colleague", label: "A colleague"},
							{uuid: "conference", label: "A conference"}
						]}
					></QuestionnaireItem>
				</Questionnaire>
			</div>

			<GeneralHeading>Branching</GeneralHeading>
			<Description>An answer decides which questions follow. The second question is only asked of an engineer, and the count re-numbers itself around it.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire onAnswerChange={(uuid, answer) => {
					if (uuid === "role") {
						setRole(answer.choices[0] ?? "");
					}
				}}>
					<QuestionnaireItem
						uuid="role"
						prompt="What do you do day to day?"
						choices={ROLE_CHOICES}
					></QuestionnaireItem>
					<QuestionnaireItem
						uuid="language"
						prompt="Which language do you write most of it in?"
						enabled={role === "engineer"}
						choices={[
							{uuid: "typescript", label: "TypeScript"},
							{uuid: "java", label: "Java"},
							{uuid: "python", label: "Python"},
							{uuid: "go", label: "Go"}
						]}
					></QuestionnaireItem>
					<QuestionnaireItem
						uuid="size"
						prompt="How big is the team you sit in?"
						choices={[
							{uuid: "solo", label: "Just me"},
							{uuid: "small", label: "Two to ten"},
							{uuid: "large", label: "More than ten"}
						]}
					></QuestionnaireItem>
				</Questionnaire>
			</div>

			<GeneralHeading>Checked as it goes</GeneralHeading>
			<Description>A validate callback holds the flow where it is and says why — which is where a schema of your own gets a say.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire progress={QuestionnaireProgress.NONE} submitLabel="Continue">
					<QuestionnaireItem
						uuid="regions"
						prompt="Which regions should this run in?"
						description="Pick at least two, so a region going down does not take the service with it."
						multiple={true}
						validate={answer => answer.choices.length < 2 ? "Pick at least two regions." : undefined}
						choices={[
							{uuid: "syd", label: "ap-southeast-2", hint: "Sydney"},
							{uuid: "sin", label: "ap-southeast-1", hint: "Singapore"},
							{uuid: "fra", label: "eu-central-1", hint: "Frankfurt"},
							{uuid: "iad", label: "us-east-1", hint: "N. Virginia", disabled: true}
						]}
					></QuestionnaireItem>
				</Questionnaire>
			</div>

			<GeneralHeading>Straight through</GeneralHeading>
			<Description>Auto advance moves on as soon as a single choice question is answered, which is what a quick survey wants. Numbers rather than letters beside the choices.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire
					autoAdvance={true}
					size={QuestionnaireSize.SMALL}
					shortcut={QuestionnaireShortcut.NUMBER}
					countLabel={(index, total) => (index + 1) + " / " + total}>
					<QuestionnaireItem
						uuid="speed"
						prompt="How quickly did you find what you came for?"
						choices={[
							{uuid: "instantly", label: "Straight away"},
							{uuid: "eventually", label: "After a look around"},
							{uuid: "never", label: "I never found it"}
						]}
					></QuestionnaireItem>
					<QuestionnaireItem
						uuid="again"
						prompt="Would you come back?"
						choices={[
							{uuid: "yes", label: "Yes"},
							{uuid: "no", label: "No"}
						]}
					></QuestionnaireItem>
				</Questionnaire>
			</div>

			<GeneralHeading>Bare</GeneralHeading>
			<Description>Without the panel, for a questionnaire that already sits inside a modal or a drawer of its own.</Description>
			<div className="blue-orange-questionnaire-development-stage">
				<Questionnaire
					bordered={false}
					progress={QuestionnaireProgress.BAR}
					onCancel={() => {}}
					size={QuestionnaireSize.LARGE}>
					<QuestionnaireItem
						uuid="plan"
						prompt="Which plan are you on?"
						choices={[
							{uuid: "free", label: "Free"},
							{uuid: "team", label: "Team"},
							{uuid: "enterprise", label: "Enterprise"}
						]}
					></QuestionnaireItem>
					<QuestionnaireItem
						uuid="seats"
						prompt="How many seats do you need?"
						choices={[
							{uuid: "few", label: "Under five"},
							{uuid: "some", label: "Five to fifty"},
							{uuid: "many", label: "More than fifty"}
						]}
					></QuestionnaireItem>
				</Questionnaire>
			</div>
		</ComponentDoc>
	)
}
