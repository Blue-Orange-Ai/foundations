/**
 * Signature creation dialog. Built from the core Modal + Button components and
 * the signature capture pads from @embedpdf/plugin-signature. On save the
 * signature is stored and placement is armed so the next page click drops it.
 */
import React, { useState } from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalFooterRight,
	ModalFooterLeft,
	Button,
	ButtonType,
	ButtonToggle,
	ButtonSize,
	IButtonToggleOption,
} from '@blue-orange-ai/foundations-core';

import {
	SignatureDrawPad,
	SignatureTypePad,
	useSignatureCapability,
} from '@embedpdf/plugin-signature/react';
import type { SignatureFieldDefinition } from '@embedpdf/plugin-signature';

import { usePdfViewerContext } from './context';

const modes: IButtonToggleOption[] = [
	{ value: 'draw', label: 'Draw', icon: 'ri-quill-pen-line' },
	{ value: 'type', label: 'Type', icon: 'ri-text' },
];

export const PdfSignatureDialog: React.FC = () => {
	const { documentId, signatureDialogOpen, setSignatureDialogOpen } = usePdfViewerContext();
	const signature = useSignatureCapability();

	const [mode, setMode] = useState<'draw' | 'type'>('draw');
	const [pending, setPending] = useState<SignatureFieldDefinition | null>(null);

	if (!signatureDialogOpen || !documentId) return null;

	const close = () => {
		setPending(null);
		setSignatureDialogOpen(false);
	};

	const save = () => {
		const cap = signature.provides;
		if (!cap || !pending) return;
		const entryId = cap.addEntry({ signature: pending });
		cap.forDocument(documentId).activateSignaturePlacement(entryId);
		close();
	};

	return (
		<Modal width={520} onClose={close}>
			<ModalHeader label="Add signature" />
			<ModalBody>
				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
					<ButtonToggle
						options={modes}
						value={mode}
						size={ButtonSize.SMALL}
						onChange={(v) => {
							setMode(v as 'draw' | 'type');
							setPending(null);
						}}
					/>
				</div>
				<div
					style={{
						border: '1px dashed #cbd5e1',
						borderRadius: 8,
						height: 180,
						background: '#fff',
						overflow: 'hidden',
					}}
				>
					{mode === 'draw' ? (
						<SignatureDrawPad
							onResult={setPending}
							strokeColor="#111827"
							strokeWidth={2.5}
						/>
					) : (
						<SignatureTypePad onResult={setPending} placeholder="Type your name" />
					)}
				</div>
				<div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
					After saving, click a page to place your signature.
				</div>
			</ModalBody>
			<ModalFooter>
				<ModalFooterLeft>
					<Button text="Cancel" buttonType={ButtonType.CLEAR} onClick={close} />
				</ModalFooterLeft>
				<ModalFooterRight>
					<Button
						text="Save & place"
						buttonType={ButtonType.PRIMARY}
						isDisabled={!pending}
						onClick={save}
					/>
				</ModalFooterRight>
			</ModalFooter>
		</Modal>
	);
};
