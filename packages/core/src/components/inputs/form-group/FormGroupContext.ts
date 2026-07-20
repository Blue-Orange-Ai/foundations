import React, {useContext} from "react";
// Type only — the validation hook imports this file at runtime, so importing it
// back would create a cycle.
import type {InputValidationResult} from "../validation/InputValidation";

/**
 * A single field registered against a {@link FormGroup}.
 *
 * Fields register themselves through the context on mount so the group can
 * validate them and read their values on submission without the caller having
 * to thread any props through the tree.
 */
export interface FormFieldRegistration {
	name: string;
	label?: string;
	getValue: () => any;
	runValidation: () => Promise<InputValidationResult | null>;
	clearValidation: () => void;
}

/**
 * A field that failed validation during a submission attempt.
 */
export interface FormFieldError {
	name: string;
	label?: string;
	result: InputValidationResult;
}

/**
 * The outcome of a submission attempt.
 *
 * - `valid`  — whether every registered field passed validation.
 * - `values` — the current value of every registered field, keyed by name.
 * - `errors` — the fields that failed, in the order they appear in the form.
 */
export interface FormGroupSubmitResult {
	valid: boolean;
	values: Record<string, any>;
	errors: Array<FormFieldError>;
}

export interface FormGroupContextValue {
	registerField: (registration: FormFieldRegistration) => () => void;
	submit: () => Promise<FormGroupSubmitResult>;
	submitting: boolean;
	validating: boolean;
}

export const FormGroupContext = React.createContext<FormGroupContextValue | null>(null);

/**
 * Access the surrounding {@link FormGroup}.
 *
 * Returns null when used outside of a form group, which lets fields and
 * buttons be rendered standalone without blowing up.
 */
export const useFormGroup = (): FormGroupContextValue | null => {
	return useContext(FormGroupContext);
};
