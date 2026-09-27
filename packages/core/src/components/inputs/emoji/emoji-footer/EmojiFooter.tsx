import React, {ReactNode, useState} from "react";

import './EmojiFooter.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";
import {EmojiObj} from "../data/UnicodeEmoji";
import {emojiHtmlToText} from "../data/EmojiText";

interface Props {
	focusedEmoji?: EmojiObj,
	skin_tone?: number,
	changeSkinTone?: (skinTone: number) => void
}
export const EmojiFooter: React.FC<Props> = ({focusedEmoji, skin_tone, changeSkinTone}) => {

	const [skinToneSelectionState, setSkinToneSelectionState] = useState(false)

	const getEmojiHtml = (emoji: EmojiObj) => {
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined || emoji.unicode) {
			return emoji.html;
		}
		return emoji.html + "&#x" + skin_tones[skin_tone] + ";";
	}

	const skinToneClicked = (skinTone: number) => {
		if (changeSkinTone) {
			changeSkinTone(skinTone)
		}
		setSkinToneSelectionState(false);
	}

	const openSkinToneSelection = () => {
		setSkinToneSelectionState(true)
	}

	return (
		<div className="blue-orange-html-emoji-footer">
			<div className="blue-orange-html-emoji-footer-selection-cont">
				<div className="blue-orange-html-emoji-footer-selection-cont-left">
					{/*{focusedEmoji == undefined && <button className="blue-orange-html-emoji-footer-add-emoji">Add Emoji</button>}*/}
					{focusedEmoji && !skinToneSelectionState &&
						<div className="blue-orange-html-emoji-focused-display">
							<div
								className="blue-orange-html-emoji-option blue-orange-html-emoji-option-xlg">{emojiHtmlToText(getEmojiHtml(focusedEmoji))}</div>
							<div className="blue-orange-html-emoji-focused-description">
								<div className="blue-orange-html-emoji-focused-description-title">{focusedEmoji.description}</div>
								<div className="blue-orange-html-emoji-focused-description-secondary">:{focusedEmoji.uuid}:</div>
							</div>
						</div>
					}
				</div>
				<div className="blue-orange-html-emoji-footer-selection-cont-right">
					{!skinToneSelectionState &&
						<div className="blue-orange-html-emoji-option" onClick={openSkinToneSelection}>
							{skin_tone == 0 && <>✋</>}
							{skin_tone == 1 && <>✋🏻</>}
							{skin_tone == 2 && <>✋🏼</>}
							{skin_tone == 3 && <>✋🏽</>}
							{skin_tone == 4 && <>✋🏾</>}
							{skin_tone == 5 && <>✋🏿</>}
						</div>
					}
					{skinToneSelectionState &&
						<div>
							<div className="blue-orange-html-emoji-select-skin-tone-row">
								<div
									className={skin_tone == 0 ?
										"blue-orange-html-emoji-option blue-orange-html-emoji-option-active" :
										"blue-orange-html-emoji-option"}
									onClick={() => skinToneClicked(0)}
								>✋</div>
								<div
									className={skin_tone == 1 ?
										"blue-orange-html-emoji-option blue-orange-html-emoji-option-active" :
										"blue-orange-html-emoji-option"}
									onClick={() => skinToneClicked(1)}
								>✋🏻</div>
								<div
									className={skin_tone == 2 ?
										"blue-orange-html-emoji-option blue-orange-html-emoji-option-active" :
										"blue-orange-html-emoji-option"}
									onClick={() => skinToneClicked(2)}
								>✋🏼</div>
								<div
									className={skin_tone == 3 ?
										"blue-orange-html-emoji-option blue-orange-html-emoji-option-active" :
										"blue-orange-html-emoji-option"}
									onClick={() => skinToneClicked(3)}
								>✋🏽</div>
								<div
									className={skin_tone == 4 ?
										"blue-orange-html-emoji-option blue-orange-html-emoji-option-active" :
										"blue-orange-html-emoji-option"}
									onClick={() => skinToneClicked(4)}
								>✋🏾</div>
								<div
									className={skin_tone == 5 ?
										"blue-orange-html-emoji-option blue-orange-html-emoji-option-active" :
										"blue-orange-html-emoji-option"}
									onClick={() => skinToneClicked(5)}
								>✋🏿</div>
							</div>
							<div className="blue-orange-html-emoji-select-skin-tone-helper no-select">Choose your
								default skin tone
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	)
}