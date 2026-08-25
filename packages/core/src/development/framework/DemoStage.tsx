import React, {ReactNode, useEffect, useRef, useState} from "react";

import './DocsTheme.css'
import './DemoStage.css'
import {ButtonTabs, ButtonTabsSize} from "../../components/layouts/button-tabs/button-tabs/ButtonTabs";
import {ButtonTab} from "../../components/layouts/button-tabs/button-tab/ButtonTab";
import {ButtonIcon} from "../../components/buttons/button-icon/ButtonIcon";
import {ButtonSize} from "../../components/buttons/button/Button";

/** Full is whatever the stage itself is wide, so the preview follows the browser. */
export type DemoWidth = number | "full";

interface Preset {
	uuid: string;
	name: string;
	icon: string;
	width: DemoWidth;
}

const PRESETS: Array<Preset> = [
	{uuid: "mobile", name: "Mobile", icon: "ri-smartphone-line", width: 375},
	{uuid: "tablet", name: "Tablet", icon: "ri-tablet-line", width: 768},
	{uuid: "desktop", name: "Desktop", icon: "ri-computer-line", width: "full"}
];

const MIN_WIDTH = 240;

const HANDLE_WIDTH = 13;

interface Props {
	children: ReactNode;
	/** Where the stage starts. */
	width?: DemoWidth;
	/** Floor under the preview so a small component still gets room to sit in. */
	minHeight?: number;
	/** Centres the preview in the stage rather than letting it sit top left. */
	centered?: boolean;
	/** Anything to put beside the viewport controls — a reset button, a note. */
	toolbar?: ReactNode;
}

/**
 * Whether the browser will take an element full screen. jsdom will not, so the
 * control is left out under test rather than rendering a button that cannot work.
 */
const fullscreenSupported = (): boolean => {
	return typeof document !== "undefined" && typeof document.exitFullscreen === "function";
}

/**
 * The demo surface: a viewport the preview is rendered into, switchable
 * between breakpoint presets and draggable to any width in between, so a
 * component can be watched responding to the space it is given.
 */
