// Per-block controller for the chart block.
//
// The primitives editor is vanilla JS and talks to each block through a small
// object it calls `state.editor` — getData/change/equals/updateEditableState
// and friends (see the built-in *Editor classes in primitives). This class is
// that object for chart blocks; it owns the block's data and a React root that
// renders the foundations-core chart into the block's DOM node.

import React from "react";
import {createRoot, Root} from "react-dom/client";

import {ChartBlockData, chartIsRenderable, migrateChartData} from "./ChartBlockTypes";
import {chartToHtml, chartToMarkdown} from "./chartExport";
import {ChartBlockView} from "./view/ChartBlockView";

export class ChartBlockController {

	/** The block's DOM node. `state.editor.editor` in primitives' terms. */
	editor: HTMLElement;

	private data: ChartBlockData;
	private editableState: boolean;
	private root: Root | null;
	private destroyed: boolean;
	// Listeners the plugin attached to this block's node, so teardown can undo
	// them. They are held here rather than on the editor's block state: every
	// key of that object except a known few is copied into the serialised
	// document, and a DOM node in there makes the document unserialisable.
	private listeners: Array<{event: string, handler: EventListener}>;

	constructor(element: HTMLElement, data: any, editableState: boolean = true) {
		this.editor = element;
		this.data = migrateChartData(data);
		this.editableState = editableState;
		this.destroyed = false;
		this.listeners = [];
		this.editor.classList.add("blue-orange-chart-block-host");
		this.root = createRoot(element);
		this.render();
	}

	/** Register a listener on the block's node, removed again by destroy(). */
	addListener(event: string, handler: EventListener) {
		this.editor.addEventListener(event, handler);
		this.listeners.push({event: event, handler: handler});
	}

	// ---- Rendering ----

	private render() {
		if (this.destroyed || this.root == null) {
			return;
		}
		this.root.render(
			React.createElement(ChartBlockView, {
				data: this.data,
				editable: this.editableState,
				onChange: (next: ChartBlockData) => {
					this.data = next;
					this.render();
					this.dispatch();
				},
				onDelete: () => this.editor.dispatchEvent(new CustomEvent("deleteevent", {detail: {delete: true}})),
				onAddBelow: () => this.editor.dispatchEvent(new CustomEvent("addbelow", {detail: {add: true}})),
			})
		);
	}

	/** Tell the editor the block's data changed, so it records history and syncs. */
	private dispatch() {
		this.editor.dispatchEvent(new CustomEvent("datachange", {
			detail: {data: () => this.getData()},
		}));
	}

	// ---- Block data interface ----

	getData(): ChartBlockData {
		return this.data;
	}

	/** Apply a snapshot — undo/redo and incoming collaboration edits land here. */
	change(data: any) {
		this.data = migrateChartData(data);
		this.render();
	}

	equals(data: any): boolean {
		try {
			return JSON.stringify(this.data) === JSON.stringify(migrateChartData(data));
		} catch (e) {
			return false;
		}
	}

	// ---- Text-shaped API the editor calls on every block ----

	getText(): string {
		return this.data.title;
	}

	setText(_text: string) {
		// A chart has no editable text run; the title is set from the settings
		// modal. Implemented so the editor's generic paths stay no-ops rather
		// than throwing.
	}

	isEmpty(): boolean {
		return !chartIsRenderable(this.data);
	}

	focus() {
		this.editor.focus();
	}

	selectable(): boolean {
		return false;
	}

	highlightSelection() {
		this.editor.classList.add("blue-orange-editor-selected-active");
	}

	removeSelectionHighlight() {
		this.editor.classList.remove("blue-orange-editor-selected-active");
	}

	updateEditableState(editableState: boolean) {
		if (this.editableState === editableState) {
			return;
		}
		this.editableState = editableState;
		this.render();
	}

	updateSelectableState(_selectableState: boolean) {
	}

	// ---- Export ----

	toHtml(_type?: string): HTMLElement {
		return chartToHtml(this.data);
	}

	toMarkdown(_type?: string): string {
		return chartToMarkdown(this.data);
	}

	// ---- Teardown ----

	destroy() {
		if (this.destroyed) {
			return;
		}
		this.destroyed = true;
		for (const listener of this.listeners) {
			try {
				this.editor.removeEventListener(listener.event, listener.handler);
			} catch (e) {
				// best-effort during teardown
			}
		}
		this.listeners = [];
		const root = this.root;
		this.root = null;
		// Deletion is usually triggered from inside this block's own React tree
		// (the toolbar's delete button), and React refuses to unmount a root
		// while it is rendering. Unmounting on the next tick keeps it happy and
		// the node is already detached by then.
		if (root != null) {
			setTimeout(() => root.unmount(), 0);
		}
	}
}
