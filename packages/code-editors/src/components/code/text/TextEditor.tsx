import React, {useEffect, useRef} from "react";
import * as monaco from 'monaco-editor';

import './TextEditor.css'

interface Props {
	value: string,
	onChange?: (value: string) => void;
	language?: string,
	readOnly?: boolean,
	theme?: string,
	height?: string,
	width?: string,
}
export const TextEditor: React.FC<Props> = ({value, onChange, language = 'plaintext', readOnly = false, theme = 'vs-dark', height, width}) => {

	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const divRef = useRef<HTMLDivElement | null>(null);

	const suppressChangeRef = useRef<boolean>(false);


	useEffect(() => {
		if (divRef.current) {
			editorRef.current = monaco.editor.create(divRef.current, {
				value: value,
				language: language,
				theme: theme,
				readOnly: readOnly,
				automaticLayout: true,
			});
		}

		const contentChangeListener = editorRef.current?.onDidChangeModelContent(() => {
			if (suppressChangeRef.current) {
				return;
			}
			const currentContent = editorRef.current?.getValue();
			if (onChange) {
				onChange(currentContent || "");
			}
		});

		return () => {
			contentChangeListener?.dispose();
			// Dispose the editor on component unmount
			editorRef.current?.dispose();
			editorRef.current = null;
		};
	}, []);

	// Keep the editor in sync with external changes to the value prop
	useEffect(() => {
		const editor = editorRef.current;
		if (editor && value !== editor.getValue()) {
			suppressChangeRef.current = true;
			const position = editor.getPosition();
			editor.setValue(value);
			if (position) {
				editor.setPosition(position);
			}
			suppressChangeRef.current = false;
		}
	}, [value]);

	useEffect(() => {
		const model = editorRef.current?.getModel();
		if (model) {
			monaco.editor.setModelLanguage(model, language);
		}
	}, [language]);

	useEffect(() => {
		editorRef.current?.updateOptions({readOnly: readOnly, theme: theme} as monaco.editor.IEditorOptions);
	}, [readOnly, theme]);

	return (
		<div ref={divRef} className="blue-orange-text-editor" style={{height: height, width: width}} />
	)
}
