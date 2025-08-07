import React, {useCallback, useEffect, useRef, useState} from "react";

import './CopyInput.css'
import {HelpIcon} from "../help/HelpIcon";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";

interface Props {
	value?:string | null;
	label?:string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	disabled?: boolean;
	help?: string;
}

export const CopyInput: React.FC<Props> = ({value, label, style, labelStyle, disabled, help}) => {

	const [copied, setCopied] = useState<boolean>(false);

	const buttonStyle: React.CSSProperties = {
		height: "24px",
		width: "24px"
	}

	const copyText = useCallback(async (text: string): Promise<void> => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => {
				setCopied(false)
			}, 2000)
		} catch (err) {
		}
	}, [])

	return (
		<div className="blue-orange-default-input-cont">
			{label &&
				<div className={"blue-orange-default-input-label-cont"} style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
				</div>
			}
			<div className="blue-orange-copy-input-cont">
				<span>{value}</span>
				<div className="blue-orange-copy-input-copy-btn">
					{copied &&
						<ButtonIcon icon={"ri-check-line"} style={buttonStyle}></ButtonIcon>
					}
					{!copied &&
						<ButtonIcon icon={"ri-clipboard-fill"} style={buttonStyle} onClick={() => copyText(value ?? "")}></ButtonIcon>
					}
				</div>
			</div>
		</div>


	)
}