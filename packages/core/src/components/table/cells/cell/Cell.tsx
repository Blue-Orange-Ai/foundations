import React, {ReactNode} from "react";

import './Cell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	children: ReactNode;
	alignment?: CellAlignment,
	onClick?: () => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	style?: React.CSSProperties
}
export const Cell: React.FC<Props> = ({
										  children,
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
                    className='blue-orange-default-data-table-cell'
                    onClick={cellClicked}
                    style={{...cellAlignment, ...style}}>
                    {alignment == CellAlignment.CENTER && <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}><CenteredDiv>{children}</CenteredDiv></ContextMenu>}
                    {alignment == CellAlignment.RIGHT && <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}><RightAlignedDiv>{children}</RightAlignedDiv></ContextMenu>}
                    {alignment == CellAlignment.LEFT && <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}><>{children}</></ContextMenu>}
                </td>
            }
            {(!dropdownItems || dropdownItems.length <= 0) &&
                <td
                    className='blue-orange-default-data-table-cell'
                    onClick={cellClicked}
                    style={{...cellAlignment, ...style}}>
                    {alignment == CellAlignment.CENTER && <CenteredDiv>{children}</CenteredDiv>}
                    {alignment == CellAlignment.RIGHT && <RightAlignedDiv>{children}</RightAlignedDiv>}
                    {alignment == CellAlignment.LEFT && <>{children}</>}
                </td>
            }

        </>

	)
}