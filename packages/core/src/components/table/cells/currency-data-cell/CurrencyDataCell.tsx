import React, {ReactNode} from "react";

import './CurrencyDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {Currency} from "../../../text-decorations/currency/Currency";

interface Props {
	amount: number,
	currency?: string,
	alignment?: CellAlignment,
	onClick?: () => void,
	style?: React.CSSProperties
}
export const CurrencyDataCell: React.FC<Props> = ({
										  amount,
										  currency="AUD",
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
	)
}