import React, {useEffect, useRef, useState} from "react";

import './OptionCards.css'
import {OptionCard} from "../option-card/OptionCard";
import {HelpIcon} from "../../help/HelpIcon";
import {RequiredIcon} from "../../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../../validation/InputValidation";
import {InputValidationMessage} from "../../validation/InputValidationMessage";

export enum OptionCardsSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

export enum OptionCardsIconPlacement {
	/** The icon sits on its own line above the label. */
	TOP = "TOP",
	/** The icon sits to the left of the label and the hint. */
	LEFT = "LEFT"
}

interface OptionMetaData {
	uuid: string,
	label: string,
	hint: string | undefined,
	icon: string | undefined,
	iconElement: React.ReactNode | undefined,
	tag: React.ReactNode | undefined,
	disabled: boolean,
	children: React.ReactNode
}

interface Props {
	/** The OptionCard entries, in the order they sit in the grid. */
	children: React.ReactNode,
	/** The uuid of the selected option. Updating it moves the selection from the outside. */
	value?: string,
	/** The label shown above the grid, in the same style as every other input. */
	label?: string,
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string,
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string,
	required?: boolean,
	help?: string,
	/** How many columns the grid holds. Ignored when minColumnWidth is set. */
	columns?: number,
	/** Fits as many columns as this width allows, instead of a fixed count. */
	minColumnWidth?: number,
	size?: OptionCardsSize,
	iconPlacement?: OptionCardsIconPlacement,
	/** Greys every card out and takes the whole group out of the keyboard order. */
	disabled?: boolean,
	/** Lets a second click on the selected card clear the selection. */
	allowDeselect?: boolean,
	labelStyle?: React.CSSProperties,
	gridStyle?: React.CSSProperties,
	style?: React.CSSProperties,
	/** Fires with the uuid of the option that was selected, or "" when it was cleared. */
	onChange?: (uuid: string) => void,
	validate?: InputValidateCallback<string>,
	validateOnChange?: boolean
}

const sizeClassName: Record<OptionCardsSize, string> = {
	[OptionCardsSize.SMALL]: "blue-orange-option-cards-sm",
	[OptionCardsSize.MEDIUM]: "",
	[OptionCardsSize.LARGE]: "blue-orange-option-cards-lg",
};

const placementClassName: Record<OptionCardsIconPlacement, string> = {
	[OptionCardsIconPlacement.TOP]: "blue-orange-option-cards-icon-top",
	[OptionCardsIconPlacement.LEFT]: "blue-orange-option-cards-icon-left",
};

/**
 * A choice made from a grid of cards rather than a dropdown — each option leads
 * with an icon and a label and explains itself in a line of hint text. It is the
 * shape a "what kind of thing are you creating?" step wants: the options are few,
 * and the difference between them needs a sentence.
 *
 * It is a radio group, not a tab strip: it picks a value, it does not switch
 * between panels. Reach for ButtonTabs when the choice reveals content instead.
 */
