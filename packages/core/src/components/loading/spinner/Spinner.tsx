import React from "react";

import './Spinner.css'

export enum SpinnerSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

interface Props {
	size?: SpinnerSize;
	/** Overrides the size variant with an explicit CSS font size, e.g. "2rem". */
	fontSize?: string;
	/** Defaults to the themed spinner colour. */
	color?: string;
	/** Any remixicon class can be spun — defaults to the loader used elsewhere. */
	icon?: string;
	/** Rendered next to the spinner and used as its accessible label. */
	label?: string;
	style?: React.CSSProperties;
}

const sizeClassName: Record<SpinnerSize, string> = {
	[SpinnerSize.SMALL]: "blue-orange-spinner-sm",
	[SpinnerSize.MEDIUM]: "",
	[SpinnerSize.LARGE]: "blue-orange-spinner-lg",
};

/**
 * An indeterminate loading indicator. Unlike Loading it is themed, sized by
 * variant and can carry a label.
 */
export const Spinner: React.FC<Props> = ({
											 size = SpinnerSize.MEDIUM,
											 fontSize,
											 color,
											 icon = "ri-loader-4-line",
											 label,
											 style = {}}) => {

	const sizeClass = sizeClassName[size] ? " " + sizeClassName[size] : "";

	const spinnerStyle: React.CSSProperties = {...style};

	if (fontSize) {
		spinnerStyle.fontSize = fontSize;
	}

	if (color) {
		spinnerStyle.color = color;
	}

	return (
		<div
			className={"blue-orange-spinner" + sizeClass}
			role="status"
			aria-label={label ?? "Loading"}
			style={spinnerStyle}>
			<i className={icon + " blue-orange-spinner-icon"}></i>
			{label && <span className="blue-orange-spinner-label">{label}</span>}
		</div>
	)
}
