import React, {ReactNode, useState} from "react";

import './EmojiGroupState.css'
import {EmojiGroupHeaderTxt} from "../emoji-group-header-txt/EmojiGroupHeaderTxt";
import {EmojiObj} from "../data/UnicodeEmoji";
import {EmojiSelection} from "../emoji-selection/EmojiSelection";

interface Props {
	label: string,
	emojis: EmojiObj[],
	onMouseOver?: (emoji: EmojiObj) => void,
	onMouseLeave?: (emoji: EmojiObj) => void,
	onSelection?: (emoji: EmojiObj) => void,
}
export const EmojiGroupState: React.FC<Props> = ({
													 label,
													 emojis,
													 onMouseOver,
													 onMouseLeave,
													 onSelection}) => {

	return (
		<div className="blue-orange-html-emoji-body-cont">
			<EmojiGroupHeaderTxt label={label}></EmojiGroupHeaderTxt>
			<div className="blue-orange-html-emoji-body-display">
				{emojis.map((item, index) => (
					<EmojiSelection
						key={index}
						emoji={item}
						onMouseOver={onMouseOver}
						onMouseLeave={onMouseLeave}
						onSelection={onSelection}></EmojiSelection>
				))}
			</div>
		</div>
	)
}