export const OptionCards: React.FC<Props> = ({
												 children,
												 value,
												 label,
												 name,
												 requiredMessage,
												 required = false,
												 help,
												 columns = 2,
												 minColumnWidth,
												 size = OptionCardsSize.MEDIUM,
												 iconPlacement = OptionCardsIconPlacement.TOP,
												 disabled = false,
												 allowDeselect = false,
												 labelStyle = {},
												 gridStyle = {},
												 style = {},
												 onChange,
												 validate,
												 validateOnChange = false}) => {

	const options: OptionMetaData[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === OptionCard) {
				options.push({
					uuid: child.props.uuid as string,
					label: child.props.label as string,
					hint: child.props.hint as (string | undefined),
					icon: child.props.icon as (string | undefined),
					iconElement: child.props.iconElement as (React.ReactNode | undefined),
					tag: child.props.tag as (React.ReactNode | undefined),
					disabled: (child.props.disabled as boolean) ?? false,
					children: child.props.children as React.ReactNode
				});
			}
		}
	});

	const [selected, setSelected] = useState(value ?? "");

	const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			value: selected
		});

	useEffect(() => {
		if (value !== undefined) {
			setSelected(value);
		}
	}, [value]);

	const isSelectable = (option: OptionMetaData) => {
		return !option.disabled && !disabled;
	}

	const updateSelected = (option: OptionMetaData) => {
		if (!isSelectable(option)) {
			return;
		}
		const next = allowDeselect && option.uuid === selected ? "" : option.uuid;
		setSelected(next);
		if (onChange) {
			onChange(next);
		}
		handleChangeValidation(next);
	}

	/** Arrow keys move between the cards and select as they go, as a radio group should. */
	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
		const selectable = options.filter(option => isSelectable(option));
		if (selectable.length === 0) {
			return;
		}
		const currentIndex = selectable.findIndex(option => option.uuid === options[index].uuid);
		var next: OptionMetaData | undefined;
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			next = selectable[(currentIndex + 1 + selectable.length) % selectable.length];
		} else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			next = selectable[(currentIndex - 1 + selectable.length) % selectable.length];
		} else if (event.key === "Home") {
			next = selectable[0];
		} else if (event.key === "End") {
			next = selectable[selectable.length - 1];
		}
		if (next) {
			event.preventDefault();
			updateSelected(next);
			cardRefs.current[next.uuid]?.focus();
		}
	}

	/**
	 * One card at a time is reachable with the tab key: the selected one, or the
	 * first that can be selected while nothing is.
	 */
	const isTabStop = (option: OptionMetaData) => {
		if (selected) {
			return option.uuid === selected;
		}
		return options.find(candidate => isSelectable(candidate))?.uuid === option.uuid;
	}

	const generateGridClassName = () => {
		var className = "blue-orange-option-cards no-select " + placementClassName[iconPlacement];
		if (sizeClassName[size]) {
			className += " " + sizeClassName[size];
		}
		if (isError) {
			className += " blue-orange-option-cards-invalid";
		}
		return className;
	}

	const generateCardClassName = (option: OptionMetaData) => {
		var className = "blue-orange-option-card";
		if (option.uuid === selected) {
			className += " blue-orange-option-card-active";
		}
		if (!isSelectable(option)) {
			className += " blue-orange-option-card-disabled";
		}
		return className;
	}

	const generateGridStyle = (): React.CSSProperties => {
		const template = minColumnWidth
			? "repeat(auto-fit, minmax(" + minColumnWidth + "px, 1fr))"
			: "repeat(" + columns + ", minmax(0, 1fr))";
		return {["--blue-orange-option-cards-template" as any]: template, ...gridStyle};
	}

	return (
		<div className="blue-orange-default-input-cont" style={style}>
			{label &&
				<div
					className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")}
					style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<div
				className={generateGridClassName()}
				role="radiogroup"
				aria-label={label}
				style={generateGridStyle()}
				onBlur={() => handleBlurValidation(selected)}>
				{options.map((option, index) => (
					<button
						key={option.uuid}
						ref={(element) => {cardRefs.current[option.uuid] = element}}
						type="button"
						role="radio"
						aria-checked={option.uuid === selected}
						aria-disabled={!isSelectable(option)}
						disabled={!isSelectable(option)}
						tabIndex={isTabStop(option) ? 0 : -1}
						className={generateCardClassName(option)}
						onKeyDown={(event) => handleKeyDown(event, index)}
						onClick={() => updateSelected(option)}>
						{option.iconElement
							? <span className="blue-orange-option-card-icon">{option.iconElement}</span>
							: option.icon && <i className={option.icon + " blue-orange-option-card-icon"}></i>}
						<span className="blue-orange-option-card-body">
							<span className="blue-orange-option-card-label">
								{option.label}
								{option.tag && <span className="blue-orange-option-card-tag">{option.tag}</span>}
							</span>
							{option.hint && <span className="blue-orange-option-card-hint">{option.hint}</span>}
							{option.children && <span className="blue-orange-option-card-content">{option.children}</span>}
						</span>
					</button>
				))}
			</div>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	)
}
