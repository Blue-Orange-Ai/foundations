import React, {ReactNode} from "react";

import './Table.css'


interface Props {
	children: ReactNode;
}
export const Table: React.FC<Props> = ({children}) => {


	return (
		<div className="blue-orange-data-table-cont">
			<table className="blue-orange-data-table">
				{children}
			</table>
		</div>

	)
}