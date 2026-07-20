import {useCallback, useState} from "react";

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
 * Shared hook that wires a `validate` callback into an input.
 *
 * By default validation runs on the blur event. Pass `validateOnChange` to also
 * run it on every keystroke / value change.
 */
export const useInputValidation = <T = string>(
	validate?: InputValidateCallback<T>,
	validateOnChange: boolean = false
) => {

	const [result, setResult] = useState<InputValidationResult | null>(null);

	const runValidation = useCallback((value: T) => {
		if (!validate) {
			return;
		}
		validate(value)
			.then((res) => setResult(res))
			.catch(() => setResult(null));
	}, [validate]);

	// Always run on blur when a validate callback is present.
	const handleBlurValidation = useCallback((value: T) => {
		runValidation(value);
	}, [runValidation]);

	// Only run on change when explicitly opted into via validateOnChange.
	const handleChangeValidation = useCallback((value: T) => {
		if (validateOnChange) {
			runValidation(value);
		}
	}, [runValidation, validateOnChange]);

	const isError = result?.state === "error";

	return {
		validationResult: result,
		isError,
		runValidation,
		handleBlurValidation,
		handleChangeValidation
	};
};
