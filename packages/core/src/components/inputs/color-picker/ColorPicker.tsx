import React, {useEffect, useRef, useState} from "react";

import './ColorPicker.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {Address} from "node:cluster";

interface Props {
	value?:string,
	label?:string,
	required?: boolean,
	help?: string,
	labelStyle?: React.CSSProperties,
	onChange?: (value: string) => void,
}

export const ColorPicker: React.FC<Props> = ({
										   value,
										   label,
										   required=false,
										   help,
										   labelStyle={},
										   onChange

}) => {

	const colorToHex = (color: string | null | undefined) => {
		if (color == undefined || color == null) {
			return "#000000"
		}
		let div = document.createElement("div");
		div.style.color = color;
		document.body.appendChild(div);
		let computedColor = window.getComputedStyle(div).color;
		document.body.removeChild(div);
		let match = computedColor.match(/\d+/g);
		if (!match || match.length < 3) {
			return null; // Invalid color
		}
		let r = parseInt(match[0]).toString(16).padStart(2, "0");
		let g = parseInt(match[1]).toString(16).padStart(2, "0");
		let b = parseInt(match[2]).toString(16).padStart(2, "0");
		return `#${r}${g}${b}`.toUpperCase();
	}

	const [selectedColor, setSelectedColor] = useState<string>(value ?? "");

	const [hiddenInputColor, setHiddenInputColor] = useState<string>(colorToHex(value) ?? "");

	const [inputFocus, setInputFocus] = useState<boolean>(false);


	const inputStyle: React.CSSProperties = {
		"padding": "0px",
		"border": "none",
		"width": "100%",
		"borderRadius": "0px"
	}

	const updateColor = (color: string) => {
		setSelectedColor(color)
		setHiddenInputColor(colorToHex(color) ?? "")
		dispatchChange(color)
	}

	const dispatchChange = (color: string) => {
		if (onChange) {
			onChange(color)
		}
	}

	return (
		<div className="blue-orange-default-input-cont">
			{label &&
				<div className={"blue-orange-default-input-label-cont"} style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<div className={!inputFocus ? "blue-orange-color-picker-input-cont" : "blue-orange-color-picker-input-cont blue-orange-color-picker-focus"}>
				<div className="blue-orange-color-picker-color-square-cont">
					<input type="color" className="blue-orange-color-picker-hidden-color" value={hiddenInputColor} onChange={(value) => updateColor(value.target.value)}/>
					<div className="blue-orange-color-picker-color-square" style={{"backgroundColor": selectedColor}}></div>
				</div>
				<Input
					style={inputStyle}
					placeholder={"#e0e1e2"}
					value={selectedColor}
					onChange={updateColor}
					focusIn={() => setInputFocus(true)}
					focusOut={() => setInputFocus(false)}></Input>
			</div>
		</div>

	);
};