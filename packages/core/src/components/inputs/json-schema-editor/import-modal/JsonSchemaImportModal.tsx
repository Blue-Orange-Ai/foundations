import React, {useEffect, useState} from "react";

import './JsonSchemaImportModal.css'
import {Modal} from "../../../layouts/modal/modal/Modal";
import {ModalHeader} from "../../../layouts/modal/modal-header/ModalHeader";
import {ModalDescription} from "../../../layouts/modal/modal-description/ModalDescription";
import {ModalBody} from "../../../layouts/modal/modal-body/ModalBody";
import {ModalFooter} from "../../../layouts/modal/modal-footer/ModalFooter";
import {ModalFooterRight} from "../../../layouts/modal/modal-footer-right/ModalFooterRight";
import {Button, ButtonType} from "../../../buttons/button/Button";
import {TextArea} from "../../textarea/TextArea";
import {JsonSchemaField} from "../JsonSchemaTypes";
import {inferJsonSchemaFields} from "../JsonSchemaInference";

interface Props {
	open: boolean;
	/** Defaults to "Infer schema from JSON". */
	title?: string;
	onClose: () => void;
	/** Handed the fields read out of the pasted example. */
	onInferred: (fields: JsonSchemaField[]) => void;
}

/**
 * Takes an example JSON object and reads a schema out of it, so a schema does
 * not have to be typed out field by field when a sample of the data is to hand.
 */
export const JsonSchemaImportModal: React.FC<Props> = ({
														   open,
														   title = "Infer schema from JSON",
														   onClose,
														   onInferred}) => {

	const [text, setText] = useState("");

	const [error, setError] = useState<string | undefined>(undefined);

	useEffect(() => {
		// the modal is reused, so it starts empty every time it is opened
		if (open) {
			setText("");
			setError(undefined);
		}
	}, [open]);

	const infer = () => {
		if (text.trim().length === 0) {
			setError("Paste an example JSON object.");
			return;
		}
		var parsed: any;
		try {
			parsed = JSON.parse(text);
		} catch (e: any) {
			setError("That is not valid JSON" + (e?.message ? " — " + e.message : "."));
			return;
		}
		const fields = inferJsonSchemaFields(parsed);
		if (fields === undefined) {
			setError("Paste a JSON object, or an array of them — a single value describes no fields.");
			return;
		}
		if (fields.length === 0) {
			setError("That object has no fields to read.");
			return;
		}
		setError(undefined);
		onInferred(fields);
		onClose();
	}

	return (
		<Modal open={open} width={640} minWidth={640} onClose={onClose}>
			<ModalHeader label={title} onClose={onClose}></ModalHeader>
			<ModalDescription
				description={"Paste an example of the data. Its fields replace the schema below, with the type of each one read from the value it holds."}></ModalDescription>
			<ModalBody>
				<div className="blue-orange-json-schema-import-text">
					<TextArea
						label={"Example JSON"}
						value={text}
						placeholder={"{\n  \"name\": \"Acme\",\n  \"orders\": [{\"reference\": \"A-1\"}]\n}"}
						onChange={(value) => {
							setText(value);
							setError(undefined);
						}}></TextArea>
				</div>
				{error &&
					<div className="blue-orange-json-schema-import-error">
						<i className="ri-error-warning-line"></i>
						<span>{error}</span>
					</div>
				}
			</ModalBody>
			<ModalFooter>
				<ModalFooterRight>
					<Button text={"Infer schema"} buttonType={ButtonType.PRIMARY} onClick={infer}></Button>
				</ModalFooterRight>
			</ModalFooter>
		</Modal>
	)
}
