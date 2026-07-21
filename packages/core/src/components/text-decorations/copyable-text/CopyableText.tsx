import React, {ReactNode, useContext, useEffect, useRef, useState} from "react";

import './CopyableText.css'
import {Toast, ToastContext, ToastLocation} from "../../alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../alerts/toast/toaster/Toaster";

export interface CopyToastOptions {
	location?: ToastLocation;
	ttl?: number;
	heading?: string;
	description?: string;
	toastType?: ToasterType;
	icon?: ReactNode;
}

interface Props {
	/** Optional when iconOnly is set and copyValue provides the clipboard value. */
	children?: ReactNode;
	/** Text placed on the clipboard. Falls back to children when they are a plain string or number. */
	copyValue?: string;
	/** Shows a toast on a successful copy. Pass true for the defaults or an object to override them. */
	toast?: boolean | CopyToastOptions;
	/** Shows a tick in place of the copy icon for this many milliseconds after copying. */
	confirmationTime?: number;
	showIcon?: boolean;
	/** Only renders the copy icon while the text is hovered. */
	iconOnHover?: boolean;
	/** Renders the copy icon on its own without the text. Requires children to be text or an explicit copyValue. */
	iconOnly?: boolean;
	title?: string;
	onCopy?: (value: string) => void;
	onError?: (error: unknown) => void;
	style?: React.CSSProperties;
}

const resolveChildrenValue = (children: ReactNode) => {
	if (typeof children === "string") {
		return children;
	}
	if (typeof children === "number") {
		return String(children);
	}
	return "";
}

export const copyTextToClipboard = async (value: string) => {
	if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(value);
		return;
	}
	const textArea = document.createElement("textarea");
	textArea.value = value;
	textArea.style.position = "fixed";
	textArea.style.opacity = "0";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	try {
		document.execCommand("copy");
	} finally {
		document.body.removeChild(textArea);
	}
}

export const CopyableText: React.FC<Props> = ({
	children,
	copyValue,
	toast = false,
	confirmationTime = 1500,
	showIcon = true,
	iconOnHover = false,
	iconOnly = false,
	title = "Click to copy",
	onCopy,
	onError,
	style = {}
}) => {

	const {addToast} = useContext(ToastContext);

	const [copied, setCopied] = useState<boolean>(false);

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		}
	}, []);

	const value = copyValue ?? resolveChildrenValue(children);

	const showToast = () => {
		if (!toast) {
			return;
		}
		const options: CopyToastOptions = typeof toast === "object" ? toast : {};
		const newToast: Toast = {
			id: `copyable-text-${Date.now()}-${Math.random().toString(16).slice(2)}`,
			location: options.location ?? ToastLocation.BOTTOM_RIGHT,
			ttl: options.ttl ?? 2000,
			toastType: options.toastType ?? ToasterType.SUCCESS,
			heading: options.heading ?? "Copied to clipboard",
			description: options.description,
			icon: options.icon ?? <i className="ri-file-copy-line"></i>,
			showCloseButton: false
		}
		addToast(newToast);
	}

	const onClick = async () => {
		if (!value) {
			return;
		}
		try {
			await copyTextToClipboard(value);
			if (confirmationTime > 0) {
				setCopied(true);
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(() => setCopied(false), confirmationTime);
			}
			showToast();
			if (onCopy) {
				onCopy(value);
			}
		} catch (error) {
			if (onError) {
				onError(error);
			}
		}
	}

	const onKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onClick();
		}
	}

	const generateClassName = () => {
		let className = "blue-orange-copyable-text";
		if (iconOnly) {
			className += " blue-orange-copyable-text-icon-only";
		}
		if (iconOnHover && !iconOnly) {
			className += " blue-orange-copyable-text-icon-on-hover";
		}
		if (copied) {
			className += " blue-orange-copyable-text-copied";
		}
		return className;
	}

	return (
		<span
			className={generateClassName()}
			style={style}
			role="button"
			tabIndex={0}
			title={title}
			onClick={onClick}
			onKeyDown={onKeyDown}
		>
			{!iconOnly && <span className="blue-orange-copyable-text-content">{children}</span>}
			{(showIcon || iconOnly) && (
				<i className={copied ? "ri-check-line blue-orange-copyable-text-icon" : "ri-file-copy-line blue-orange-copyable-text-icon"}></i>
			)}
		</span>
	)
}
