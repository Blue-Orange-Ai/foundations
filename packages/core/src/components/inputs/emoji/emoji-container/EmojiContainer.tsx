import React, {ReactNode, useState} from "react";

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

	const groupedEmojis = UnicodeEmoji.getGrouped();

	const flatEmojis = UnicodeEmoji.getFlat();

	const [focusedEmoji, setFocusedEmoji] = useState<EmojiObj | undefined>(undefined);

	const [state, setState] = useState<number>(0);

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

	return (
		<div className="blue-orange-html-emoji shadow">
			<EmojiHeader onHeaderItemClicked={changeState} state={state}></EmojiHeader>
			{state == 0 &&
				<EmojiSearchState
					emojis={flatEmojis}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiSearchState>
			}
			{state == 1 &&
				<EmojiGroupState
					label={"Smileys & Emotion"}
					emojis={groupedEmojis["Smileys & Emotion"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 2 &&
				<EmojiGroupState
					label={"Animals & Nature"}
					emojis={groupedEmojis["Animals & Nature"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 3 &&
				<EmojiGroupState
					label={"Food & Drink"}
					emojis={groupedEmojis["Food & Drink"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 4 &&
				<EmojiGroupState
					label={"Travel & Places"}
					emojis={groupedEmojis["Travel & Places"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 5 &&
				<EmojiGroupState
					label={"Activities"}
					emojis={groupedEmojis["Activities"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 6 &&
				<EmojiGroupState
					label={"Objects"}
					emojis={groupedEmojis["Objects"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 7 &&
				<EmojiGroupState
					label={"Symbols"}
					emojis={groupedEmojis["Symbols"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			{state == 8 &&
				<EmojiGroupState
					label={"Flags"}
					emojis={groupedEmojis["Flags"]}
					onMouseOver={onMouseOver}
					onMouseLeave={onMouseLeave}
					onSelection={emojiSelected}></EmojiGroupState>
			}
			<EmojiFooter focusedEmoji={focusedEmoji}></EmojiFooter>
		</div>
	)
}