import React from "react";
import {act, render, waitFor} from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
//
// The wrapper instantiates the real primitives BlockEditor, pulls in
// foundations-core layout components, a passport client and codemirror. We
// replace all of those with lightweight stand-ins so the tests exercise the
// wrapper's own logic (option wiring, imperative handle, event plumbing) in
// isolation.
// ---------------------------------------------------------------------------

// NB: react-scripts' Jest config sets `resetMocks: true`, which strips every
// mock's implementation before each test. So we declare bare vi.fn()s in the
// module factories and (re)install their behaviour in beforeEach.
vi.mock("@blue-orange-ai/primitives-block-editor", () => ({
	BlockEditor: vi.fn(),
}));

const buildEditorMock = (element?: any, doc?: any, options?: any) => ({
	element,
	doc,
	options,
	toJson: vi.fn(() => ({states: [{uuid: "a"}, {uuid: "b"}]})),
	toHtmlCopy: vi.fn(() => "<p>html copy</p>"),
	reviveDocument: vi.fn(),
	clearDocument: vi.fn(),
	resolveComment: vi.fn(),
	updateInlineContext: vi.fn(),
	closeInlineContextWindowToolbar: vi.fn(),
	undo: vi.fn(),
	redo: vi.fn(),
	diffDocuments: vi.fn(() => ({close: vi.fn()})),
	createBlock: vi.fn(),
	toMarkdown: vi.fn(() => "# markdown"),
	fromMarkdown: vi.fn(),
	isTemplateMode: vi.fn(() => true),
	getTemplateVariables: vi.fn(() => ["name"]),
	getTemplateLoops: vi.fn(() => [{name: "items", fields: ["label"]}]),
	getTemplateSchema: vi.fn(() => ({name: "", items: [{label: ""}]})),
	substituteTemplateData: vi.fn(),
	substituteVariables: vi.fn(),
	substituteLoops: vi.fn(),
	applyTemplateModeToBlocks: vi.fn(),
	// Document mode. The mock keeps real state so the wrapper's
	// "only call setDocumentMode when it actually changed" guard is exercised.
	documentMode: (options && options.mode) || "edit",
	getDocumentMode: vi.fn(),
	setDocumentMode: vi.fn(),
	setReadOnly: vi.fn(),
	setCommentOnly: vi.fn(),
	isReadOnly: vi.fn(() => false),
	isCommentOnly: vi.fn(() => false),
	canEdit: vi.fn(() => true),
	canComment: vi.fn(() => true),
	effectiveBlockEditable: vi.fn(() => true),
	applyDocumentMode: vi.fn(),
	documentBuilder: vi.fn(() => documentBuilderStub),
});

// Stands in for the DocumentBuilder the editor hands back.
const documentBuilderStub = {kind: "document-builder"};

