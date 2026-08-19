// The chart block type, registered with the primitives block editor through
// `options.additionalPlugins`.
//
// Primitives' plugin contract is a class of static methods that the editor
// calls with itself as the first argument. This class implements that contract
// directly rather than extending primitives' BlockPlugin: the base class is
// only exported by newer primitives builds, and inheriting from a missing
// export would fail at module evaluation and take the whole package with it.
// The two helpers we need from it (the comment indicator, and the managed
// listener registry) are small and reproduced here.
//
// The block's DOM, data and chart rendering live in ChartBlockController.

import type {
	BlueOrangeDocumentOptionsPlugin,
	BlueOrangeDocumentState,
} from "@blue-orange-ai/primitives-block-editor";

import {ChartBlockController} from "./ChartBlockController";
import {ChartBlockData, emptyChartData, migrateChartData} from "./ChartBlockTypes";

export const CHART_BLOCK_TYPE = "chart";

// The editor is a large vanilla-JS object whose type is not exported in a form
// we can usefully narrow to here; the fields the plugin touches are the ones
// every built-in plugin uses.
type EditorLike = any;

interface ChartCreateData {
	pos: number,
	type: string,
	parent?: string,
	indent?: number,
	selected?: boolean,
	reference?: string,
	focus?: boolean,
	selectable?: boolean,
	deletable?: boolean,
	moveable?: boolean,
	editable?: boolean,
	metaData?: any,
	chart?: any,
}

export class ChartPlugin {

	static get_type(): string {
		return CHART_BLOCK_TYPE;
	}

	// ---- Lifecycle ----

	static create(editorState: EditorLike, data: ChartCreateData) {
		// A host can seed every new chart through the registration entry's
		// `options.defaults` (see chartPluginEntry); an explicit `chart` on the
		// block spec still wins field by field.
		const defaults = editorState.getPluginOptionsByType?.(CHART_BLOCK_TYPE)?.defaults;
		this.createInternal(editorState, {
			pos: data.pos,
			type: data.type,
			parent: data.parent ?? "",
			indent: data.indent ?? 0,
			selected: data.selected ?? false,
			reference: data.reference ?? "",
			focus: data.focus ?? true,
			selectable: data.selectable !== false,
			deletable: data.deletable !== false,
			moveable: data.moveable !== false,
			editable: data.editable !== false,
			metaData: data.metaData ?? [],
			chart: migrateChartData({...(defaults ?? {}), ...(data.chart ?? {})}),
		});
	}

	static revive(editorState: EditorLike, state: any, pos: number) {
		this.createInternal(editorState, {
			pos: pos,
			type: state.type,
			parent: state.parent ?? "",
			indent: state.indent ?? 0,
			selected: state.selected ?? false,
			reference: state.reference ?? "",
			focus: false,
			selectable: state.selectable !== false,
			deletable: state.deletable !== false,
			moveable: state.moveable !== false,
			editable: state.editable !== false,
			metaData: state.metaData ?? [],
			chart: migrateChartData(state.data),
		});
	}

	static move(
		editorState: EditorLike,
		state: any,
		pos: number,
		indent: number,
		selected: boolean,
		focus: boolean
	) {
		this.createInternal(editorState, {
			pos: pos,
			type: state.type,
			parent: state.parent ?? "",
			indent: indent,
			selected: selected,
			reference: state.reference,
			focus: focus,
			selectable: state.selectable !== false,
			deletable: state.deletable !== false,
			moveable: state.moveable !== false,
			editable: state.editable !== false,
			metaData: state.metaData ?? [],
			chart: state.editor.getData(),
		});
	}

	// ---- Block data interface ----

	static serialize(state: any): ChartBlockData {
		return state.editor.getData();
	}

	static hydrate(state: any, data: any) {
		if (state.editor && typeof state.editor.change === "function") {
			state.editor.change(data);
		}
	}

	static equals(state: any, data: any): boolean {
		try {
			return state.editor.equals(data);
		} catch (e) {
			return true;
		}
	}

	// Deprecated primitives aliases — older editor builds call these names.
	static getDocumentData(state: any) { return this.serialize(state); }
	static applyBlockEdit(state: any, data: any) { return this.hydrate(state, data); }
	static blockEquals(state: any, data: any) { return this.equals(state, data); }

	// ---- Keyboard ----
	//
	// A chart holds no text run, so Enter appends a paragraph after it and
	// Backspace at the start merges it away, matching the other content blocks.

	static onEnter(_state: any, _ctx: any) {
		return {action: "insert-after", newType: "paragraph"};
	}

	static onBackspaceAtStart(_state: any, _ctx: any) {
		return {action: "merge-with-previous"};
	}

	static stopEventListeners(_state: any) {}

	static restartEventListeners(_editorState: EditorLike, _state: any) {}

	// ---- Comment indicator (mirrors primitives' BlockPlugin) ----

