import React, {ReactNode, useRef, useState} from "react";

import './EmojiSearchState.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";
import {Input} from "../../input/Input";
import {DropdownItem as DropdownItemObj, DropdownItemType} from "../../../../interfaces/AppInterfaces";
import Fuse from "fuse.js";
import {EmojiObj} from "../data/UnicodeEmoji";
import {EmojiSelection} from "../emoji-selection/EmojiSelection";
import {EmojiGroupHeaderTxt} from "../emoji-group-header-txt/EmojiGroupHeaderTxt";
import {EmojiSearchStateDisplay} from "../emoji-search-state-display/EmojiSearchStateDisplay";

interface Props {
	emojis: EmojiObj[],
	skinTone: number,
	onMouseOver?: (emoji: EmojiObj) => void,
	onMouseLeave?: (emoji: EmojiObj) => void,
	onSelection?: (emoji: EmojiObj) => void,
}
export const EmojiSearchState: React.FC<Props> = ({
													  emojis,
													  skinTone,
													  onMouseOver,
													  onMouseLeave,
													  onSelection}) => {

	const [queryItems, setQueryItems] = useState<Array<EmojiObj>>(emojis)

	const queryItemsRef = useRef<Array<EmojiObj>>(emojis);

	const fuseOptions = {
		keys: [
			"description",
		]
	};

	const handleFilterChange = (query: string) => {
		if (query == "") {
			setQueryItems(emojis)
		} else {
			const fuse = new Fuse(emojis, fuseOptions);
			queryItemsRef.current = fuse.search(query).map(fuseItem => fuseItem.item);
			setQueryItems(queryItemsRef.current);
		}
	}

	return (
		<div className="blue-orange-html-emoji-body-cont">
			<div className="blue-orange-html-emoji-filter-cont">
				<Input placeholder={"Filter..."} style={{height: "32px", fontSize: "14px"}} onInputChange={handleFilterChange} focus={true}></Input>
			</div>
			<EmojiGroupHeaderTxt label={"All Emojis"}></EmojiGroupHeaderTxt>
			<EmojiSearchStateDisplay
				queryItems={queryItems}
				skinTone={skinTone}
				onMouseOver={onMouseOver}
				onMouseLeave={onMouseLeave}
				onSelection={onSelection}></EmojiSearchStateDisplay>
		</div>
	)
}