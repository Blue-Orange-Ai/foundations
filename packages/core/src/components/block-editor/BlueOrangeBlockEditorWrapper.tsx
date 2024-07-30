import React, {ReactNode, useEffect, useRef} from "react";

import './BlueOrangeBlockEditorWrapper.css'

import { BlockEditor } from '@Blue-Orange-Ai/primitives-block-editor'

import '@Blue-Orange-Ai/primitives-block-editor/dist/css/primitives-block-editor.min.css'


interface Props {
}
export const BlueOrangeBlockEditorWrapper: React.FC<Props> = ({}) => {

	const editorRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeGraphRef = useRef<BlockEditor | null>(null);

	useEffect(() => {
		const current = editorRef.current as HTMLElement;
		if (blueOrangeGraphRef.current == null) {
			blueOrangeGraphRef.current = new BlockEditor(
				current);
		}
	}, []);


	return (
		<div ref={editorRef} className="blue-orange-bloxk-editor-parent"></div>
	)
}