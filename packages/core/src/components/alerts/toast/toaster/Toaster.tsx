import React, {ReactNode} from "react";

import './Toaster.css'
import {ToastLocation} from "../toastcontext/ToastContext";

export enum ToasterType {
	DEFAULT,
	SUCCESS,
	WARNING,
	ERROR
}

interface Props {
	heading: string,
	toastType: ToasterType,
	location: ToastLocation,
	icon?: ReactNode,
	description?: string,
	action?: ReactNode,
	onClose?: () => void,
	closeOnClick?: boolean
}
export const Toaster: React.FC<Props> = ({
											 heading,
											 toastType,
											 location,
											 icon,
											 description,
											 action,
										     onClose,
											 closeOnClick=true}) => {

	const generateClassName = () => {
		var classname = 'blue-orange-toaster shadow'
		if (toastType == ToasterType.SUCCESS) {
			classname += " blue-orange-toaster-success"
		} else if (toastType == ToasterType.WARNING) {
			classname += " blue-orange-toaster-warning"
		} else if (toastType == ToasterType.ERROR) {
			classname += " blue-orange-toaster-error"
		}
		if (location == ToastLocation.TOP_LEFT || location == ToastLocation.BOTTOM_LEFT) {
			classname += " animate__animated animate__fadeInLeft"
		} else {
			classname += " animate__animated animate__fadeInRight"
		}
		return classname;
	}

	const handleClick = () => {
		if (closeOnClick && onClose) {
			onClose()
		}
	}

	return (
		<div className={generateClassName()} onClick={handleClick}>
			{icon &&
				<div className="blue-orange-toaster-icon">
					{icon}
				</div>
			}
			<div className="blue-orange-toaster-text-group">
				<div className="blue-orange-toaster-text-group-heading">{heading}</div>
				{description && <div className="blue-orange-toaster-text-group-description">{description}</div>}
			</div>
			{action &&
				<div className="blue-orange-toaster-action">
					{action}
				</div>
			}
		</div>
	)
}