import React, {useEffect, useRef} from "react";

import './FormField.css';
import {InputValidateCallback, InputValidationResult, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

interface Props {
	children: React.ReactNode;
	/** Key the value is reported under in the object passed to onSubmit. */
	name: string;
	/** Current value of the wrapped component. */
	value?: any;
	/** Human readable name used in the default required message. */
	label?: string;
	/** Blocks submission while the value is empty. */
	required?: boolean;
	requiredMessage?: string;
	requiredMessageHtml?: string;
	/** Runs after the required check passes. Same callback shape as every input. */
	validate?: InputValidateCallback<any>;
	/** Re-run validation on every value change, not just on blur and submit. */
	validateOnChange?: boolean;
	/** Skip the blur validation and only validate on submit. */
	validateOnBlur?: boolean;
	/** Set to false when the wrapped component renders its own validation message. */
	showMessage?: boolean;
	style?: React.CSSProperties;
	onValidation?: (result: InputValidationResult | null) => void;
}

/**
 * Brings a component that is not one of this library's inputs into a
 * {@link FormGroup}.
 *
 * The inputs in this library register themselves — give one a `name` and it
 * takes part in the form on its own, with no wrapper. Reach for FormField when
 * you need to either:
 *
 * - validate something the library did not provide (a third party component, or
 *   a composition of your own), or
 * - attach a requirement to a group of components rather than a single input.
 *
 * It never inspects what it wraps, so it works with anything.
 */
export const FormField: React.FC<Props> = ({
											   children,
											   name,
											   value,
											   label,
											   required = false,
											   requiredMessage,
											   requiredMessageHtml,
											   validate,
											   validateOnChange = false,
											   validateOnBlur = true,
											   showMessage = true,
											   style = {},
											   onValidation
										   }) => {

	// The requirement check, the validate callback and the registration against
	// the surrounding group all live in the shared hook — the same one every
	// input in this library uses.
	const {validationResult, isError, runValidation, handleChangeValidation} =
		useInputValidation<any>(validate, validateOnChange, {
			name: name,
			label: label,
			value: value,
			required: required,
			requiredMessage: requiredMessage,
			requiredMessageHtml: requiredMessageHtml
		});

	const onValidationRef = useRef(onValidation);
	onValidationRef.current = onValidation;

	useEffect(() => {
		if (onValidationRef.current) {
			onValidationRef.current(validationResult);
		}
	}, [validationResult]);

	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		handleChangeValidation(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
		if (!validateOnBlur) {
			return;
		}
		// Ignore focus moves that stay inside the field (eg. a dropdown menu).
		if (event.currentTarget.contains(event.relatedTarget as Node)) {
			return;
		}
		runValidation(value);
	};

	return (
		<div
			className={"blue-orange-form-field" + (isError ? " blue-orange-form-field-error" : "")}
			style={style}
			onBlur={handleBlur}>
			{children}
			{showMessage && <InputValidationMessage result={validationResult}></InputValidationMessage>}
		</div>
	);
};
