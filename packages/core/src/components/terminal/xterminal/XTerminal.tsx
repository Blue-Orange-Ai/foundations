import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";
import "./XTerminal.css";

// Imperative handle exposed to the host so it can push backend (PTY) output
// into the view and drive layout.
export interface XTerminalHandle {
	// Write a chunk of output coming from the backend PTY into the terminal.
	write: (data: string) => void;
	// Clear the screen.
	clear: () => void;
	// Move focus into the terminal.
	focus: () => void;
	// Re-measure and reflow to the container size, returning the new geometry.
	fit: () => { cols: number; rows: number } | null;
}

interface Props {
	// User keystrokes / paste data leaving the terminal — forward these to the
	// backend PTY.
	onData?: (data: string) => void;
	// Fired after the terminal is mounted and first sized, and again whenever
	// the container is resized. The host forwards the geometry to the PTY.
	onResize?: (cols: number, rows: number) => void;
	// Called once the terminal is attached to the DOM, with the initial size.
	onReady?: (cols: number, rows: number) => void;
	fontSize?: number;
	fontFamily?: string;
	// xterm theme override (see @xterm/xterm ITheme).
	theme?: Record<string, string>;
}

const DEFAULT_DARK_THEME: Record<string, string> = {
	background: "#1e1e1e",
	foreground: "#d4d4d4",
	cursor: "#d4d4d4",
};

// A thin, backend-agnostic React wrapper around xterm.js. It renders the view
// and forwards user input via onData; the host is responsible for wiring the
// input/output to an actual shell (in Electron, a node-pty session over IPC).
export const XTerminal = forwardRef<XTerminalHandle, Props>((
	{ onData, onResize, onReady, fontSize = 13, fontFamily, theme }, ref) => {

	const containerRef = useRef<HTMLDivElement | null>(null);

	const terminalRef = useRef<Terminal | null>(null);

	const fitAddonRef = useRef<FitAddon | null>(null);

	// Latest callbacks kept in refs so the terminal is created only once.
	const onDataRef = useRef(onData);
	onDataRef.current = onData;

	const onResizeRef = useRef(onResize);
	onResizeRef.current = onResize;

	const onReadyRef = useRef(onReady);
	onReadyRef.current = onReady;

	useImperativeHandle(ref, () => ({
		write: (data: string) => terminalRef.current?.write(data),
		clear: () => terminalRef.current?.clear(),
		focus: () => terminalRef.current?.focus(),
		fit: () => {
			if (!fitAddonRef.current || !terminalRef.current) {
				return null;
			}
			fitAddonRef.current.fit();
			return { cols: terminalRef.current.cols, rows: terminalRef.current.rows };
		},
	}), []);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		const terminal = new Terminal({
			fontSize: fontSize,
			fontFamily: fontFamily ?? "Menlo, Monaco, 'Courier New', monospace",
			cursorBlink: true,
			theme: theme ?? DEFAULT_DARK_THEME,
			scrollback: 5000,
		});
		const fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);
		terminal.open(containerRef.current);
		fitAddon.fit();

		terminalRef.current = terminal;
		fitAddonRef.current = fitAddon;

		terminal.onData(data => onDataRef.current?.(data));
		terminal.onResize(({ cols, rows }) => onResizeRef.current?.(cols, rows));

		onReadyRef.current?.(terminal.cols, terminal.rows);

		// Reflow whenever the container changes size.
		const resizeObserver = new ResizeObserver(() => {
			try {
				fitAddon.fit();
			} catch (e) {
				// The container can briefly have a zero size while hidden.
			}
		});
		resizeObserver.observe(containerRef.current);

		return () => {
			resizeObserver.disconnect();
			terminal.dispose();
			terminalRef.current = null;
			fitAddonRef.current = null;
		};
		// Created once; runtime updates go through the imperative handle and refs.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div ref={containerRef} className="blue-orange-xterminal" />;
});

XTerminal.displayName = "XTerminal";
