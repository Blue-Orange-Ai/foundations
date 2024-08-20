import React, {ReactNode, useEffect, useRef} from "react";

import './BlueOrangeGraphWrapper.css'

import { BlueOrangeGraph } from '@blue-orange-ai/primitives-graph'

import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'

import { Edge as GraphEdge, Node as GraphNode, GraphOptions } from "@blue-orange-ai/primitives-graph";


interface Props {
	nodes?: Array<GraphNode>,
	edges?: Array<GraphEdge>,
	options?: GraphOptions
}
export const BlueOrangeGraphWrapper: React.FC<Props> = ({nodes=[], edges=[], options}) => {

	const graphRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeGraphRef = useRef<BlueOrangeGraph | null>(null);

	useEffect(() => {
		const current = graphRef.current as HTMLElement;
		if (blueOrangeGraphRef.current == null) {
			blueOrangeGraphRef.current = new BlueOrangeGraph(
				current,
				nodes,
				edges,
				options);
		}
	}, []);


	return (
		<div ref={graphRef} className="blue-orange-graph-parent"></div>
	)
}