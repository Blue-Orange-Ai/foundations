import React, {ReactNode, useRef, useState} from "react";

import './EmojiSearchStateDisplay.css'
import {EmojiObj} from "../data/UnicodeEmoji";
import {EmojiSelection} from "../emoji-selection/EmojiSelection";
import { v4 as uuidv4 } from 'uuid';

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


	const uuid = uuidv4();


	return (
		<div className="blue-orange-html-emoji-body-display">
			{queryItems.map((item, index) => (
				<EmojiSelection
					key={item.uuid + "-" + uuidv4()}
					emoji={item}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					skin_tone={skinTone}
					onSelection={onSelection}></EmojiSelection>
			))}
		</div>
	)
}