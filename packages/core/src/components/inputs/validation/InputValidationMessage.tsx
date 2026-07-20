import React from "react";

import './InputValidationMessage.css';
import {InputValidationResult} from "./InputValidation";
import {RenderHtml} from "../../text-decorations/render-html/RenderHtml";

interface Props {
	result: InputValidationResult | null;
}

/**
 * Renders the message returned by a `validate` callback underneath an input.
 *
 * - If `messageHtml` is present it is rendered with the RenderHtml text decoration.
 * - Otherwise the plain text `message` is rendered, coloured red on error
 *   (green on success) via the shared CSS variables.
 */
export const InputValidationMessage: React.FC<Props> = ({result}) => {

	if (!result) {
		return null;
	}

	if (!result.message && !result.messageHtml) {
		return null;
	}

	const stateClass = result.state === "error"
		? "blue-orange-input-validation-message-error"
		: "blue-orange-input-validation-message-success";

	return (
		<div className={`blue-orange-input-validation-message ${stateClass}`}>
			{result.messageHtml
				? <RenderHtml html={result.messageHtml}></RenderHtml>
				: <span>{result.message}</span>
			}
		</div>
	);
};
