import React, {ReactNode, useEffect, useRef, useState, MouseEvent as ReactMouseEvent} from "react";

import './EmojiWrapper.css'
import {EmojiContainer} from "../emoji-container/EmojiContainer";
import {EmojiObj} from "../data/UnicodeEmoji";
import Cookies from "js-cookie";

interface Props {
	children: ReactNode;
	onSelection?: (emoji: string) => void;
}

export const EmojiWrapper: React.FC<Props> = ({children, onSelection}) => {

	const POPUP_WIDTH = 382;
	const POPUP_HEIGHT = 400;
	const GAP = 10;

	const calculateContextWindowPos = () : React.CSSProperties => {
		try {
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			// Horizontal: center on the trigger, then clamp to viewport
			let left = rect.left + rect.width / 2 - POPUP_WIDTH / 2;
			left = Math.max(GAP, Math.min(left, vw - POPUP_WIDTH - GAP));

			// Vertical: prefer below the trigger; if not enough space, show above
			const spaceBelow = vh - rect.bottom - GAP;
			const spaceAbove = rect.top - GAP;

			if (spaceBelow >= POPUP_HEIGHT) {
				return { left: left + "px", top: (rect.bottom + GAP) + "px" };
			} else if (spaceAbove >= POPUP_HEIGHT) {
				return { left: left + "px", top: (rect.top - GAP - POPUP_HEIGHT) + "px" };
			} else if (spaceBelow >= spaceAbove) {
				// Not enough space either way — pin to bottom edge
				return { left: left + "px", top: (vh - POPUP_HEIGHT - GAP) + "px" };
			} else {
				// Pin to top edge
				return { left: left + "px", top: GAP + "px" };
			}
		} catch (e) {
			return { left: GAP + "px", top: GAP + "px" };
		}
	}

	const [visible, setVisible] = useState(false);

	const visibleRef = useRef(visible);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const emojiRef = useRef<HTMLInputElement | null>(null);

	const [position, setPosition] = useState(calculateContextWindowPos());

	const toggleVisibility = (ev: ReactMouseEvent<HTMLDivElement>) => {
		const target = ev.target as HTMLElement;
		if (!isDescendantOf(emojiRef.current, target)) {
			setVisible(!visibleRef.current)
			visibleRef.current = !visibleRef.current
			setPosition(calculateContextWindowPos());
		}

	}

	const isDescendantOf = (parent:HTMLElement | null, child:HTMLElement | null) =>{
		if (parent && child) {
			if (parent === child) {
				return child
			}
			try{
				var node = child.parentElement;
				while (node != null){
					if (node === parent){
						return node;
					}
					node = node.parentElement;
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	const handleMouseDown = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (inputRef && !isDescendantOf(inputRef.current, target)) {
			setVisible(false);
			visibleRef.current = false;
		} else if (inputRef && !isDescendantOf(inputRef.current, target) && !visibleRef.current) {
			setVisible(true);
			visibleRef.current = true;
			setPosition(calculateContextWindowPos());
		}
	};

	const handleKeyDown = (e:KeyboardEvent) => {
		if (e.key == "Escape") {
			setVisible(false);
			visibleRef.current = false;
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('keydown', handleKeyDown);
		}
	}, []);

	const getEmojiHtml = (emoji: EmojiObj) => {
		const skin_tone = Cookies.get("skinTone")
		var skin_tones = ["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]
		if (!emoji.skin_tone || skin_tone === undefined || +skin_tone == 0) {
			return emoji.html;
		}
		var emojisSplit: string[] = emoji.html.split(";");
		if (emojisSplit.length < 2) {
			return emoji.html + "&#x" + skin_tones[+skin_tone - 1] + ";";
		}
		emojisSplit.splice(1, 0, "&#x" + skin_tones[+skin_tone - 1]);
		return emojisSplit.join(";")
	}

	const emojiSelection = (emoji: EmojiObj) => {
		if (onSelection) {
			onSelection(getEmojiHtml(emoji));
			setVisible(false);
			visibleRef.current = false;
		}
	}

	return (
		<div ref={inputRef} onClick={toggleVisibility}>
			{children}
			{visible &&
				<div ref={emojiRef} className="blue-orange-emoji-wrapper" style={position}>
					<EmojiContainer onSelection={emojiSelection}></EmojiContainer>
				</div>
			}
		</div>
	)
}