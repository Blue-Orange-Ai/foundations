import React, {useState} from "react";

import './DateInputDevelopment.css'
import {SplitPageMajor} from "../../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
	HorizontalSplitPage
} from "../../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {DateInput} from "../../../../components/inputs/date/datepicker/inputs/dateinput/DateInput";
import {
	TimePrecision
} from "../../../../components/inputs/date/datepicker/items/datecontextwindowsingle/DateContextWindowSingle";
import {Month} from "../../../../components/inputs/date/datepicker/items/month/Month";
import {InputValidateCallback} from "../../../../components/inputs/validation/InputValidation";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const DATE_INPUT_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "Date",
		control: "text",
		value: "2026-08-25T14:30:00",
		description: "The date in the field."
	},
	{
		name: "displayFormat",
		type: "string",
		default: "\"ddd, MMMM Do YYYY\"",
		control: "select",
		options: [
			{label: "ddd, MMMM Do YYYY", value: "ddd, MMMM Do YYYY"},
			{label: "DD/MM/YYYY", value: "DD/MM/YYYY"},
			{label: "YYYY-MM-DD", value: "YYYY-MM-DD"},
			{label: "D MMM YY", value: "D MMM YY"}
		],
		description: "A moment format deciding how the date reads in the field."
	},
	{
		name: "placeholder",
		type: "string",
		control: "text",
		description: "Shown while no date has been chosen."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Inspection date",
		description: "The label above the field."
	},
	{
		name: "showTime",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Adds a time of day to the calendar, so the value carries both."
	},
	{
		name: "timePrecision",
		type: "TimePrecision",
		default: "TimePrecision.MINUTE",
		defaultValue: TimePrecision.MINUTE,
		control: "select",
		options: [
			{label: "Minute", value: TimePrecision.MINUTE, code: "TimePrecision.MINUTE"},
			{label: "Second", value: TimePrecision.SECOND, code: "TimePrecision.SECOND"},
			{label: "Millisecond", value: TimePrecision.MILLISECOND, code: "TimePrecision.MILLISECOND"}
		],
		description: "How far down the time goes when showTime is on."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the field out and stops the calendar opening."
	},
	{
		name: "onChange",
		type: "(date: Date) => void",
		description: "Fires with the date that was chosen."
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
	...validationProps("Date")
];

interface Props {
}

interface SelectionEntry {
	field: string;
	iso: string;
}

