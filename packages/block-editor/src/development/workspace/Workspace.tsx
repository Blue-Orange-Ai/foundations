// @ts-ignore
import React, {useEffect, useMemo, useRef, useState} from "react";

import './Workspace.css'
import {
	BlueOrangeBlockEditorWrapper,
	BlueOrangeBlockEditorHandle
} from "../../components/block-editor/BlueOrangeBlockEditorWrapper";
import type {
	BlueOrangeDocument,
	BlueOrangeDocumentModeValue,
	BlueOrangeDocumentOptions,
	BlockSpec
} from "@blue-orange-ai/primitives-block-editor";
import {CollaborationSimulator} from "./collabSimulator";

interface Props {
}

type ToolbarMode = "bubble" | "fixed";

const MODE_CYCLE: Array<BlueOrangeDocumentModeValue> = ["edit", "comment", "read"];

const MODE_LABEL: Record<BlueOrangeDocumentModeValue, string> = {
	edit: "Edit",
	comment: "Comment only",
	read: "Read only",
};

const SAMPLE_MARKDOWN = `# Block Editor Demo

This is a **bold** paragraph with _italic_ and \`inline code\`.

- First bullet
- Second bullet

1. Ordered one
2. Ordered two

> A callout / quote line.
`;

const TEMPLATE_HINT = `Type template fields directly into the editor, e.g.

  Hello {{name}}, welcome to {{company}}.

  {{#each items}}
  - {{label}}: {{value}}
  {{/each}}

Then use "Refresh schema" to read them back and "Apply data" to fill them in.`;

