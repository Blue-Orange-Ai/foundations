import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import './ButtonDropdown.css';
import {SuccessAnimation} from "../utils/successanimation/SuccessAnimation";
import {ErrorAnimation} from "../utils/erroranimation/ErrorAnimation";
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import {ButtonIconPos, ButtonSize, ButtonType} from "../button/Button";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";
import {TOOLTIP_Z_INDEX} from "../../utils/ZIndex";


interface Props {
	children: React.ReactNode;
	text: string;
	buttonType: ButtonType;
	size?: ButtonSize;
	tooltip?: string;
	icon?: string;
	iconPos?: ButtonIconPos;
	filter?: boolean;
	allowMultiple?: boolean;
	/** Width of the dropdown popup. Defaults to "max-content" so it sizes to the option text, not the button. */
	contextWidth?: number | string;
	onSelection?: (reference: string) => void;
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
	[ButtonSize.SMALL]: "blue-orange-button-dropdown-btn-sm",
	[ButtonSize.MEDIUM]: "",
	[ButtonSize.LARGE]: "blue-orange-button-dropdown-btn-lg",
};

export const ButtonDropdown: React.FC<Props> = ({
											children,
											text,
											buttonType,
											size = ButtonSize.MEDIUM,
											tooltip,
											icon,
											iconPos,
											filter,
											allowMultiple,
											contextWidth = "max-content",
											onSelection,
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

	const handleSelection = (reference: string) => {
		if (!isDisabled && !isLoading && onSelection) {
			onSelection(reference);
		}
	};

	// An open popup sits right where the tooltip would, so the tooltip is suppressed
	// while it is open rather than left to cover a row of options.
	const handleVisibilityChange = (visible: boolean) => {
		const tippyInstance = (btnRef.current as TippyHTMLElement | null)?._tippy;
		if (tippyInstance) {
			if (visible) {
				tippyInstance.disable();
			} else {
				tippyInstance.enable();
			}
		}
	};

	const sizeClass = sizeClassName[size] ? " " + sizeClassName[size] : "";

	const generateDefaultStyle = () => {
		if (buttonType == ButtonType.SECONDARY) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-secondary-btn" + sizeClass;
		} else if (buttonType == ButtonType.SUCCESS) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-success-btn" + sizeClass;
		} else if (buttonType == ButtonType.DANGER) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-danger-btn" + sizeClass;
		} else if (buttonType == ButtonType.WARNING) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-warning-btn" + sizeClass;
		} else if (buttonType == ButtonType.CUSTOM) {
			return "blue-orange-button-dropdown-default-btn no-select" + sizeClass;
		} else if (buttonType == ButtonType.CLEAR) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-clear-btn" + sizeClass;
		}
		return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-primary-btn" + sizeClass;
	}

	const defaultStyle = generateDefaultStyle()

	// Derived on every render, never stored — see the note in Button.tsx. Held in
	// state and re-derived by an effect keyed on [isLoading] alone, `isDisabled`
	// never reached the DOM after the first render, so a dropdown mounted
	// disabled stayed painted disabled however the prop changed.
	const btnClassname = errorAnimation
		? "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-danger-btn"
		: successAnimation
			? "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-success-btn"
			: isDisabled || isLoading
				? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled"
				: defaultStyle;

	useEffect(() => {
		if (isSuccess && successClear) {
			setSuccessAnimation(true);
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
		<div ref={btnRef} className={btnClassname} style={style}>
			<div style={{zIndex: "1", position: "absolute", left: "0", top: "0", width: "100%", height: "100%"}}>
				<Dropdown
					style={{width: "100%", height: "100%", opacity: 0}}
					filter={filter}
					contextWidth={contextWidth}
					contextClassName="blue-orange-button-dropdown-window"
					allowMultipleSelection={allowMultiple}
					onVisibilityChange={handleVisibilityChange}
					onSelection={(item) => handleSelection(item.reference)}>
					{children}
				</Dropdown>
			</div>
			{isLoading ? <i className="ri-loader-4-line blue-orange-button-dropdown-rotate-spinner"></i> : null}
			{successAnimation ? <SuccessAnimation></SuccessAnimation> : null}
			{errorAnimation ? <ErrorAnimation></ErrorAnimation> : null}
			{!isLoading && !successAnimation && !errorAnimation ?
				<span>
					{icon && iconPos == ButtonIconPos.LEFT ? <i className={icon + " blue-orange-button-dropdown-default-btn-icon-left"}></i> : null}
					<span>{text}</span>
					{icon && iconPos == ButtonIconPos.RIGHT ? <i className={icon + " blue-orange-button-dropdown-default-btn-icon-right"}></i> : null}
					<span className="blue-orange-button-dropdown-down-chevron"><i className="ri-arrow-down-s-line"></i></span>
				</span> : null
			}
		</div>
	)
}