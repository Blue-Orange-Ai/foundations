import React, {useRef} from "react";

import './EmojiSkinToneSelector.css'
import {EMOJI_SKIN_TONE_OPTIONS, EmojiSkinTone} from "../../../utils/appearance/EmojiSkinTone";

interface Props {
	value: EmojiSkinTone;
	onChange: (tone: EmojiSkinTone) => void;
	/** Accessible name for the group. Defaults to "Emoji skin tone". */
	label?: string;
	classes?: string;
	style?: React.CSSProperties;
}

/**
 * The default skin tone applied to emoji that carry a Fitzpatrick modifier.
 * Laid out like the picker's own footer so the two read as the same control.
 */
export const EmojiSkinToneSelector: React.FC<Props> = ({
														   value,
														   onChange,
														   label = "Emoji skin tone",
														   classes = "",
														   style = {}}) => {

	const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const moveSelection = (from: number, delta: number) => {
		const next = (from + delta + EMOJI_SKIN_TONE_OPTIONS.length) % EMOJI_SKIN_TONE_OPTIONS.length;
		const node = optionRefs.current[next];
		if (node) {
			node.focus();
		}
		onChange(EMOJI_SKIN_TONE_OPTIONS[next].tone);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			event.preventDefault();
			moveSelection(index, 1);
			return;
		}
		if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			event.preventDefault();
			moveSelection(index, -1);
		}
	};

	return (
		<div
			role="radiogroup"
			aria-label={label}
			className={"blue-orange-blocks-skin-tones" + (classes ? " " + classes : "")}
			style={style}>
			{EMOJI_SKIN_TONE_OPTIONS.map((option, index) => (
				<button
					key={option.tone}
					type="button"
					role="radio"
					aria-checked={value === option.tone}
					aria-label={option.label}
					title={option.label}
					tabIndex={value === option.tone ? 0 : -1}
					ref={(node) => {optionRefs.current[index] = node}}
					className={value === option.tone
						? "blue-orange-blocks-skin-tone blue-orange-blocks-skin-tone-selected"
						: "blue-orange-blocks-skin-tone"}
					onClick={() => onChange(option.tone)}
					onKeyDown={(event) => handleKeyDown(event, index)}>
					<span className="blue-orange-blocks-skin-tone-sample" aria-hidden="true">{option.sample}</span>
					<span className="blue-orange-blocks-skin-tone-label">{option.label}</span>
				</button>
			))}
		</div>
	)
}
