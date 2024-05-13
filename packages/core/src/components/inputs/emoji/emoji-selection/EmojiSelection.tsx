import React, {ReactNode, useEffect, useState} from "react";

import './EmojiSelection.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";
import {EmojiObj} from "../data/UnicodeEmoji";

interface Props {
	emoji: EmojiObj,
	skin_tone?: number,
	onMouseOver?: (emoji: EmojiObj) => void,
	onMouseLeave?: (emoji: EmojiObj) => void,
	onSelection?: (emoji: EmojiObj) => void,
}
export const EmojiSelection: React.FC<Props> = ({
													emoji,
													skin_tone,
													onMouseOver,
													onMouseLeave,
													onSelection}) => {


	const getEmojiHtml = (emoji: EmojiObj) => {
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined || skin_tone == 0) {
			return emoji.html;
		}
		var emojisSplit: string[] = emoji.html.split(";");
		if (emojisSplit.length < 2) {
			return emoji.html + "&#x" + skin_tones[skin_tone - 1] + ";";
		}
		emojisSplit.splice(1, 0, "&#x" + skin_tones[skin_tone - 1]);
		return emojisSplit.join(";")
	}

	const [emojiHtml, setEmojiHtml] = useState<string>(getEmojiHtml(emoji));

	useEffect(() => {
		setEmojiHtml(getEmojiHtml(emoji));
	}, [skin_tone]);

	const getEmojiUnicode = (emoji: EmojiObj) => {
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined) {
			return emoji.unicode;
		}
		return emoji.unicode + " U+" + skin_tones[skin_tone];
	}

	const mouseEnter = () => {
		if (onMouseOver) {
			onMouseOver(emoji);
		}
	}

	const mouseLeave = () => {
		if (onMouseLeave) {
			onMouseLeave(emoji);
		}
	}

	const selection = () => {
		if (onSelection) {
			onSelection(emoji);
		}
	}

	return (
		<div
			className="blue-orange-html-emoji-option"
			data-unicode={getEmojiUnicode(emoji)}
			data-html={getEmojiHtml(emoji)}
			onMouseOver={mouseEnter}
			onMouseLeave={mouseLeave}
			onClick={selection}
			dangerouslySetInnerHTML={{ __html: emojiHtml }}
		>
		</div>
	)
}