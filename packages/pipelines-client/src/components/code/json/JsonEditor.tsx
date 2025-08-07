import React, {ReactNode, useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';

import './JsonEditor.css'


interface Props {
	value: string,
	disabled?: boolean,
	onChange?: (value: string) => void;
}
export const JsonEditor: React.FC<Props> = ({value, disabled=false, onChange}) => {

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const divRef = useRef<HTMLDivElement | null>(null);


	useEffect(() => {
		if (divRef.current) {
			editorRef.current = monaco.editor.create(divRef.current, {
				value: value,
				language: 'json',
				theme: 'vs-dark',
				formatOnPaste: true,
				automaticLayout: true,
				readOnly: disabled,
			});
		}

		// @ts-ignore
		const contentChangeListener = editorRef.current.onDidChangeModelContent((event) => {
			const currentContent = editorRef.current?.getValue();
			if (onChange) {
				onChange(currentContent || "");
			}
		});

		return () => {
			contentChangeListener.dispose();
			// Dispose the editor on component unmount
			editorRef.current?.dispose();
		};
	}, []);

	return (
		<div ref={divRef} className="blue-orange-pipeline-editor-json-input" style={{ height: '100%', width: '100%', border: 'none' }} />
	)
}