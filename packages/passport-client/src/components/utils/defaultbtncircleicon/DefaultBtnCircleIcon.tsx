import React, { useEffect, useRef }  from "react";
import tippy from "tippy.js";
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";

import './DefaultBtnCircleIcon.css'

interface Props {
	icon: string;
	label: string;
	isDisabled?: boolean;
	onClick?: () => void;
}

export const DefaultBtnCircleIcon: React.FC<Props> = ({icon, label, onClick, isDisabled}) => {

	const btnRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
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
	}, []);

	const handleClick = () => {
		if (!isDisabled && onClick) {
			onClick();
		}
	};

	const style: React.CSSProperties = {
		cursor: isDisabled ? "not-allowed" : "pointer"
	}

	return (
		<div ref={btnRef} className="passport-default-btn-circle no-select" onClick={handleClick} style={style}>
			<i className={icon}></i>
		</div>
	)
}