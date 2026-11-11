import React, {useEffect, useRef, useState} from "react";

import './TraceDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Badge} from "../../../components/text-decorations/badge/Badge";
import {CodeBlock} from "../../../components/text-decorations/code-block/CodeBlock";
import {Button, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {Modal} from "../../../components/layouts/modal/modal/Modal";
import {ModalHeader} from "../../../components/layouts/modal/modal-header/ModalHeader";
import {ModalBody} from "../../../components/layouts/modal/modal-body/ModalBody";
import {Drawer, DrawerPosition} from "../../../components/layouts/drawer/drawer/Drawer";
import {DrawerHeader} from "../../../components/layouts/drawer/drawer-header/DrawerHeader";
import {DrawerBody} from "../../../components/layouts/drawer/drawer-body/DrawerBody";
import {Trace} from "../../../components/trace/trace/Trace";
import {TraceStatus} from "../../../components/trace/trace/TraceContext";
import {TraceLine} from "../../../components/trace/trace-line/TraceLine";
import {TraceIcon} from "../../../components/trace/trace-icon/TraceIcon";
import {TraceTitle} from "../../../components/trace/trace-title/TraceTitle";
import {TraceDescription} from "../../../components/trace/trace-description/TraceDescription";
import {TraceCollapsible} from "../../../components/trace/trace-collapsible/TraceCollapsible";
import {TraceCollapsibleTrigger} from "../../../components/trace/trace-collapsible-trigger/TraceCollapsibleTrigger";
import {TraceCollapsibleContent} from "../../../components/trace/trace-collapsible-content/TraceCollapsibleContent";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const STATUS_OPTIONS = [
	{label: "Done", value: TraceStatus.DONE, code: "TraceStatus.DONE"},
	{label: "Running", value: TraceStatus.RUNNING, code: "TraceStatus.RUNNING"},
	{label: "Error", value: TraceStatus.ERROR, code: "TraceStatus.ERROR"},
	{label: "Pending", value: TraceStatus.PENDING, code: "TraceStatus.PENDING"}
];

const CLASSES_PROP: PropSpec = {
	name: "classes",
	type: "string",
	default: "\"\"",
	description: "Extra class names."
};

const STYLE_PROP: PropSpec = {
	name: "style",
	type: "React.CSSProperties",
	default: "{}",
	description: "Inline style."
};

const TRACE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "The rows: lines, collapsibles, or links and buttons that wrap a line."
	},
	CLASSES_PROP,
	STYLE_PROP
];

const TRACE_LINE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "A TraceIcon, a TraceTitle and an optional TraceDescription or trailing TraceIcon."
	},
	{
		name: "status",
		type: "TraceStatus",
		default: "TraceStatus.DONE",
		defaultValue: TraceStatus.DONE,
		control: "select",
		options: STATUS_OPTIONS,
		description: "RUNNING shimmers the title, ERROR colours the line, PENDING dims it. Say the status in the title too."
	},
	CLASSES_PROP,
	STYLE_PROP
];

const TRACE_ICON_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-terminal-line",
		description: "A remixicon class."
	},
	{
		name: "spin",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Spins the icon with the Spinner — for a running step. With no icon it spins the loader."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Anything else — an svg, an image — used when no icon class is given."
	},
	CLASSES_PROP,
	STYLE_PROP
];

const TRACE_TEXT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "The text."
	},
	CLASSES_PROP,
	STYLE_PROP
];

const TRACE_COLLAPSIBLE_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "A TraceCollapsibleTrigger and a TraceCollapsibleContent."
	},
	{
		name: "defaultOpen",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Where an uncontrolled row starts."
	},
	{
		name: "open",
		type: "boolean",
		description: "Controls the row. Pass `open ?? running` to open it while it streams and let the reader's click win."
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Called when the trigger is clicked."
	},
	CLASSES_PROP,
	STYLE_PROP
];

const TRACE_TRIGGER_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "The TraceLine the trigger opens and closes. A chevron is added after it."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Stops the row from opening or closing."
	},
	CLASSES_PROP,
	STYLE_PROP
];

const TRACE_CONTENT_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "The detail: output, a nested Trace, badges, anything."
	},
	{
		name: "keepMounted",
		type: "boolean",
		default: "false",
		description: "Keeps the detail rendered while the row is closed."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		description: "Extra class names put on the block under the rail."
	},
	STYLE_PROP
];

