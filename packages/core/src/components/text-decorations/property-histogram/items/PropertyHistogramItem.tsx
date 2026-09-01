import React, {useEffect, useRef} from "react";
import tippy from "tippy.js";

import './PropertyHistogramItem.css'
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";
import {TOOLTIP_Z_INDEX} from "../../../utils/ZIndex";
import {TOOLTIP_POPPER_OPTIONS} from "../../../utils/Tooltip";

interface Props {
	label: string;
	/** Width of the filled portion of the bar, between 0 and 100. */
	percentage: number;
	/** Colour of the filled portion of the bar. */
	color?: string;
	/** Shows a tooltip with the percentage when the bar is hovered. */
	tooltip?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

export const PropertyHistogramItem: React.FC<Props> = ({
	label,
	percentage,
	color,
	tooltip = true,
	classes = "",
	style = {}
}) => {

	const histogramRef = useRef<HTMLDivElement | null>(null);

	const formatPercentage = (value: number) => {
		return `${Math.round(value * 10) / 10}%`;
	}

	useEffect(() => {
		const current = histogramRef.current as TippyHTMLElement;
		if (current && tooltip) {
			tippy(current, {
				content: formatPercentage(percentage),
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
	}, [tooltip, percentage]);

	const generateClassName = () => {
		var className = "blue-orange-property-histogram-item";
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const percentageStyle: React.CSSProperties = {
		width: `${percentage}%`
	}

	if (color) {
		percentageStyle.background = color;
	}

	return (
		<div className={generateClassName()} style={style}>
			<div className="blue-orange-property-histogram-item-text">{label}</div>
			<div className="blue-orange-property-histogram-item-histogram-cont" ref={histogramRef}>
				<div
					className="blue-orange-property-histogram-item-histogram-percentage"
					style={percentageStyle}
				></div>
			</div>
		</div>
	)
}
