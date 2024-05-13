import React, {ReactNode} from "react";

import './EmojiHeaderItem.css'
import {CellAlignment} from "../../../../interfaces/AppInterfaces";
import {ButtonIcon} from "../../../buttons/button-circle-icon/ButtonIcon";

interface Props {
	icon: string,
	index: number,
	onHeaderItemClicked?: (state: number) => void
}
export const EmojiHeaderItem: React.FC<Props> = ({icon, index, onHeaderItemClicked}) => {


	const style: React.CSSProperties = {
		color: "#393939",
		fontSize: "1.4rem",
		border: "none"
	}

	const itemClicked = () => {
		if (onHeaderItemClicked) {
			onHeaderItemClicked(index);
		}
	}

	return (
		<div className="blue-orange-html-emoji-header-icon">
			<ButtonIcon icon={icon} className={"blue-orange-html-emoji-header-icon-class"} style={style} onClick={itemClicked}></ButtonIcon>
		</div>
	)
}