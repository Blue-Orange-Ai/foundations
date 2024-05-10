import React, { useEffect, useRef }  from "react";
import tippy from "tippy.js";
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";

import './ButtonIcon.css'

interface Props {
	icon: string;
	label?: string;
	isDisabled?: boolean;
	onClick?: () => void;
	style?: React.CSSProperties
}

export const ButtonIcon: React.FC<Props> = ({icon, label, onClick, isDisabled, style}) => {

	const btnRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (label) {
			const current = btnRef.current as TippyHTMLElement;
			if (current) {
				tippy(current, {
					content: label,
					// Add other tippy options here if desired
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

	const handleClick = () => {
		if (!isDisabled && onClick) {
			onClick();
		}
	};

	const setStyle = () => {
		var st: React.CSSProperties = {
			cursor: isDisabled ? "not-allowed" : "pointer"
		}
		if (style) {
			st = {...style};
		}
		return st
	}

	return (
		<div ref={btnRef} className="blue-orange-default-btn-icon no-select" onClick={handleClick} style={setStyle()}>
			<i className={icon}></i>
		</div>
	)
}