import React, {useEffect, useRef, useState} from "react";

import './Slider.css'
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

export enum SliderOrientation {
	HORIZONTAL = "HORIZONTAL",
	VERTICAL = "VERTICAL"
}

/** A single value slider takes a number, a range slider takes one number per thumb. */
export type SliderValue = number | number[];

interface Props {
	value?: SliderValue;
	label?: string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	required?: boolean;
	help?: string;
	min?: number;
	max?: number;
	step?: number;
	orientation?: SliderOrientation;
	disabled?: boolean;
	/** Prints the current value(s) next to the label. */
	showValue?: boolean;
	/** Formats the value shown by `showValue` and read by screen readers. */
	formatValue?: (value: number) => string;
	/** Fires continuously while a thumb is being dragged. */
	onChange?: (value: SliderValue) => void;
	/** Fires once the drag (or key press) finishes. */
	onChangeComplete?: (value: SliderValue) => void;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	validate?: InputValidateCallback<SliderValue>;
	validateOnChange?: boolean;
}

const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
}

const decimalsOf = (step: number): number => {
	const text = step.toString();
	const separator = text.indexOf(".");
	return separator === -1 ? 0 : text.length - separator - 1;
}

/** Snaps a raw value onto the step grid, keeping the precision of the step. */
const snapToStep = (value: number, min: number, max: number, step: number): number => {
	if (step <= 0) {
		return clamp(value, min, max);
	}
	const steps = Math.round((value - min) / step);
	const snapped = min + (steps * step);
	return clamp(parseFloat(snapped.toFixed(decimalsOf(step))), min, max);
}

const toArray = (value: SliderValue | undefined, min: number): number[] => {
	if (value === undefined || value === null) {
		return [min];
	}
	return Array.isArray(value) ? [...value] : [value];
}

/**
 * A draggable value selector. Pass a single number for one thumb or an array of
 * numbers for a range — each thumb is keyboard operable.
 */
