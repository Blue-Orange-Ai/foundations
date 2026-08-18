import React from "react";

import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../../buttons/button/Button";

interface Props {
	/** Defaults to "Add field". */
	label?: string;
	/** Defaults to a small button. */
	size?: ButtonSize;
	disabled?: boolean;
	onClick: () => void;
}

/**
 * The control that appends a field, used at the root of the JsonSchemaEditor
 * and again inside every struct.
 */
export const JsonSchemaAddField: React.FC<Props> = ({
														label = "Add field",
														size = ButtonSize.SMALL,
														disabled = false,
														onClick}) => {

	return (
		<Button
			text={label}
			buttonType={ButtonType.SECONDARY}
			size={size}
			icon={"ri-add-line"}
			iconPos={ButtonIconPos.LEFT}
			isDisabled={disabled}
			onClick={onClick}></Button>
	)
}
