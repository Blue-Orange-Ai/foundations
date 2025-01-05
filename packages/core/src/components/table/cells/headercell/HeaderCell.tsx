import React, {ReactNode} from "react";

import './HeaderCell.css'
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	children: ReactNode;
	dropdownItems?: Array<IContextMenuItem>;
	onClick?: (rowId: string) => void,
	onDropdownSelected?: (arg0: IContextMenuItem) => void;
	hover?: boolean,
	rowId?: string
}
export const HeaderCell: React.FC<Props> = ({children, dropdownItems=[], onClick, onDropdownSelected, hover=false,rowId=""}) => {


	return (
			<td>
				<div className="blue-orange-header-data-table-cell">
					{children}
					{dropdownItems.length > 0 &&
						<ContextMenu width={120} maxHeight={200} items={dropdownItems} onClick={onDropdownSelected}>
							<div className='blue-orange-header-data-table-cell-control'>
								<i className="ri-arrow-down-s-line"></i>
							</div>
						</ContextMenu>
					}
				</div>

			</td>
	)
}