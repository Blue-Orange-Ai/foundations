import React, {useCallback, useEffect, useRef, useState} from "react";

import './CopyInput.css'
import {HelpIcon} from "../help/HelpIcon";
import {ButtonIcon} from "../../buttons/button-icon/ButtonIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	value?:string | null;
	label?:string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	disabled?: boolean;
	help?: string;
	validate?: InputValidateCallback<string>;
	validateOnChange?: boolean;
}

export const CopyInput: React.FC<Props> = ({value, label, style, labelStyle, disabled, help, validate, validateOnChange=false}) => {

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange);

	const [copied, setCopied] = useState<boolean>(false);

	useEffect(() => {
		const current = value ?? "";
		handleBlurValidation(current);
		handleChangeValidation(current);
	}, [value, handleBlurValidation, handleChangeValidation]);

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
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
				</div>
			}
			<div className={"blue-orange-copy-input-cont" + (isError ? " blue-orange-copy-input-cont-invalid" : "")}>
				<span className="blue-orange-copy-input-text">{value}</span>
				<div className="blue-orange-copy-input-copy-btn">
					{copied &&
						<ButtonIcon icon={"ri-check-line"} style={buttonStyle}></ButtonIcon>
					}
					{!copied &&
						<ButtonIcon icon={"ri-clipboard-fill"} style={buttonStyle} onClick={() => copyText(value ?? "")}></ButtonIcon>
					}
				</div>
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>


	)
}