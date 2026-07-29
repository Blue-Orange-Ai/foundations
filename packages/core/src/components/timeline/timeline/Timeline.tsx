import React from "react";

import './Timeline.css'
import {TimelineAlign, TimelineContext, TimelineOrientation} from "./TimelineContext";

interface Props {
	children: React.ReactNode;
	orientation?: TimelineOrientation;
	/** Alternating puts items either side of a centred rail. Vertical only. */
	align?: TimelineAlign;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * A run of events joined by a rail. Nest a TimelineItem per event — each one
 * draws its own marker and the connector down (or across) to the next.
 */
export const Timeline: React.FC<Props> = ({
											  children,
											  orientation = TimelineOrientation.VERTICAL,
											  align = TimelineAlign.START,
											  classes = "",
											  style = {}}) => {

	const items = React.Children.toArray(children);

	const alternate = align === TimelineAlign.ALTERNATE && orientation === TimelineOrientation.VERTICAL;

	const generateClassName = () => {
		var className = "blue-orange-timeline";
		className += orientation === TimelineOrientation.HORIZONTAL
			? " blue-orange-timeline-horizontal"
			: " blue-orange-timeline-vertical";
		if (alternate) {
			className += " blue-orange-timeline-alternate";
		}
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	return (
		<div className={generateClassName()} style={style}>
			{items.map((item, index) => (
				// A provider renders no markup of its own, so the item stays a direct
				// child of the timeline and its own layout is untouched.
				<TimelineContext.Provider
					key={index}
					value={{
						orientation: orientation,
						align: alternate ? TimelineAlign.ALTERNATE : TimelineAlign.START,
						index: index,
						last: index === items.length - 1
					}}>
					{item}
				</TimelineContext.Provider>
			))}
		</div>
	)
}
