import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import './Button.css';
import {SuccessAnimation} from "../utils/successanimation/SuccessAnimation";
import {ErrorAnimation} from "../utils/erroranimation/ErrorAnimation";
import {TippyHTMLElement} from "../../../interfaces/AppInterfaces";

export enum ButtonType {
	PRIMARY,
	SECONDARY,
	SUCCESS,
	DANGER,
	WARNING,
	CUSTOM,
	CLEAR
}

export enum ButtonIconPos {
	LEFT,
	RIGHT
}

interface Props {
	text: string;
	buttonType: ButtonType;
	tooltip?: string;
	icon?: string;
	iconPos?: ButtonIconPos;
	onClick?: () => void;
	onSuccessAnimationComplete?: () => void;
	onErrorAnimationComplete?: () => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	isSuccess?: boolean;
	successClear?: boolean;
	successClearAnimationTime?: number;
	isError?: boolean;
	errorClear?: boolean;
	errorClearAnimationTime?: number;
	style?: React.CSSProperties
}

export const Button: React.FC<Props> = ({
											text,
											buttonType,
											tooltip,
											icon,
											iconPos,
											onClick,
											onSuccessAnimationComplete,
											onErrorAnimationComplete,
											isDisabled = false,
											isLoading = false,
											isSuccess = false,
											successClear = true,
											successClearAnimationTime = 3000,
											isError = false,
											errorClear = true,
											errorClearAnimationTime = 3000,
											style={}}) => {

	const btnRef = useRef<HTMLDivElement | null>(null);

	const [successAnimation, setSuccessAnimation] = useState(false);

	const [errorAnimation, setErrorAnimation] = useState(false);

	const handleClick = () => {
		if (!isDisabled && !isLoading && onClick) {
			onClick();
		}
	};

	const generateDefaultStyle = () => {
		if (buttonType == ButtonType.SECONDARY) {
			return "foundations-default-btn no-select foundations-secondary-btn";
		} else if (buttonType == ButtonType.SUCCESS) {
			return "foundations-default-btn no-select foundations-success-btn";
		} else if (buttonType == ButtonType.DANGER) {
			return "foundations-default-btn no-select foundations-danger-btn";
		} else if (buttonType == ButtonType.WARNING) {
			return "foundations-default-btn no-select foundations-warning-btn";
		} else if (buttonType == ButtonType.CUSTOM) {
			return "foundations-default-btn no-select";
		} else if (buttonType == ButtonType.CLEAR) {
			return "foundations-default-btn no-select foundations-clear-btn";
		}
		return "foundations-default-btn no-select foundations-primary-btn";
	}

	const defaultStyle = generateDefaultStyle()

	const loadingClassName = isDisabled || isLoading ? defaultStyle + " foundations-default-btn-disabled" : defaultStyle;

	const [btnClassname, setBtnClassname] = useState(loadingClassName);


	useEffect(() => {
		setBtnClassname(isDisabled || isLoading ? defaultStyle + " foundations-default-btn-disabled" : defaultStyle)
	}, [isLoading]);

	useEffect(() => {
		if (isSuccess && successClear) {
			setSuccessAnimation(true);
			setBtnClassname("foundations-default-btn no-select foundations-success-btn")
			setTimeout(() => {
				setBtnClassname(isDisabled || isLoading ? defaultStyle + " foundations-default-btn-disabled" : defaultStyle)
				setSuccessAnimation(false);
				if (onSuccessAnimationComplete) {
					onSuccessAnimationComplete();
				}
			}, successClearAnimationTime)
		} else if (isSuccess && !successClear) {
			setBtnClassname("foundations-default-btn no-select foundations-success-btn")
			setSuccessAnimation(isSuccess);
		} else if (!isSuccess && !successClear) {
			setBtnClassname(isDisabled || isLoading ? defaultStyle + " foundations-default-btn-disabled" : defaultStyle)
			setSuccessAnimation(isSuccess);
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError && errorClear) {
			setBtnClassname("foundations-default-btn no-select foundations-danger-btn")
			setErrorAnimation(true);
			setTimeout(() => {
				setBtnClassname(isDisabled || isLoading ? defaultStyle + " foundations-default-btn-disabled" : defaultStyle)
				setErrorAnimation(false);
				if (onErrorAnimationComplete) {
					onErrorAnimationComplete();
				}
			}, errorClearAnimationTime)
		} else if (isError && !errorClear) {
			setBtnClassname("foundations-default-btn no-select foundations-danger-btn")
			setErrorAnimation(isError);
		} else if (!isError && !errorClear) {
			setBtnClassname(isDisabled || isLoading ? defaultStyle + " foundations-default-btn-disabled" : defaultStyle)
			setErrorAnimation(isError);
		}
	}, [isError]);

	useEffect(() => {
		const current = btnRef.current as TippyHTMLElement;
		if (current && tooltip) {
			tippy(current, {
				content: tooltip,
			});
			return () => {
				const tippyInstance = current._tippy;
				if (tippyInstance) {
					tippyInstance.destroy();
				}
			};
		}
	}, []);

	return (
		<div ref={btnRef} className={btnClassname} onClick={handleClick} style={style}>
			{isLoading ? <i className="ri-loader-4-line foundations-btn-rotate-spinner"></i> : null}
			{successAnimation ? <SuccessAnimation></SuccessAnimation> : null}
			{errorAnimation ? <ErrorAnimation></ErrorAnimation> : null}
			{!isLoading && !successAnimation && !errorAnimation ?
				<span>
					{icon && iconPos == ButtonIconPos.LEFT ? <i className={icon + " foundations-default-btn-icon-left"}></i> : null}
					<span>{text}</span>
					{icon && iconPos == ButtonIconPos.RIGHT ? <i className={icon + " foundations-default-btn-icon-right"}></i> : null}
				</span> : null
			}
		</div>
	)
}