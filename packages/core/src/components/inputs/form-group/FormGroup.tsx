import React, {useCallback, useMemo, useRef, useState} from "react";

import './FormGroup.css';
import {InputValidationResult} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";
import {
	FormFieldError,
	FormFieldRegistration,
	FormGroupContext,
	FormGroupContextValue,
	FormGroupSubmitResult
} from "./FormGroupContext";
import {FormActions} from "./FormActions";

export enum FormActionsAlignment {
	LEFT = "LEFT",
	CENTER = "CENTER",
	RIGHT = "RIGHT",
	SPACE_BETWEEN = "SPACE_BETWEEN"
}

interface Props {
	children: React.ReactNode;
	/** Externally controlled message rendered at the bottom of the form. Supports plain text and html. */
	error?: InputValidationResult | null;
	/** Message rendered when one or more fields fail validation on submit. */
	summaryMessage?: string;
	/** Html variant of the summary message. Takes precedence over summaryMessage. */
	summaryMessageHtml?: string;
	/** Set to false to stop the group rendering its own summary when fields fail. */
	showSummary?: boolean;
	/** Called with the values of every registered field once validation passes. */
	onSubmit?: (values: Record<string, any>) => void | Promise<void>;
	/** Called with the failing fields when a submission is blocked by validation. */
	onValidationFailed?: (errors: Array<FormFieldError>) => void;
	/** Space between each row of the form body. */
	verticalMargin?: number;
	paddingTop?: number;
	paddingBottom?: number;
	actionsAlignment?: FormActionsAlignment;
	style?: React.CSSProperties;
}

const alignmentClass = (alignment: FormActionsAlignment) => {
	switch (alignment) {
		case FormActionsAlignment.LEFT:
			return "blue-orange-form-group-actions-left";
		case FormActionsAlignment.CENTER:
			return "blue-orange-form-group-actions-center";
		case FormActionsAlignment.SPACE_BETWEEN:
			return "blue-orange-form-group-actions-space-between";
		default:
			return "blue-orange-form-group-actions-right";
	}
};

/**
 * A form built from children rather than props.
 *
 * Anything that is not a {@link FormActions} child is rendered in the body,
 * so sections and rows can be nested freely. Give an input a `name` and it
 * registers itself with the group through context — the group then enforces
 * its `required` flag, runs its `validate` callback and reads its value on
 * submission, however deeply it is nested. {@link FormField} is only needed
 * for components that are not inputs from this library.
 *
 * ```tsx
 * <FormGroup onSubmit={save} error={serverError}>
 *     <FormSection label="Contact">
 *         <FormRow>
 *             <Input name="firstName" label="First name" value={firstName} onChange={setFirstName} required/>
 *             <Input name="lastName" label="Last name" value={lastName} onChange={setLastName} required/>
 *         </FormRow>
 *         <Input name="email" label="Email" value={email} onChange={setEmail} required validate={checkEmail}/>
 *     </FormSection>
 *     <FormActions>
 *         <Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={cancel}/>
 *         <FormSubmitButton text="Save" buttonType={ButtonType.PRIMARY}/>
 *     </FormActions>
 * </FormGroup>
 * ```
 */
export const FormGroup: React.FC<Props> = ({
											   children,
											   error,
											   summaryMessage,
											   summaryMessageHtml,
											   showSummary = true,
											   onSubmit,
											   onValidationFailed,
											   verticalMargin = 10,
											   paddingTop = 10,
											   paddingBottom = 10,
											   actionsAlignment = FormActionsAlignment.RIGHT,
											   style = {}
										   }) => {

	const fields = useRef<Array<FormFieldRegistration>>([]);

	const [submitting, setSubmitting] = useState(false);

	const [validating, setValidating] = useState(false);

	const [summary, setSummary] = useState<InputValidationResult | null>(null);

	const registerField = useCallback((registration: FormFieldRegistration) => {
		fields.current = [...fields.current, registration];
		return () => {
			fields.current = fields.current.filter(field => field !== registration);
		};
	}, []);

	const buildSummary = (errors: Array<FormFieldError>): InputValidationResult => {
		if (summaryMessageHtml) {
			return {state: "error", messageHtml: summaryMessageHtml};
		}
		if (summaryMessage) {
			return {state: "error", message: summaryMessage};
		}
		return {
			state: "error",
			message: errors.length === 1
				? "1 field needs your attention before this form can be submitted."
				: errors.length + " fields need your attention before this form can be submitted."
		};
	};

	const submit = useCallback(async (): Promise<FormGroupSubmitResult> => {
		const registrations = fields.current;
		setValidating(true);
		let results: Array<InputValidationResult | null>;
		try {
			results = await Promise.all(registrations.map(field => field.runValidation()));
		} finally {
			setValidating(false);
		}

		const errors: Array<FormFieldError> = [];
		const values: Record<string, any> = {};

		registrations.forEach((field, index) => {
			values[field.name] = field.getValue();
			const result = results[index];
			if (result && result.state === "error") {
				errors.push({name: field.name, label: field.label, result: result});
			}
		});

		if (errors.length > 0) {
			setSummary(showSummary ? buildSummary(errors) : null);
			if (onValidationFailed) {
				onValidationFailed(errors);
			}
			return {valid: false, values: values, errors: errors};
		}

		setSummary(null);

		if (onSubmit) {
			setSubmitting(true);
			try {
				await onSubmit(values);
			} finally {
				setSubmitting(false);
			}
		}

		return {valid: true, values: values, errors: []};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onSubmit, onValidationFailed, showSummary, summaryMessage, summaryMessageHtml]);

	const contextValue = useMemo<FormGroupContextValue>(() => ({
		registerField: registerField,
		submit: submit,
		submitting: submitting,
		validating: validating
	}), [registerField, submit, submitting, validating]);

	const bodyItems: React.ReactNode[] = [];
	const actionItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			if (child.type === FormActions) {
				React.Children.forEach(child.props.children, actionChild => {
					actionItems.push(actionChild);
				});
			} else {
				bodyItems.push(child);
			}
		}
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		submit();
	};

	// The externally supplied error always wins over the generated summary.
	const message = error !== undefined && error !== null ? error : summary;

	return (
		<FormGroupContext.Provider value={contextValue}>
			<form
				className="blue-orange-form-group"
				style={{paddingTop: paddingTop + "px", paddingBottom: paddingBottom + "px", ...style}}
				onSubmit={handleSubmit}
				noValidate={true}>
				<div className="blue-orange-form-group-body">
					{bodyItems.map((child, index) => (
						<div
							key={index}
							className="blue-orange-form-group-row"
							style={{marginBottom: index === bodyItems.length - 1 ? 0 : verticalMargin + "px"}}>
							{child}
						</div>
					))}
				</div>
				{message &&
					<div className="blue-orange-form-group-message">
						<InputValidationMessage result={message}></InputValidationMessage>
					</div>
				}
				{actionItems.length > 0 &&
					<div className={"blue-orange-form-group-actions " + alignmentClass(actionsAlignment)}>
						{actionItems.map((child, index) => (
							<div key={index} className="blue-orange-form-group-action">{child}</div>
						))}
					</div>
				}
			</form>
		</FormGroupContext.Provider>
	);
};