vi.mock("@blue-orange-ai/foundations-core", () => {
	const ReactLib = require("react");
	const passthrough = (testid: string) => ({children}: any) =>
		ReactLib.createElement("div", {"data-testid": testid}, children);
	return {
		Drawer: passthrough("drawer"),
		DrawerBody: passthrough("drawer-body"),
		DrawerHeader: ({label}: any) => ReactLib.createElement("div", {"data-testid": "drawer-header"}, label),
		DrawerPosition: {RIGHT: "right", LEFT: "left"},
		FullPageComments: ({topic}: any) => ReactLib.createElement("div", {"data-testid": "comments", "data-topic": topic}),
		Tab: () => ReactLib.createElement("div", {"data-testid": "tab"}),
		Tabs: passthrough("tabs"),
		RenderHtml: ({html}: any) => ReactLib.createElement("div", {"data-testid": "render-html"}, html),
		// Pulled in transitively by the chart block plugin, which the wrapper
		// registers. The wrapper's own behaviour is what these tests cover, so
		// the chart UI is stubbed rather than rendered.
		BarChart: passthrough("bar-chart"),
		LineChart: passthrough("line-chart"),
		ScatterChart: passthrough("scatter-chart"),
		ComboChart: passthrough("combo-chart"),
		LegendPosition: {
			TOP: 0,
			BOTTOM: 1,
			TOP_LEFT: 2,
			TOP_RIGHT: 3,
			BOTTOM_LEFT: 4,
			BOTTOM_RIGHT: 5,
		},
		Button: ({text}: any) => ReactLib.createElement("button", null, text),
		ButtonIcon: ({icon}: any) => ReactLib.createElement("button", {"data-icon": icon}),
		ButtonType: {PRIMARY: 0, SECONDARY: 1, SUCCESS: 2, DANGER: 3, WARNING: 4, CUSTOM: 5, CLEAR: 6},
		ButtonSize: {SMALL: "SMALL", MEDIUM: "MEDIUM", LARGE: "LARGE"},
		ColorPicker: passthrough("color-picker"),
		Dropdown: passthrough("dropdown"),
		DropdownItemText: () => ReactLib.createElement("div", {"data-testid": "dropdown-item"}),
		Input: passthrough("input"),
		Modal: passthrough("modal"),
		ModalBody: passthrough("modal-body"),
		ModalFooter: passthrough("modal-footer"),
		ModalFooterRight: passthrough("modal-footer-right"),
		ModalHeader: ({label}: any) => ReactLib.createElement("div", {"data-testid": "modal-header"}, label),
		Spinner: () => ReactLib.createElement("div", {"data-testid": "spinner"}),
		SpinnerSize: {SMALL: "SMALL", MEDIUM: "MEDIUM", LARGE: "LARGE"},
		TextArea: passthrough("textarea"),
		Toggle: passthrough("toggle"),
	};
});

const mockSearchPublicUsers = vi.fn();

vi.mock("./config/BlueOrangePassportConfig", () => ({
	__esModule: true,
	default: {searchPublicUsers: (...args: any[]) => mockSearchPublicUsers(...args)},
}));

vi.mock("codemirror", () => ({__esModule: true, default: {}}));

import {BlockEditor} from "@blue-orange-ai/primitives-block-editor";
import {BlueOrangeBlockEditorHandle, BlueOrangeBlockEditorWrapper} from "./BlueOrangeBlockEditorWrapper";

const MockBlockEditor = BlockEditor as unknown as ReturnType<typeof vi.fn>;

// ---- helpers --------------------------------------------------------------

const latestEditor = () => MockBlockEditor.mock.results[MockBlockEditor.mock.results.length - 1].value;
const latestOptions = () => MockBlockEditor.mock.calls[MockBlockEditor.mock.calls.length - 1][2];

const getEditorEl = (container: HTMLElement): HTMLElement =>
	container.querySelector(".blue-orange-block-editor-parent") as HTMLElement;

const fire = (el: HTMLElement, type: string, detail?: any) =>
	act(() => {
		el.dispatchEvent(new CustomEvent(type, {detail}));
	});

