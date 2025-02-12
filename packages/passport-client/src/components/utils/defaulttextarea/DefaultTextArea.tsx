import React, {useRef, useState} from "react";

import './DefaultTextArea.css';

interface Props {
	value?:string;
	placeholder?: string;
	style?: React.CSSProperties;
	onInputChange?: (value: string) => void;
}

export const DefaultTextArea: React.FC<Props> = ({value="", placeholder="", style = {}, onInputChange}) => {


	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.target.value;
		if (onInputChange) {
			onInputChange(newValue);
		}
	};

	return (
		<textarea
			className="default-text-area"
			placeholder={placeholder}
			onChange={handleInputChange}
			style={style}>
		</textarea>
	);
};