	static createCommentBlock(
		editorState: EditorLike,
		div: HTMLElement,
		uuid: string,
		_type: string,
		marginTop: string = "-8px"
	) {
		const commentCont = document.createElement("div");
		commentCont.setAttribute("contenteditable", "false");
		commentCont.className = "blue-orange-comment-cont no-select";
		commentCont.id = "blue-orange-comment-" + uuid;
		commentCont.style.display = "none";
		commentCont.style.marginTop = marginTop;
		commentCont.style.left = "calc(100% + 10px)";
		const commentIcon = document.createElement("i");
		commentIcon.className = editorState.commentIconClassName;
		commentCont.appendChild(commentIcon);
		const commentSpan = document.createElement("span");
		commentSpan.id = "blue-orange-comment-numbers-" + uuid;
		commentSpan.className = "blue-orange-comment-text";
		commentSpan.innerText = "1";
		commentCont.appendChild(commentSpan);
		commentCont.addEventListener("click", () => {
			editorState.raw.dispatchEvent(new CustomEvent("commenttooltipclicked", {detail: {uuid: uuid}}));
		});
		div.appendChild(commentCont);
	}

	static updateCommentBlock(uuid: string, show: boolean, num: number) {
		const commentBlock = document.getElementById("blue-orange-comment-" + uuid);
		if (commentBlock) {
			commentBlock.style.display = show ? "flex" : "none";
			const commentSpan = document.getElementById("blue-orange-comment-numbers-" + uuid);
			if (commentSpan) {
				(commentSpan as HTMLElement).innerText = String(num);
			}
		}
	}

	// ---- Teardown ----
	//
	// detachAllManagedListeners is called when a block is deleted and when the
	// whole editor is destroyed, and is the only teardown hook the plugin
	// contract offers — so the block's listeners come off and its React root is
	// unmounted from here. The listeners live on the controller rather than on
	// the block state: the serialiser copies every unrecognised key of that
	// object into the document, and a DOM node there would make the document
	// unserialisable.

	static detachAllManagedListeners(state: any) {
		if (state && state.editor && typeof state.editor.destroy === "function") {
			try {
				state.editor.destroy();
			} catch (e) {
				// best-effort during teardown
			}
		}
	}

	// ---- Block construction ----

	private static createInternal(editorState: EditorLike, spec: Required<Omit<ChartCreateData, "chart">> & {chart: ChartBlockData}) {
		const pos = editorState.adjustPos(spec.pos);
		const uuid = editorState.generateUUID();

		const div = document.createElement("div");
		div.setAttribute("id", uuid);
		div.setAttribute("class", "blue-orange-block-editor-cont");
		div.style.paddingLeft = editorState.indentLevel * spec.indent + "px";

		const divInternal = document.createElement("div");
		divInternal.setAttribute("class", "blue-orange-block-editor-cont-internal");
		div.appendChild(divInternal);

		if (pos >= editorState.state.length - 1) {
			editorState.element.appendChild(div);
		} else {
			editorState.element.insertBefore(div, document.getElementById(editorState.state[pos + 1].uuid));
		}

		const controller = new ChartBlockController(divInternal, spec.chart, spec.editable);

		const state: BlueOrangeDocumentState & Record<string, any> = {
			reference: spec.reference === "" ? editorState.generateUUID() : spec.reference,
			uuid: uuid,
			editor: controller,
			type: spec.type,
			parent: spec.parent,
			indent: spec.indent,
			toggleOpen: false,
			checked: false,
			dragging: false,
			selected: spec.selected,
			selectable: spec.selectable,
			deletable: spec.deletable,
			moveable: spec.moveable,
			editable: spec.editable,
			metaData: spec.metaData,
			data: spec.chart,
		};

		if (pos >= editorState.state.length - 1) {
			editorState.state.push(state);
		} else {
			editorState.state.splice(pos + 1, 0, state);
		}

		controller.addListener("deleteevent", () => {
			editorState.deleteDiv(editorState.getPos(state.uuid));
		});
		controller.addListener("addbelow", () => {
			editorState.enterEvent(state);
		});
		controller.addListener("datachange", () => {
			// Only record once the block is really in the document — a change
			// fired while it is being spliced in would land on the wrong index.
			if (editorState.state[editorState.getPosReference(state.reference)] !== undefined) {
				editorState.recordBlockEdit(state, {
					type: spec.type,
					data: controller.getData(),
					caret: 0,
					toggleOpen: false,
					checked: false,
				});
			}
		});

		editorState.updatePageOrder();
		editorState.determineToggleState();
		editorState.determineToggleCaret();

		this.createDragHandle(editorState, div, uuid);
		this.createCommentBlock(editorState, div, uuid, spec.type);
		this.attachBlockSelection(editorState, div, uuid);

		const selectedDiv = document.createElement("div");
		selectedDiv.id = "blue-orange-editor-selected-" + uuid;
		selectedDiv.className = "blue-orange-editor-selected";
		selectedDiv.setAttribute("contenteditable", "false");
		div.appendChild(selectedDiv);

		editorState.updateSelected(state.reference);
	}