beforeEach(() => {
	// resetMocks has already wiped implementations — reinstall them here.
	MockBlockEditor.mockImplementation((element: any, doc: any, options: any) => {
		const editor: any = buildEditorMock(element, doc, options);
		editor.getDocumentMode.mockImplementation(() => editor.documentMode);
		editor.setDocumentMode.mockImplementation((mode: string) => {
			editor.documentMode = mode;
		});
		editor.isReadOnly.mockImplementation(() => editor.documentMode === "read");
		editor.isCommentOnly.mockImplementation(() => editor.documentMode === "comment");
		editor.canEdit.mockImplementation(() => editor.documentMode === "edit");
		editor.canComment.mockImplementation(() => editor.documentMode !== "read");
		editor.documentBuilder.mockImplementation(() => documentBuilderStub);
		return editor;
	});
	mockSearchPublicUsers.mockResolvedValue({
		result: [
			{id: "user-1", username: "alice", name: "Alice"},
			{id: "user-2", username: "bob", name: ""},
		],
	});
	document.cookie = "";
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — rendering & construction", () => {

	it("renders the editor parent element", () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper/>);
		expect(getEditorEl(container)).toBeInTheDocument();
	});

	it("constructs the BlockEditor exactly once with the editor element", () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper/>);
		expect(MockBlockEditor).toHaveBeenCalledTimes(1);
		expect(MockBlockEditor.mock.calls[0][0]).toBe(getEditorEl(container));
	});

	it("applies default comments/template options", () => {
		render(<BlueOrangeBlockEditorWrapper/>);
		const options = latestOptions();
		expect(options.comments).toBe(true);
		expect(options.template).toBe(false);
	});

	it("passes the initial document through to the editor", () => {
		const doc = {states: [{uuid: "x"}]} as any;
		render(<BlueOrangeBlockEditorWrapper document={doc}/>);
		expect(MockBlockEditor.mock.calls[0][1]).toBe(doc);
	});

	it("merges user options and honours enableComments / template props", () => {
		render(
			<BlueOrangeBlockEditorWrapper
				options={{collaborationCursors: true, userName: "Tom"} as any}
				enableComments={false}
				template={true}
			/>
		);
		const options = latestOptions();
		expect(options.collaborationCursors).toBe(true);
		expect(options.userName).toBe("Tom");
		expect(options.comments).toBe(false);
		expect(options.template).toBe(true);
	});

	it("sets mediaUri when provided", () => {
		render(<BlueOrangeBlockEditorWrapper mediaUri="http://media.test"/>);
		expect(latestOptions().mediaUri).toBe("http://media.test");
	});

	it("clears mediaUri when the media server is disabled", () => {
		render(<BlueOrangeBlockEditorWrapper mediaUri="http://media.test" disableMediaServer/>);
		expect(latestOptions().mediaUri).toBeUndefined();
	});
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — imperative handle", () => {

	const renderWithRef = (props = {}) => {
		const ref = React.createRef<BlueOrangeBlockEditorHandle>();
		const utils = render(<BlueOrangeBlockEditorWrapper ref={ref} {...props}/>);
		return {ref, ...utils};
	};

	it("getEditor returns the underlying editor instance", () => {
		const {ref} = renderWithRef();
		expect(ref.current!.getEditor()).toBe(latestEditor());
	});

	it("toJson delegates to the editor", () => {
		const {ref} = renderWithRef();
		const result = ref.current!.toJson();
		expect(latestEditor().toJson).toHaveBeenCalled();
		expect(result).toEqual({states: [{uuid: "a"}, {uuid: "b"}]});
	});

	it("toHtmlCopy delegates to the editor", () => {
		const {ref} = renderWithRef();
		expect(ref.current!.toHtmlCopy()).toBe("<p>html copy</p>");
		expect(latestEditor().toHtmlCopy).toHaveBeenCalled();
	});

	it("reviveDocument delegates to the editor", () => {
		const {ref} = renderWithRef();
		const doc = {states: []} as any;
		ref.current!.reviveDocument(doc);
		expect(latestEditor().reviveDocument).toHaveBeenCalledWith(doc);
	});

	it("clearDocument delegates to the editor", () => {
		const {ref} = renderWithRef();
		ref.current!.clearDocument();
		expect(latestEditor().clearDocument).toHaveBeenCalled();
	});

	it("toMarkdown delegates to the editor (new feature)", () => {
		const {ref} = renderWithRef();
		expect(ref.current!.toMarkdown()).toBe("# markdown");
		expect(latestEditor().toMarkdown).toHaveBeenCalled();
	});

	it("fromMarkdown delegates to the editor (new feature)", () => {
		const {ref} = renderWithRef();
		ref.current!.fromMarkdown("# hello");
		expect(latestEditor().fromMarkdown).toHaveBeenCalledWith("# hello");
	});

	it("undo / redo delegate to the editor (new feature)", () => {
		const {ref} = renderWithRef();
		ref.current!.undo();
		ref.current!.redo();
		expect(latestEditor().undo).toHaveBeenCalled();
		expect(latestEditor().redo).toHaveBeenCalled();
	});

	it("diffDocuments delegates with the other doc and options (new feature)", () => {
		const {ref} = renderWithRef();
		const other = {states: []} as any;
		const opts = {oldLabel: "old"};
		ref.current!.diffDocuments(other, opts);
		expect(latestEditor().diffDocuments).toHaveBeenCalledWith(other, opts);
	});

	it("createBlock delegates to the editor (new feature)", () => {
		const {ref} = renderWithRef();
		const spec = {pos: 0, type: "paragraph", text: "hi"} as any;
		ref.current!.createBlock(spec);
		expect(latestEditor().createBlock).toHaveBeenCalledWith(spec);
	});

	it("exposes the template helpers (new feature)", () => {
		const {ref} = renderWithRef();
		expect(ref.current!.isTemplateMode()).toBe(true);
		expect(ref.current!.getTemplateVariables()).toEqual(["name"]);
		expect(ref.current!.getTemplateLoops()).toEqual([{name: "items", fields: ["label"]}]);
		expect(ref.current!.getTemplateSchema()).toEqual({name: "", items: [{label: ""}]});

		ref.current!.substituteTemplateData({name: "Tom"});
		expect(latestEditor().substituteTemplateData).toHaveBeenCalledWith({name: "Tom"});

		ref.current!.substituteVariables({name: "Tom"});
		expect(latestEditor().substituteVariables).toHaveBeenCalledWith({name: "Tom"});

		ref.current!.substituteLoops({items: [{label: "one"}]});
		expect(latestEditor().substituteLoops).toHaveBeenCalledWith({items: [{label: "one"}]});

		ref.current!.applyTemplateModeToBlocks();
		expect(latestEditor().applyTemplateModeToBlocks).toHaveBeenCalled();
	});
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — change & reference events", () => {

	it("invokes onChange with the serialized document on datachange", () => {
		const onChange = vi.fn();
		const {container} = render(<BlueOrangeBlockEditorWrapper onChange={onChange}/>);
		fire(getEditorEl(container), "datachange");
		expect(onChange).toHaveBeenCalledWith({states: [{uuid: "a"}, {uuid: "b"}]});
	});

	it("forwards reference lifecycle events to their callbacks", () => {
		const onReferenceAdded = vi.fn();
		const onReferenceUpdated = vi.fn();
		const onReferenceRemoved = vi.fn();
		const onReferenceClicked = vi.fn();
		const {container} = render(
			<BlueOrangeBlockEditorWrapper
				onReferenceAdded={onReferenceAdded}
				onReferenceUpdated={onReferenceUpdated}
				onReferenceRemoved={onReferenceRemoved}
				onReferenceClicked={onReferenceClicked}
			/>
		);
		const el = getEditorEl(container);
		const detail = {referenceUuid: "r1", referenceNumber: 1};

		fire(el, "blue-orange-editor-new-reference-added", detail);
		fire(el, "blue-orange-editor-reference-updated", detail);
		fire(el, "blue-orange-editor-reference-removed", detail);
		fire(el, "blue-orange-editor-reference-clicked", detail);

		expect(onReferenceAdded).toHaveBeenCalledWith(detail);
		expect(onReferenceUpdated).toHaveBeenCalledWith(detail);
		expect(onReferenceRemoved).toHaveBeenCalledWith(detail);
		expect(onReferenceClicked).toHaveBeenCalledWith(detail);
	});
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — comments", () => {

	it("opens the comment drawer when a new comment is added", async () => {
		const {container, queryByTestId, findByTestId} = render(<BlueOrangeBlockEditorWrapper/>);
		expect(queryByTestId("drawer")).not.toBeInTheDocument();

		fire(getEditorEl(container), "blue-orange-editor-new-comment-added", {commentUuid: "c1"});

		expect(await findByTestId("drawer")).toBeInTheDocument();
		expect(await findByTestId("comments")).toHaveAttribute("data-topic", "c1");
	});

	it("renders a tab per comment group on a tooltip click", async () => {
		const {container, findAllByTestId} = render(<BlueOrangeBlockEditorWrapper/>);
		fire(getEditorEl(container), "blue-orange-editor-comment-tooltip-clicked", {commentIds: ["c1", "c2"]});
		expect(await findAllByTestId("tab")).toHaveLength(2);
	});

	it("does not wire comment events when comments are disabled", () => {
		const {container, queryByTestId} = render(<BlueOrangeBlockEditorWrapper enableComments={false}/>);
		fire(getEditorEl(container), "blue-orange-editor-new-comment-added", {commentUuid: "c1"});
		expect(queryByTestId("drawer")).not.toBeInTheDocument();
	});
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — inline context (mentions & emoji)", () => {

	it("fetches users and updates inline context when '@' opens with mentions enabled", async () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper enableMentions={true}/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextopen", {listener: {key: "@"}});

		await waitFor(() => expect(mockSearchPublicUsers).toHaveBeenCalled());
		await waitFor(() => expect(latestEditor().updateInlineContext).toHaveBeenCalled());
	});

	it("filters users by the typed query on an inline context update", async () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper enableMentions={true}/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextupdateevent", {listener: {key: "@"}, filter: "ali"});

		await waitFor(() =>
			expect(mockSearchPublicUsers).toHaveBeenCalledWith(expect.objectContaining({query: "ali"}))
		);
	});

	it("does not fetch users when mentions are disabled", () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper enableMentions={false}/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextopen", {listener: {key: "@"}});
		expect(mockSearchPublicUsers).not.toHaveBeenCalled();
		expect(latestEditor().closeInlineContextWindowToolbar).toHaveBeenCalled();
	});

	it("populates inline context with emoji when ':' opens", () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextopen", {listener: {key: ":"}});
		expect(latestEditor().updateInlineContext).toHaveBeenCalled();
	});

	it("closes the inline context for an unknown trigger key", () => {
		const {container} = render(<BlueOrangeBlockEditorWrapper/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextopen", {listener: {key: "#"}});
		expect(latestEditor().closeInlineContextWindowToolbar).toHaveBeenCalled();
	});

	it("calls handleMentionAdded when a mention is selected", () => {
		const handleMentionAdded = vi.fn();
		const {container} = render(<BlueOrangeBlockEditorWrapper handleMentionAdded={handleMentionAdded}/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextselectionevent", {
			type: "mention",
			uuid: "mention-1",
			userId: "user-1",
		});
		expect(handleMentionAdded).toHaveBeenCalledWith("mention-1", "user-1");
	});
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — document mode", () => {

	const renderWithRef = (props: any = {}) => {
		const ref = React.createRef<BlueOrangeBlockEditorHandle>();
		const utils = render(<BlueOrangeBlockEditorWrapper ref={ref} {...props}/>);
		return {ref, ...utils};
	};

	it("defaults to edit mode", () => {
		render(<BlueOrangeBlockEditorWrapper/>);
		expect(latestOptions().mode).toBe("edit");
	});

	it("passes an explicit mode through at construction", () => {
		render(<BlueOrangeBlockEditorWrapper mode="comment"/>);
		expect(latestOptions().mode).toBe("comment");
	});

	it("maps the readOnly shorthand onto mode: read", () => {
		render(<BlueOrangeBlockEditorWrapper readOnly/>);
		expect(latestOptions().mode).toBe("read");
	});

	it("maps the commentOnly shorthand onto mode: comment", () => {
		render(<BlueOrangeBlockEditorWrapper commentOnly/>);
		expect(latestOptions().mode).toBe("comment");
	});

	it("lets an explicit mode win over the shorthands", () => {
		render(<BlueOrangeBlockEditorWrapper mode="edit" readOnly commentOnly/>);
		expect(latestOptions().mode).toBe("edit");
	});

	it("switches the live editor over when the mode prop changes", () => {
		const {rerender} = render(<BlueOrangeBlockEditorWrapper/>);
		const editor = latestEditor();
		expect(editor.setDocumentMode).not.toHaveBeenCalled();

		rerender(<BlueOrangeBlockEditorWrapper mode="read"/>);
		expect(editor.setDocumentMode).toHaveBeenCalledWith("read");
		// The editor is constructed once — the mode change is applied in place.
		expect(MockBlockEditor).toHaveBeenCalledTimes(1);
	});

	it("does not re-apply a mode the editor is already in", () => {
		const {rerender} = render(<BlueOrangeBlockEditorWrapper mode="read"/>);
		const editor = latestEditor();
		rerender(<BlueOrangeBlockEditorWrapper mode="read" template={false}/>);
		expect(editor.setDocumentMode).not.toHaveBeenCalled();
	});

	it("reports mode changes through onModeChange", () => {
		const onModeChange = vi.fn();
		const {container} = render(<BlueOrangeBlockEditorWrapper onModeChange={onModeChange}/>);
		fire(getEditorEl(container), "blue-orange-editor-mode-changed", {mode: "read", previousMode: "edit"});
		expect(onModeChange).toHaveBeenCalledWith("read", "edit");
	});

	it("calls the latest onModeChange after a re-render", () => {
		const first = vi.fn();
		const second = vi.fn();
		const {container, rerender} = render(<BlueOrangeBlockEditorWrapper onModeChange={first}/>);
		rerender(<BlueOrangeBlockEditorWrapper onModeChange={second}/>);
		fire(getEditorEl(container), "blue-orange-editor-mode-changed", {mode: "comment", previousMode: "edit"});
		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledWith("comment", "edit");
	});

	it("exposes the mode API on the imperative handle", () => {
		const {ref} = renderWithRef();
		const editor = latestEditor();

		expect(ref.current!.getDocumentMode()).toBe("edit");
		expect(ref.current!.canEdit()).toBe(true);
		expect(ref.current!.canComment()).toBe(true);
		expect(ref.current!.isReadOnly()).toBe(false);

		ref.current!.setReadOnly();
		expect(editor.setReadOnly).toHaveBeenCalledWith(true);

		ref.current!.setCommentOnly(false);
		expect(editor.setCommentOnly).toHaveBeenCalledWith(false);

		ref.current!.setDocumentMode("read");
		expect(editor.setDocumentMode).toHaveBeenCalledWith("read");
		expect(ref.current!.getDocumentMode()).toBe("read");
		expect(ref.current!.isReadOnly()).toBe(true);
		expect(ref.current!.canEdit()).toBe(false);

		ref.current!.applyDocumentMode();
		expect(editor.applyDocumentMode).toHaveBeenCalled();

		const state = {uuid: "a"} as any;
		expect(ref.current!.effectiveBlockEditable(state)).toBe(true);
		expect(editor.effectiveBlockEditable).toHaveBeenCalledWith(state);
	});
});

// ===========================================================================

describe("BlueOrangeBlockEditorWrapper — document builder", () => {

	it("documentBuilder returns the editor's builder", () => {
		const ref = React.createRef<BlueOrangeBlockEditorHandle>();
		render(<BlueOrangeBlockEditorWrapper ref={ref}/>);
		expect(ref.current!.documentBuilder()).toEqual({kind: "document-builder"});
		expect(latestEditor().documentBuilder).toHaveBeenCalled();
	});
});
