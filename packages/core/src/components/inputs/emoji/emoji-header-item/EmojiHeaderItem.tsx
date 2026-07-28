import React from "react";

import './EmojiHeaderItem.css'
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";

interface Props {
	icon: string,
	index: number,
	state: number,
	onHeaderItemClicked?: (state: number) => void
}
export const EmojiHeaderItem: React.FC<Props> = ({icon, index, state, onHeaderItemClicked}) => {


	// No explicit colour here: the icon inherits `currentColor` from the wrapping
	// header-icon class, which is theme-aware (light/dark). Hardcoding a colour
	// would override the dark-mode rule and leave the icons unreadable.
	const style: React.CSSProperties = {
		fontSize: "1.4rem",
		border: "none"
	}

	const itemClicked = () => {
		if (onHeaderItemClicked) {
			onHeaderItemClicked(index);
		}
	}

	return (
		<div className={state == index ?
			"blue-orange-html-emoji-header-icon-class-active" :
			"blue-orange-html-emoji-header-icon-class"}>
			<ButtonIcon
				icon={icon}
				style={style}
				onClick={itemClicked}></ButtonIcon>
		</div>
	)
}