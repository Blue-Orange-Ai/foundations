import React from "react";

import './NavigationMenuItem.css'

interface Props {
	/** The text shown in the bar. */
	label: string;
	/** A remixicon class shown before the label. */
	icon?: string;
	/** Turns the item into a plain link — ignored when the item has children. */
	href?: string;
	disabled?: boolean;
	onClick?: () => void;
	/** The panel shown when the item is opened. Without it the item is a link. */
	children?: React.ReactNode;
}

/**
 * Declares one entry of a NavigationMenu. Like Tab it renders nothing itself —
 * NavigationMenu reads its props.
 */
export const NavigationMenuItem: React.FC<Props> = ({}) => {

	return (
		<></>
	)
}
