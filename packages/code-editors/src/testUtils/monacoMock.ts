/**
 * A lightweight monaco-editor mock used by this package's tests.
 *
 * Two things stop the real editor from loading under Vitest:
 *
 *  1. monaco-editor's package.json declares only a `module` field — no `main`
 *     and no `exports` — so Vite's node/SSR resolution finds no entry point and
 *     fails with "Failed to resolve entry for package monaco-editor".
 *  2. Even once resolved, the editor drives real browser APIs that jsdom does
 *     not implement (document.queryCommandSupported, web workers, layout), so
 *     importing it throws before a single test runs.
 *
 * The editors are canvas/DOM-driven and are exercised in the browser, so tests
 * here stand monaco in for a recorder instead: it captures the containers,
 * options and models each wrapper creates, and implements the instance methods
 * the wrappers call (getValue/setValue, position, options, disposal) so their
 * effects and cleanup run end to end.
 *
 * Wired up through `test.alias` in vite.config.js, so it applies to tests only
 * and never to the library build.
 */

export interface MockModel {
	value: string;
	language: string;
	dispose: () => void;
}

export interface MockEditor {
	container: HTMLElement;
	options: Record<string, any>;
	model: any;
	disposed: boolean;
	getValue: () => string;
	setValue: (value: string) => void;
	getPosition: () => { lineNumber: number; column: number };
	setPosition: (position: { lineNumber: number; column: number }) => void;
	setModel: (model: any) => void;
	getModel: () => any;
	updateOptions: (options: Record<string, any>) => void;
	onDidChangeModelContent: (listener: () => void) => { dispose: () => void };
	// Lets a test drive the change listeners the wrapper registered.
	emitModelContentChange: () => void;
	layout: () => void;
	dispose: () => void;
}

const createEditor = (container: HTMLElement, options: Record<string, any> = {}): MockEditor => {
	const listeners: Array<() => void> = [];

	const editor: MockEditor = {
		container,
		options: {...options},
		model: null,
		disposed: false,
		getValue: () => editor.options.value ?? "",
		setValue: (value: string) => {
			editor.options.value = value;
		},
		getPosition: () => ({lineNumber: 1, column: 1}),
		setPosition: () => undefined,
		setModel: (model: any) => {
			editor.model = model;
		},
		getModel: () => editor.model,
		updateOptions: (update: Record<string, any>) => {
			editor.options = {...editor.options, ...update};
		},
		onDidChangeModelContent: (listener: () => void) => {
			listeners.push(listener);
			return {
				dispose: () => {
					const index = listeners.indexOf(listener);
					if (index >= 0) {
						listeners.splice(index, 1);
					}
				},
			};
		},
		emitModelContentChange: () => listeners.forEach((listener) => listener()),
		layout: () => undefined,
		dispose: () => {
			editor.disposed = true;
			listeners.length = 0;
		},
	};

	instances.push(editor);
	return editor;
};

export const instances: MockEditor[] = [];
export const models: MockModel[] = [];

export const reset = (): void => {
	instances.length = 0;
	models.length = 0;
};

export const editor = {
	create: (container: HTMLElement, options: Record<string, any> = {}) => createEditor(container, options),

	createDiffEditor: (container: HTMLElement, options: Record<string, any> = {}) => createEditor(container, options),

	createModel: (value: string, language: string): MockModel => {
		const model: MockModel = {
			value,
			language,
			dispose: () => undefined,
		};
		models.push(model);
		return model;
	},

	setModelLanguage: (model: MockModel, language: string): void => {
		model.language = language;
	},
};

export default {editor};
