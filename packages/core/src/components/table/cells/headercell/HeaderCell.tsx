import React, {ReactNode} from "react";

import './HeaderCell.css'
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	children: ReactNode;
	dropdownItems?: Array<IContextMenuItem>;
	onClick?: (rowId: string) => void,
	onDropdownSelected?: (arg0: IContextMenuItem) => void;
	hover?: boolean,
	sorted?: boolean,
	sortAsc?: boolean,
	rowId?: string
}
export const HeaderCell: React.FC<Props> = ({
												children,
												dropdownItems=[],
												onClick,
												onDropdownSelected,
												hover=false,
												sorted=false,
												sortAsc=false,
												rowId =""}) => {


	return (
			<td>
                {dropdownItems.length > 0 &&
                    <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected}>
                        <div className="blue-orange-header-data-table-cell">
                            {children}
                            <div className='blue-orange-header-data-table-cell-control'>
                                {sorted && !sortAsc &&
                                    <i className="ri-arrow-down-s-line"></i>
                                }
                                {sorted && sortAsc &&
                                    <i className="ri-arrow-up-s-line"></i>
                                }
                                {!sorted &&
                                    <div className="blue-orange-header-data-table-cell-control-hidden">
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>

                                }
                            </div>
                        </div>
                    </ContextMenu>
                }
                {dropdownItems.length <= 0 &&
                    <div className="blue-orange-header-data-table-cell">
                        {children}
                        <div className='blue-orange-header-data-table-cell-control'>
                            {sorted && !sortAsc &&
                                <i className="ri-arrow-down-s-line"></i>
                            }
                            {sorted && sortAsc &&
                                <i className="ri-arrow-up-s-line"></i>
                            }
                            {!sorted &&
                                <div className="blue-orange-header-data-table-cell-control-hidden">
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>

                            }
                        </div>
                    </div>
                }


                {/*<div className="blue-orange-header-data-table-cell">*/}
				{/*	{children}*/}
				{/*	{dropdownItems.length > 0 &&*/}
				{/*		<ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected}>*/}
				{/*			<div className='blue-orange-header-data-table-cell-control'>*/}
				{/*				{sorted && !sortAsc &&*/}
				{/*					<i className="ri-arrow-down-s-line"></i>*/}
				{/*				}*/}
				{/*				{sorted && sortAsc &&*/}
				{/*					<i className="ri-arrow-up-s-line"></i>*/}
				{/*				}*/}
				{/*				{!sorted &&*/}
				{/*					<div className="blue-orange-header-data-table-cell-control-hidden">*/}
				{/*						<i className="ri-arrow-down-s-line"></i>*/}
				{/*					</div>*/}

				{/*				}*/}
				{/*			</div>*/}
				{/*		</ContextMenu>*/}
				{/*	}*/}
				{/*</div>*/}

			</td>
	)
}