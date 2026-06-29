// Dev-only collaboration simulator.
//
// Drives the inner TextEditor of text blocks and table cells with fake peer
// activity so the multiplayer cursor / live-typing behaviour can be exercised
// in the dev harness without spinning up a real PeerJS session. Ported from
// the primitives block-editor dev harness.
//
// This intentionally reaches into editor internals (`editor.state`, the inner
// `state.editor`, table `cells`, etc.) which are not part of the published
// type surface — hence the `any` typing throughout. It is never shipped in the
// library build (lives under src/development).

type EditorGetter = () => any | null;

interface SimSession {
	key: string;
	kind: "block" | "cell";
	blockReference: string;
	cellUuid: string | null;
	pos: number;
	phrase: string;
	phraseIdx: number;
	cooldownTicks: number;
}

interface SimPeer {
	user_id: string;
	user_name: string;
	user_color: string;
	session: SimSession | null;
}

const PHRASES = [
	" Just adding a quick note here.",
	" I think we should expand on this section.",
	" Great point — let's also mention scalability.",
	" Could we move this paragraph above the intro?",
	" Let me know what you think of this rewrite.",
	" Adding a TODO: confirm with the design team.",
	" Tightening this sentence to read more clearly.",
	" Worth linking out to the original RFC here.",
	" This is the part I want to highlight.",
	" Reordering the bullets for better flow."
];

export interface SimulatorPeerInfo {
	name: string;
	color: string;
}

export class CollaborationSimulator {

	private getEditor: EditorGetter;
	private onRunningChange?: (running: boolean) => void;
	private running = false;
	private peers: SimPeer[] = [
		{user_id: "sim-peer-aiko", user_name: "Aiko", user_color: "#E11D48", session: null},
		{user_id: "sim-peer-marco", user_name: "Marco", user_color: "#7C3AED", session: null},
		{user_id: "sim-peer-priya", user_name: "Priya", user_color: "#0EA5E9", session: null}
	];

	constructor(getEditor: EditorGetter, onRunningChange?: (running: boolean) => void) {
		this.getEditor = getEditor;
		this.onRunningChange = onRunningChange;
	}

	isRunning(): boolean {
		return this.running;
	}

	getPeers(): SimulatorPeerInfo[] {
		return this.peers.map(p => ({name: p.user_name, color: p.user_color}));
	}

	// ---- public controls -------------------------------------------------

	start(): void {
		if (this.running) {
			return;
		}
		const editor = this.getEditor();
		if (!editor) {
			return;
		}
		this.running = true;
		this.onRunningChange?.(true);
		this.peers.forEach((peer, i) => {
			peer.session = null;
			setTimeout(() => this.tick(peer), 200 + i * 400);
		});
	}

	stop(): void {
		this.running = false;
		this.onRunningChange?.(false);
		const editor = this.getEditor();
		this.peers.forEach((peer) => {
			peer.session = null;
			try {
				editor?.removeCollaborationCursor(peer.user_id);
			} catch (e) { /* editor gone */ }
		});
	}

	// ---- internals -------------------------------------------------------

	private stripHtml(html: string): string {
		const d = document.createElement("div");
		d.innerHTML = html || "";
		return d.innerText;
	}

	// Insert a character into an HTML string at a "visible" character offset,
	// skipping past tags so we don't corrupt markup. <br> counts as one
	// visible position so offset math stays sane.
	private insertAtPlainPos(html: string, plainPos: number, ch: string): string {
		let out = "";
		let seen = 0;
		let i = 0;
		let inserted = false;
		while (i < html.length) {
			if (html[i] === "<") {
				let end = html.indexOf(">", i);
				if (end === -1) {
					end = html.length - 1;
				}
				const tag = html.substring(i, end + 1);
				if (!inserted && seen === plainPos) {
					out += ch;
					inserted = true;
				}
				out += tag;
				if (/^<br\s*\/?>$/i.test(tag)) {
					seen++;
				}
				i = end + 1;
				continue;
			}
			if (!inserted && seen === plainPos) {
				out += ch;
				inserted = true;
			}
			out += html[i];
			seen++;
			i++;
		}
		if (!inserted) {
			out += ch;
		}
		return out;
	}

