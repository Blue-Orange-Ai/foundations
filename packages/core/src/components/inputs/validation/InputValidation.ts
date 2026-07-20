import {useCallback, useEffect, useRef, useState} from "react";
import {useFormGroup} from "../form-group/FormGroupContext";

/**
 * The two possible outcomes of a validation run.
 * Defined as string literals so they are ergonomic to return from a callback.
 */
export type InputValidationState = "success" | "error";

/**
 * The object a `validate` callback is expected to resolve with.
 *
 * - `state`    — whether the value passed validation.
 * - `message`  — optional plain text message rendered underneath the input.
 * - `messageHtml` — optional HTML message rendered underneath the input using the
 *                   RenderHtml text decoration. Takes precedence over `message`.
 */
export interface InputValidationResult {
	state: InputValidationState;
	message?: string;
	messageHtml?: string;
}

/**
 * Optional callback that can be supplied to any input. Receives the current
 * value of the input and resolves with an {@link InputValidationResult}.
 */
export type InputValidateCallback<T = string> = (value: T) => Promise<InputValidationResult>;

/**
 * Everything an input hands the hook so it can register itself against a
 * surrounding FormGroup. Registration only happens when a `name` is supplied
 * and the input is inside a group, so nothing changes for a standalone input.
 */
export interface InputFormRegistration<T = any> {
	name?: string;
	/** The current value. Use `getValue` instead when the value lives in a ref. */
	value?: T;
	/**
	 * Read the current value on demand. Inputs that hold their value in a ref
	 * (and so do not re-render as the user types) must supply this — a plain
	 * `value` would be whatever it was at the last render.
	 */
	getValue?: () => T;
	label?: string;
	required?: boolean;
	requiredMessage?: string;
	requiredMessageHtml?: string;
}

/**
 * Treats undefined, null, blank strings, empty arrays and false as empty, so a
 * single `required` check covers text inputs, dropdowns, tags and checkboxes.
 */
export const isEmptyInputValue = (value: any): boolean => {
	if (value === undefined || value === null || value === false) {
		return true;
	}
	if (typeof value === "string") {
		return value.trim().length === 0;
	}
	if (Array.isArray(value)) {
		return value.length === 0;
	}
	if (typeof value === "object" && !(value instanceof Date)) {
		return Object.keys(value).length === 0;
	}
	return false;
};

/**
 * Shared hook that wires a `validate` callback into an input.
 *
 * By default validation runs on the blur event. Pass `validateOnChange` to also
 * run it on every keystroke / value change.
 *
 * When the optional `registration` is supplied with a `name` and the input sits
 * inside a FormGroup, the input registers itself with that group. The group can
 * then enforce the input's `required` flag, run its `validate` callback and read
 * its value on submission — without the caller repeating any of it.
 */
export const useInputValidation = <T = string>(
	validate?: InputValidateCallback<T>,
	validateOnChange: boolean = false,
	registration?: InputFormRegistration<T>
) => {

	const [result, setResult] = useState<InputValidationResult | null>(null);

	const group = useFormGroup();

	// Held in a ref so the registration handed to the group never goes stale
	// without having to re-register on every keystroke.
	const registrationRef = useRef(registration);
	registrationRef.current = registration;

	const name = registration?.name;

	const readValue = (): T => {
		const current = registrationRef.current;
		return (current?.getValue ? current.getValue() : current?.value) as T;
	};

	// The requirement is only enforced when the input is part of a form. On its
	// own an input behaves exactly as it did before.
	const requirementEnforced = group !== null && name !== undefined;

	const buildRequiredResult = (): InputValidationResult => {
		const current = registrationRef.current;
		if (current?.requiredMessageHtml) {
			return {state: "error", messageHtml: current.requiredMessageHtml};
		}
		return {
			state: "error",
			message: current?.requiredMessage ?? ((current?.label ?? "This field") + " is required.")
		};
	};

	/**
	 * Runs the requirement check followed by the validate callback and resolves
	 * with whatever the input should display.
	 */
	const runValidation = useCallback((value: T): Promise<InputValidationResult | null> => {
		if (requirementEnforced && registrationRef.current?.required && isEmptyInputValue(value)) {
			const requiredResult = buildRequiredResult();
			setResult(requiredResult);
			return Promise.resolve(requiredResult);
		}
		if (!validate) {
			if (requirementEnforced) {
				setResult(null);
			}
			return Promise.resolve(null);
		}
		return validate(value)
			.then((res) => {
				setResult(res);
				return res;
			})
			.catch(() => {
				setResult(null);
				return null;
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validate, requirementEnforced]);

	// Always run on blur when there is something to check.
	const handleBlurValidation = useCallback((value: T) => {
		runValidation(value);
	}, [runValidation]);

	// Only run on change when explicitly opted into via validateOnChange.
	const handleChangeValidation = useCallback((value: T) => {
		if (validateOnChange) {
			runValidation(value);
		}
	}, [runValidation, validateOnChange]);

	// Kept in a ref so registering does not depend on the callback identity.
	const runValidationRef = useRef(runValidation);
	runValidationRef.current = runValidation;

	const registerField = group?.registerField;

	useEffect(() => {
		if (!registerField || name === undefined) {
			return;
		}
		return registerField({
			name: name,
			label: registrationRef.current?.label,
			getValue: () => readValue(),
			runValidation: () => runValidationRef.current(readValue()),
			clearValidation: () => setResult(null)
		});
	}, [registerField, name]);

	const isError = result?.state === "error";

	return {
		validationResult: result,
		isError,
		runValidation,
		handleBlurValidation,
		handleChangeValidation
	};
};
