import React from "react";

import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../buttons/button/Button";
import {FormGroupSubmitResult, useFormGroup} from "./FormGroupContext";

interface Props {
	text: string;
	buttonType?: ButtonType;
	size?: ButtonSize;
	classes?: string;
	tooltip?: string;
	icon?: string;
	iconPos?: ButtonIconPos;
	isDisabled?: boolean;
	/** Forces the loading state on. The button also loads while the form submits. */
	isLoading?: boolean;
	isSuccess?: boolean;
	isError?: boolean;
	style?: React.CSSProperties;
	/** Called with the outcome once the submission finishes. */
	onSubmitted?: (result: FormGroupSubmitResult) => void;
}

/**
 * A button that submits the surrounding {@link FormGroup}.
 *
 * Shows the loading state for the duration of the validation and submission,
 * so an async onSubmit needs no extra wiring. Any number of these can sit in
 * the {@link FormActions} slot alongside ordinary buttons.
 */
export const FormSubmitButton: React.FC<Props> = ({
													  text,
													  buttonType = ButtonType.PRIMARY,
													  size,
													  classes,
													  tooltip,
													  icon,
													  iconPos,
													  isDisabled = false,
													  isLoading = false,
													  isSuccess,
													  isError,
													  style,
													  onSubmitted
												  }) => {

	const group = useFormGroup();

	const handleClick = () => {
		if (!group) {
			return;
		}
		group.submit().then(result => {
			if (onSubmitted) {
				onSubmitted(result);
			}
		});
	};

	const busy = group ? group.submitting || group.validating : false;

	return (
		<Button
			text={text}
			buttonType={buttonType}
			size={size}
			classes={classes}
			tooltip={tooltip}
			icon={icon}
			iconPos={iconPos}
			isDisabled={isDisabled}
			isLoading={isLoading || busy}
			isSuccess={isSuccess}
			isError={isError}
			style={style}
			onClick={handleClick}></Button>
	);
};