	// Every typing target: each text-typed block is one candidate; every cell
	// of every table block is its own candidate. Skips whatever the local user
	// is currently in.
	private enumerateTargets(): any[] {
		const editor = this.getEditor();
		const targets: any[] = [];
		if (!editor || !editor.state) {
			return targets;
		}
		for (let i = 0; i < editor.state.length; i++) {
			const s = editor.state[i];
			if (s.type === "table" && s.editor && Array.isArray(s.editor.cells)) {
				let focusedCellId: string | null = null;
				try {
					const focusedEl = s.editor.getCurrentFocusedCell();
					if (focusedEl) {
						focusedCellId = focusedEl.getAttribute("blue-orange-table-cell-id");
					}
				} catch (e) { /* nothing focused */ }
				for (let j = 0; j < s.editor.cells.length; j++) {
					const cell = s.editor.cells[j];
					if (!cell || !cell.editor) {
						continue;
					}
					if (cell.uuid === focusedCellId) {
						continue;
					}
					targets.push({
						kind: "cell",
						key: s.reference + "::" + cell.uuid,
						blockState: s,
						cell: cell,
						innerEditor: cell.editor
					});
				}
			} else if (editor.typeIsText(s.type) && s.editor && s.editor.editor) {
				if (s.uuid === editor.focused) {
					continue;
				}
				targets.push({
					kind: "block",
					key: s.reference,
					blockState: s,
					innerEditor: s.editor
				});
			}
		}
		return targets;
	}

	private claimedKeys(): Record<string, boolean> {
		const keys: Record<string, boolean> = {};
		this.peers.forEach((p) => {
			if (p.session && p.session.key) {
				keys[p.session.key] = true;
			}
		});
		return keys;
	}

	private pickTarget(): any | null {
		const targets = this.enumerateTargets();
		if (!targets.length) {
			return null;
		}
		const claimed = this.claimedKeys();
		const free = targets.filter((t) => !claimed[t.key]);
		const pool = free.length ? free : targets;
		return pool[Math.floor(Math.random() * pool.length)];
	}

	private nextPhrase(): string {
		return PHRASES[Math.floor(Math.random() * PHRASES.length)];
	}

	private placeCursor(peer: SimPeer, innerEditor: any, pos: number): void {
		try {
			innerEditor.updateCollaborationCursor(peer.user_id, peer.user_color, peer.user_name, pos);
		} catch (e) { /* target went away — recover next tick */ }
	}

	private beginSession(peer: SimPeer): boolean {
		const target = this.pickTarget();
		if (!target) {
			return false;
		}
		const plain = this.stripHtml(target.innerEditor.getText());
		const pos = Math.max(0, Math.floor(Math.random() * (plain.length + 1)));
		peer.session = {
			key: target.key,
			kind: target.kind,
			blockReference: target.blockState.reference,
			cellUuid: target.kind === "cell" ? target.cell.uuid : null,
			pos: pos,
			phrase: this.nextPhrase(),
			phraseIdx: 0,
			cooldownTicks: 0
		};
		this.placeCursor(peer, target.innerEditor, pos);
		return true;
	}

	// Re-resolve the inner editor each tick — blocks may have been reordered,
	// deleted, or (for cells) rebuilt by a table edit.
	private resolveInnerEditor(session: SimSession): any | null {
		const editor = this.getEditor();
		if (!editor || !editor.state) {
			return null;
		}
		for (let i = 0; i < editor.state.length; i++) {
			const s = editor.state[i];
			if (s.reference !== session.blockReference) {
				continue;
			}
			if (session.kind === "cell") {
				if (!s.editor || typeof s.editor.getCell !== "function") {
					return null;
				}
				const cell = s.editor.getCell(session.cellUuid);
				if (!cell || !cell.editor) {
					return null;
				}
				return cell.editor;
			}
			return s.editor && s.editor.editor ? s.editor : null;
		}
		return null;
	}

	private typeNextChar(peer: SimPeer): void {
		const session = peer.session;
		if (!session) {
			return;
		}
		const innerEditor = this.resolveInnerEditor(session);
		if (!innerEditor) {
			peer.session = null;
			return;
		}
		const currentText = innerEditor.getText() || "";
		const plain = this.stripHtml(currentText);
		if (session.pos > plain.length) {
			session.pos = plain.length;
		}
		const ch = session.phrase.charAt(session.phraseIdx);
		const inserted = this.insertAtPlainPos(currentText, session.pos, ch);
		if (inserted !== currentText) {
			innerEditor.setText(inserted);
		}
		session.pos += 1;
		session.phraseIdx += 1;
		// setText wiped the peer cursor; re-place it at the new position.
		this.placeCursor(peer, innerEditor, session.pos);
		if (session.phraseIdx >= session.phrase.length) {
			session.cooldownTicks = 4 + Math.floor(Math.random() * 6);
			session.phraseIdx = -1;
		}
	}

	private tick(peer: SimPeer): void {
		if (!this.running) {
			return;
		}
		const session = peer.session;
		if (session && session.phraseIdx === -1) {
			session.cooldownTicks -= 1;
			if (session.cooldownTicks <= 0) {
				peer.session = null;
			}
		} else if (!session) {
			this.beginSession(peer);
		} else {
			this.typeNextChar(peer);
		}
		const delay = 140 + Math.floor(Math.random() * 180);
		setTimeout(() => this.tick(peer), delay);
	}
}
