import React, {useEffect, useRef, useState} from "react";

import './MetricCard.css'
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";

interface Props {
	text: string;
	label?: string;
	icon?: string;
	style?: React.CSSProperties;
	iconStyle?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	valueStyle?: React.CSSProperties;
}

export const MetricCard: React.FC<Props> = ({
												text,
												label,
												icon,
												style = {},
												iconStyle = {},
												labelStyle = {},
												valueStyle = {}
											}) => {

	const defaultCopyStyle: React.CSSProperties = {}

	const defaultCopiedStyle: React.CSSProperties = {
		backgroundColor: "#186A3B",
		color: "white"
	}

	const [btnStyle, setBtnStyle] = useState(defaultCopyStyle);

	const copyTextClicked = () => {
		navigator.clipboard.writeText(text).then(() => {
			setBtnStyle(defaultCopiedStyle);
			setTimeout(() => {
				setBtnStyle(defaultCopyStyle);
			}, 2000)
		})
	}

	return (
		<div className="blue-orange-metrics-card" style={style}>
			{icon &&
				<div className="blue-orange-metrics-card-icon" style={iconStyle}>
					<i className={icon}></i>
				</div>
			}
			<div className="blue-orange-metrics-card-body">
				{label &&
					<div className="blue-orange-metrics-card-body-title" style={labelStyle}>{label}</div>
				}
				<div className="blue-orange-metrics-card-value" style={valueStyle}>{text}</div>
			</div>
		</div>
	)
}