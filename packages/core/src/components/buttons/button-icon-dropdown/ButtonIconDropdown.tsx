import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import {ButtonSize} from "../button/Button";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {TOOLTIP_Z_INDEX} from "../../utils/ZIndex";

import './ButtonIconDropdown.css';

interface Props {
	children: React.ReactNode;
	icon: string;
	label?: string;
	size?: ButtonSize;
	filter?: boolean;
	allowMultiple?: boolean;
	/** Width of the dropdown popup. Defaults to "max-content" so it sizes to the option text, not the icon button. */
	contextWidth?: number | string;
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
														contextWidth = "max-content",
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

	// An open popup sits right where the tooltip would, so the tooltip is suppressed
	// while it is open rather than left to cover a row of options.
	const handleVisibilityChange = (visible: boolean) => {
		const tippyInstance = (btnRef.current as TippyHTMLElement | null)?._tippy;
		if (tippyInstance) {
			if (visible) {
				tippyInstance.disable();
			} else {
				tippyInstance.enable();
			}
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
				zIndex: TOOLTIP_Z_INDEX,
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
					contextWidth={contextWidth}
					contextClassName="blue-orange-btn-icon-dropdown-window"
					allowMultipleSelection={allowMultiple}
					onVisibilityChange={handleVisibilityChange}
					disabled={isDisabled}
					onSelection={(item) => handleSelection(item.reference)}>
					{children}
				</Dropdown>
			</div>
			<i className={icon}></i>
		</div>
	)
}
