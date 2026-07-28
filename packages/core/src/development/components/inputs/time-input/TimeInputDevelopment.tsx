import React, {useState} from "react";

import './TimeInputDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {TimeInput} from "../../../../components/inputs/time/TimeInput";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";

interface Props {
}

const USAGE = `const [start, setStart] = useState("09:00");

<TimeInput label="Start" value={start} onChange={setStart}></TimeInput>

// Inside a FormGroup it registers itself under name and can be required
<TimeInput label="Cut off" name="cutOff" required={true}
           requiredMessage="Pick a cut off time"></TimeInput>`;

export const TimeInputDevelopment: React.FC<Props> = ({}) => {

	const [value, setValue] = useState<string>("09:30");

	return (
		<PaddedPage>
			<PageHeading>Time Input</PageHeading>
			<Paragraph>
				A time of day field. It reports its value as a 24 hour HH:mm string through onChange, and takes part in
				form validation the same way the other inputs do.
			</Paragraph>

			<div className="time-input-dev-section">
				<FormHeading label="Basic"></FormHeading>
				<div className="time-input-dev-row">
					<TimeInput label="Start" value={value} onChange={setValue}></TimeInput>
				</div>
				<div className="time-input-dev-output">Value: {value || "(empty)"}</div>
			</div>

			<div className="time-input-dev-section">
				<FormHeading label="Empty, with a label and without"></FormHeading>
				<div className="time-input-dev-row">
					<TimeInput label="Finish"></TimeInput>
					<TimeInput></TimeInput>
				</div>
			</div>

			<div className="time-input-dev-section">
				<FormHeading label="Required and disabled"></FormHeading>
				<div className="time-input-dev-row">
					<TimeInput label="Required" name="requiredTime" required={true}></TimeInput>
					<TimeInput label="Disabled" value="17:00" disabled={true}></TimeInput>
					<TimeInput label="Invalid" value="25:00" isInvalid={true}></TimeInput>
				</div>
			</div>

			<div className="time-input-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>
		</PaddedPage>
	)
}
