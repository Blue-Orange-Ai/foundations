import React, {ReactNode} from "react";

import './CheckboxCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {Checkbox} from "../../../inputs/checkbox/Checkbox";

interface Props {
	state?: boolean,
	onClick?: (state: boolean) => void,
	rowId?: string
	style?: React.CSSProperties
}
export const CheckboxCell: React.FC<Props> = ({state = false, onClick, rowId="", style={}}) => {

	const checkboxClicked = (state: boolean) => {
		if (onClick) {
			onClick(state);
		}
	}

	return (
		<td className='blue-orange-checkbox-data-table-cell' style={style}>
			<div className='blue-orange-checkbox-data-table-cell-inner-cont'>
				<Checkbox checked={state} onCheckboxChange={checkboxClicked}></Checkbox>
			</div>
		</td>
	)
}