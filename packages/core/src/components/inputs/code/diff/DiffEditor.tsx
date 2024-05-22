import React, {ReactNode, useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';

import './DiffEditor.css'

interface Props {
	original: string;
	modified: string;
	language: string;
	onChange?: (value: string) => void;
}
export const DiffEditor: React.FC<Props> = ({original, modified, language, onChange}) => {

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const divRef = useRef<HTMLDivElement | null>(null);


	useEffect(() => {
		if (divRef.current) {
			// @ts-ignore
			editorRef.current = monaco.editor.createDiffEditor(divRef.current, {
				theme: 'vs-dark',
				renderSideBySide: true
			});
			const originalModel = monaco.editor.createModel(original, language);
			const modifiedModel = monaco.editor.createModel(modified, language);

			// @ts-ignore
			editorRef.current.setModel({original: originalModel, modified: modifiedModel});
		}

		return () => {
			if (editorRef.current) {
				editorRef.current.dispose();
			}
		};
	}, [original, modified]);

	return (
		<div ref={divRef} style={{ height: '100%', width: '100%', border: '1px solid #ccc' }} />
	)
}