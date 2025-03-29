import React, {ReactNode} from "react";

import './DateDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {TruncatedText} from "../../../text-decorations/truncated-text/TruncatedText";
import {SimpleTooltip} from "../../../tooltips/simple-tooltip/SimpleTooltip";
import {TimeDisplay} from "../../../text-decorations/dates/time/TimeDisplay";
import {DateDisplay} from "../../../text-decorations/dates/date-display/DateDisplay";

interface Props {
	date: Date,
	dateformat?: string,
	alignment?: CellAlignment,
	onClick?: () => void,
	style?: React.CSSProperties
}
export const DateDataCell: React.FC<Props> = ({
										  date,
										  dateformat,
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
	)
}