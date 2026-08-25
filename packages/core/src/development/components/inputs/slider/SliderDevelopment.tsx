import React, {useState} from "react";

import './SliderDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../../components/text-decorations/description/Description";
import {Slider, SliderOrientation, SliderValue} from "../../../../components/inputs/slider/Slider";
import {InputValidationResult} from "../../../../components/inputs/validation/InputValidation";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {validationProps} from "../../../framework/InputProps";

const SLIDER_PROPS: Array<PropSpec> = [
	{
		name: "value",
		type: "SliderValue",
		control: "slider",
		min: 0,
		max: 100,
		step: 1,
		value: 40,
		description: "A number for one thumb, or an array with one number per thumb for a range."
	},
	{
		name: "label",
		type: "string",
		control: "text",
		value: "Throughput target",
		description: "The label above the track."
	},
	{
		name: "min",
		type: "number",
		default: "0",
		control: "number",
		description: "The low end of the range."
	},
	{
		name: "max",
		type: "number",
		default: "100",
		control: "number",
		description: "The high end."
	},
	{
		name: "step",
		type: "number",
		default: "1",
		control: "number",
		description: "The grid values snap to. It also sets how many decimals the value keeps."
	},
	{
		name: "orientation",
		type: "SliderOrientation",
		default: "SliderOrientation.HORIZONTAL",
		defaultValue: SliderOrientation.HORIZONTAL,
		control: "select",
		options: [
			{label: "Horizontal", value: SliderOrientation.HORIZONTAL, code: "SliderOrientation.HORIZONTAL"},
			{label: "Vertical", value: SliderOrientation.VERTICAL, code: "SliderOrientation.VERTICAL"}
		],
		description: "Which way the track runs. A vertical slider takes its height from what it sits in."
	},
	{
		name: "showValue",
		type: "boolean",
		default: "false",
		control: "toggle",
		value: true,
		description: "Prints the current value next to the label."
	},
	{
		name: "formatValue",
		type: "(value: number) => string",
		description: "Formats the value shown by showValue, and read out by a screen reader."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the slider out and stops it responding."
	},
	{
		name: "help",
		type: "string",
		control: "text",
		description: "Puts a help icon beside the label with this text behind it."
	},
	{
		name: "onChange",
		type: "(value: SliderValue) => void",
		description: "Fires continuously while a thumb is being dragged."
	},
	{
		name: "onChangeComplete",
		type: "(value: SliderValue) => void",
		description: "Fires once the drag — or the key press — finishes. The one to save on."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		description: "Inline style put on the slider."
	},
	{
		name: "labelStyle",
		type: "React.CSSProperties",
		description: "Inline style put on the label."
	},
	{
		name: "range",
		type: "boolean",
		control: "toggle",
		hideFromTable: true,
		hideFromSnippet: true,
		description: "Demo only — hands the slider two values so it becomes a range."
	},
	...validationProps("SliderValue")
];

interface Props {
}

export const SliderDevelopment: React.FC<Props> = ({}) => {

	const [volume, setVolume] = useState<SliderValue>(40);

	const [priceRange, setPriceRange] = useState<SliderValue>([20, 70]);

	const validateBudget = (value: SliderValue): Promise<InputValidationResult> => {
		const amount = Array.isArray(value) ? value[0] : value;
		if (amount > 800) {
			return Promise.resolve({state: "error", message: "That is over the approval limit."});
		}
		return Promise.resolve({state: "success", message: "Within the approval limit."});
	}

	return (
		<ComponentDoc
			title="Slider"
			description="A draggable value selector. Pass a number for one thumb or an array for a range — both come back through the same onChange, and the arrow keys move whichever thumb has focus."
			name="Slider"
			previewHeight={180}
			previewCentered={false}
			imports={["SliderOrientation"]}
			props={SLIDER_PROPS}
			preview={values => (
				<div style={{
					width: "100%",
					maxWidth: "420px",
					height: values.orientation === SliderOrientation.VERTICAL ? "200px" : undefined
				}}>
					<Slider
						value={values.range ? [values.value, values.max] : values.value}
						label={values.label}
						min={values.min}
						max={values.max}
						step={values.step}
						orientation={values.orientation}
						showValue={values.showValue}
						disabled={values.disabled}
						help={values.help}
						name={values.name}
						required={values.required}
						requiredMessage={values.requiredMessage}
						validateOnChange={values.validateOnChange}
						onChange={() => {}}></Slider>
				</div>
			)}>

			<GeneralHeading>Single value</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider label="Volume" value={volume} showValue={true} onChange={setVolume}></Slider>
			</div>

			<GeneralHeading>Range</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider
					label="Price range"
					value={priceRange}
					showValue={true}
					formatValue={(value) => "£" + value}
					onChange={setPriceRange}></Slider>
			</div>

			<GeneralHeading>Steps</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider label="Temperature" min={16} max={28} step={0.5} value={21} showValue={true}
						formatValue={(value) => value + "°C"}></Slider>
			</div>

			<GeneralHeading>Vertical</GeneralHeading>
			<div className="blue-orange-slider-development-row">
				<Slider orientation={SliderOrientation.VERTICAL} value={30}></Slider>
				<Slider orientation={SliderOrientation.VERTICAL} value={60}></Slider>
				<Slider orientation={SliderOrientation.VERTICAL} value={[20, 80]}></Slider>
			</div>

			<GeneralHeading>Disabled</GeneralHeading>
			<div className="blue-orange-slider-development-block">
				<Slider label="Locked" value={50} showValue={true} disabled={true}></Slider>
			</div>

			<GeneralHeading>With validation</GeneralHeading>
			<Description>Validation runs when the drag finishes — anything over 800 is rejected.</Description>
			<div className="blue-orange-slider-development-block">
				<Slider
					label="Monthly budget"
					min={0}
					max={1000}
					step={50}
					value={400}
					showValue={true}
					formatValue={(value) => "£" + value}
					validate={validateBudget}></Slider>
			</div>
		</ComponentDoc>
	)
}
