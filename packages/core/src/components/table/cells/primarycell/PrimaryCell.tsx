import React, {ReactNode} from "react";

import './PrimaryCell.css'
import {CellAlignment} from "../../../../interfaces/AppInterfaces";

interface Props {
}
export const PrimaryCell: React.FC<Props> = ({}) => {


	return (
		<td className='blue-orange-primary-data-table-cell'>
			<div className='blue-orange-primary-data-table-cell-cont'>
				<div className='blue-orange-primary-data-avatar'>
				</div>
			</div>
		</td>
	)
}