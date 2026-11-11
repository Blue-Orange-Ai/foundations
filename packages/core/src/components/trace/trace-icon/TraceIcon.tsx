import React from "react";

import './TraceIcon.css'
import {Spinner} from "../../loading/spinner/Spinner";

interface Props {
	/** A remixicon class, e.g. "ri-terminal-line". */
	icon?: string;
	/** Spins the icon — for a step that is running. Falls back to the loader when no icon is given. */
	spin?: boolean;
	/** Anything else — an svg, an image. Used when no icon class is given. */
	children?: React.ReactNode;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The icon at the start (or the end) of a line. It is hidden from assistive
 * tech, so the TraceTitle is the line's accessible name.
 */
export const TraceIcon: React.FC<Props> = ({icon, spin = false, children, classes = "", style = {}}) => {

	const renderIcon = () => {
		if (spin) {
			return <Spinner icon={icon} fontSize="1rem"></Spinner>;
		}
		if (icon) {
			return <i className={icon}></i>;
		}
		return children;
	}

	return (
		<span className={"blue-orange-trace-icon" + (classes ? " " + classes : "")} aria-hidden="true" style={style}>
			{renderIcon()}
		</span>
	)
}
