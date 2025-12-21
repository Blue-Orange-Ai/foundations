import React, {ReactNode} from "react";

import './CurrencyDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {Currency} from "../../../text-decorations/currency/Currency";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";
import {Checkbox} from "../../../inputs/checkbox/Checkbox";

interface Props {
	amount: number,
	currency?: string,
	alignment?: CellAlignment,
	onClick?: () => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	style?: React.CSSProperties
}
export const CurrencyDataCell: React.FC<Props> = ({
										  amount,
										  currency="AUD",
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
                                <Currency amount={amount} currency={currency}></Currency>
                            </CenteredDiv>
                        </ContextMenu>

                    }
                    {alignment == CellAlignment.RIGHT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <RightAlignedDiv>
                                <Currency amount={amount} currency={currency}></Currency>
                            </RightAlignedDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <>
                                <Currency amount={amount} currency={currency}></Currency>
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
                            <Currency amount={amount} currency={currency}></Currency>
                        </CenteredDiv>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <RightAlignedDiv>
                            <Currency amount={amount} currency={currency}></Currency>
                        </RightAlignedDiv>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <>
                            <Currency amount={amount} currency={currency}></Currency>
                        </>
                    }
                </td>
            }
        </>
	)
}