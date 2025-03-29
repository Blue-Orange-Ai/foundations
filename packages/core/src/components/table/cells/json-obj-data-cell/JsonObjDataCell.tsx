import React, {ReactNode} from "react";

import './JsonObjDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {TextDataCell} from "../text-data-cell/TextDataCell";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {TruncatedText} from "../../../text-decorations/truncated-text/TruncatedText";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {JsonObjectText} from "../../../text-decorations/json-object-text/JsonObjectText";
import {TruncatedTextWrapper} from "../../../text-decorations/truncated-text-wrapper/TruncatedTextWrapper";

interface Props {
	obj: any,
	alignment?: CellAlignment,
	onClick?: () => void,
	style?: React.CSSProperties
}
export const JsonObjDataCell: React.FC<Props> = ({
										  obj,
										  alignment=CellAlignment.LEFT,
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
					<TruncatedTextWrapper maxLines={1}>
						<JsonObjectText obj={obj}></JsonObjectText>
					</TruncatedTextWrapper>
				</CenteredDiv>
			}
			{alignment == CellAlignment.RIGHT &&
				<RightAlignedDiv>
					<TruncatedTextWrapper maxLines={1}>
						<JsonObjectText obj={obj}></JsonObjectText>
					</TruncatedTextWrapper>
				</RightAlignedDiv>
			}
			{alignment == CellAlignment.LEFT &&
				<>
					<TruncatedTextWrapper maxLines={1}>
						<JsonObjectText obj={obj}></JsonObjectText>
					</TruncatedTextWrapper>
				</>
			}
		</td>
	)
}