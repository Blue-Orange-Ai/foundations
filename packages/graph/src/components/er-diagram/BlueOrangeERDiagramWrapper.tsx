import React, {useEffect, useRef} from "react";

import './BlueOrangeERDiagramWrapper.css'

import { BlueOrangeERDiagram } from '@blue-orange-ai/primitives-graph'

import '@blue-orange-ai/primitives-graph/dist/css/primitives-graph.min.css'

import {
	Edge as GraphEdge,
	EREntity,
	EREntityInput,
	ERColumn,
	ERColumnClickDetail,
	EROptions,
	ERRelationship,
	ERRelationshipClickDetail,
	ERRelationshipInput,
	Node as GraphNode
} from "@blue-orange-ai/primitives-graph";

export type ERTheme = "light" | "dark";

interface Props {
	entities?: Array<EREntityInput>,
	relationships?: Array<ERRelationshipInput>,
	/** SQL DDL (CREATE TABLE ...) parsed into entities + relationships on mount, merged ahead of `entities` / `relationships`. */
	sql?: string,
	options?: EROptions,
	/** Colour theme. Changing it after mount switches the live diagram over. */
	theme?: ERTheme,
	instance?: (erDiagram: BlueOrangeERDiagram) => void,
	entityCreated?: (entity: EREntity | null) => void,
	entityRenamed?: (id: string, name: string) => void,
	columnChanged?: (entityId: string, column: ERColumn) => void,
	columnClicked?: (detail: ERColumnClickDetail) => void,
	relationshipCreated?: (relationship: ERRelationship) => void,
	relationshipClicked?: (detail: ERRelationshipClickDetail) => void,
	themeChanged?: (theme: ERTheme) => void,
	entityClicked?: (entity: EREntity | null, node: GraphNode, clickEvent: any) => void,
	entityDblClick?: (entity: EREntity | null, node: GraphNode, clickEvent: any) => void,
	entityRightClick?: (entity: EREntity | null, node: GraphNode, clickEvent: any) => void,
	onSelection?: (nodes: Array<GraphNode>, edges: Array<GraphEdge>) => void,
	onChange?: (nodes: Array<GraphNode>, edges: Array<GraphEdge>) => void
}

export const BlueOrangeERDiagramWrapper: React.FC<Props> = (props) => {

	const {entities=[], relationships=[], sql, options, theme, instance} = props;

	const erDiagramRef = useRef<HTMLDivElement | null>(null);

	const blueOrangeERDiagramRef = useRef<BlueOrangeERDiagram | null>(null);

	// Event listeners are registered once, so they read the callbacks through a
	// ref to always call the latest props rather than the ones captured on mount.
	const propsRef = useRef<Props>(props);
	propsRef.current = props;

	// ER entities are graph nodes, so the node events carry the node rather than
	// the entity meta the ER API works with.
	const resolveEntity = (node: GraphNode): EREntity | null => {
		const erDiagram = blueOrangeERDiagramRef.current;
		if (erDiagram == null || node == null || !node.id) {
			return null;
		}
		return erDiagram.getEntity(node.id);
	}

	useEffect(() => {
		const current = erDiagramRef.current as HTMLElement;
		if (blueOrangeERDiagramRef.current == null) {
			let initialEntities: Array<EREntityInput> = entities;
			let initialRelationships: Array<ERRelationshipInput> = relationships;
			if (sql) {
				const parsed = BlueOrangeERDiagram.parseSql(sql);
				initialEntities = [...parsed.entities, ...entities];
				initialRelationships = [...parsed.relationships, ...relationships];
			}
			const erOptions: EROptions = {
				...(options || {}),
				er: {
					...((options && options.er) || {}),
					...(theme ? { theme: theme } : {})
				}
			};
			blueOrangeERDiagramRef.current = new BlueOrangeERDiagram(
				current,
				initialEntities,
				initialRelationships,
				erOptions);
			if (instance) {
				instance(blueOrangeERDiagramRef.current)
			}
			current.addEventListener("blue-orange-er-entity-created", (ev: any) => {
				const entity: EREntity | null = ev.detail.entity;
				if (propsRef.current.entityCreated) {
					propsRef.current.entityCreated(entity);
				}
			})
			current.addEventListener("blue-orange-er-entity-renamed", (ev: any) => {
				const id: string = ev.detail.id;
				const name: string = ev.detail.name;
				if (propsRef.current.entityRenamed) {
					propsRef.current.entityRenamed(id, name);
				}
			})
			current.addEventListener("blue-orange-er-column-changed", (ev: any) => {
				const entityId: string = ev.detail.entityId;
				const column: ERColumn = ev.detail.column;
				if (propsRef.current.columnChanged) {
					propsRef.current.columnChanged(entityId, column);
				}
			})
			current.addEventListener("blue-orange-er-column-clicked", (ev: any) => {
				const detail: ERColumnClickDetail = ev.detail;
				if (propsRef.current.columnClicked) {
					propsRef.current.columnClicked(detail);
				}
			})
			current.addEventListener("blue-orange-er-relationship-created", (ev: any) => {
				const relationship: ERRelationship = ev.detail.relationship;
				if (propsRef.current.relationshipCreated) {
					propsRef.current.relationshipCreated(relationship);
				}
			})
			current.addEventListener("blue-orange-er-relationship-clicked", (ev: any) => {
				const detail: ERRelationshipClickDetail = ev.detail;
				if (propsRef.current.relationshipClicked) {
					propsRef.current.relationshipClicked(detail);
				}
			})
			current.addEventListener("blue-orange-er-theme-changed", (ev: any) => {
				const changedTheme: ERTheme = ev.detail.theme;
				if (propsRef.current.themeChanged) {
					propsRef.current.themeChanged(changedTheme);
				}
			})
			current.addEventListener("blue-orange-graph-node-clicked", (ev: any) => {
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.entityClicked) {
					propsRef.current.entityClicked(resolveEntity(node), node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-dbl-click", (ev: any) => {
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.entityDblClick) {
					propsRef.current.entityDblClick(resolveEntity(node), node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-node-right-click", (ev: any) => {
				const node: GraphNode = ev.detail.node;
				const clickEvent: any = ev.detail.clickEvent;
				if (propsRef.current.entityRightClick) {
					propsRef.current.entityRightClick(resolveEntity(node), node, clickEvent);
				}
			})
			current.addEventListener("blue-orange-graph-selection-event", (ev: any) => {
				const selectedNodes: Array<GraphNode> = ev.detail.selectedNodes;
				const selectedEdges: Array<GraphEdge> = ev.detail.selectedEdges;
				if (propsRef.current.onSelection) {
					propsRef.current.onSelection(selectedNodes, selectedEdges);
				}
			})
			current.addEventListener("blue-orange-graph-update-event", (ev: any) => {
				const nodes: Array<GraphNode> = ev.detail.nodes;
				const edges: Array<GraphEdge> = ev.detail.edges;
				if (propsRef.current.onChange) {
					propsRef.current.onChange(nodes, edges);
				}
			})
		}
	}, []);

	useEffect(() => {
		const erDiagram = blueOrangeERDiagramRef.current;
		if (erDiagram != null && theme && erDiagram.theme !== theme) {
			erDiagram.setTheme(theme);
		}
	}, [theme]);

	return (
		<div ref={erDiagramRef} className="blue-orange-er-diagram-parent"></div>
	)
}
