import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import {ButtonSize} from "../button/Button";
import {TOOLTIP_Z_INDEX} from "../../utils/ZIndex";
import {TOOLTIP_POPPER_OPTIONS} from "../../utils/Tooltip";

import './ButtonIcon.css'

interface Props {
	icon: string;
	label?: string;
	size?: ButtonSize;
	isDisabled?: boolean;
	isLoading?: boolean;
	onClick?: () => void;
	style?: React.CSSProperties;
	className?: string;
}

const sizeClassName: Record<ButtonSize, string> = {
	[ButtonSize.SMALL]: "blue-orange-default-btn-icon-sm",
	[ButtonSize.MEDIUM]: "",
	[ButtonSize.LARGE]: "blue-orange-default-btn-icon-lg",
};

export const ButtonIcon: React.FC<Props> = ({
												icon,
												label,
												size = ButtonSize.MEDIUM,
												onClick,
												isDisabled,
												isLoading = false,
												style,
												className}) => {

	const generateClassname = (name: string | undefined) => {
		const sizeClass = sizeClassName[size] ? " " + sizeClassName[size] : "";
		const base = "blue-orange-default-btn-icon no-select" + sizeClass
		if (name) {
			return base + " " + name;
		}
		return base;
	}

	const btnRef = useRef<HTMLDivElement | null>(null);

	const [classname, setClassname] = useState(generateClassname(className));

	useEffect(() => {
		if (label) {
			const current = btnRef.current as TippyHTMLElement;
			if (current) {
				tippy(current, {
					content: label,
					zIndex: TOOLTIP_Z_INDEX,
					popperOptions: TOOLTIP_POPPER_OPTIONS
				});

				return () => {
					const tippyInstance = current._tippy;
					if (tippyInstance) {
						tippyInstance.destroy();
					}
				};
			}
		}
	}, []);

	useEffect(() => {
		setClassname(generateClassname(className))
	}, [className, size]);

	const handleClick = () => {
		if (!isDisabled && !isLoading && onClick) {
			onClick();
		}
	};

	const setStyle = () => {
		var st: React.CSSProperties = {
			cursor: isDisabled || isLoading ? "not-allowed" : "pointer"
		}
		if (style) {
			st = {...style};
		}
		return st
	}

	return (
		<div ref={btnRef} className={classname} onClick={handleClick} style={setStyle()}>
			{isLoading
				? <i className="ri-loader-4-line blue-orange-btn-icon-rotate-spinner"></i>
				: <i className={icon}></i>
			}
		</div>
	)
}