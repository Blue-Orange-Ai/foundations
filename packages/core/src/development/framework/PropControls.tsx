import React from "react";

import './DocsTheme.css'
import './PropControls.css'
import {PropSpec} from "./PropSpec";
import {Toggle} from "../../components/inputs/toggle/Toggle";
import {Input} from "../../components/inputs/input/Input";
import {Slider} from "../../components/inputs/slider/Slider";
import {ColorPicker} from "../../components/inputs/color-picker/ColorPicker";
import {Dropdown} from "../../components/inputs/dropdown/basic/Dropdown";
import {DropdownItemText} from "../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {DropdownItemObj} from "../../components/interfaces/AppInterfaces";

interface Props {
	props: Array<PropSpec>;
	values: Record<string, any>;
	onChange: (name: string, value: any) => void;
}

/** Options are addressed by index so a value of any shape — enum, object, number — can sit behind a row. */
const optionReference = (index: number): string => "option-" + index;

/**
 * The knob panel. Every prop that declares a control gets a row, and changing
 * one drives the live preview and the usage snippet at the same time.
 */
export const PropControls: React.FC<Props> = ({props, values, onChange}) => {

	const controllable = props.filter(spec => spec.control !== undefined);

	if (controllable.length === 0) {
		return (
			<div className="blue-orange-docs-controls">
				<div className="blue-orange-docs-controls-empty">
					This component has nothing worth putting a control on — the examples below show what it does.
				</div>
			</div>
		)
	}

	const renderControl = (spec: PropSpec) => {
		const value = values[spec.name];
		if (spec.control === "toggle") {
			return (
				<Toggle
					checked={value === true}
					onChange={checked => onChange(spec.name, checked)}
				></Toggle>
			)
		}
		if (spec.control === "text") {
			return (
				<Input
					value={value === undefined || value === null ? "" : String(value)}
					placeholder={spec.default ?? ""}
					onChange={text => onChange(spec.name, text)}
				></Input>
			)
		}
		if (spec.control === "number") {
			return (
				<Input
					value={value === undefined || value === null ? "" : String(value)}
					isNumber={true}
					placeholder={spec.default ?? ""}
					onChange={text => onChange(spec.name, text === "" ? undefined : Number(text))}
				></Input>
			)
		}
		if (spec.control === "slider") {
			return (
				<Slider
					value={typeof value === "number" ? value : (spec.min ?? 0)}
					min={spec.min ?? 0}
					max={spec.max ?? 100}
					step={spec.step ?? 1}
					showValue={true}
					onChange={next => onChange(spec.name, next as number)}
				></Slider>
			)
		}
		if (spec.control === "color") {
			return (
				<ColorPicker
					value={typeof value === "string" ? value : ""}
					onChange={next => onChange(spec.name, next)}
				></ColorPicker>
			)
		}
		if (spec.control === "select") {
			const options = spec.options ?? [];
			const selectedIndex = options.findIndex(option => option.value === value);
			// The dropdown reads its selection from its children once, on mount, so it
			// is remounted whenever the value changes from outside — a reset, say.
			return (
				<Dropdown
					key={spec.name + "-" + String(selectedIndex)}
					placeholder="Not set"
					contextWidth="100%"
					onSelection={(item: DropdownItemObj) => {
						const index = options.findIndex((option, position) => optionReference(position) === item.reference);
						if (index !== -1) {
							onChange(spec.name, options[index].value);
						}
					}}>
					{options.map((option, index) => (
						<DropdownItemText
							key={optionReference(index)}
							label={option.label}
							value={optionReference(index)}
							selected={index === selectedIndex}
						></DropdownItemText>
					))}
				</Dropdown>
			)
		}
		return <></>;
	}

	return (
		<div className="blue-orange-docs-controls">
			{controllable.map(spec => (
				<div className="blue-orange-docs-controls-row" key={spec.name}>
					<label className="blue-orange-docs-controls-label" title={spec.type}>
						{spec.name}
						{spec.required && <span className="blue-orange-docs-controls-required">*</span>}
					</label>
					<div className="blue-orange-docs-controls-input">
						{renderControl(spec)}
					</div>
				</div>
			))}
		</div>
	)
}
