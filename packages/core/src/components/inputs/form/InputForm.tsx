import React, {useEffect, useState} from "react";

import './InputForm.css'
import {v4 as uuidv4} from "uuid";

interface Props {
	children: React.ReactNode;
	paddingTop?: number;
	paddingBottom?: number;
	verticalMargin?: number;
}

export const InputForm: React.FC<Props> = ({children, verticalMargin=10, paddingTop=10, paddingBottom=10}) => {

	const formRows: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			formRows.push(child);
		}
	});

	return (
		<div className="blue-orange-input-form" style={{paddingTop: paddingTop + "px", paddingBottom: paddingBottom + "px"}}>
			{formRows.map((child, index) => (
				<div
					key={index}
					className="blue-orange-input-form-row"
					style={{marginBottom: index == formRows.length - 1 ? 0 : verticalMargin + "px"}}>
					{child}
				</div>
			))}
		</div>
	)
}