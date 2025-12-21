import React, {ReactNode} from "react";

import './NumberDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {Currency} from "../../../text-decorations/currency/Currency";
import {NumberText} from "../../../text-decorations/number-text/NumberText";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	value: number,
	decimalPlaces?: number,
	alignment?: CellAlignment,
	onClick?: () => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	style?: React.CSSProperties
}
export const NumberDataCell: React.FC<Props> = ({
										  value,
										  decimalPlaces,
										  alignment=CellAlignment.CENTER,
                                          dropdownItems,
                                          onDropdownSelected,
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
                                <NumberText value={value} decimalPlaces={decimalPlaces}></NumberText>
                            </CenteredDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <RightAlignedDiv>
                                <NumberText value={value} decimalPlaces={decimalPlaces}></NumberText>
                            </RightAlignedDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <>
                                <NumberText value={value} decimalPlaces={decimalPlaces}></NumberText>
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
                            <NumberText value={value} decimalPlaces={decimalPlaces}></NumberText>
                        </CenteredDiv>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <RightAlignedDiv>
                            <NumberText value={value} decimalPlaces={decimalPlaces}></NumberText>
                        </RightAlignedDiv>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <>
                            <NumberText value={value} decimalPlaces={decimalPlaces}></NumberText>
                        </>
                    }
                </td>
            }
        </>


	)
}