export const Workspace: React.FC<Props> = ({}) => {

	const editorRef = useRef<BlueOrangeBlockEditorHandle>(null);

	// Latest document, kept outside React state so keystrokes don't re-render.
	// Used to restore content when the editor is remounted (toolbar / template
	// toggles re-instantiate the underlying editor).
	const docRef = useRef<BlueOrangeDocument | undefined>(undefined);
	const seededRef = useRef<boolean>(false);

	// Forces the editor to remount. `template` and the toolbar `mode` are both
	// constructor-time options on the underlying editor.
	const [editorKey, setEditorKey] = useState<number>(0);
	const [templateMode, setTemplateMode] = useState<boolean>(false);
	const [toolbarMode, setToolbarMode] = useState<ToolbarMode>("bubble");
	const [collabRunning, setCollabRunning] = useState<boolean>(false);
	// Document mode is a live prop, not a constructor option — no remount needed.
	const [documentMode, setDocumentMode] = useState<BlueOrangeDocumentModeValue>("edit");

	const [markdownIn, setMarkdownIn] = useState<string>(SAMPLE_MARKDOWN);
	const [output, setOutput] = useState<string>("");
	const [outputTitle, setOutputTitle] = useState<string>("Output");

	const [snapshot, setSnapshot] = useState<BlueOrangeDocument | null>(null);
	const [substituteIn, setSubstituteIn] = useState<string>("");
	const [status, setStatus] = useState<string>("");

	// One simulator instance for the lifetime of the workspace. It resolves the
	// live editor lazily, so it keeps working across editor remounts.
	const simulatorRef = useRef<CollaborationSimulator | null>(null);
	if (simulatorRef.current == null) {
		simulatorRef.current = new CollaborationSimulator(
			() => editorRef.current?.getEditor() ?? null,
			(running) => setCollabRunning(running)
		);
	}

	// Editor options. Recreated per render but only read by the editor at mount
	// time, so this only takes effect when `editorKey` changes (remount).
	const editorOptions = useMemo<Partial<BlueOrangeDocumentOptions>>(() => ({
		collaborationCursors: true,
		userId: "local-user",
		userName: "You",
		userColor: "#CA6F1E",
		// `toolbar.mode` is a real runtime option but isn't in the published
		// typings yet, hence the cast.
		toolbar: {mode: toolbarMode} as any,
	}), [toolbarMode]);

	// Seed sample content once so collaboration / diff have something to act on.
	useEffect(() => {
		if (!seededRef.current && editorRef.current) {
			editorRef.current.fromMarkdown(SAMPLE_MARKDOWN);
			docRef.current = editorRef.current.toJson() ?? undefined;
			seededRef.current = true;
		}
		return () => {
			simulatorRef.current?.stop();
		};
	}, []);

	const show = (title: string, value: string) => {
		setOutputTitle(title);
		setOutput(value);
	};

	const flash = (message: string) => {
		setStatus(message);
	};

	// Capture content + stop the simulator before remounting the editor.
	const remountEditor = () => {
		simulatorRef.current?.stop();
		docRef.current = editorRef.current?.toJson() ?? docRef.current;
		setEditorKey(key => key + 1);
	};

	// ---- Collaboration --------------------------------------------------

	const toggleCollaboration = () => {
		const sim = simulatorRef.current;
		if (!sim) {
			return;
		}
		if (sim.isRunning()) {
			sim.stop();
			flash("Collaboration simulation stopped.");
		} else {
			sim.start();
			flash("Collaboration simulation started — watch the peer cursors type.");
		}
	};

	// ---- Toolbar mode ---------------------------------------------------

	const toggleToolbarMode = () => {
		const next: ToolbarMode = toolbarMode === "bubble" ? "fixed" : "bubble";
		setToolbarMode(next);
		remountEditor();
		flash("Toolbar mode: " + next + " (editor remounted).");
	};

	// ---- Markdown -------------------------------------------------------

	const exportMarkdown = () => {
		const md = editorRef.current?.toMarkdown() ?? "";
		show("Markdown export", md);
		flash("Exported document to markdown.");
	};

	const importMarkdown = () => {
		editorRef.current?.fromMarkdown(markdownIn);
		docRef.current = editorRef.current?.toJson() ?? docRef.current;
		flash("Imported markdown into the editor.");
	};

	// ---- Serialization --------------------------------------------------

	const exportJson = () => {
		const json = editorRef.current?.toJson();
		show("Document JSON", JSON.stringify(json, null, 2));
	};

	const exportHtml = () => {
		const html = editorRef.current?.toHtmlCopy() ?? "";
		show("HTML copy", html);
	};

	const clearDocument = () => {
		editorRef.current?.clearDocument();
		docRef.current = editorRef.current?.toJson() ?? undefined;
		flash("Cleared the document.");
	};

	// ---- History --------------------------------------------------------

	const undo = () => {
		editorRef.current?.undo();
		flash("Undo.");
	};

	const redo = () => {
		editorRef.current?.redo();
		flash("Redo.");
	};

	// ---- Programmatic block creation ------------------------------------

	const insertBlock = () => {
		const doc = editorRef.current?.toJson();
		const pos = doc?.states?.length ?? 0;
		const spec: BlockSpec = {
			pos: pos,
			type: "paragraph",
			text: "Block inserted programmatically via createBlock() at " + new Date().toLocaleTimeString(),
		};
		editorRef.current?.createBlock(spec);
		flash("Inserted a new block at position " + pos + ".");
	};

	// ---- Diff & merge ---------------------------------------------------

	const takeSnapshot = () => {
		const doc = editorRef.current?.toJson() ?? null;
		setSnapshot(doc);
		flash("Snapshot captured. Edit the document, then 'Diff vs snapshot'.");
	};

	const diffAgainstSnapshot = () => {
		if (!snapshot) {
			flash("Take a snapshot first.");
			return;
		}
		editorRef.current?.diffDocuments(snapshot, {
			oldLabel: "Snapshot",
			newLabel: "Current editor",
			onClose: () => flash("Diff viewer closed."),
			onApply: () => flash("Merged document applied to the editor."),
		});
		flash("Diff viewer opened (overlay).");
	};

	// ---- Templates ------------------------------------------------------

	const toggleTemplateMode = () => {
		const next = !templateMode;
		setTemplateMode(next);
		remountEditor();
		flash(next ? "Template mode ON — editor remounted." : "Template mode OFF — editor remounted.");
	};

	const refreshSchema = () => {
		const editor = editorRef.current;
		if (!editor) {
			return;
		}
		const variables = editor.getTemplateVariables();
		const loops = editor.getTemplateLoops();
		const schema = editor.getTemplateSchema();
		show(
			"Template schema",
			"Variables: " + JSON.stringify(variables) + "\n" +
			"Loops: " + JSON.stringify(loops) + "\n\n" +
			"Schema:\n" + JSON.stringify(schema, null, 2)
		);
		setSubstituteIn(JSON.stringify(schema, null, 2));
		flash("Read template schema. Fill in the values below, then 'Apply data'.");
	};

	const applyTemplateData = () => {
		try {
			const data = JSON.parse(substituteIn);
			editorRef.current?.substituteTemplateData(data);
			flash("Substituted template data into the document.");
		} catch (e: any) {
			flash("Invalid JSON: " + e.message);
		}
	};

	// ---- Document mode --------------------------------------------------

	const cycleDocumentMode = () => {
		const next = MODE_CYCLE[(MODE_CYCLE.indexOf(documentMode) + 1) % MODE_CYCLE.length];
		setDocumentMode(next);
	};

	const onModeChange = (mode: BlueOrangeDocumentModeValue, previousMode: BlueOrangeDocumentModeValue) => {
		flash("Document mode: " + previousMode + " → " + mode + " (no remount).");
	};

	// ---- Document builder -----------------------------------------------

	const buildSampleDocument = () => {
		const builder = editorRef.current?.documentBuilder();
		if (!builder) {
			flash("Editor not ready.");
			return;
		}
		builder
			.h2("Built with DocumentBuilder")
			.paragraph("These blocks were appended without touching the DOM.")
			.bullets(["Fluent", "DOM-free", "Every block type"])
			.callout("Callouts take a colour and an emoji.", {color: "blue", emoji: "💡"})
			.code("print('hello')", {language: "python"})
			.table([["Block", "Supported"], ["Table", "yes"], ["Equation", "yes"]], {headerRow: true})
			.appendTo(editorRef.current!.getEditor()!);
		flash("Appended a builder-authored section to the document.");
	};

	const showBuiltJson = () => {
		const builder = editorRef.current?.documentBuilder();
		if (!builder) {
			flash("Editor not ready.");
			return;
		}
		show("DocumentBuilder → JSON", JSON.stringify(builder.build(), null, 2));
	};

	const onChange = (doc: BlueOrangeDocument) => {
		docRef.current = doc;
	};

	return (
		<div className="workspace-main-window">
			<div className="workspace-editor-pane">
				<BlueOrangeBlockEditorWrapper
					key={editorKey}
					ref={editorRef}
					document={docRef.current}
					options={editorOptions}
					enableMentions={false}
					enableComments={false}
					template={templateMode}
					mode={documentMode}
					onModeChange={onModeChange}
					onChange={onChange}
				/>
			</div>

			<div className="workspace-control-pane">
				<h2 className="workspace-title">Block Editor — feature demo</h2>
				{status && <div className="workspace-status">{status}</div>}

				<section className="workspace-section">
					<h3>Collaboration <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={toggleCollaboration} className={collabRunning ? "workspace-active" : ""}>
							{collabRunning ? "Stop simulation" : "Start simulation"}
						</button>
					</div>
					<div className="workspace-peers">
						{simulatorRef.current?.getPeers().map(peer => (
							<span key={peer.name} className="workspace-peer">
								<span className="workspace-peer-dot" style={{background: peer.color}}></span>
								{peer.name}
							</span>
						))}
					</div>
					<p className="workspace-hint">Simulated peers type into blocks/cells with live collaboration cursors. Needs some content in the editor.</p>
				</section>

				<section className="workspace-section">
					<h3>Document mode <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={cycleDocumentMode} className={documentMode === "edit" ? "" : "workspace-active"}>
							Mode: {MODE_LABEL[documentMode]}
						</button>
					</div>
					<p className="workspace-hint">Cycles Edit → Comment only → Read only. Comment only freezes the body but keeps the Comment control; Read only disables all editing. Applied in place — the editor is not remounted.</p>
				</section>

				<section className="workspace-section">
					<h3>Document builder <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={buildSampleDocument}>Append built blocks</button>
						<button onClick={showBuiltJson}>Builder → JSON</button>
					</div>
					<p className="workspace-hint">documentBuilder() hands back a builder seeded with the current document. Note it bypasses the mode gate — the mode gates user input, not the API.</p>
				</section>

				<section className="workspace-section">
					<h3>Toolbar mode <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={toggleToolbarMode} className={toolbarMode === "fixed" ? "workspace-active" : ""}>
							Toolbar: {toolbarMode === "fixed" ? "Fixed" : "Bubble"}
						</button>
					</div>
					<p className="workspace-hint">Bubble shows the toolbar on selection; Fixed pins it. Switching re-instantiates the editor.</p>
				</section>

				<section className="workspace-section">
					<h3>Markdown <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={exportMarkdown}>Export markdown</button>
						<button onClick={importMarkdown}>Import markdown ↓</button>
					</div>
					<textarea
						className="workspace-textarea"
						value={markdownIn}
						onChange={e => setMarkdownIn(e.target.value)}
						spellCheck={false}
					/>
				</section>

				<section className="workspace-section">
					<h3>History <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={undo}><i className="ri-arrow-go-back-line"></i> Undo</button>
						<button onClick={redo}><i className="ri-arrow-go-forward-line"></i> Redo</button>
					</div>
				</section>

				<section className="workspace-section">
					<h3>Diff &amp; merge <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={takeSnapshot}>Take snapshot</button>
						<button onClick={diffAgainstSnapshot} disabled={!snapshot}>Diff vs snapshot</button>
					</div>
					<p className="workspace-hint">Snapshot the doc, make edits, then open the diff viewer to accept/reject/merge changes.</p>
				</section>

				<section className="workspace-section">
					<h3>Programmatic blocks <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={insertBlock}>createBlock() at end</button>
					</div>
				</section>

				<section className="workspace-section">
					<h3>Templates <span className="workspace-badge">new</span></h3>
					<div className="workspace-btn-row">
						<button onClick={toggleTemplateMode} className={templateMode ? "workspace-active" : ""}>
							Template mode: {templateMode ? "ON" : "OFF"}
						</button>
						<button onClick={refreshSchema} disabled={!templateMode}>Refresh schema</button>
						<button onClick={applyTemplateData} disabled={!templateMode}>Apply data</button>
					</div>
					<p className="workspace-hint">{TEMPLATE_HINT}</p>
					<textarea
						className="workspace-textarea"
						value={substituteIn}
						onChange={e => setSubstituteIn(e.target.value)}
						placeholder="Template data (JSON) — populated by 'Refresh schema'"
						spellCheck={false}
						disabled={!templateMode}
					/>
				</section>

				<section className="workspace-section">
					<h3>Serialization</h3>
					<div className="workspace-btn-row">
						<button onClick={exportJson}>To JSON</button>
						<button onClick={exportHtml}>To HTML</button>
						<button onClick={clearDocument}>Clear</button>
					</div>
				</section>

				<section className="workspace-section">
					<h3>{outputTitle}</h3>
					<pre className="workspace-output">{output}</pre>
				</section>
			</div>
		</div>
	)
}