export const DateInputDevelopment: React.FC<Props> = ({}) => {

	// ── Demo field state ───────────────────────────────────────────
	const [basic, setBasic] = useState<Date | undefined>(new Date());
	const [formatted, setFormatted] = useState<Date | undefined>(new Date());
	const [empty, setEmpty] = useState<Date | undefined>(undefined);
	const [withTime, setWithTime] = useState<Date | undefined>(new Date());
	const [withSeconds, setWithSeconds] = useState<Date | undefined>(new Date());
	const [withMillis, setWithMillis] = useState<Date | undefined>(new Date());
	const [requiredDate, setRequiredDate] = useState<Date | undefined>(undefined);
	const [validated, setValidated] = useState<Date | undefined>(undefined);
	const [inlineMonth, setInlineMonth] = useState<Date | undefined>(new Date());
	const [sundayMonth, setSundayMonth] = useState<Date | undefined>(new Date());

	// Rolling log of the most recent selections, newest first.
	const [log, setLog] = useState<SelectionEntry[]>([]);

	const track = (field: string, setter: (date: Date) => void) => (date: Date) => {
		setter(date);
		setLog((prev) => [{field, iso: date.toISOString()}, ...prev].slice(0, 12));
	};

	// The date must be in the future — demonstrates the shared validate contract.
	const validateFutureDate: InputValidateCallback<Date> = async (value) => {
		if (value == undefined) {
			return {state: "error", message: "Please choose a date."};
		}
		return value.getTime() > Date.now()
			? {state: "success", message: "That date is in the future."}
			: {state: "error", message: "Please choose a date in the future."};
	};

	// ── Code snippets for the documentation ────────────────────────
	const anatomySnippet = `DateInput
└─ DateContextWindowSingle   fixed-position popover + time boxes
   └─ Month                  header, month / year selects, grid
      └─ Week                a <tr> of seven days
         └─ Day              a <td> for one date`;

	const basicSnippet = `import { DateInput } from "@blue-orange-ai/foundations-core";

const [date, setDate] = useState<Date>(new Date());

<DateInput
    label="Start date"
    value={date}
    onChange={setDate}
/>`;

	const timeSnippet = `import { DateInput, TimePrecision } from "@blue-orange-ai/foundations-core";

// Adds hour + minute boxes under the calendar
<DateInput label="Starts at" value={date} onChange={setDate} showTime />

// Add seconds as well
<DateInput
    label="Cut-off"
    value={date}
    onChange={setDate}
    showTime
    timePrecision={TimePrecision.SECOND}
/>

// …or milliseconds
<DateInput
    label="Timestamp"
    value={date}
    onChange={setDate}
    showTime
    timePrecision={TimePrecision.MILLISECOND}
/>`;

	const validationSnippet = `<DateInput
    label="Renewal date"
    value={date}
    onChange={setDate}
    validate={async (value) => value.getTime() > Date.now()
        ? { state: "success", message: "That date is in the future." }
        : { state: "error", message: "Please choose a date in the future." }}
/>`;

	const monthSnippet = `import { Month } from "@blue-orange-ai/foundations-core";

// The calendar body on its own — no text field, no popover.
<Month
    date={date}
    onSelection={setDate}
    sundayStart={true}
    hideInActiveMonths={true}
    minStartingYear={2020}
    maxStartingYear={2030}
/>`;

	const primitivesSnippet = `// The shape a single cell is rendered from.
interface DayObj {
    day: number;                  // day of the month, 1-31
    month: number;                // 0-11, matching Date#getMonth()
    year: number;
    selected?: boolean;           // draws the selected style
    highlighted?: boolean;        // draws the highlight style (for range hovers)
    currentDay?: boolean;         // draws the "today" style
    inActiveMonth?: boolean;      // day belongs to the previous / next month
    hideInActiveMonth?: boolean;  // hide, rather than dim, those spill-over days
}

// A row of exactly seven days.
interface WeekObj {
    days: DayObj[];
}

<Week week={week} onClick={onDay} onMouseEnter={onHover} onMouseLeave={onLeave} />
<Day day={day} onClick={onDay} onMouseEnter={onHover} onMouseLeave={onLeave} />`;

	return (
		<HorizontalSplitPage>
			<SplitPageMajor>
				<ComponentDoc
					title="Date Input"
					description="A date field with a calendar behind it. It can carry a time of day as well, to whatever precision the value needs, and prints the value back in whichever moment format is asked for."
					name="DateInput"
					previewHeight={200}
					previewCentered={false}
					imports={["TimePrecision"]}
					props={DATE_INPUT_PROPS}
					preview={values => (
						<div style={{width: "100%", maxWidth: "420px"}}>
							<DateInput
								value={values.value ? new Date(values.value) : undefined}
								label={values.label}
								placeholder={values.placeholder}
								displayFormat={values.displayFormat}
								showTime={values.showTime}
								timePrecision={values.timePrecision}
								help={values.help}
								disabled={values.disabled}
								name={values.name}
								required={values.required}
								requiredMessage={values.requiredMessage}
								validateOnChange={values.validateOnChange}
								onChange={() => {}}></DateInput>
						</div>
					)}>

					<Paragraph>
						The date picker is a small family of components that build on each other. In most
						applications you only need <code>DateInput</code> — a text field that opens a calendar
						popover. The pieces underneath are exported too, so you can drop a calendar straight into
						a page or build a completely custom picker out of the primitives.
					</Paragraph>

					<GeneralHeading>Anatomy</GeneralHeading>
					<Paragraph>
						<code>DateInput</code> renders an <code>Input</code> and, while focused, a
						<code> DateContextWindowSingle</code> popover. That popover contains a <code>Month</code>
						plus the optional time boxes. <code>Month</code> builds its grid from <code>Week</code>
						rows, and each <code>Week</code> renders seven <code>Day</code> cells. Every layer is
						exported from the package, so you can enter the stack at whatever level you need.
					</Paragraph>
					<CodeBlock value={{code: anatomySnippet, lang: "text", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>DateInput</GeneralHeading>
					<Paragraph>
						The field is editable as free text as well as through the calendar. Typing is parsed with
						<code> chrono-node</code> (en-GB locale) when the field loses focus or you press enter, so
						<b> "next friday"</b>, <b>"in 3 weeks"</b>, <b>"25/12/2026"</b> and <b>"tomorrow at 9am"</b>
						all resolve to a real date. If nothing can be parsed the field shows
						<code> Invalid Date</code> and the previous value is kept. Note that day-first parsing means
						<code> 03/04/2026</code> is the 3rd of April, not the 4th of March.
					</Paragraph>
					<Paragraph>
						The selected date is written back into the box using a <code>moment</code> format string,
						defaulting to <code>ddd, MMMM Do YYYY</code>. <code>displayFormat</code> only controls that
						display — you can still type any format chrono understands.
					</Paragraph>
					<CodeBlock value={{code: basicSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>
					<Paragraph>
						Alongside <code>value</code>, <code>onChange</code> and <code>displayFormat</code> it takes
						the props shared by every input in the library: <code>label</code>, <code>placeholder</code>,
						<code> help</code> (a tooltip icon beside the label), <code>required</code>,
						<code> disabled</code>, <code>style</code>, <code>labelStyle</code>, and <code>name</code> for
						registering with a surrounding <code>FormGroup</code>.
					</Paragraph>

					<GeneralHeading>Times</GeneralHeading>
					<Paragraph>
						Pass <code>showTime</code> to add number boxes under the calendar. How many appear is
						controlled by <code>timePrecision</code>: <code>TimePrecision.MINUTE</code> (the default)
						shows hours and minutes, <code>TimePrecision.SECOND</code> adds seconds, and
						<code> TimePrecision.MILLISECOND</code> adds milliseconds. Hours use a 24-hour clock.
						Pressing <b>enter</b> in a time box commits it immediately; otherwise the time is combined
						with whichever day you click next.
					</Paragraph>
					<CodeBlock value={{code: timeSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>Validation</GeneralHeading>
					<Paragraph>
						<code>DateInput</code> implements the same optional <code>validate</code> contract as the
						rest of the inputs — an async callback receiving the current <code>Date</code> and resolving
						with a <code>state</code> of <code>"success"</code> or <code>"error"</code> plus a message.
						It runs on blur by default; pass <code>validateOnChange</code> to run it on every selection
						too. See the Validation page for the full contract.
					</Paragraph>
					<CodeBlock value={{code: validationSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>Month — the inline calendar</GeneralHeading>
					<Paragraph>
						<code>Month</code> is the calendar on its own, with no text field and no popover. Use it
						when you want a calendar permanently visible in a page or panel.
						<code> hideInActiveMonths</code> hides the spill-over days from the neighbouring months
						rather than dimming them, <code>sundayStart</code> switches the week to start on Sunday (it
						starts on Monday by default), <code>showHeader</code> hides the month / year controls, and
						<code> minStartingYear</code> / <code>maxStartingYear</code> bound the year dropdown
						(1900–2200 by default). The <code>hour</code>, <code>minute</code>, <code>second</code> and
						<code> millisecond</code> props are the time-of-day combined with whichever day is clicked —
						this is how <code>DateContextWindowSingle</code> feeds the time boxes back into the grid.
					</Paragraph>
					<CodeBlock value={{code: monthSnippet, lang: "tsx", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>DateContextWindowSingle — the popover</GeneralHeading>
					<Paragraph>
						This is the floating panel <code>DateInput</code> shows: a <code>Month</code> plus the time
						boxes. It is <code>position: fixed</code> and takes a <b>required</b> <code>style</code>
						prop, which is how the caller positions it — <code>DateInput</code> measures the field's
						viewport rect, re-measures it on scroll, and flips the panel above the field when the
						field sits in the lower half of the viewport. It also portals the panel to the body, so
						an ancestor carrying a transform — a modal or drawer card — cannot become the containing
						block for the fixed panel and re-base the coordinates it was placed with; that is what
						<code>className</code> and <code>contextRef</code> are for, re-applying the theme the panel
						was written inside and letting the owner measure it and recognise its own clicks. If you
						use this component directly you own that positioning, and you own closing it; it has no
						click-outside handling of its own.
					</Paragraph>

					<GeneralHeading>Week and Day — the primitives</GeneralHeading>
					<Paragraph>
						<code>Week</code> renders a table row and <code>Day</code> a table cell, both driven
						entirely by plain data objects, so they must be rendered inside a
						<code> &lt;table&gt;</code>. Because both expose <code>onMouseEnter</code> and
						<code> onMouseLeave</code> alongside <code>onClick</code>, and <code>DayObj</code> carries a
						<code> highlighted</code> flag, these are the pieces to reach for when building something the
						higher-level components do not do — a date-range picker, for instance.
					</Paragraph>
					<CodeBlock value={{code: primitivesSnippet, lang: "typescript", theme: "github-dark"}}></CodeBlock>

					<GeneralHeading>Live examples</GeneralHeading>
					<Paragraph>
						Every selection below is logged in the panel on the right. Try typing natural language into
						the fields as well as picking from the calendar.
					</Paragraph>

					<div className="date-demo-grid">

						<div className="date-demo-item">
							<div className="date-demo-title">Default</div>
							<DateInput
								label="Start date"
								value={basic}
								onChange={track("Start date", setBasic)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">Empty · placeholder · help icon</div>
							<DateInput
								label="Due date"
								placeholder="Try typing 'next friday'"
								help="Accepts natural language as well as calendar clicks."
								value={empty}
								onChange={track("Due date", setEmpty)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">Custom displayFormat · YYYY-MM-DD</div>
							<DateInput
								label="ISO style"
								displayFormat="YYYY-MM-DD"
								value={formatted}
								onChange={track("ISO style", setFormatted)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">showTime · MINUTE (default)</div>
							<DateInput
								label="Starts at"
								displayFormat="ddd, MMM Do YYYY · HH:mm"
								showTime={true}
								value={withTime}
								onChange={track("Starts at", setWithTime)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">showTime · SECOND</div>
							<DateInput
								label="Cut-off"
								displayFormat="ddd, MMM Do YYYY · HH:mm:ss"
								showTime={true}
								timePrecision={TimePrecision.SECOND}
								value={withSeconds}
								onChange={track("Cut-off", setWithSeconds)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">showTime · MILLISECOND</div>
							<DateInput
								label="Timestamp"
								displayFormat="ddd, MMM Do YYYY · HH:mm:ss.SSS"
								showTime={true}
								timePrecision={TimePrecision.MILLISECOND}
								value={withMillis}
								onChange={track("Timestamp", setWithMillis)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">Required</div>
							<DateInput
								label="Effective from"
								placeholder="Required field"
								required={true}
								value={requiredDate}
								onChange={track("Effective from", setRequiredDate)}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">Validated · must be in the future</div>
							<DateInput
								label="Renewal date"
								placeholder="Pick a future date"
								value={validated}
								onChange={track("Renewal date", setValidated)}
								validate={validateFutureDate}
							></DateInput>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">Disabled</div>
							<DateInput
								label="Locked"
								disabled={true}
								value={basic}
							></DateInput>
						</div>

					</div>

					<GeneralHeading>Inline calendars</GeneralHeading>
					<Paragraph>
						The same <code>Month</code> component rendered directly into the page. The left one uses the
						defaults (week starts Monday, spill-over days dimmed); the right one starts on Sunday, hides
						the spill-over days entirely and limits the year dropdown to 2020–2030.
					</Paragraph>

					<div className="date-demo-calendars">
						<div className="date-demo-item">
							<div className="date-demo-title">Defaults</div>
							<div className="date-demo-calendar">
								<Month
									date={inlineMonth}
									onSelection={track("Inline calendar", setInlineMonth)}
								></Month>
							</div>
						</div>

						<div className="date-demo-item">
							<div className="date-demo-title">sundayStart · hideInActiveMonths · 2020–2030</div>
							<div className="date-demo-calendar">
								<Month
									date={sundayMonth}
									sundayStart={true}
									hideInActiveMonths={true}
									minStartingYear={2020}
									maxStartingYear={2030}
									onSelection={track("Sunday calendar", setSundayMonth)}
								></Month>
							</div>
						</div>
					</div>

				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Selections (newest first):</div>
					{log.length === 0 &&
						<div style={{opacity: 0.6, fontFamily: "monospace"}}>
							Nothing selected yet. Pick a date on the left.
						</div>
					}
					{log.map((entry, index) => (
						<div key={index} className="date-log-entry">
							<div className="date-log-field">{entry.field}</div>
							<div style={{whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.75rem"}}>
								{entry.iso}
							</div>
						</div>
					))}
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
