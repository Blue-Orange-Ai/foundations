import React, {ReactNode, useEffect, useRef} from "react";

import '../../../../../node_modules/codemirror/lib/codemirror.css'
import '../../../../../node_modules/plyr/dist/plyr.css'

import './BlueOrangeBlockEditorWrapper.css'

import '@blue-orange-ai/primitives-block-editor/dist/css/primitives-block-editor.min.css'

import { BlockEditor } from "@blue-orange-ai/primitives-block-editor";


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