	private static createDragHandle(editorState: EditorLike, div: HTMLElement, uuid: string) {
		const dragHandle = document.createElement("div");
		dragHandle.setAttribute("contenteditable", "false");
		dragHandle.className = "blue-orange-drag-handle";
		dragHandle.id = "blue-orange-drag-handle-" + uuid;
		dragHandle.style.right = "calc(100% + 10px)";
		dragHandle.style.marginTop = "-8px";
		const dragHandleIcon = document.createElement("i");
		dragHandleIcon.className = editorState.dragHandleIconClassName;
		dragHandle.appendChild(dragHandleIcon);
		dragHandle.draggable = true;
		dragHandle.addEventListener("dragstart", (ev) => {
			ev.preventDefault();
			editorState.openDragSelected();
		});
		dragHandle.addEventListener("contextmenu", (ev) => {
			ev.preventDefault();
			editorState._openBlockContextWindow(ev);
		});
		div.appendChild(dragHandle);
	}

	/**
	 * Block-level selection, matching the built-in content blocks: dragging
	 * across blocks selects them, and a click inside the chart's own controls
	 * must not put a caret into the document.
	 */
	private static attachBlockSelection(editorState: EditorLike, div: HTMLElement, uuid: string) {
		const isOwnControl = (target: EventTarget | null) =>
			editorState.isDescendantClassName("blue-orange-drag-handle", target) ||
			editorState.isDescendantClassName("blue-orange-chart-block-tools", target) ||
			editorState.isDescendantClassName("blue-orange-editor-modal", target);

		div.addEventListener("mousedown", (ev) => {
			editorState.mouseDown = true;
			editorState.mouseDownPos = editorState.getPos(uuid);
			const pos = editorState.getPos(uuid);
			if (editorState.state[pos]) {
				editorState.state[pos].selected = true;
			}
			if (!isOwnControl(ev.target)) {
				editorState.clearSelected();
				editorState.activateContentEditable(ev);
			} else {
				editorState.element.setAttribute("contenteditable", "false");
				editorState.highlightSelected();
			}
		});
		div.addEventListener("mouseenter", () => {
			if (editorState.mouseDown && !editorState.dragging) {
				editorState.determineSelected(editorState.getPos(uuid));
			}
			editorState.deactivateAllTools();
			editorState.activateHandles(uuid);
		});
		div.addEventListener("mousemove", () => {
			editorState.deactivateAllTools();
			editorState.activateHandles(uuid);
		});
		div.addEventListener("mouseup", (ev) => {
			if (editorState.mouseDown) {
				editorState.mouseDown = false;
				if (!editorState.utils.isTextSelected() && !isOwnControl(ev.target)) {
					editorState.clearContentEditable();
				}
			}
		});
	}
}

/**
 * Append a chart block, optionally pre-configured.
 *
 * `createBlock` only carries the block fields primitives knows about, so the
 * chart's own data is applied to the new block afterwards. Returns the block's
 * reference, or null when the chart block type is not registered.
 */
export const insertChartBlock = (
	editor: EditorLike,
	chart?: Partial<ChartBlockData>,
	options: {pos?: number, focus?: boolean} = {}
): string | null => {
	if (editor == null || typeof editor.createBlock !== "function") {
		return null;
	}
	if (editor.getPluginByType(CHART_BLOCK_TYPE) === undefined) {
		return null;
	}
	const before: Record<string, boolean> = {};
	for (const state of editor.state) {
		before[state.uuid] = true;
	}
	editor.createBlock({
		pos: options.pos !== undefined ? options.pos : editor.state.length - 1,
		type: CHART_BLOCK_TYPE,
		focus: options.focus !== false,
	});
	const added = editor.state.find((state: any) => !before[state.uuid]);
	if (added === undefined) {
		return null;
	}
	if (chart !== undefined) {
		added.editor.change(migrateChartData({...emptyChartData(), ...chart}));
		editor.recordBlockEdit(added, {
			type: CHART_BLOCK_TYPE,
			data: added.editor.getData(),
			caret: 0,
			toggleOpen: false,
			checked: false,
		});
	}
	return added.reference;
};

/**
 * The registration entry handed to the primitives editor via
 * `options.additionalPlugins`.
 */
export const chartPluginEntry = (
	overrides: Partial<BlueOrangeDocumentOptionsPlugin> = {}
): BlueOrangeDocumentOptionsPlugin => ({
	label: "Chart",
	type: CHART_BLOCK_TYPE,
	isText: false,
	icon: "ri-line-chart-line",
	plugin: ChartPlugin as any,
	// `defaults` seeds every chart block created through this registration —
	// override it to change the starting chart type, height or palette.
	options: {defaults: emptyChartData()},
	aliases: ["graph", "plot", "bar chart", "line chart", "csv", "xlsx", "data", "visualisation", "visualization"],
	...overrides,
});
