import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import {ButtonSize} from "../button/Button";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";

import './ButtonIconDropdown.css';

interface Props {
	children: React.ReactNode;
	icon: string;
	label?: string;
	size?: ButtonSize;
	filter?: boolean;
	allowMultiple?: boolean;
	onSelection?: (reference: string) => void;
	isDisabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

const sizeClassName: Record<ButtonSize, string> = {
	[ButtonSize.SMALL]: "blue-orange-btn-icon-dropdown-sm",
	[ButtonSize.MEDIUM]: "",
	[ButtonSize.LARGE]: "blue-orange-btn-icon-dropdown-lg",
};

export const ButtonIconDropdown: React.FC<Props> = ({
														children,
														icon,
														label,
														size = ButtonSize.MEDIUM,
														filter,
														allowMultiple,
														onSelection,
														isDisabled = false,
														style = {},
														className}) => {

	const btnRef = useRef<HTMLDivElement | null>(null);

	const handleSelection = (reference: string) => {
		if (!isDisabled && onSelection) {
			onSelection(reference);
		}
	};

	const generateClassname = () => {
		const sizeClass = sizeClassName[size] ? " " + sizeClassName[size] : "";
		const disabledClass = isDisabled ? " blue-orange-btn-icon-dropdown-disabled" : "";
		const custom = className ? " " + className : "";
		return "blue-orange-btn-icon-dropdown no-select" + sizeClass + disabledClass + custom;
	}

	const [classname, setClassname] = useState(generateClassname());

	useEffect(() => {
		setClassname(generateClassname())
	}, [size, isDisabled, className]);

	useEffect(() => {
		const current = btnRef.current as TippyHTMLElement;
		if (current && label) {
			tippy(current, {
				content: label,
				zIndex: 99999999999999,
			});
			return () => {
				const tippyInstance = current._tippy;
				if (tippyInstance) {
					tippyInstance.destroy();
				}
			};
		}
	}, []);

	return (
		<div ref={btnRef} className={classname} style={style}>
			<div style={{zIndex: "1", position: "absolute", left: "0", top: "0", width: "100%", height: "100%"}}>
				<Dropdown
					style={{width: "100%", height: "100%", opacity: 0}}
					filter={filter}
					allowMultipleSelection={allowMultiple}
					disabled={isDisabled}
					onSelection={(item) => handleSelection(item.reference)}>
					{children}
				</Dropdown>
			</div>
			<i className={icon}></i>
		</div>
	)
}