const nodeOutput = `$ node --version
v24.18.0`;

const devError = `$ pnpm dev
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1908:16)`;

const sources = [
	{title: "Install Astro | docs.astro.build", href: "https://docs.astro.build/en/install-and-setup/"},
	{title: "create-astro | npmjs.com", href: "https://www.npmjs.com/package/create-astro"},
	{title: "Settings: minimumReleaseAge | pnpm.io", href: "https://pnpm.io/settings#minimumreleaseage"}
];

/**
 * A scripted agent turn, played back a step at a time so the running, error
 * and done states can be seen moving.
 */
const AgentTurn: React.FC = () => {

	const [step, setStep] = useState<number>(7);

	const [thinkingOpen, setThinkingOpen] = useState<boolean>();

	const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

	const clear = () => {
		timers.current.forEach(timer => clearTimeout(timer));
		timers.current = [];
	}

	useEffect(() => clear, []);

	const replay = () => {
		clear();
		setThinkingOpen(undefined);
		setStep(0);
		[1, 2, 3, 4, 5, 6, 7].forEach((next, index) => {
			timers.current.push(setTimeout(() => setStep(next), 1100 * (index + 1)));
		});
	}

	const thinking = step === 0;

	const commandRow = (index: number, command: string, output: string, failed: boolean = false) => {
		if (step < index) {
			return null;
		}
		if (step === index) {
			return (
				<TraceLine status={TraceStatus.RUNNING}>
					<TraceIcon spin></TraceIcon>
					<TraceTitle>Running {command}</TraceTitle>
				</TraceLine>
			);
		}
		return (
			<TraceCollapsible defaultOpen={failed}>
				<TraceCollapsibleTrigger>
					<TraceLine status={failed ? TraceStatus.ERROR : TraceStatus.DONE}>
						<TraceIcon icon={failed ? "ri-error-warning-line" : "ri-checkbox-circle-line"}></TraceIcon>
						<TraceTitle>{failed ? "Failed to run" : "Ran"} {command}</TraceTitle>
					</TraceLine>
				</TraceCollapsibleTrigger>
				<TraceCollapsibleContent>
					<CodeBlock value={{code: output, lang: "bash"}}></CodeBlock>
				</TraceCollapsibleContent>
			</TraceCollapsible>
		);
	}

	return (
		<div className="blue-orange-trace-development-turn">
			<div className="blue-orange-trace-development-bubble">Why does pnpm install fail in CI?</div>
			<Trace>
				<TraceCollapsible open={thinkingOpen ?? thinking} onOpenChange={setThinkingOpen}>
					<TraceCollapsibleTrigger>
						<TraceLine status={thinking ? TraceStatus.RUNNING : TraceStatus.DONE}>
							{thinking
								? <TraceIcon spin></TraceIcon>
								: <TraceIcon icon="ri-checkbox-circle-line"></TraceIcon>}
							<TraceTitle>{thinking ? "Thinking" : "Thought for 5s"}</TraceTitle>
						</TraceLine>
					</TraceCollapsibleTrigger>
					<TraceCollapsibleContent>
						CI installs with a frozen lockfile, so the install stops when package.json and
						pnpm-lock.yaml disagree. I should check what the last commit changed, then reproduce the install.
					</TraceCollapsibleContent>
				</TraceCollapsible>
				{commandRow(1, "pnpm --version", "10.18.0")}
				{commandRow(2, "git diff --stat HEAD~1", " package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)")}
				{commandRow(3, "pnpm install --frozen-lockfile", "ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with \"frozen-lockfile\"\nbecause pnpm-lock.yaml is not up to date with package.json", true)}
				{step >= 5 && (
					<TraceCollapsible>
						<TraceCollapsibleTrigger>
							<TraceLine status={step === 5 ? TraceStatus.RUNNING : TraceStatus.DONE}>
								<TraceIcon icon="ri-global-line" spin={step === 5}></TraceIcon>
								<TraceTitle>{step === 5 ? "Using" : "Used"} 2 sources</TraceTitle>
							</TraceLine>
						</TraceCollapsibleTrigger>
						<TraceCollapsibleContent>
							<Trace>
								<a href="https://pnpm.io/cli/install#--frozen-lockfile" target="_blank" rel="noreferrer">
									<TraceLine>
										<TraceIcon icon="ri-global-line"></TraceIcon>
										<TraceTitle>
											pnpm install | pnpm.io
											<span className="blue-orange-trace-development-sr-only"> (opens in a new tab)</span>
										</TraceTitle>
										<TraceIcon icon="ri-arrow-right-up-line"></TraceIcon>
									</TraceLine>
								</a>
								<a href="https://pnpm.io/continuous-integration" target="_blank" rel="noreferrer">
									<TraceLine>
										<TraceIcon icon="ri-global-line"></TraceIcon>
										<TraceTitle>
											Continuous Integration | pnpm.io
											<span className="blue-orange-trace-development-sr-only"> (opens in a new tab)</span>
										</TraceTitle>
										<TraceIcon icon="ri-arrow-right-up-line"></TraceIcon>
									</TraceLine>
								</a>
							</Trace>
						</TraceCollapsibleContent>
					</TraceCollapsible>
				)}
			</Trace>
			{step >= 7 && (
				<p className="blue-orange-trace-development-reply">
					The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the
					frozen install fails. Run pnpm install locally and commit the lockfile.
				</p>
			)}
			{step >= 7 && (
				<div>
					<Button text="Replay" buttonType={ButtonType.SECONDARY} size={ButtonSize.SMALL} onClick={replay}></Button>
				</div>
			)}
		</div>
	)
}

