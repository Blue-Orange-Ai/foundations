import React from "react";

import './TruncatedTextDevelopment.css'
import {TruncatedText} from "../../../../components/text-decorations/truncated-text/TruncatedText";
import {TruncatedTextWrapper} from "../../../../components/text-decorations/truncated-text-wrapper/TruncatedTextWrapper";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const LONG_TEXT = "The depot reports its throughput every hour on the hour. Where a report is missed the last known figure is carried forward and marked as stale, and the site is queued for a manual check at the end of the shift. Three consecutive misses raise an alert against the site rather than against the run.";

const TRUNCATED_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "text",
		type: "string",
		required: true,
		control: "text",
		value: LONG_TEXT,
		description: "The string to clamp. The whole of it is kept in the title attribute, so hovering shows it in full."
	},
	{
		name: "maxLines",
		type: "number",
		required: true,
		control: "slider",
		min: 1,
		max: 6,
		step: 1,
		value: 2,
		description: "How many lines are shown before the text is cut off."
	},
	{
		name: "lineHeight",
		type: "number",
		default: "1.5",
		control: "number",
		description: "The line height, in em. It also sets the height the clamp is measured against."
	}
];

const TRUNCATED_WRAPPER_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Whatever should be clamped. Unlike TruncatedText there is no title attribute, since the content is not necessarily text."
	},
	{
		name: "maxLines",
		type: "number",
		required: true,
		control: "slider",
		min: 1,
		max: 6,
		step: 1,
		value: 2,
		description: "How many lines are shown before the content is cut off."
	},
	{
		name: "lineHeight",
		type: "number",
		default: "1.5",
		control: "number",
		description: "The line height, in em."
	}
];

interface Props {
}

export const TruncatedTextDevelopment: React.FC<Props> = ({}) => {

	const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

	return (
		<ComponentDoc
			title="Truncated Text"
			description="Clamps text to a set number of lines and ends it with an ellipsis. TruncatedText takes a string and puts the whole of it in the title attribute; TruncatedTextWrapper does the same for arbitrary children."
			name="TruncatedText"
			previewHeight={160}
			previewCentered={false}
			props={TRUNCATED_TEXT_PROPS}
			preview={values => (
				<div style={{width: "100%"}}>
					<TruncatedText text={values.text} maxLines={values.maxLines} lineHeight={values.lineHeight}></TruncatedText>
				</div>
			)}
			siblings={[
				{
					name: "TruncatedTextWrapper",
					description: "The same clamp around whatever it is given, for a value that is not a plain string — a tag, a link, a run of mixed content.",
					props: TRUNCATED_WRAPPER_PROPS,
					previewHeight: 160,
					previewCentered: false,
					snippetChildren: () => "<span>Melbourne Depot — <strong>operational</strong></span>",
					preview: values => (
						<div style={{width: "100%"}}>
							<TruncatedTextWrapper maxLines={values.maxLines} lineHeight={values.lineHeight}>
								<span>{LONG_TEXT}</span>
							</TruncatedTextWrapper>
						</div>
					)
				}
			]}>

			<GeneralHeading>TruncatedText - 1 Line</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={1} />
			</div>

			<GeneralHeading>TruncatedText - 2 Lines</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={2} />
			</div>

			<GeneralHeading>TruncatedText - 3 Lines</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={3} />
			</div>

			<GeneralHeading>TruncatedText - Custom Line Height</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedText text={longText} maxLines={2} lineHeight={2} />
			</div>

			<GeneralHeading>TruncatedTextWrapper - With Children</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedTextWrapper maxLines={2}>
					<span>This is a <strong>wrapper component</strong> that can contain <em>mixed content</em> including styled elements, and will still truncate properly after the specified number of lines.</span>
				</TruncatedTextWrapper>
			</div>

			<GeneralHeading>TruncatedTextWrapper - 1 Line</GeneralHeading>
			<div style={{width: "400px", border: "1px solid #e5e7eb", padding: "8px", borderRadius: "4px"}}>
				<TruncatedTextWrapper maxLines={1}>
					A very long single line that should be truncated with an ellipsis when it exceeds the container width.
				</TruncatedTextWrapper>
			</div>
		</ComponentDoc>
	)
}
