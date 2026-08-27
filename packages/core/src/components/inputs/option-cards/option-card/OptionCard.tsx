import React from "react";

import './OptionCard.css'

export interface OptionCardProps {
	/** Identifies the option, and is what value and onChange speak in. */
	uuid: string,
	/** The line the card leads with. */
	label: string,
	/** The sentence underneath the label explaining what picking this means. */
	hint?: string,
	/** A remixicon class shown above (or beside) the label. */
	icon?: string,
	/** Anything richer than an icon class — an image, a logo, a badge. Takes precedence over icon. */
	iconElement?: React.ReactNode,
	/** A short tag shown alongside the label — "Beta", "Recommended". */
	tag?: React.ReactNode,
	/** Greys the card out and takes it out of the keyboard order. */
	disabled?: boolean,
	/**
	 * Extra content rendered under the hint. The card itself is the button, so
	 * keep this to static content — nothing focusable or clickable.
	 */
	children?: React.ReactNode
}

/**
 * Declares a single option inside an OptionCards group. Like ButtonTab it
 * renders nothing itself — OptionCards reads its props and its children.
 */
export const OptionCard: React.FC<OptionCardProps> = ({}) => {

	return (
		<></>
	)
}
