import React, {ReactNode, useState} from "react";

import './EmojiGroupHeaderTxt.css'
import {EmojiHeader} from "../emoji-header/EmojiHeader";

interface Props {
	label: string
}
export const EmojiGroupHeaderTxt: React.FC<Props> = ({label}) => {

	return (
		<div className="blue-orange-html-emoji-header-txt">
			{label}
		</div>
	)
}