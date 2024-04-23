import React, {ReactNode} from "react";

import './PrimaryCell.css'
import {CellAlignment} from "../../../../interfaces/AppInterfaces";
import {Image} from "../../../media/image/Image";

interface Props {
	src: string,
	text: string,
	imgHeight?: number,
	secondaryText?: string,
	style?: React.CSSProperties,
	onClick?: (rowId: string) => void,
	hover?: boolean,
	rowId?: string
}
export const PrimaryCell: React.FC<Props> = ({src, text, imgHeight=42, secondaryText, style, hover=false, rowId="", onClick}) => {


	var hoverStyle: React.CSSProperties = {
		textDecoration: hover ? "underline" : "unset"
	}

	return (
		<td className='blue-orange-primary-data-table-cell' style={style}>
			<div className='blue-orange-primary-data-table-cell-cont'>
				<div className='blue-orange-primary-data-table-image'>
					<Image src={src} alt={'data-table-image'} height={imgHeight} width={imgHeight} fit={'cover'} borderRadius={"50%"}></Image>
				</div>
				<div className='blue-orange-primary-data-text-body'>
					<div className='blue-orange-primary-data-primary-text' style={hoverStyle}>{text}</div>
					{secondaryText && <div className='blue-orange-primary-data-secondary-text'>{secondaryText}</div>}
				</div>
			</div>
		</td>
	)
}