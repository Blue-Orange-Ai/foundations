import React, {ReactNode} from "react";

import './NumberDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {Currency} from "../../../text-decorations/currency/Currency";
import {NumberText} from "../../../text-decorations/number-text/NumberText";

interface Props {
	value: number,
	decimalPlaces?: number,
	alignment?: CellAlignment,
	onClick?: () => void,
	style?: React.CSSProperties
}
export const NumberDataCell: React.FC<Props> = ({
										  value,
										  decimalPlaces,
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
	)
}