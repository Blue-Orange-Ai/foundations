import React, {useEffect, useRef, useState} from "react";

import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

// Shares the tag chrome with the other tag inputs.
import '../tags/simple/TagInput.css';
import './EmailRecipientInput.css';
import {HelpIcon} from "../help/HelpIcon";
import {RequiredIcon} from "../required-icon/RequiredIcon";
import {InputValidateCallback, useInputValidation} from "../validation/InputValidation";
import {InputValidationMessage} from "../validation/InputValidationMessage";

/** Emails have no spaces, so whitespace (and commas) start the validation chain. */
const EMAIL_DELIMITERS = /[\s,]+/;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True when `value` is a plausible email address (no spaces, one `@`, a dot). */
export const isEmailRecipient = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

interface Props {
	/** Emails present when the input first mounts. */
	initialEmails?: string[];
	/**
	 * Suggestions offered in the dropdown as the user types. Purely a
	 * convenience — any well formed email can still be added.
	 */
	suggestions?: string[];
	maxEmails?: number;
	placeholder?: string;
	onChange?: (emails: string[]) => void;
	label?: string;
	/** Registers the input with a surrounding FormGroup under this key. */
	name?: string;
	/** Overrides the message shown when a required field is left empty. */
	requiredMessage?: string;
	required?: boolean;
	help?: string;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
	validate?: InputValidateCallback<string[]>;
	validateOnChange?: boolean;
}

/**
 * A chip input for collecting email addresses, modelled on the passport user
 * tag input. Typing an email and pressing space (or comma, or enter) validates
 * it and turns it into a chip; anything that is not a valid email is rejected
 * and left in the field for the user to fix. An optional list of suggestions is
 * offered in a dropdown.
 */
export const EmailRecipientInput: React.FC<Props> = ({
	initialEmails = [],
	suggestions = [],
	maxEmails = 100000,
	placeholder = "Add guests by email",
	onChange,
	label,
	name,
	requiredMessage,
	required = false,
	help,
	style = {},
	labelStyle = {},
	validate,
	validateOnChange = false
}) => {
	const currentEmailsRef = useRef<string[]>(initialEmails);

	const {validationResult, isError, handleBlurValidation, handleChangeValidation} =
		useInputValidation<string[]>(validate, validateOnChange, {
			name: name,
			label: label,
			required: required,
			requiredMessage: requiredMessage,
			getValue: () => currentEmailsRef.current ?? []
		});

	const tagifyRef = useRef<HTMLInputElement>(null);
	const onChangeRef = useRef(onChange);
	const handleChangeValidationRef = useRef(handleChangeValidation);
	const handleBlurValidationRef = useRef(handleBlurValidation);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		handleChangeValidationRef.current = handleChangeValidation;
	}, [handleChangeValidation]);

	useEffect(() => {
		handleBlurValidationRef.current = handleBlurValidation;
	}, [handleBlurValidation]);

	useEffect(() => {
		if (!tagifyRef.current) return;

		const settings: any = {
			whitelist: suggestions,
			maxTags: maxEmails,
			placeholder,
			// Space / comma / enter each close off the address being typed.
			delimiters: EMAIL_DELIMITERS.source,
			// Reject anything that is not an email rather than keeping it as a chip.
			keepInvalidTags: false,
			validate: (tagData: any) => isEmailRecipient(tagData.value),
			dropdown: {
				enabled: 0,
				maxItems: 10,
				closeOnSelect: false
			}
		};

		const tagify = new Tagify(tagifyRef.current, settings) as any;
		if (initialEmails.length > 0) {
			tagify.addTags(initialEmails.filter(isEmailRecipient));
		}

		// @ts-ignore
		tagify.on("add remove", () => {
			const updated = (tagify.value || []).map((t: any) => t?.value || '');
			currentEmailsRef.current = updated;
			if (onChangeRef.current) {
				onChangeRef.current(updated);
			}
			handleChangeValidationRef.current(updated);
		});

		// @ts-ignore
		tagify.on("blur", () => {
			handleBlurValidationRef.current(currentEmailsRef.current);
		});

		return () => {
			tagify.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={"blue-orange-input-tags-cont" + (isError ? " blue-orange-input-tags-cont-error" : "")} style={style}>
			{label &&
				<div className={"blue-orange-default-input-label-cont" + (isError ? " blue-orange-default-input-label-cont-error" : "")} style={labelStyle}>
					{label}
					{help && <HelpIcon label={help}></HelpIcon>}
					{required && <RequiredIcon></RequiredIcon>}
				</div>
			}
			<input ref={tagifyRef} className={"blue-orange-tags blue-orange-email-recipients"}/>
			<InputValidationMessage result={validationResult}></InputValidationMessage>
		</div>
	);
};
