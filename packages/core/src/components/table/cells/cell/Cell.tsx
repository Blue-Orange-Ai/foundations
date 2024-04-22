import React, {ReactNode} from "react";

import './Cell.css'
import {CellAlignment} from "../../../../interfaces/AppInterfaces";

interface Props {
	children: ReactNode;
	alignment?: CellAlignment
}
export const Cell: React.FC<Props> = ({children, alignment=CellAlignment.LEFT}) => {


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

	return (
		<td className='blue-orange-default-data-table-cell' style={cellAlignment}>
			{children}
		</td>
	)
}