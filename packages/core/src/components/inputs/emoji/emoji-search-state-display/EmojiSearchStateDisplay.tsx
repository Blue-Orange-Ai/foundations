import React, {ReactNode, useRef, useState} from "react";

import './EmojiSearchStateDisplay.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";
import {Input} from "../../input/Input";
import {DropdownItem as DropdownItemObj, DropdownItemType} from "../../../../interfaces/AppInterfaces";
import Fuse from "fuse.js";
import {EmojiObj} from "../data/UnicodeEmoji";
import {EmojiSelection} from "../emoji-selection/EmojiSelection";
import {EmojiGroupHeaderTxt} from "../emoji-group-header-txt/EmojiGroupHeaderTxt";

interface Props {
	queryItems: EmojiObj[],
	skinTone: number,
	onMouseOver?: (emoji: EmojiObj) => void,
	onMouseLeave?: (emoji: EmojiObj) => void,
	onSelection?: (emoji: EmojiObj) => void,
}
export const EmojiSearchStateDisplay: React.FC<Props> = ({
															 queryItems,
													  		 skinTone,
															 onMouseOver,
															 onMouseLeave,
															 onSelection}) => {



	return (
		<div className="blue-orange-html-emoji-body-display">
			{queryItems.map((item, index) => (
				<EmojiSelection
					key={item.uuid}
					emoji={item}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					skin_tone={skinTone}
					onSelection={onSelection}></EmojiSelection>
			))}
		</div>
	)
}