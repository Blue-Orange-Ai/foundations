import React, {useRef, useState} from "react";

import './DateContextWindowSingle.css';
import {Month} from "../month/Month";
import 'animate.css';

interface Props {
	selectedDate?: Date,
	style: React.CSSProperties,
	onSelection: (date: Date) => void;
}

export const DateContextWindowSingle: React.FC<Props> = ({selectedDate, style, onSelection}) => {

	return (
		<div className="blue-orange-date-picker-context-window-single animate__fadeIn" style={style}>
			<Month date={selectedDate} onSelection={onSelection}></Month>
		</div>
	);
};