export const Slider: React.FC<Props> = ({
											value,
											label,
											name,
											requiredMessage,
											required = false,
											help,
											min = 0,
											max = 100,
											step = 1,
											orientation = SliderOrientation.HORIZONTAL,
											disabled = false,
											showValue = false,
											formatValue,
											onChange,
											onChangeComplete,
											style = {},
											labelStyle = {},
											validate,
											validateOnChange = false}) => {

	const isRange = Array.isArray(value) && value.length > 1;

	const vertical = orientation === SliderOrientation.VERTICAL;

	const [values, setValues] = useState<number[]>(() => toArray(value, min).map(v => snapToStep(v, min, max, step)));

	// The pointer handlers live on window while dragging, so they need the
	// latest values without re-binding on every move.
	const valuesRef = useRef<number[]>(values);
	valuesRef.current = values;

	const activeThumb = useRef<number>(0);

	const trackRef = useRef<HTMLDivElement>(null);

	const draggingRef = useRef<boolean>(false);

	const emitValue = (next: number[]): SliderValue => {
		return isRange ? next : next[0];
	}

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<SliderValue>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			getValue: () => emitValue(valuesRef.current)
		});

	useEffect(() => {
		if (value !== undefined) {
			setValues(toArray(value, min).map(v => snapToStep(v, min, max, step)));
		}
	}, [JSON.stringify(value), min, max, step]);

	const ratioOf = (thumbValue: number): number => {
		if (max === min) {
			return 0;
		}
		return (thumbValue - min) / (max - min);
	}

	const valueFromPointer = (clientX: number, clientY: number): number => {
		const track = trackRef.current;
		if (!track) {
			return min;
		}
		const rect = track.getBoundingClientRect();
		const ratio = vertical
			? clamp(rect.height === 0 ? 0 : (rect.bottom - clientY) / rect.height, 0, 1)
			: clamp(rect.width === 0 ? 0 : (clientX - rect.left) / rect.width, 0, 1);
		return snapToStep(min + (ratio * (max - min)), min, max, step);
	}

	/** Thumbs may not cross over each other. */
	const applyValue = (index: number, next: number): number[] => {
		const updated = [...valuesRef.current];
		const lower = index > 0 ? updated[index - 1] : min;
		const upper = index < updated.length - 1 ? updated[index + 1] : max;
		updated[index] = clamp(next, lower, upper);
		return updated;
	}

	const commitValues = (next: number[], complete: boolean) => {
		valuesRef.current = next;
		setValues(next);
		handleChangeValidation(emitValue(next));
		if (onChange) {
			onChange(emitValue(next));
		}
		if (complete && onChangeComplete) {
			onChangeComplete(emitValue(next));
		}
	}

	const nearestThumb = (target: number): number => {
		var closest = 0;
		var distance = Number.MAX_VALUE;
		valuesRef.current.forEach((thumbValue, index) => {
			const thumbDistance = Math.abs(thumbValue - target);
			if (thumbDistance < distance) {
				distance = thumbDistance;
				closest = index;
			}
		});
		return closest;
	}

	// The listeners that are live for the duration of a drag. Held in a ref so
	// the same functions that were added are the ones removed, even though the
	// component re-renders on every move.
	const dragListenersRef = useRef<{move: (event: PointerEvent) => void, up: () => void} | null>(null);

	const stopDragging = () => {
		const listeners = dragListenersRef.current;
		if (listeners) {
			window.removeEventListener("pointermove", listeners.move);
			window.removeEventListener("pointerup", listeners.up);
			dragListenersRef.current = null;
		}
		draggingRef.current = false;
	}

	useEffect(() => {
		return () => stopDragging();
	}, []);

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (disabled) {
			return;
		}
		stopDragging();

		const target = valueFromPointer(event.clientX, event.clientY);
		activeThumb.current = nearestThumb(target);
		draggingRef.current = true;
		commitValues(applyValue(activeThumb.current, target), false);

		const move = (moveEvent: PointerEvent) => {
			if (!draggingRef.current) {
				return;
			}
			moveEvent.preventDefault();
			const next = valueFromPointer(moveEvent.clientX, moveEvent.clientY);
			commitValues(applyValue(activeThumb.current, next), false);
		};

		const up = () => {
			if (!draggingRef.current) {
				return;
			}
			stopDragging();
			handleBlurValidation(emitValue(valuesRef.current));
			if (onChangeComplete) {
				onChangeComplete(emitValue(valuesRef.current));
			}
		};

		dragListenersRef.current = {move: move, up: up};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
		if (disabled) {
			return;
		}
		const current = valuesRef.current[index];
		const stepSize = step > 0 ? step : 1;
		var next: number | null = null;
		if (event.key === "ArrowRight" || event.key === "ArrowUp") {
			next = current + stepSize;
		} else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
			next = current - stepSize;
		} else if (event.key === "PageUp") {
			next = current + (stepSize * 10);
		} else if (event.key === "PageDown") {
			next = current - (stepSize * 10);
		} else if (event.key === "Home") {
			next = min;
		} else if (event.key === "End") {
			next = max;
		}
		if (next !== null) {
			event.preventDefault();
			commitValues(applyValue(index, snapToStep(next, min, max, step)), true);
		}
	}

	const format = (thumbValue: number): string => {
		return formatValue ? formatValue(thumbValue) : String(thumbValue);
	}

	const rangeStart = values.length > 1 ? ratioOf(values[0]) : 0;

	const rangeEnd = ratioOf(values[values.length - 1]);

	const rangeStyle: React.CSSProperties = vertical
		? {bottom: (rangeStart * 100) + "%", height: ((rangeEnd - rangeStart) * 100) + "%"}
		: {left: (rangeStart * 100) + "%", width: ((rangeEnd - rangeStart) * 100) + "%"};

	const generateClassName = () => {
		var className = "blue-orange-slider";
		className += vertical ? " blue-orange-slider-vertical" : " blue-orange-slider-horizontal";
		if (disabled) {
			className += " blue-orange-slider-disabled";
		}
		if (isError) {
			className += " blue-orange-slider-error";
		}
		return className;
	}

	return (
		<div className="blue-orange-slider-cont">
			{(label || showValue) &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
					{showValue &&
						<span className="blue-orange-slider-value">{values.map(format).join(" – ")}</span>
					}
				</div>
			}
			<div className={generateClassName()} style={style}>
				<div
					ref={trackRef}
					className="blue-orange-slider-track"
					onPointerDown={handlePointerDown}>
					<div className="blue-orange-slider-range" style={rangeStyle}></div>
					{values.map((thumbValue, index) => (
						<div
							key={index}
							className="blue-orange-slider-thumb"
							role="slider"
							tabIndex={disabled ? -1 : 0}
							aria-valuemin={min}
							aria-valuemax={max}
							aria-valuenow={thumbValue}
							aria-valuetext={format(thumbValue)}
							aria-orientation={vertical ? "vertical" : "horizontal"}
							aria-disabled={disabled}
							aria-label={label}
							style={vertical
								? {bottom: (ratioOf(thumbValue) * 100) + "%"}
								: {left: (ratioOf(thumbValue) * 100) + "%"}}
							onKeyDown={(event) => handleKeyDown(event, index)}
							onBlur={() => handleBlurValidation(emitValue(valuesRef.current))}></div>
					))}
				</div>
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	)
}