interface Props {
}

export const TraceDevelopment: React.FC<Props> = ({}) => {

	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	const [controlledOpen, setControlledOpen] = useState<boolean>(false);

	return (
		<ComponentDoc
			title="Trace"
			description="The building block for reasoning, tool calls, sources and plans. A trace is a list of lines, each with an icon, a title and an optional description and status. A line can expand to show more detail, link to a page, or open a modal or drawer."
			name="Trace"
			previewHeight={300}
			previewCentered={false}
			imports={["TraceLine", "TraceIcon", "TraceTitle", "TraceCollapsible", "TraceCollapsibleTrigger", "TraceCollapsibleContent", "TraceStatus"]}
			props={TRACE_PROPS}
			snippetChildren={() => "<TraceLine>\n\t<TraceIcon icon=\"ri-search-line\"></TraceIcon>\n\t<TraceTitle>Searched for minimumReleaseAge</TraceTitle>\n</TraceLine>\n<TraceCollapsible>\n\t<TraceCollapsibleTrigger>\n\t\t<TraceLine>\n\t\t\t<TraceIcon icon=\"ri-terminal-line\"></TraceIcon>\n\t\t\t<TraceTitle>Ran node --version</TraceTitle>\n\t\t</TraceLine>\n\t</TraceCollapsibleTrigger>\n\t<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>\n</TraceCollapsible>"}
			preview={values => (
				<div className="blue-orange-trace-development-block">
					<Trace classes={values.classes}>
						<TraceLine>
							<TraceIcon icon="ri-search-line"></TraceIcon>
							<TraceTitle>Searched for minimumReleaseAge</TraceTitle>
						</TraceLine>
						<TraceLine>
							<TraceIcon icon="ri-file-text-line"></TraceIcon>
							<TraceTitle>Read pnpm-workspace.yaml</TraceTitle>
						</TraceLine>
						<TraceCollapsible defaultOpen>
							<TraceCollapsibleTrigger>
								<TraceLine>
									<TraceIcon icon="ri-terminal-line"></TraceIcon>
									<TraceTitle>Ran node --version</TraceTitle>
								</TraceLine>
							</TraceCollapsibleTrigger>
							<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
						</TraceCollapsible>
					</Trace>
				</div>
			)}
			siblings={[
				{
					name: "TraceLine",
					description: "One step. It is a span, so on its own it reads as text and is not a tab stop. Wrap it in a trigger, a link or a button to make it do something.",
					props: TRACE_LINE_PROPS,
					previewHeight: 120,
					imports: ["TraceIcon", "TraceTitle", "TraceStatus"],
					snippetChildren: () => "<TraceIcon icon=\"ri-terminal-line\"></TraceIcon>\n<TraceTitle>Ran pnpm install</TraceTitle>",
					preview: values => (
						<TraceLine status={values.status}>
							<TraceIcon icon="ri-terminal-line" spin={values.status === TraceStatus.RUNNING}></TraceIcon>
							<TraceTitle>
								{values.status === TraceStatus.RUNNING ? "Running pnpm install"
									: values.status === TraceStatus.ERROR ? "Failed to run pnpm install"
										: values.status === TraceStatus.PENDING ? "Run pnpm install" : "Ran pnpm install"}
							</TraceTitle>
						</TraceLine>
					)
				},
				{
					name: "TraceIcon",
					description: "The icon at the start, or the end, of a line. Hidden from assistive tech, so the title is the line's name.",
					props: TRACE_ICON_PROPS,
					previewHeight: 110,
					preview: values => (
						<TraceLine>
							<TraceIcon icon={values.icon} spin={values.spin}></TraceIcon>
							<TraceTitle>Ran pnpm install</TraceTitle>
						</TraceLine>
					)
				},
				{
					name: "TraceTitle",
					description: "What happened, as a sentence. It truncates when the row runs out of room.",
					props: TRACE_TEXT_PROPS,
					previewHeight: 110,
					snippetChildren: () => "Edited trace.tsx",
					preview: () => (<TraceLine><TraceTitle>Edited trace.tsx</TraceTitle></TraceLine>)
				},
				{
					name: "TraceDescription",
					description: "Secondary text after the title — a diff stat, a duration, a count. It does not truncate.",
					props: TRACE_TEXT_PROPS,
					previewHeight: 110,
					snippetChildren: () => "2.4s",
					preview: () => (
						<TraceLine>
							<TraceIcon icon="ri-terminal-line"></TraceIcon>
							<TraceTitle>Ran pnpm build</TraceTitle>
							<TraceDescription>2.4s</TraceDescription>
						</TraceLine>
					)
				},
				{
					name: "TraceCollapsible",
					description: "A row that expands. Rows start closed; use defaultOpen to start open, or open with onOpenChange to control it.",
					props: TRACE_COLLAPSIBLE_PROPS,
					previewHeight: 160,
					previewCentered: false,
					imports: ["TraceCollapsibleTrigger", "TraceCollapsibleContent", "TraceLine", "TraceIcon", "TraceTitle"],
					snippetChildren: () => "<TraceCollapsibleTrigger>\n\t<TraceLine>\n\t\t<TraceIcon icon=\"ri-terminal-line\"></TraceIcon>\n\t\t<TraceTitle>Ran node --version</TraceTitle>\n\t</TraceLine>\n</TraceCollapsibleTrigger>\n<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>",
					preview: values => (
						<div className="blue-orange-trace-development-block">
							<TraceCollapsible key={String(values.defaultOpen)} defaultOpen={values.defaultOpen}>
								<TraceCollapsibleTrigger>
									<TraceLine>
										<TraceIcon icon="ri-terminal-line"></TraceIcon>
										<TraceTitle>Ran node --version</TraceTitle>
									</TraceLine>
								</TraceCollapsibleTrigger>
								<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
							</TraceCollapsible>
						</div>
					)
				},
				{
					name: "TraceCollapsibleTrigger",
					description: "Turns the line inside it into a button with aria-expanded, and adds a chevron that turns as it opens.",
					props: TRACE_TRIGGER_PROPS,
					previewHeight: 110,
					preview: values => (
						<TraceCollapsible>
							<TraceCollapsibleTrigger disabled={values.disabled}>
								<TraceLine>
									<TraceIcon icon="ri-terminal-line"></TraceIcon>
									<TraceTitle>Ran node --version</TraceTitle>
								</TraceLine>
							</TraceCollapsibleTrigger>
							<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
						</TraceCollapsible>
					)
				},
				{
					name: "TraceCollapsibleContent",
					description: "The detail, hung off a rail under the line's icon. Its height animates open and shut.",
					props: TRACE_CONTENT_PROPS,
					previewHeight: 110,
					preview: () => (
						<TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
					)
				}
			]}>

			<GeneralHeading>Agent turn</GeneralHeading>
			<Description>A whole turn played back step by step: thinking that opens while it streams, tool calls that run, fail and expand, and the sources used. Press Replay to watch it again.</Description>
			<AgentTurn></AgentTurn>

			<GeneralHeading>Trace line</GeneralHeading>
			<Description>A line on its own, for a step with no detail to show. It reads as plain text.</Description>
			<div className="blue-orange-trace-development-block">
				<Trace>
					<TraceLine>
						<TraceIcon icon="ri-git-branch-line"></TraceIcon>
						<TraceTitle>Created branch fix/frozen-lockfile</TraceTitle>
					</TraceLine>
				</Trace>
			</div>

			<GeneralHeading>Status</GeneralHeading>
			<Description>Running shimmers the title, error colours the line and pending dims it. Say the status in the title too.</Description>
			<div className="blue-orange-trace-development-block">
				<Trace>
					<TraceLine>
						<TraceIcon icon="ri-checkbox-circle-line"></TraceIcon>
						<TraceTitle>Ran pnpm install</TraceTitle>
					</TraceLine>
					<TraceLine status={TraceStatus.ERROR}>
						<TraceIcon icon="ri-error-warning-line"></TraceIcon>
						<TraceTitle>Failed to run pnpm lint</TraceTitle>
					</TraceLine>
					<TraceLine status={TraceStatus.RUNNING}>
						<TraceIcon spin></TraceIcon>
						<TraceTitle>Running pnpm build</TraceTitle>
					</TraceLine>
					<TraceLine status={TraceStatus.PENDING}>
						<TraceIcon icon="ri-checkbox-blank-circle-line"></TraceIcon>
						<TraceTitle>Run pnpm test</TraceTitle>
					</TraceLine>
				</Trace>
			</div>

			<GeneralHeading>Description</GeneralHeading>
			<Description>Secondary text after the title — a duration, a count, a diff stat.</Description>
			<div className="blue-orange-trace-development-block">
				<Trace>
					<TraceLine>
						<TraceIcon icon="ri-terminal-line"></TraceIcon>
						<TraceTitle>Ran pnpm build</TraceTitle>
						<TraceDescription>2.4s</TraceDescription>
					</TraceLine>
					<TraceLine>
						<TraceIcon icon="ri-search-line"></TraceIcon>
						<TraceTitle>Searched the codebase for useChat</TraceTitle>
						<TraceDescription>14 results</TraceDescription>
					</TraceLine>
				</Trace>
			</div>

			<GeneralHeading>Collapsible</GeneralHeading>
			<Description>Wrap the line in a TraceCollapsible to show more detail when it expands. The detail can be any existing component — here a CodeBlock.</Description>
			<div className="blue-orange-trace-development-block">
				<Trace>
					<TraceCollapsible defaultOpen>
						<TraceCollapsibleTrigger>
							<TraceLine>
								<TraceIcon icon="ri-terminal-line"></TraceIcon>
								<TraceTitle>Ran node --version</TraceTitle>
							</TraceLine>
						</TraceCollapsibleTrigger>
						<TraceCollapsibleContent>
							<CodeBlock value={{code: nodeOutput, lang: "bash"}}></CodeBlock>
						</TraceCollapsibleContent>
					</TraceCollapsible>
					<TraceCollapsible defaultOpen>
						<TraceCollapsibleTrigger>
							<TraceLine status={TraceStatus.ERROR}>
								<TraceIcon icon="ri-terminal-line"></TraceIcon>
								<TraceTitle>Failed to run pnpm dev</TraceTitle>
							</TraceLine>
						</TraceCollapsibleTrigger>
						<TraceCollapsibleContent>
							<CodeBlock value={{code: devError, lang: "bash"}}></CodeBlock>
						</TraceCollapsibleContent>
					</TraceCollapsible>
				</Trace>
			</div>

			<GeneralHeading>Open state</GeneralHeading>
			<Description>Control a row with open and onOpenChange.</Description>
			<div className="blue-orange-trace-development-block">
				<div className="blue-orange-trace-development-row">
					<Button
						text={controlledOpen ? "Close" : "Open"}
						buttonType={ButtonType.SECONDARY}
						size={ButtonSize.SMALL}
						onClick={() => setControlledOpen(!controlledOpen)}></Button>
				</div>
				<Trace>
					<TraceCollapsible open={controlledOpen} onOpenChange={setControlledOpen}>
						<TraceCollapsibleTrigger>
							<TraceLine>
								<TraceIcon icon="ri-lightbulb-line"></TraceIcon>
								<TraceTitle>Thought for 12s</TraceTitle>
							</TraceLine>
						</TraceCollapsibleTrigger>
						<TraceCollapsibleContent>
							The deploy is slow because the image optimisation cache is keyed on the commit, so every
							deploy starts cold. Keying it on the lockfile hash would let it be reused.
						</TraceCollapsibleContent>
					</TraceCollapsible>
				</Trace>
			</div>

			<GeneralHeading>Link</GeneralHeading>
			<Description>Wrap the line in an anchor. For a new tab, use an arrow out icon and say so to screen readers.</Description>
			<div className="blue-orange-trace-development-block">
				<Trace>
					<a href="#trace">
						<TraceLine>
							<TraceIcon icon="ri-file-text-line"></TraceIcon>
							<TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
							<TraceIcon icon="ri-arrow-right-s-line"></TraceIcon>
						</TraceLine>
					</a>
					<a href="https://docs.astro.build/en/install-and-setup/" target="_blank" rel="noreferrer">
						<TraceLine>
							<TraceIcon icon="ri-global-line"></TraceIcon>
							<TraceTitle>
								Install Astro | docs.astro.build
								<span className="blue-orange-trace-development-sr-only"> (opens in a new tab)</span>
							</TraceTitle>
							<TraceIcon icon="ri-arrow-right-up-line"></TraceIcon>
						</TraceLine>
					</a>
				</Trace>
			</div>

			<GeneralHeading>Modal and drawer</GeneralHeading>
			<Description>Wrap the line in a button that opens a Modal or a Drawer. The trace styles the button so it lines up with the other rows.</Description>
			<div className="blue-orange-trace-development-block">
				<Trace>
					<button type="button" onClick={() => setModalOpen(true)}>
						<TraceLine>
							<TraceIcon icon="ri-global-line"></TraceIcon>
							<TraceTitle>Searched the web for cache keys</TraceTitle>
							<TraceIcon icon="ri-arrow-right-s-line"></TraceIcon>
						</TraceLine>
					</button>
					<button type="button" onClick={() => setDrawerOpen(true)}>
						<TraceLine>
							<TraceIcon icon="ri-file-edit-line"></TraceIcon>
							<TraceTitle>Edited next.config.ts</TraceTitle>
							<TraceDescription>
								<span className="blue-orange-trace-description-added">+4</span>{" "}
								<span className="blue-orange-trace-description-removed">-1</span>
							</TraceDescription>
							<TraceIcon icon="ri-arrow-right-s-line"></TraceIcon>
						</TraceLine>
					</button>
				</Trace>
			</div>
			<Modal open={modalOpen} width={480} onClose={() => setModalOpen(false)}>
				<ModalHeader label="Searched the web for cache keys" onClose={() => setModalOpen(false)}></ModalHeader>
				<ModalBody>
					<Trace>
						{sources.map(source => (
							<a key={source.href} href={source.href} target="_blank" rel="noreferrer">
								<TraceLine>
									<TraceIcon icon="ri-global-line"></TraceIcon>
									<TraceTitle>{source.title}</TraceTitle>
									<TraceIcon icon="ri-arrow-right-up-line"></TraceIcon>
								</TraceLine>
							</a>
						))}
					</Trace>
				</ModalBody>
			</Modal>
			<Drawer open={drawerOpen} position={DrawerPosition.RIGHT} width="480px" onClose={() => setDrawerOpen(false)}>
				<DrawerHeader label="next.config.ts" onClose={() => setDrawerOpen(false)}></DrawerHeader>
				<DrawerBody>
					<CodeBlock value={{code: "const nextConfig = {\n-  images: {},\n+  images: {\n+    minimumCacheTTL: 60,\n+    formats: [\"image/avif\"],\n+  },\n}", lang: "diff"}}></CodeBlock>
				</DrawerBody>
			</Drawer>

			<GeneralHeading>Sources</GeneralHeading>
			<Description>A collapsible row whose detail is a Trace of link rows.</Description>
			<div className="blue-orange-trace-development-block">
				<TraceCollapsible defaultOpen>
					<TraceCollapsibleTrigger>
						<TraceLine>
							<TraceIcon icon="ri-global-line"></TraceIcon>
							<TraceTitle>Used {sources.length} sources</TraceTitle>
						</TraceLine>
					</TraceCollapsibleTrigger>
					<TraceCollapsibleContent>
						<Trace>
							{sources.map(source => (
								<a key={source.href} href={source.href} target="_blank" rel="noreferrer">
									<TraceLine>
										<TraceIcon icon="ri-global-line"></TraceIcon>
										<TraceTitle>
											{source.title}
											<span className="blue-orange-trace-development-sr-only"> (opens in a new tab)</span>
										</TraceTitle>
										<TraceIcon icon="ri-arrow-right-up-line"></TraceIcon>
									</TraceLine>
								</a>
							))}
						</Trace>
					</TraceCollapsibleContent>
				</TraceCollapsible>
			</div>

			<GeneralHeading>Chain of thought</GeneralHeading>
			<Description>A collapsible row with step rows inside. Set the parent's status and title from its children.</Description>
			<div className="blue-orange-trace-development-block">
				<TraceCollapsible defaultOpen>
					<TraceCollapsibleTrigger>
						<TraceLine status={TraceStatus.RUNNING}>
							<TraceTitle>Looking into the slow deploy</TraceTitle>
						</TraceLine>
					</TraceCollapsibleTrigger>
					<TraceCollapsibleContent keepMounted>
						<Trace>
							<TraceCollapsible>
								<TraceCollapsibleTrigger>
									<TraceLine>
										<TraceIcon icon="ri-search-line"></TraceIcon>
										<TraceTitle>Searched for the checkout build log</TraceTitle>
									</TraceLine>
								</TraceCollapsibleTrigger>
								<TraceCollapsibleContent>
									<div className="blue-orange-trace-development-badges">
										<Badge>vercel.com</Badge>
										<Badge>github.com</Badge>
									</div>
								</TraceCollapsibleContent>
							</TraceCollapsible>
							<a href="#trace">
								<TraceLine>
									<TraceIcon icon="ri-file-text-line"></TraceIcon>
									<TraceTitle>Read the last twelve deploys</TraceTitle>
									<TraceIcon icon="ri-arrow-right-s-line"></TraceIcon>
								</TraceLine>
							</a>
							<TraceCollapsible defaultOpen>
								<TraceCollapsibleTrigger>
									<TraceLine status={TraceStatus.RUNNING}>
										<TraceIcon icon="ri-search-line"></TraceIcon>
										<TraceTitle>Searching for the cache key</TraceTitle>
									</TraceLine>
								</TraceCollapsibleTrigger>
								<TraceCollapsibleContent>
									<CodeBlock value={{code: "cache key image optimization", lang: "text"}}></CodeBlock>
								</TraceCollapsibleContent>
							</TraceCollapsible>
						</Trace>
					</TraceCollapsibleContent>
				</TraceCollapsible>
			</div>

			<GeneralHeading>Commit</GeneralHeading>
			<Description>A collapsible row with a line for each changed file. Say what changed in the title and put the line counts in the description.</Description>
			<div className="blue-orange-trace-development-block">
				<TraceCollapsible defaultOpen>
					<TraceCollapsibleTrigger>
						<TraceLine>
							<TraceIcon icon="ri-git-commit-line"></TraceIcon>
							<TraceTitle>Committed fix: update the lockfile</TraceTitle>
							<TraceDescription>3 files</TraceDescription>
						</TraceLine>
					</TraceCollapsibleTrigger>
					<TraceCollapsibleContent>
						<Trace>
							<TraceLine>
								<TraceIcon icon="ri-file-edit-line"></TraceIcon>
								<TraceTitle>Edited package.json</TraceTitle>
								<TraceDescription>
									<span className="blue-orange-trace-description-added">+1</span>{" "}
									<span className="blue-orange-trace-description-removed">-1</span>
								</TraceDescription>
							</TraceLine>
							<TraceLine>
								<TraceIcon icon="ri-file-edit-line"></TraceIcon>
								<TraceTitle>Edited pnpm-lock.yaml</TraceTitle>
								<TraceDescription>
									<span className="blue-orange-trace-description-added">+38</span>{" "}
									<span className="blue-orange-trace-description-removed">-12</span>
								</TraceDescription>
							</TraceLine>
							<TraceLine>
								<TraceIcon icon="ri-file-add-line"></TraceIcon>
								<TraceTitle>Added .npmrc</TraceTitle>
								<TraceDescription>
									<span className="blue-orange-trace-description-added">+2</span>
								</TraceDescription>
							</TraceLine>
						</Trace>
					</TraceCollapsibleContent>
				</TraceCollapsible>
			</div>
		</ComponentDoc>
	)
}
