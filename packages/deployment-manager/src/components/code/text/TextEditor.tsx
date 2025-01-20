import React, {ReactNode, useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';

import './TextEditor.css'

interface Props {
	value: string,
	onChange?: (value: string) => void;
}
export const TextEditor: React.FC<Props> = ({value, onChange}) => {

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const divRef = useRef<HTMLDivElement | null>(null);


	useEffect(() => {
		if (divRef.current) {
			editorRef.current = monaco.editor.create(divRef.current, {
				value: value,
				language: 'text',
				theme: 'vs-dark'
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
		<div ref={divRef} style={{ height: '100%', width: '100%', border: 'none' }} />
	)
}