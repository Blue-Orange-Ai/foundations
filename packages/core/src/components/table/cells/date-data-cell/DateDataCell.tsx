import React, {ReactNode} from "react";

import './DateDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {DateDisplay} from "../../../text-decorations/dates/date-display/DateDisplay";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	date: Date,
	dateformat?: string,
	alignment?: CellAlignment,
	onClick?: () => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	style?: React.CSSProperties
}
export const DateDataCell: React.FC<Props> = ({
										  date,
										  dateformat,
                                          dropdownItems,
                                          onDropdownSelected,
										  alignment=CellAlignment.CENTER,
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
		<>
            {dropdownItems && dropdownItems.length > 0 &&
                <td
                    className='blue-orange-data-table-text-cell'
                    onClick={cellClicked}
                    style={{...cellAlignment, ...style}}>
                    {alignment == CellAlignment.CENTER &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <CenteredDiv>
                                <DateDisplay targetDate={date} dateFormat={dateformat}></DateDisplay>
                            </CenteredDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <RightAlignedDiv>
                                <DateDisplay targetDate={date} dateFormat={dateformat}></DateDisplay>
                            </RightAlignedDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <>
                                <DateDisplay targetDate={date} dateFormat={dateformat}></DateDisplay>
                            </>
                        </ContextMenu>
                    }
                </td>
            }
            {(!dropdownItems || dropdownItems.length <= 0) &&
                <td
                    className='blue-orange-data-table-text-cell'
                    onClick={cellClicked}
                    style={{...cellAlignment, ...style}}>
                    {alignment == CellAlignment.CENTER &&
                        <CenteredDiv>
                            <DateDisplay targetDate={date} dateFormat={dateformat}></DateDisplay>
                        </CenteredDiv>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <RightAlignedDiv>
                            <DateDisplay targetDate={date} dateFormat={dateformat}></DateDisplay>
                        </RightAlignedDiv>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <>
                            <DateDisplay targetDate={date} dateFormat={dateformat}></DateDisplay>
                        </>
                    }
                </td>
            }
        </>

	)
}