export const DemoStage: React.FC<Props> = ({
											   children,
											   width = "full",
											   minHeight = 220,
											   centered = true,
											   toolbar}) => {

	const [current, setCurrent] = useState<DemoWidth>(width);

	const [dragging, setDragging] = useState<boolean>(false);

	const [fullscreen, setFullscreen] = useState<boolean>(false);

	const demoRef = useRef<HTMLDivElement | null>(null);

	const stageRef = useRef<HTMLDivElement | null>(null);

	const viewportRef = useRef<HTMLDivElement | null>(null);

	/** What the preview is actually measuring, so the readout is honest while `full`. */
	const [measured, setMeasured] = useState<number>(0);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport || typeof ResizeObserver === "undefined") {
			return;
		}
		const observer = new ResizeObserver(entries => {
			entries.forEach(entry => setMeasured(Math.round(entry.contentRect.width)));
		});
		observer.observe(viewport);
		return () => observer.disconnect();
	}, []);

	// Escape leaves full screen without going through the button, so the state is
	// read back off the document rather than assumed from the last click.
	useEffect(() => {
		if (!fullscreenSupported()) {
			return;
		}
		const handleChange = () => setFullscreen(document.fullscreenElement === demoRef.current);
		document.addEventListener("fullscreenchange", handleChange);
		return () => document.removeEventListener("fullscreenchange", handleChange);
	}, []);

	/**
	 * Takes the demo — toolbar and all — to the size of the monitor, which is the
	 * only way to see a component at a width the page itself cannot offer.
	 * Anything the component portals to the body (a modal, a tooltip) is outside
	 * the full screen element and will not be drawn while this is on.
	 */
	const toggleFullscreen = () => {
		const demo = demoRef.current;
		if (!demo || !fullscreenSupported()) {
			return;
		}
		if (document.fullscreenElement === demo) {
			document.exitFullscreen().catch(() => {});
		} else {
			demo.requestFullscreen().catch(() => {});
		}
	}

	const activePreset = PRESETS.find(preset => preset.width === current);

	const clamp = (value: number): number => {
		// The handle lives in the stage too, so the widest the viewport gets is what is left over.
		const limit = stageRef.current ? stageRef.current.clientWidth - HANDLE_WIDTH : value;
		return Math.round(Math.min(Math.max(value, MIN_WIDTH), Math.max(limit, MIN_WIDTH)));
	}

	const startDrag = (event: React.MouseEvent) => {
		event.preventDefault();
		const stage = stageRef.current;
		if (!stage) {
			return;
		}
		const left = stage.getBoundingClientRect().left;
		setDragging(true);
		const move = (moveEvent: MouseEvent) => {
			setCurrent(clamp(moveEvent.clientX - left));
		}
		const stop = () => {
			setDragging(false);
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", stop);
		}
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", stop);
	}

	// The handle is focusable so the viewport can be sized without a mouse.
	const handleKeyDown = (event: React.KeyboardEvent) => {
		const step = event.shiftKey ? 100 : 16;
		const from = typeof current === "number" ? current : measured;
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			setCurrent(clamp(from - step));
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			setCurrent(clamp(from + step));
		} else if (event.key === "Home") {
			event.preventDefault();
			setCurrent(MIN_WIDTH);
		} else if (event.key === "End") {
			event.preventDefault();
			setCurrent("full");
		}
	}

	return (
		<div className="blue-orange-docs-demo" ref={demoRef}>
			<div className="blue-orange-docs-demo-toolbar">
				<ButtonTabs
					size={ButtonTabsSize.SMALL}
					activeTab={activePreset ? activePreset.uuid : ""}
					onClick={uuid => {
						const preset = PRESETS.find(item => item.uuid === uuid);
						if (preset) {
							setCurrent(preset.width);
						}
					}}>
					{PRESETS.map(preset => (
						<ButtonTab key={preset.uuid} uuid={preset.uuid} name={preset.name} icon={preset.icon}></ButtonTab>
					))}
				</ButtonTabs>
				<div className="blue-orange-docs-demo-toolbar-spacer"></div>
				{toolbar}
				<span className="blue-orange-docs-demo-width">
					{current === "full" ? measured + "px" : current + "px"}
					{current === "full" ? " (full)" : ""}
				</span>
				{fullscreenSupported() &&
					<ButtonIcon
						icon={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"}
						label={fullscreen ? "Leave full screen" : "Fill the screen"}
						size={ButtonSize.SMALL}
						onClick={toggleFullscreen}
					></ButtonIcon>
				}
				<ButtonIcon
					icon="ri-refresh-line"
					label="Reset the viewport"
					size={ButtonSize.SMALL}
					onClick={() => setCurrent(width)}
				></ButtonIcon>
			</div>
			<div className="blue-orange-docs-demo-stage" ref={stageRef}>
				<div
					className={centered
						? "blue-orange-docs-demo-viewport blue-orange-docs-demo-viewport-centered"
						: "blue-orange-docs-demo-viewport"}
					ref={viewportRef}
					style={{
						// Full lets the viewport take whatever the handle leaves; a fixed
						// width holds its size until it runs out of stage.
						flex: current === "full" ? "1 1 auto" : "0 1 auto",
						width: current === "full" ? "auto" : current + "px",
						minHeight: minHeight + "px"
					}}>
					{children}
				</div>
				<div
					className={dragging
						? "blue-orange-docs-demo-handle blue-orange-docs-demo-handle-active"
						: "blue-orange-docs-demo-handle"}
					role="separator"
					aria-label="Resize the preview"
					aria-orientation="vertical"
					tabIndex={0}
					onMouseDown={startDrag}
					onKeyDown={handleKeyDown}>
					<span className="blue-orange-docs-demo-handle-grip"></span>
				</div>
			</div>
		</div>
	)
}
