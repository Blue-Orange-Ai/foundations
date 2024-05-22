import React, {ReactNode, useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';

import './JsonEditor.css'


interface Props {
	value: string,
	onChange?: (value: string) => void;
}
export const JsonEditor: React.FC<Props> = ({value, onChange}) => {

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const divRef = useRef<HTMLDivElement | null>(null);


	useEffect(() => {
		if (divRef.current) {
			editorRef.current = monaco.editor.create(divRef.current, {
				value: '{\n  "key": "value"\n}',
				language: 'json',
				theme: 'vs-dark',
				formatOnPaste: true,
				automaticLayout: true,
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
		<div ref={divRef} style={{ height: '500px', width: '800px', border: '1px solid #ccc' }} />
	)
}