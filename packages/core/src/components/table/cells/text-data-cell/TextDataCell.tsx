import React, {ReactNode} from "react";

import './TextDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {TruncatedText} from "../../../text-decorations/truncated-text/TruncatedText";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	text: string,
	alignment?: CellAlignment,
	onClick?: () => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	style?: React.CSSProperties
}
export const TextDataCell: React.FC<Props> = ({
										  text,
										  alignment=CellAlignment.LEFT,
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
                                <TruncatedText text={text} maxLines={1}></TruncatedText>
                            </CenteredDiv>
                        </ContextMenu>

                    }
                    {alignment == CellAlignment.RIGHT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <RightAlignedDiv>
                                <TruncatedText text={text} maxLines={1}></TruncatedText>
                            </RightAlignedDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <TruncatedText text={text} maxLines={1}></TruncatedText>
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
                            <TruncatedText text={text} maxLines={1}></TruncatedText>
                        </CenteredDiv>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <RightAlignedDiv>
                            <TruncatedText text={text} maxLines={1}></TruncatedText>
                        </RightAlignedDiv>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <>
                            <TruncatedText text={text} maxLines={1}></TruncatedText>
                        </>
                    }
                </td>
            }

        </>

	)
}