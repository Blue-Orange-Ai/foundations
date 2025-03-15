import React, {useEffect, useRef, useState} from "react";

import './IconSelector.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {Input} from "../input/Input";
import {Address} from "node:cluster";
import {Dropdown} from "../dropdown/basic/Dropdown";
import {DropdownItemObj} from "../../interfaces/AppInterfaces";
import {DropdownItemText} from "../dropdown/items/DropdownItemText/DropdownItemText";
import {ILogicalOperand} from "../../rules/rule-editor/RuleEditor";
import {DropdownItemIcon} from "../dropdown/items/DropdownItemIcon/DropdownItemIcon";

import iconsData from "./data/icons.json";
import {EmojiSelection} from "../emoji/emoji-selection/EmojiSelection";

interface Props {
	value?:string | null,
	label?:string,
	required?: boolean,
	help?: string,
	labelStyle?: React.CSSProperties,
	onChange?: (value: string) => void,
}

export const IconSelector: React.FC<Props> = ({
										   value,
										   label,
										   required=false,
										   help,
										   labelStyle={},
										   onChange

}) => {


	const dispatchChange = (selectedIcon: string) => {
		if (onChange) {
			onChange(selectedIcon)
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
			<Dropdown filter={true} onSelection={(item: DropdownItemObj) => dispatchChange(item.reference)}>
				{iconsData.map((item, index) => (
					<DropdownItemIcon
						key={item.value + "-" + index}
						label={item.label}
						value={"<i class=\"" + item.value + "\"></i>"}
						src={item.value}></DropdownItemIcon>
				))}
			</Dropdown>
		</div>

	);
};