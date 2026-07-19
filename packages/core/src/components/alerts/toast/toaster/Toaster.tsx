import React, {ReactNode} from "react";

import './Toaster.css'
import {ToastLocation} from "../toastcontext/ToastContext";
import {ButtonIcon} from "../../../buttons/button-icon/ButtonIcon";

export enum ToasterType {
	DEFAULT,
	SUCCESS,
	WARNING,
	ERROR
}

interface Props {
	heading?: string,
	toastType: ToasterType,
	location: ToastLocation,
	ttl?: number,
	icon?: ReactNode,
	description?: string,
	action?: ReactNode,
	onClose?: () => void,
	closeOnClick?: boolean,
	showCloseButton?: boolean
}
export const Toaster: React.FC<Props> = ({
											 heading,
											 toastType,
											 location,
											 ttl,
											 icon,
											 description,
											 action,
										     onClose,
											 closeOnClick=true,
											 showCloseButton=true}) => {

	const generateClassName = () => {
		var classname = 'blue-orange-toaster shadow'
		if (!ttl) {
			classname += " blue-orange-toaster-persistent"
		}
		if (toastType == ToasterType.SUCCESS) {
			classname += " blue-orange-toaster-success"
		} else if (toastType == ToasterType.WARNING) {
			classname += " blue-orange-toaster-warning"
		} else if (toastType == ToasterType.ERROR) {
			classname += " blue-orange-toaster-error"
		}
		if (location == ToastLocation.TOP_LEFT || location == ToastLocation.BOTTOM_LEFT) {
			classname += " animate__animated animate__fadeInLeft"
		} else if (location == ToastLocation.CENTRE_TOP) {
			classname += " animate__animated animate__fadeInDown"
		} else if (location == ToastLocation.CENTRE_BOTTOM) {
			classname += " animate__animated animate__fadeInUp"
		} else {
			classname += " animate__animated animate__fadeInRight"
		}
		return classname;
	}

	const handleClick = () => {
		if (ttl && closeOnClick && onClose) {
			onClose()
		}
	}

	const handleCloseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onClose) {
			onClose();
		}
	}

	return (
		<div className={generateClassName()} onClick={handleClick}>
			{!ttl && showCloseButton && (
				<div className="blue-orange-toaster-close" onClick={handleCloseClick}>
					<ButtonIcon icon={"ri-close-line"} label={"Close"} />
				</div>
			)}
			{icon &&
				<div className="blue-orange-toaster-icon">
					{icon}
				</div>
			}
			<div className={!heading && description ? "blue-orange-toaster-text-group-description-only" : "blue-orange-toaster-text-group"}>
                {heading && <div className="blue-orange-toaster-text-group-heading">{heading}</div>}
				{description && <div className="blue-orange-toaster-text-group-description">{description}</div>}
			</div>
			{action &&
				<div className="blue-orange-toaster-action">
					{action}
				</div>
			}
			{ttl && (
				<div className="blue-orange-toaster-progress">
					<div
						className="blue-orange-toaster-progress-bar"
						style={{ animationDuration: `${ttl}ms` }}
					></div>
				</div>
			)}
		</div>
	)
}