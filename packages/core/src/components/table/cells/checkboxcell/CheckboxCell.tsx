import React, {ReactNode} from "react";

import './CheckboxCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {Checkbox} from "../../../inputs/checkbox/Checkbox";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";

interface Props {
	state?: boolean,
	onClick?: (state: boolean) => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	rowId?: string
	style?: React.CSSProperties
}
export const CheckboxCell: React.FC<Props> = ({
                                                  state = false,
                                                  onClick,
                                                  dropdownItems,
                                                  onDropdownSelected,
                                                  rowId="",
                                                  style={}}) => {

	const checkboxClicked = (state: boolean) => {
		if (onClick) {
			onClick(state);
		}
	}

	return (
        <td className='blue-orange-checkbox-data-table-cell' style={style}>
            {dropdownItems && dropdownItems.length > 0 &&
                <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                    <div className='blue-orange-checkbox-data-table-cell-inner-cont'>
                        <Checkbox checked={state} onCheckboxChange={checkboxClicked}></Checkbox>
                    </div>
                </ContextMenu>
            }
            {(!dropdownItems || dropdownItems.length <= 0) &&
                <div className='blue-orange-checkbox-data-table-cell-inner-cont'>
                    <Checkbox checked={state} onCheckboxChange={checkboxClicked}></Checkbox>
                </div>
            }

		</td>
	)
}