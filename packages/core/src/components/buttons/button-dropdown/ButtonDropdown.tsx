import React, {useEffect, useRef, useState} from "react";
import tippy from "tippy.js";
import './ButtonDropdown.css';
import {SuccessAnimation} from "../utils/successanimation/SuccessAnimation";
import {ErrorAnimation} from "../utils/erroranimation/ErrorAnimation";
import {TippyHTMLElement} from "../../interfaces/AppInterfaces";
import {ButtonIconPos, ButtonType} from "../button/Button";
import {Dropdown} from "../../inputs/dropdown/basic/Dropdown";


interface Props {
	children: React.ReactNode;
	text: string;
	buttonType: ButtonType;
	tooltip?: string;
	icon?: string;
	iconPos?: ButtonIconPos;
	filter?: boolean;
	allowMultiple?: boolean;
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

export const ButtonDropdown: React.FC<Props> = ({
											children,
											text,
											buttonType,
											tooltip,
											icon,
											iconPos,
											filter,
											allowMultiple,
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

	const generateDefaultStyle = () => {
		if (buttonType == ButtonType.SECONDARY) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-secondary-btn";
		} else if (buttonType == ButtonType.SUCCESS) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-success-btn";
		} else if (buttonType == ButtonType.DANGER) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-danger-btn";
		} else if (buttonType == ButtonType.WARNING) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-warning-btn";
		} else if (buttonType == ButtonType.CUSTOM) {
			return "blue-orange-button-dropdown-default-btn no-select";
		} else if (buttonType == ButtonType.CLEAR) {
			return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-clear-btn";
		}
		return "blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-primary-btn";
	}

	const defaultStyle = generateDefaultStyle()

	const loadingClassName = isDisabled || isLoading ? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled" : defaultStyle;

	const [btnClassname, setBtnClassname] = useState(loadingClassName);


	useEffect(() => {
		setBtnClassname(isDisabled || isLoading ? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled" : defaultStyle)
	}, [isLoading]);

	useEffect(() => {
		if (isSuccess && successClear) {
			setSuccessAnimation(true);
			setBtnClassname("blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-success-btn")
			setTimeout(() => {
				setBtnClassname(isDisabled || isLoading ? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled" : defaultStyle)
				setSuccessAnimation(false);
				if (onSuccessAnimationComplete) {
					onSuccessAnimationComplete();
				}
			}, successClearAnimationTime)
		} else if (isSuccess && !successClear) {
			setBtnClassname("blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-success-btn")
			setSuccessAnimation(isSuccess);
		} else if (!isSuccess && !successClear) {
			setBtnClassname(isDisabled || isLoading ? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled" : defaultStyle)
			setSuccessAnimation(isSuccess);
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isError && errorClear) {
			setBtnClassname("blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-danger-btn")
			setErrorAnimation(true);
			setTimeout(() => {
				setBtnClassname(isDisabled || isLoading ? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled" : defaultStyle)
				setErrorAnimation(false);
				if (onErrorAnimationComplete) {
					onErrorAnimationComplete();
				}
			}, errorClearAnimationTime)
		} else if (isError && !errorClear) {
			setBtnClassname("blue-orange-button-dropdown-default-btn no-select blue-orange-button-dropdown-danger-btn")
			setErrorAnimation(isError);
		} else if (!isError && !errorClear) {
			setBtnClassname(isDisabled || isLoading ? defaultStyle + " blue-orange-button-dropdown-default-btn-disabled" : defaultStyle)
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
		<div ref={btnRef} className={btnClassname} style={style}>
			<div style={{zIndex: "1", position: "absolute", left: "0", top: "0", width: "100%", height: "100%"}}>
				<Dropdown
					style={{width: "100%", height: "100%", opacity: 0}}
					filter={filter}
					allowMultipleSelection={allowMultiple}
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