import React, {ReactNode, useState} from "react";

import './EmojiFooter.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";
import {EmojiObj} from "../data/UnicodeEmoji";

interface Props {
	focusedEmoji?: EmojiObj,
	skin_tone?: number,
}
export const EmojiFooter: React.FC<Props> = ({focusedEmoji, skin_tone}) => {

	const getEmojiHtml = (emoji: EmojiObj) => {
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined || emoji.unicode) {
			return emoji.html;
		}
		return emoji.html + "&#x" + skin_tones[skin_tone] + ";";
	}

	return (
		<div className="blue-orange-html-emoji-footer">
			<div className="blue-orange-html-emoji-footer-selection-cont">
				<div className="blue-orange-html-emoji-footer-selection-cont-left">
					{/*{focusedEmoji == undefined && <button className="blue-orange-html-emoji-footer-add-emoji">Add Emoji</button>}*/}
					{focusedEmoji &&
						<div className="blue-orange-html-emoji-focused-display">
							<div
								className="blue-orange-html-emoji-option blue-orange-html-emoji-option-xlg"
								dangerouslySetInnerHTML={{ __html: getEmojiHtml(focusedEmoji) }}></div>
							<div className="blue-orange-html-emoji-focused-description">
								<div className="blue-orange-html-emoji-focused-description-title">{focusedEmoji.description}</div>
								<div className="blue-orange-html-emoji-focused-description-secondary">:{focusedEmoji.uuid}:</div>
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	)
}