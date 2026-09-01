import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

import * as chrono from 'chrono-node';
import './DateInput.css';
import {Input} from "../../../../input/Input";
import {useOverlayTheme} from "../../../../../layouts/utils/useOverlayTheme";
import moment from 'moment';
import {DateContextWindowSingle, TimePrecision} from "../../items/datecontextwindowsingle/DateContextWindowSingle";
import {HelpIcon} from "../../../../help/HelpIcon";
import {RequiredIcon} from "../../../../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../../../../validation/InputValidation";
import {InputValidationMessage} from "../../../../validation/InputValidationMessage";


interface Props {
	value?: Date,
	displayFormat?: string,
	placeholder?: string,
	onChange?: (date: Date) => void;
	label?:string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	required?: boolean;
	disabled?: boolean;
	help?: string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	showTime?: boolean,
	timePrecision?: TimePrecision,
	validate?: InputValidateCallback<Date>,
	validateOnChange?: boolean
}

export const DateInput: React.FC<Props> = ({
											   value,
											   displayFormat = 'ddd, MMMM Do YYYY',
											   placeholder,
											   onChange,
											   label,
											   name,
											   requiredMessage,
											   required=false,
											   disabled=false,
											   help,
											   style = {},
											   labelStyle={},
											   showTime=false,
											   timePrecision=TimePrecision.MINUTE,
											   validate,
											   validateOnChange=false}) => {

	const [dateValue, setDateValue] = useState(value);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<Date>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: dateValue
		});

	const getFormattedDate = (date: Date | undefined, invalid: boolean) => {
		if (invalid) {
			return "Invalid Date";
		} else if (date == undefined) {
			return "";
		} else {
			return moment(date).format(displayFormat);
		}
	}

	const [inputValue, setInputValue] = useState(getFormattedDate(value, false));

	const [showDateSelection, setShowDateSelection] = useState(false);

	// the whole component, used to tell a click on the input apart from a click outside it
	const containerRef = useRef<HTMLDivElement | null>(null);

	// just the field the popover hangs off — the label and the validation message must not skew the
	// rect the calendar is placed from
	const anchorRef = useRef<HTMLDivElement | null>(null);

	const contextRef = useRef<HTMLDivElement | null>(null);

	const {anchorRef: themeAnchorRef, themeClass} = useOverlayTheme(showDateSelection);

	const updateDate = (date: Date) => {
		setDateValue(date);
		if (onChange) {
			onChange(date);
		}
		handleChangeValidation(date);
	}

	const handleBlur = () => {
		const result = chrono.en.GB.parseDate(inputValue);
		handleBlurValidation((result == null ? dateValue : result) as Date);
	}

	const validateInputDate = () => {
		var result = chrono.en.GB.parseDate(inputValue);
		if (result == null) {
			setInputValue(getFormattedDate(undefined, true));
		} else {
			setInputValue(getFormattedDate(result, false));
			updateDate(result);
		}
	}

	const focusOut = () => {
		setShowDateSelection(false);
		validateInputDate();
	}

	const focusIn = () => {
		setShowDateSelection(true);
	}

	const storeInputChange = (value: string) => {
		setInputValue(value);
	}

	/** Gap between the field and the calendar, whichever side it opens on. */
	const CONTEXT_WINDOW_OFFSET = 10;

	// The popover is `position: fixed` and portalled to the body, so it is placed from the field's
	// viewport rect. That rect is re-measured while the calendar is open — a scroll or resize
	// anywhere on the page moves the field out from under a popover placed once and left alone.
	const [anchorRect, setAnchorRect] = useState<DOMRect | undefined>(undefined);

	useLayoutEffect(() => {
		if (!showDateSelection) {
			setAnchorRect(undefined);
			return;
		}
		const measure = () => {
			const rect = anchorRef.current?.getBoundingClientRect();
			if (rect) {
				setAnchorRect(rect);
			}
		};
		measure();
		// capture phase so a scroll inside any panel between the field and the page is caught, not
		// just one on the window itself
		window.addEventListener('scroll', measure, true);
		window.addEventListener('resize', measure);
		return () => {
			window.removeEventListener('scroll', measure, true);
			window.removeEventListener('resize', measure);
		}
	}, [showDateSelection]);

	// The calendar is centred on the field and pulled back inside the viewport, both of which need
	// its rendered width — it is measured rather than assumed, because the time boxes and the
	// month grid do not add up to one fixed number.
	const [contextWidth, setContextWidth] = useState<number | undefined>(undefined);

	useLayoutEffect(() => {
		if (!showDateSelection) {
			setContextWidth(undefined);
			return;
		}
		const rect = contextRef.current?.getBoundingClientRect();
		if (rect) {
			setContextWidth(current => current === rect.width ? current : rect.width);
		}
	}, [showDateSelection, showTime, anchorRect]);

	const isPosAbove = () => {
		return anchorRect != undefined && anchorRect.top > window.innerHeight / 2;
	}

	const calculateLeftPosition = () => {
		if (anchorRect == undefined) {
			return 0;
		}
		const offset = ((contextWidth ?? anchorRect.width) - anchorRect.width) / 2;
		const left = Math.max(0, anchorRect.left - offset);
		if (contextWidth == undefined) {
			return left;
		}
		return Math.max(10, Math.min(left, window.innerWidth - 10 - contextWidth));
	}

	const calculateContextWindowPos = () : React.CSSProperties => {
		return {
			left: calculateLeftPosition(),
			bottom: isPosAbove() && anchorRect != undefined
				? (window.innerHeight - anchorRect.top) + CONTEXT_WINDOW_OFFSET + "px" : "unset",
			top: !isPosAbove() && anchorRect != undefined
				? anchorRect.bottom + CONTEXT_WINDOW_OFFSET + "px" : "unset",
		}
	}

	const onDateSelected = (date: Date) => {
		setInputValue(getFormattedDate(date, false));
		updateDate(date);
		setShowDateSelection(false)
	}

	const isDescendantOf = (parent:HTMLElement | null, child:HTMLElement | null) =>{
		if (parent && child) {
			if (parent === child) {
				return child
			}
			try{
				var node = child.parentElement;
				while (node != null){
					if (node === parent){
						return node;
					}
					node = node.parentElement;
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return null;
	}

	// the calendar is portalled out of the component, so a click on a day is no longer a click
	// inside it — both trees have to count as "inside" or picking a date would close the popover
	// before the selection lands
	const handleMouseDown = (e:MouseEvent) => {
		const target = e.target as HTMLElement;
		if (isDescendantOf(containerRef.current, target) || isDescendantOf(contextRef.current, target)) {
			return;
		}
		setShowDateSelection(false);
	};

	const handleKeyDown = (e:KeyboardEvent) => {
		if (e.key == "Escape") {
			setShowDateSelection(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('keydown', handleKeyDown);
		}
	}, []);

	useEffect(() => {
		if (onChange && dateValue != undefined) {
			onChange(dateValue);
		}
	}, [dateValue]);

	return (
		<div ref={containerRef} style={{width: "100%"}}>
			{label &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<div ref={anchorRef} className="blue-orange-date-picker-input-anchor">
				<Input
					style={style}
					disabled={disabled}
					isInvalid={isError}
					placeholder={placeholder}
					value={inputValue}
					onChange={storeInputChange}
					focusIn={focusIn}
					focusOut={handleBlur}
					enterEvent={validateInputDate}></Input>
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
			{/* stays behind in the caller's tree so the portalled calendar can still read the theme it was written inside */}
			<span ref={themeAnchorRef} style={{display: "none"}} aria-hidden="true"></span>
			{showDateSelection && typeof document !== "undefined" && createPortal(
				<DateContextWindowSingle
					contextRef={contextRef}
					className={themeClass.trim()}
					style={calculateContextWindowPos()}
					selectedDate={dateValue}
					showTime={showTime}
					timePrecision={timePrecision}
					onSelection={onDateSelected}></DateContextWindowSingle>,
				// Portalled to the body so an ancestor with a transform, filter, will-change or
				// contain — a modal or drawer card mid-animation, a virtualised panel — cannot
				// become the containing block for the fixed popover and re-base the viewport
				// coordinates it was positioned with.
				document.body
			)}
		</div>
	);
};