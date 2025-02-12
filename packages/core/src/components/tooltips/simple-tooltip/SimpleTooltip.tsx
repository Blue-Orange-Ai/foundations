import React, {useEffect, useRef} from "react";

import './SimpleTooltip.css'
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import tippy from "tippy.js";

interface Props {
	children: React.ReactNode,
	label?: string
}

export const SimpleTooltip: React.FC<Props> = ({children, label}) => {

	const tooltipRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (label) {
			const current = tooltipRef.current as TippyHTMLElement;
			if (current) {
				tippy(current, {
					content: label,
					zIndex: 999999999999999
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

	return (
		<div className="blue-orange-simple-tooltip" ref={tooltipRef}>
			{children}
		</div>
	)
}