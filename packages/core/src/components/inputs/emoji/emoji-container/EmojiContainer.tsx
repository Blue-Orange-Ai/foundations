import React, {ReactNode, useState} from "react";

import Cookies from "js-cookie";

import './EmojiContainer.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";
import {EmojiGroupState} from "../emoji-group-state/EmojiGroupState";
import UnicodeEmoji, {EmojiObj} from "../data/UnicodeEmoji";
import {EmojiFooter} from "../emoji-footer/EmojiFooter";
import {EmojiSearchState} from "../emoji-search-state/EmojiSearchState";

interface Props {
	onSelection?: (emoji: EmojiObj) => void
}
export const EmojiContainer: React.FC<Props> = ({onSelection}) => {

	const initial_skin_tone = Cookies.get("skinTone")

	const groupedEmojis = UnicodeEmoji.getGrouped();

	const flatEmojis = UnicodeEmoji.getFlat();

	const [focusedEmoji, setFocusedEmoji] = useState<EmojiObj | undefined>(undefined);

	const [state, setState] = useState<number>(0);

	const [skinTone, setSkinTone] = useState<number>(initial_skin_tone ? +initial_skin_tone : 0);

	const onMouseOver = (emoji: EmojiObj) => {
		setFocusedEmoji(emoji);
	}

	const onMouseLeave = (emoji: EmojiObj) => {
		setFocusedEmoji(undefined);
	}

	const emojiSelected = (emoji: EmojiObj) => {
		if (onSelection) {
			onSelection(emoji);
		}
	}

	const changeState = (state: number) => {
		setState(state);
	}

	const changeSkinToneSelection = (skinTone: number) => {
		setSkinTone(skinTone);
		Cookies.set("skinTone", skinTone.toString())
	}

	return (
		<div className="blue-orange-html-emoji shadow">
			<EmojiHeader onHeaderItemClicked={changeState} state={state}></EmojiHeader>
			{state == 0 &&
				<EmojiSearchState
					emojis={flatEmojis}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiSearchState>
			}
			{state == 1 &&
				<EmojiGroupState
					label={"Smileys & Emotion"}
					emojis={groupedEmojis["Smileys & Emotion"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 2 &&
				<EmojiGroupState
					label={"Animals & Nature"}
					emojis={groupedEmojis["Animals & Nature"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 3 &&
				<EmojiGroupState
					label={"Food & Drink"}
					emojis={groupedEmojis["Food & Drink"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 4 &&
				<EmojiGroupState
					label={"Travel & Places"}
					emojis={groupedEmojis["Travel & Places"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 5 &&
				<EmojiGroupState
					label={"Activities"}
					emojis={groupedEmojis["Activities"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 6 &&
				<EmojiGroupState
					label={"Objects"}
					emojis={groupedEmojis["Objects"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 7 &&
				<EmojiGroupState
					label={"Symbols"}
					emojis={groupedEmojis["Symbols"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 8 &&
				<EmojiGroupState
					label={"Flags"}
					emojis={groupedEmojis["Flags"]}
					skinTone={skinTone}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			<EmojiFooter focusedEmoji={focusedEmoji} skin_tone={skinTone} changeSkinTone={changeSkinToneSelection}></EmojiFooter>
		</div>
	)
}