import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import './Button.css';
import {SuccessAnimation} from "../utils/successanimation/SuccessAnimation";
import {ErrorAnimation} from "../utils/erroranimation/ErrorAnimation";
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import {TOOLTIP_Z_INDEX} from "../../utils/ZIndex";

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

export enum ButtonSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

interface Props {
	text: string;
	buttonType: ButtonType;
	size?: ButtonSize;
	classes?: string;
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

const sizeClassName: Record<ButtonSize, string> = {
	[ButtonSize.SMALL]: "foundations-btn-sm",
	[ButtonSize.MEDIUM]: "",
	[ButtonSize.LARGE]: "foundations-btn-lg",
};

export const Button: React.FC<Props> = ({
											text,
											buttonType,
											size = ButtonSize.MEDIUM,
											classes = "",
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

	const sizeClass = sizeClassName[size] ? " " + sizeClassName[size] : "";

	const generateDefaultStyle = () => {
		if (buttonType == ButtonType.SECONDARY) {
			return "foundations-default-btn no-select foundations-secondary-btn" + sizeClass;
		} else if (buttonType == ButtonType.SUCCESS) {
			return "foundations-default-btn no-select foundations-success-btn" + sizeClass;
		} else if (buttonType == ButtonType.DANGER) {
			return "foundations-default-btn no-select foundations-danger-btn" + sizeClass;
		} else if (buttonType == ButtonType.WARNING) {
			return "foundations-default-btn no-select foundations-warning-btn" + sizeClass;
		} else if (buttonType == ButtonType.CUSTOM) {
			return "foundations-default-btn no-select" + sizeClass;
		} else if (buttonType == ButtonType.CLEAR) {
			return "foundations-default-btn no-select foundations-clear-btn" + sizeClass;
		}
		return "foundations-default-btn no-select foundations-primary-btn" + sizeClass;
	}

	const customClasses = classes ? " " + classes : "";

	const defaultStyle = generateDefaultStyle()

	// The class name is derived on every render, never stored.
	//
	// It used to live in state seeded at mount and be re-derived by an effect
	// keyed on [isLoading] alone, so `isDisabled` never reached the DOM after the
	// first render: a button mounted disabled kept `foundations-default-btn-disabled`
	// (and its `cursor: not-allowed`) forever, however the prop changed, while
	// `handleClick` read the live prop — appearance and behaviour diverged. It hit
	// every form whose submit is gated on validity, since such a button is
	// disabled at mount by definition and so could never visibly enable. The same
	// staleness applied to `buttonType`, `size` and `classes`.
	//
	// Only the success/error *animation* genuinely needs state, because a cleared
	// animation ends on a timer rather than on a prop change. Those two flags are
	// what the class name reads, so what is painted and what is animated can no
	// longer disagree.
	const btnClassname = errorAnimation
		? "foundations-default-btn no-select foundations-danger-btn"
		: successAnimation
			? "foundations-default-btn no-select foundations-success-btn"
			: isDisabled || isLoading
				? defaultStyle + " foundations-default-btn-disabled"
				: defaultStyle;

	useEffect(() => {
		if (isSuccess && successClear) {
			setSuccessAnimation(true);
			// Cleared on unmount and on the next change, so a re-fired animation
			// cannot stack timers or land on a component that is already gone.
			const timer = setTimeout(() => {
				setSuccessAnimation(false);
				if (onSuccessAnimationComplete) {
					onSuccessAnimationComplete();
				}
			}, successClearAnimationTime)
			return () => clearTimeout(timer);
		} else if (!successClear) {
			setSuccessAnimation(isSuccess);
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError && errorClear) {
			setErrorAnimation(true);
			const timer = setTimeout(() => {
				setErrorAnimation(false);
				if (onErrorAnimationComplete) {
					onErrorAnimationComplete();
				}
			}, errorClearAnimationTime)
			return () => clearTimeout(timer);
		} else if (!errorClear) {
			setErrorAnimation(isError);
		}
	}, [isError]);

	useEffect(() => {
		const current = btnRef.current as TippyHTMLElement;
		if (current && tooltip) {
			tippy(current, {
				content: tooltip,
				zIndex: TOOLTIP_Z_INDEX
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
		<div ref={btnRef} className={btnClassname + customClasses} onClick={handleClick} style={style}>
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