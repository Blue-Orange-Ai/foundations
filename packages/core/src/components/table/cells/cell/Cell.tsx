import React, {ReactNode} from "react";

import './Cell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";

interface Props {
	children: ReactNode;
	alignment?: CellAlignment,
	onClick?: () => void,
	style?: React.CSSProperties
}
export const Cell: React.FC<Props> = ({
										  children,
										  alignment=CellAlignment.LEFT,
										  style= {},
										  onClick}) => {


	const getTextAlignment = () => {
		try{
			if (alignment == CellAlignment.RIGHT) {
				return "right";
			} else if (alignment == CellAlignment.CENTER) {
				return "center";
			}
			return "left";
		} catch (e) {
			return "left";
		}

	}

	const cellAlignment: React.CSSProperties = {
		textAlign: getTextAlignment()
	}

	const cellClicked = () => {
		if (onClick) {
			onClick();
		}
	}

	return (
		<td
			className='blue-orange-default-data-table-cell'
			onClick={cellClicked}
			style={{...cellAlignment, ...style}}>
			{children}
		</td>
	)
}