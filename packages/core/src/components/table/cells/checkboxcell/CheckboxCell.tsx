import React, {ReactNode} from "react";

import './CheckboxCell.css'
import {CellAlignment} from "../../../../interfaces/AppInterfaces";
import {Checkbox} from "../../../inputs/checkbox/Checkbox";

interface Props {
	state?: boolean,
	onClick?: (state: boolean, rowId: string) => void,
	hover?: boolean,
	rowId?: string
}
export const CheckboxCell: React.FC<Props> = ({state = false, onClick, hover=false,rowId=""}) => {

	return (
		<td className='blue-orange-checkbox-data-table-cell'>
			<div className='blue-orange-checkbox-data-table-cell-inner-cont'>
				<Checkbox checked={state}></Checkbox>
			</div>
		</td>
	)
}