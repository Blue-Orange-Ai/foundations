import React from "react";

import './EmptyMedia.css'

export enum EmptyMediaVariant {
	/** Renders whatever is passed as-is — an image, an avatar, an illustration. */
	DEFAULT = "DEFAULT",
	/** Renders the media inside a rounded, filled tile. */
	ICON = "ICON"
}

interface Props {
	/** A remixicon class rendered inside the media tile. */
	icon?: string;
	variant?: EmptyMediaVariant;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

/**
 * The illustration at the top of an empty state. Pass an `icon` for the common
 * case, or any children for an image or custom artwork.
 */
export const EmptyMedia: React.FC<Props> = ({
												icon,
												variant = icon ? EmptyMediaVariant.ICON : EmptyMediaVariant.DEFAULT,
												children,
												style = {}}) => {

	const className = variant === EmptyMediaVariant.ICON
		? "blue-orange-empty-media blue-orange-empty-media-icon"
		: "blue-orange-empty-media";

	return (
		<div className={className} style={style}>
			{icon && <i className={icon}></i>}
			{children}
		</div>
	)
}
