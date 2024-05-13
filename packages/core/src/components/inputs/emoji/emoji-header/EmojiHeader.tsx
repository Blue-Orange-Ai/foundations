import React, {ReactNode} from "react";

import './EmojiHeader.css'
import {CellAlignment} from "../../../../interfaces/AppInterfaces";
import {ButtonIcon} from "../../../buttons/button-circle-icon/ButtonIcon";
import {EmojiHeaderItem} from "../emoji-header-item/EmojiHeaderItem";

interface Props {
	state: number,
	onHeaderItemClicked?: (state: number) => void;
}
export const EmojiHeader: React.FC<Props> = ({state, onHeaderItemClicked}) => {



	return (
		<div className="blue-orange-html-emoji-header">
			<EmojiHeaderItem icon={"ri-search-line"} index={0} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-emotion-happy-line"} index={1} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-leaf-line"} index={2} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-cake-3-line"} index={3} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-flight-takeoff-line"} index={4} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-basketball-line"} index={5} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-lightbulb-line"} index={6} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-notification-line"} index={7} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			<EmojiHeaderItem icon={"ri-flag-2-line"} index={8} onHeaderItemClicked={onHeaderItemClicked} state={state}></EmojiHeaderItem>
			{/*<EmojiHeaderItem icon={"ri-pencil-ruler-line"} index={0} onHeaderItemClicked={onHeaderItemClicked}></EmojiHeaderItem>*/}
		</div>
	)
}