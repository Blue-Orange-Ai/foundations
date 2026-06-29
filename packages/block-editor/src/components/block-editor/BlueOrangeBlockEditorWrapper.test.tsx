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
// mock's implementation before each test. So we declare bare jest.fn()s in the
// module factories and (re)install their behaviour in beforeEach.
jest.mock("@blue-orange-ai/primitives-block-editor", () => ({
	BlockEditor: jest.fn(),
}));

const buildEditorMock = (element?: any, doc?: any, options?: any) => ({
	element,
	doc,
	options,
	toJson: jest.fn(() => ({states: [{uuid: "a"}, {uuid: "b"}]})),
	toHtmlCopy: jest.fn(() => "<p>html copy</p>"),
	reviveDocument: jest.fn(),
	clearDocument: jest.fn(),
	resolveComment: jest.fn(),
	updateInlineContext: jest.fn(),
	closeInlineContextWindowToolbar: jest.fn(),
	undo: jest.fn(),
	redo: jest.fn(),
	diffDocuments: jest.fn(() => ({close: jest.fn()})),
	createBlock: jest.fn(),
	toMarkdown: jest.fn(() => "# markdown"),
	fromMarkdown: jest.fn(),
	isTemplateMode: jest.fn(() => true),
	getTemplateVariables: jest.fn(() => ["name"]),
	getTemplateLoops: jest.fn(() => [{name: "items", fields: ["label"]}]),
	getTemplateSchema: jest.fn(() => ({name: "", items: [{label: ""}]})),
	substituteTemplateData: jest.fn(),
	substituteVariables: jest.fn(),
	substituteLoops: jest.fn(),
	applyTemplateModeToBlocks: jest.fn(),
});

jest.mock("@blue-orange-ai/foundations-core", () => {
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
	};
});

const mockSearchPublicUsers = jest.fn();

jest.mock("./config/BlueOrangePassportConfig", () => ({
	__esModule: true,
	default: {searchPublicUsers: (...args: any[]) => mockSearchPublicUsers(...args)},
}));

jest.mock("codemirror", () => ({__esModule: true, default: {}}));

import {BlockEditor} from "@blue-orange-ai/primitives-block-editor";
import {BlueOrangeBlockEditorHandle, BlueOrangeBlockEditorWrapper} from "./BlueOrangeBlockEditorWrapper";

const MockBlockEditor = BlockEditor as unknown as jest.Mock;

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
	MockBlockEditor.mockImplementation((element: any, doc: any, options: any) =>
		buildEditorMock(element, doc, options)
	);
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
		const onChange = jest.fn();
		const {container} = render(<BlueOrangeBlockEditorWrapper onChange={onChange}/>);
		fire(getEditorEl(container), "datachange");
		expect(onChange).toHaveBeenCalledWith({states: [{uuid: "a"}, {uuid: "b"}]});
	});

	it("forwards reference lifecycle events to their callbacks", () => {
		const onReferenceAdded = jest.fn();
		const onReferenceUpdated = jest.fn();
		const onReferenceRemoved = jest.fn();
		const onReferenceClicked = jest.fn();
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
		const handleMentionAdded = jest.fn();
		const {container} = render(<BlueOrangeBlockEditorWrapper handleMentionAdded={handleMentionAdded}/>);
		fire(getEditorEl(container), "blueorangeeditorinlinecontextselectionevent", {
			type: "mention",
			uuid: "mention-1",
			userId: "user-1",
		});
		expect(handleMentionAdded).toHaveBeenCalledWith("mention-1", "user-1");
	});
});
