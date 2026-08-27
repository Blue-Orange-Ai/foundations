import React, {ReactNode} from "react";

import './IconText.css'

export enum IconTextSize {
	/** Takes the font size of whatever it sits in. */
	INHERIT = "INHERIT",
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

export enum IconTextPosition {
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

interface Props {
	/** The text the icon is put against. */
	children: ReactNode;
	/** A remixicon class — the icon shown beside the text. */
	icon?: string;
	/** Anything richer than an icon class — an avatar, an image, a status dot. Takes precedence over icon. */
	iconElement?: ReactNode;
	/** Which side of the text the icon sits on. */
	iconPosition?: IconTextPosition;
	size?: IconTextSize;
	/** Colours the whole line. Left off it takes the colour it inherits. */
	color?: string;
	/** Colours the icon on its own, for a status colour against ordinary text. */
	iconColor?: string;
	/** Holds the icon back from the text so the text stays the thing being read. */
	mutedIcon?: boolean;
	bold?: boolean;
	/** The space between the icon and the text, in pixels. */
	gap?: number;
	/** Keeps the text on one line and cuts it with an ellipsis. */
	truncate?: boolean;
	/** Lines the icon up with the first line rather than the middle, for text that wraps. */
	alignTop?: boolean;
	/** Fills the width of its parent instead of sitting at the width of its content. */
	fullWidth?: boolean;
	/** The native tooltip, worth setting whenever the text can be truncated. */
	title?: string;
	style?: React.CSSProperties;
	iconStyle?: React.CSSProperties;
	textStyle?: React.CSSProperties;
	onClick?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
}

const sizeClassName: Record<IconTextSize, string> = {
	[IconTextSize.INHERIT]: "",
	[IconTextSize.SMALL]: "blue-orange-icon-text-sm",
	[IconTextSize.MEDIUM]: "blue-orange-icon-text-md",
	[IconTextSize.LARGE]: "blue-orange-icon-text-lg",
};

/**
 * An icon put against a line of text — a host beside a server icon, a region
 * beside a globe, a branch beside a branch icon. It is the smallest thing a
 * table cell or a detail row keeps repeating, so it is worth one component
 * rather than a flex row rewritten everywhere.
 *
 * The icon scales with the text, so the pair stays in proportion at any size.
 */
export const IconText: React.FC<Props> = ({
											  children,
											  icon,
											  iconElement,
											  iconPosition = IconTextPosition.LEFT,
											  size = IconTextSize.MEDIUM,
											  color,
											  iconColor,
											  mutedIcon = true,
											  bold = false,
											  gap,
											  truncate = false,
											  alignTop = false,
											  fullWidth = false,
											  title,
											  style = {},
											  iconStyle = {},
											  textStyle = {},
											  onClick}) => {

	const generateClassName = () => {
		var className = "blue-orange-icon-text";
		if (sizeClassName[size]) {
			className += " " + sizeClassName[size];
		}
		if (mutedIcon) {
			className += " blue-orange-icon-text-muted-icon";
		}
		if (bold) {
			className += " blue-orange-icon-text-bold";
		}
		if (truncate) {
			className += " blue-orange-icon-text-truncated";
		}
		if (alignTop) {
			className += " blue-orange-icon-text-align-top";
		}
		if (fullWidth) {
			className += " blue-orange-icon-text-full-width";
		}
		if (onClick) {
			className += " blue-orange-icon-text-interactive";
		}
		return className;
	}

	const generateStyle = (): React.CSSProperties => {
		return {
			color: color,
			gap: gap === undefined ? undefined : gap + "px",
			...style
		};
	}

	const iconNode = () => {
		const styling: React.CSSProperties = {color: iconColor, ...iconStyle};
		if (iconElement) {
			return <span className="blue-orange-icon-text-icon" style={styling}>{iconElement}</span>
		}
		if (icon) {
			return <i className={icon + " blue-orange-icon-text-icon"} style={styling}></i>
		}
		return <></>
	}

	/** A line that acts as a button has to answer the keyboard like one. */
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!onClick) {
			return;
		}
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onClick(event);
		}
	}

	return (
		<div
			className={generateClassName()}
			style={generateStyle()}
			title={title}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			onClick={onClick}
			onKeyDown={handleKeyDown}>
			{iconPosition === IconTextPosition.LEFT && iconNode()}
			<span className="blue-orange-icon-text-label" style={textStyle}>{children}</span>
			{iconPosition === IconTextPosition.RIGHT && iconNode()}
		</div>
	)
}
