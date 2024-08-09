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

	const getClientTop = () => {
		try {
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			return rect.top;
		} catch (e) {
			return 0;
		}

	}

	const getClientBottom = () => {
		try {
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			return window.innerHeight - rect.bottom;
		} catch (e) {
			return 0;
		}

	}

	const getClientHeight = () => {
		try{
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			return rect.height;
		} catch (e) {
			return 0;
		}

	}

	const calculateLeftPosition = () => {
		try{
			const rect = inputRef.current?.getBoundingClientRect() as DOMRect;
			const clientWidth = rect.width;
			const clientLeft = rect.left;
			const width = 278;
			const offset = (width - clientWidth) / 2;
			return Math.max(0, clientLeft - offset);
		} catch (e) {
			return 0;
		}

	}

	const isPosAbove = () => {
		if (getClientTop() > window.innerHeight / 2) {
			return true;
		}
		return false;
	}

	const calculateContextWindowPos = () : React.CSSProperties => {
		if (isPosAbove() && (getClientBottom() + getClientHeight() + 10) < window.innerHeight) {
			return {
				left: calculateLeftPosition(),
				bottom: getClientBottom() + getClientHeight() + 10 + "px"
			}
		} else if (isPosAbove()) {
			return {
				left: calculateLeftPosition(),
				top: "20px"
			}
		} else if (!isPosAbove() && (getClientTop() - getClientHeight() + 20) > 0) {
			return {
				left: calculateLeftPosition(),
				top: getClientTop() + getClientHeight() + 20 + "px"
			}
		} else {
			return {
				left: calculateLeftPosition(),
				bottom: "20px"
			}
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