import React, {useEffect, useMemo, useRef, useState} from "react";

import './FileSystemDevelopment.css'
import {
	FileSystem,
	IFileSystemItem,
	IFileSystemOrderBy,
	IFileSystemType
} from "../../../components/file-system/file-system/FileSystem";
import {FileSystemRow} from "../../../components/file-system/file-system-row/FileSystemRow";
import {IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";
import {Button, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {Checkbox} from "../../../components/inputs/checkbox/Checkbox";
import {BreadCrumb, Breadcrumbs} from "../../../components/breadcrumbs/Breadcrumbs";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {SplitPageMajor} from "../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {SplitPageMinor} from "../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";
import {
	HorizontalSplitPage
} from "../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";

const DEMO_FILE_SYSTEM_ITEMS: Array<IFileSystemItem> = [
	{
		reference: "run-sheets",
		indent: 0,
		type: IFileSystemType.FOLDER,
		label: "Run sheets",
		icon: "ri-folder-fill",
		iconColor: "#f0b429",
		showDropdown: true,
		selected: false,
		size: 0,
		lastModified: new Date("2026-08-24T09:12:00"),
		fileType: "Folder"
	},
	{
		reference: "melbourne-depot.pdf",
		indent: 0,
		type: IFileSystemType.FILE,
		label: "melbourne-depot.pdf",
		icon: "ri-file-pdf-fill",
		iconColor: "#e11d48",
		selected: false,
		size: 248000,
		lastModified: new Date("2026-08-22T16:04:00"),
		fileType: "PDF"
	},
	{
		reference: "throughput.csv",
		indent: 0,
		type: IFileSystemType.FILE,
		label: "throughput.csv",
		icon: "ri-file-excel-fill",
		iconColor: "#16a34b",
		selected: true,
		size: 1240000,
		lastModified: new Date("2026-08-25T08:30:00"),
		fileType: "CSV"
	}
];

const FILE_SYSTEM_ITEM_INTERFACE = {
	name: "IFileSystemItem",
	description: "One row. Everything about how a row looks and what it can do is on the item, so the browser itself stays stateless.",
	props: [
		{name: "reference", type: "string", required: true, description: "Identifies the row, and is what the callbacks report."},
		{name: "type", type: "IFileSystemType", required: true, description: "FOLDER, FILE or PARENT_DIRECTORY."},
		{name: "label", type: "string", required: true, description: "The name shown."},
		{name: "indent", type: "number", required: true, description: "How deep the row sits in the tree."},
		{name: "selected", type: "boolean", required: true, description: "Whether the row is part of the selection."},
		{name: "size", type: "number", required: true, description: "Size in bytes, formatted by the size column."},
		{name: "lastModified", type: "Date", required: true, description: "When it last changed."},
		{name: "fileType", type: "string", required: true, description: "What the type column reads."},
		{name: "description", type: "string", description: "A second line under the name."},
		{name: "icon", type: "string", description: "A remixicon class for the row."},
		{name: "iconColor", type: "string", description: "The colour of that icon."},
		{name: "iconSize", type: "string", description: "Its size, as a CSS length."},
		{name: "showDropdown", type: "boolean", description: "Draws the expand chevron, for a folder that can be opened in place."},
		{name: "dropdownOpen", type: "boolean", description: "Whether that folder is currently open."},
		{name: "rename", type: "boolean", description: "Puts the row into its inline rename editor."},
		{name: "rowHeight", type: "number", description: "Overrides the row's height."},
		{name: "cut", type: "boolean", description: "Fades the row, marking it as cut."},
		{name: "copy", type: "boolean", description: "Marks the row as copied."},
		{name: "progress", type: "number", description: "A percentage between 0 and 100. Set it while the item uploads to show a bar inside the row."}
	] as Array<PropSpec>
};

const FILE_SYSTEM_ROW_INTERFACE = {
	name: "FileSystemRow",
	description: "Renders one item. The columns follow the surrounding FileSystem unless the row overrides them.",
	props: [
		{name: "item", type: "IFileSystemItem", required: true, description: "The item to draw."},
		{name: "indent", type: "number", description: "Overrides the item's own indent."},
		{name: "indentStep", type: "number", description: "How much room one level of indent takes."},
		{name: "contextMenuItems", type: "Array<IContextMenuItem>", description: "Rows for this item's context menu."},
		{name: "contextMenuItemClicked", type: "(item: IContextMenuItem) => void", description: "Fires with whichever context menu row was picked."},
		{name: "onClick", type: "(item: IFileSystemItem, ctrlKey: boolean, shiftKey: boolean) => void", description: "Fires with the row and the modifier keys, which is how the selection is worked out."},
		{name: "onDoubleClick", type: "(item: IFileSystemItem) => void", description: "Fires on a double click — usually what opens a folder or a file."},
		{name: "onDrop", type: "() => void", description: "Fires when a selection is dropped onto this row."},
		{name: "onDropdownClick", type: "(item: IFileSystemItem) => void", description: "Fires when the expand chevron is clicked. Requires item.showDropdown."},
		{name: "onRenameComplete", type: "(item: IFileSystemItem, label: string) => void", description: "Fires when the inline rename is committed. Requires item.rename."},
		{name: "showFileSize", type: "boolean", description: "Overrides the surrounding FileSystem's size column for this row."},
		{name: "showFileType", type: "boolean", description: "The same for the type column."},
		{name: "showLastModified", type: "boolean", description: "The same for the modified column."},
		{name: "style", type: "React.CSSProperties", description: "Inline style put on the row."}
	] as Array<PropSpec>
};

const FILE_SYSTEM_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The rows, as FileSystemRow elements."
	},
	{
		name: "showHeader",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the column headings."
	},
	{
		name: "showFileSize",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the size column."
	},
	{
		name: "showFileType",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the type column."
	},
	{
		name: "showLastModified",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Shows the modified column."
	},
	{
		name: "orderBy",
		type: "IFileSystemOrderBy",
		default: "IFileSystemOrderBy.UNSELECTED",
		defaultValue: IFileSystemOrderBy.UNSELECTED,
		control: "select",
		options: [
			{label: "Unselected", value: IFileSystemOrderBy.UNSELECTED, code: "IFileSystemOrderBy.UNSELECTED"},
			{label: "Name ascending", value: IFileSystemOrderBy.NAME_ASC, code: "IFileSystemOrderBy.NAME_ASC"},
			{label: "Name descending", value: IFileSystemOrderBy.NAME_DESC, code: "IFileSystemOrderBy.NAME_DESC"},
			{label: "Modified ascending", value: IFileSystemOrderBy.LAST_MOD_ASC, code: "IFileSystemOrderBy.LAST_MOD_ASC"},
			{label: "Modified descending", value: IFileSystemOrderBy.LAST_MOD_DESC, code: "IFileSystemOrderBy.LAST_MOD_DESC"},
			{label: "Size ascending", value: IFileSystemOrderBy.FILE_SIZE_ASC, code: "IFileSystemOrderBy.FILE_SIZE_ASC"},
			{label: "Size descending", value: IFileSystemOrderBy.FILE_SIZE_DESC, code: "IFileSystemOrderBy.FILE_SIZE_DESC"}
		],
		description: "Which column the arrow is shown against, and which way. The sorting itself is yours to do."
	},
	{
		name: "orderByEvent",
		type: "(orderBy: IFileSystemOrderBy) => void",
		description: "Supply it and the column headings become clickable, toggling between ascending and descending."
	},
	{
		name: "showParentDirectory",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Puts a row above the children that navigates out of the folder being viewed. Set it while anything other than the root is on screen."
	},
	{
		name: "parentDirectoryLabel",
		type: "string",
		default: "\"..\"",
		control: "text",
		description: "What that row reads."
	},
	{
		name: "parentDirectoryIcon",
		type: "string",
		default: "\"ri-corner-left-up-line\"",
		control: "text",
		description: "The remixicon class on it."
	},
	{
		name: "parentDirectoryEvent",
		type: "() => void",
		description: "Fires when that row is double clicked."
	},
	{
		name: "parentDirectoryDropEvent",
		type: "() => void",
		description: "Fires when a selection is dragged onto it."
	},
	{
		name: "onClick",
		type: "(item: IFileSystemItem, pos: SelectedElementsPos) => void",
		description: "Fires with the clicked row and where the pointer was."
	},
	{
		name: "onRightClick",
		type: "(items: Array<IFileSystemItem>, pos: SelectedElementsPos) => void",
		description: "Fires with the whole selection and where the pointer was — where a context menu is opened."
	},
	{
		name: "onDblClick",
		type: "(item: IFileSystemItem) => void",
		description: "Fires on a double click, which is what opens a folder."
	},
	{
		name: "copyEvent",
		type: "() => void",
		description: "Fires on the copy shortcut."
	},
	{
		name: "cutEvent",
		type: "() => void",
		description: "Fires on the cut shortcut."
	},
	{
		name: "pasteEvent",
		type: "() => void",
		description: "Fires on the paste shortcut."
	},
	{
		name: "movingEvent",
		type: "(state: boolean) => void",
		description: "Fires as a drag of the selection starts and finishes."
	},
	{
		name: "dropEvent",
		type: "(files: FileList) => void",
		description: "Fires with the files dropped onto the browser from outside the page."
	}
];

interface Props {
}

interface DemoNode {
	id: string,
	label: string,
	description?: string,
	/** Percentage of an upload still running, cleared once the file has landed. */
	progress?: number,
	type: IFileSystemType,
	icon: string,
	iconColor?: string,
	size: number,
	lastModified: Date,
	fileType: string,
	children?: Array<DemoNode>,
}

interface VisibleRow {
	node: DemoNode,
	indent: number,
}

type ClipboardMode = "COPY" | "CUT";

const daysAgo = (days: number): Date => {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
}

const folder = (id: string, label: string, lastModified: Date, children: Array<DemoNode>): DemoNode => {
	return {
		id: id,
		label: label,
		type: IFileSystemType.FOLDER,
		icon: "ri-folder-fill",
		iconColor: "#f0b429",
		size: 0,
		lastModified: lastModified,
		fileType: "Folder",
		children: children
	}
}

const FILE_TYPES: Record<string, {icon: string, iconColor: string, fileType: string}> = {
	doc: {icon: "ri-file-word-fill", iconColor: "#2b579a", fileType: "Word"},
	docx: {icon: "ri-file-word-fill", iconColor: "#2b579a", fileType: "Word"},
	xls: {icon: "ri-file-excel-fill", iconColor: "#217346", fileType: "Excel"},
	xlsx: {icon: "ri-file-excel-fill", iconColor: "#217346", fileType: "Excel"},
	ppt: {icon: "ri-file-ppt-fill", iconColor: "#d24726", fileType: "Powerpoint"},
	pdf: {icon: "ri-file-pdf-fill", iconColor: "#d93025", fileType: "PDF"},
	png: {icon: "ri-image-fill", iconColor: "#7c4dff", fileType: "Image"},
	jpg: {icon: "ri-image-fill", iconColor: "#7c4dff", fileType: "Image"},
	jpeg: {icon: "ri-image-fill", iconColor: "#7c4dff", fileType: "Image"},
	svg: {icon: "ri-shapes-fill", iconColor: "#7c4dff", fileType: "Vector"},
	mp4: {icon: "ri-video-fill", iconColor: "#e91e63", fileType: "Video"},
	mp3: {icon: "ri-music-2-fill", iconColor: "#e91e63", fileType: "Audio"},
	zip: {icon: "ri-file-zip-fill", iconColor: "#795548", fileType: "Archive"},
	json: {icon: "ri-braces-fill", iconColor: "#00897b", fileType: "JSON"},
	ts: {icon: "ri-code-s-slash-fill", iconColor: "#3178c6", fileType: "Typescript"},
	tsx: {icon: "ri-reactjs-fill", iconColor: "#3178c6", fileType: "React"},
	css: {icon: "ri-css3-fill", iconColor: "#264de4", fileType: "CSS"},
	md: {icon: "ri-markdown-fill", iconColor: "#607d8b", fileType: "Markdown"},
}

const DEFAULT_FILE_TYPE = {icon: "ri-file-fill", iconColor: "#8a8a8e", fileType: "File"};

const fileTypeForName = (name: string) => {
	const extension = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
	return FILE_TYPES[extension] ?? DEFAULT_FILE_TYPE;
}

const file = (id: string, label: string, size: number, lastModified: Date, description?: string): DemoNode => {
	const type = fileTypeForName(label);
	return {
		id: id,
		label: label,
		description: description,
		type: IFileSystemType.FILE,
		icon: type.icon,
		iconColor: type.iconColor,
		size: size,
		lastModified: lastModified,
		fileType: type.fileType
	}
}

const SEED_TREE: Array<DemoNode> = [
	folder("documents", "Documents", daysAgo(2), [
		folder("documents-contracts", "Contracts", daysAgo(9), [
			file("contract-acme", "Acme Master Agreement.pdf", 2_411_000, daysAgo(9)),
			file("contract-orbit", "Orbit Reseller Agreement.pdf", 1_204_000, daysAgo(31)),
		]),
		folder("documents-empty", "Archive 2019", daysAgo(420), []),
		file("doc-strategy", "Company Strategy.docx", 184_320, daysAgo(2), "Shared with the leadership team"),
		file("doc-budget", "Budget FY26.xlsx", 962_000, daysAgo(5)),
		file("doc-notes", "Meeting Notes.md", 8_100, daysAgo(1)),
	]),
	folder("media", "Media", daysAgo(4), [
		file("media-hero", "hero-banner.png", 4_800_000, daysAgo(4)),
		file("media-logo", "logo.svg", 24_500, daysAgo(60)),
		file("media-demo", "product-demo.mp4", 148_000_000, daysAgo(12)),
		file("media-jingle", "jingle.mp3", 3_200_000, daysAgo(200)),
	]),
	folder("projects", "Projects", daysAgo(0), [
		folder("projects-foundations", "foundations", daysAgo(0), [
			file("proj-fs", "FileSystem.tsx", 14_820, daysAgo(0)),
			file("proj-fs-css", "FileSystem.css", 2_140, daysAgo(0)),
			file("proj-readme", "README.md", 6_400, daysAgo(3)),
		]),
		file("proj-config", "workspace.json", 1_900, daysAgo(7)),
		file("proj-archive", "release-2025.zip", 88_400_000, daysAgo(45)),
	]),
	file("root-invoice", "Invoice 10432.pdf", 320_000, daysAgo(1)),
	file("root-photo", "team-offsite.jpg", 6_120_000, daysAgo(18)),
	file("root-todo", "todo.md", 1_200, daysAgo(0)),
];

const findNode = (nodes: Array<DemoNode>, id: string): DemoNode | null => {
	for (const node of nodes) {
		if (node.id === id) {
			return node;
		}
		if (node.children) {
			const match = findNode(node.children, id);
			if (match) {
				return match;
			}
		}
	}
	return null;
}

const collectIds = (node: DemoNode): Array<string> => {
	const ids = [node.id];
	(node.children ?? []).forEach((child) => ids.push(...collectIds(child)));
	return ids;
}

/** Removes every node in `ids` from the tree and hands the detached nodes back to the caller. */
const removeNodes = (nodes: Array<DemoNode>, ids: Array<string>, removed: Array<DemoNode>): Array<DemoNode> => {
	const remaining: Array<DemoNode> = [];
	nodes.forEach((node) => {
		if (ids.includes(node.id)) {
			removed.push(node);
			return;
		}
		remaining.push(node.children ? {...node, children: removeNodes(node.children, ids, removed)} : node);
	});
	return remaining;
}

const insertNodes = (nodes: Array<DemoNode>, folderId: string | null, toInsert: Array<DemoNode>): Array<DemoNode> => {
	if (folderId === null) {
		return [...nodes, ...toInsert];
	}
	return nodes.map((node) => {
		if (node.id === folderId) {
			return {...node, children: [...(node.children ?? []), ...toInsert]};
		}
		if (node.children) {
			return {...node, children: insertNodes(node.children, folderId, toInsert)};
		}
		return node;
	});
}

const updateNode = (nodes: Array<DemoNode>, id: string, update: (node: DemoNode) => DemoNode): Array<DemoNode> => {
	return nodes.map((node) => {
		if (node.id === id) {
			return update(node);
		}
		if (node.children) {
			return {...node, children: updateNode(node.children, id, update)};
		}
		return node;
	});
}

/** Folder sizes are the total of everything underneath them, files report their own size. */
const nodeSize = (node: DemoNode): number => {
	if (!node.children) {
		return node.size;
	}
	return node.children.reduce((total, child) => total + nodeSize(child), 0);
}

const compareNodes = (a: DemoNode, b: DemoNode, orderBy: IFileSystemOrderBy): number => {
	switch (orderBy) {
		case IFileSystemOrderBy.NAME_ASC:
			return a.label.localeCompare(b.label);
		case IFileSystemOrderBy.NAME_DESC:
			return b.label.localeCompare(a.label);
		case IFileSystemOrderBy.LAST_MOD_ASC:
			return a.lastModified.getTime() - b.lastModified.getTime();
		case IFileSystemOrderBy.LAST_MOD_DESC:
			return b.lastModified.getTime() - a.lastModified.getTime();
		case IFileSystemOrderBy.FILE_SIZE_ASC:
			return nodeSize(a) - nodeSize(b);
		case IFileSystemOrderBy.FILE_SIZE_DESC:
			return nodeSize(b) - nodeSize(a);
		case IFileSystemOrderBy.FILE_TYPE_ASC:
			return a.fileType.localeCompare(b.fileType) || a.label.localeCompare(b.label);
		case IFileSystemOrderBy.FILE_TYPE_DESC:
			return b.fileType.localeCompare(a.fileType) || a.label.localeCompare(b.label);
		default:
			return 0;
	}
}

export const FileSystemDevelopment: React.FC<Props> = ({}) => {

	const [tree, setTree] = useState<Array<DemoNode>>(SEED_TREE);

	const [path, setPath] = useState<Array<{id: string, label: string}>>([]);

	const [expandedIds, setExpandedIds] = useState<Array<string>>([]);

	const [selectedIds, setSelectedIds] = useState<Array<string>>([]);

	const [orderBy, setOrderBy] = useState<IFileSystemOrderBy>(IFileSystemOrderBy.NAME_ASC);

	const [foldersFirst, setFoldersFirst] = useState(true);

	const [clipboard, setClipboard] = useState<{ids: Array<string>, mode: ClipboardMode} | null>(null);

	const [renameId, setRenameId] = useState<string | null>(null);

	const [showHeader, setShowHeader] = useState(true);
	const [showFileSize, setShowFileSize] = useState(true);
	const [showFileType, setShowFileType] = useState(true);
	const [showLastModified, setShowLastModified] = useState(true);
	const [showParentDirectory, setShowParentDirectory] = useState(true);
	const [parentDirectoryDots, setParentDirectoryDots] = useState(false);

	/** Double clicking a folder either replaces the view with it, or expands it in place. */
	const [openFoldersInNewView, setOpenFoldersInNewView] = useState(true);

	const [log, setLog] = useState<Array<string>>([]);

	const lastSelectedIndexRef = useRef<number>(-1);

	const movingRef = useRef<boolean>(false);

	const idCounterRef = useRef<number>(0);

	const uploadTimersRef = useRef<Array<number>>([]);

	useEffect(() => {
		return () => {
			uploadTimersRef.current.forEach((timer) => window.clearInterval(timer));
		};
	}, []);

	const nextId = (prefix: string) => {
		idCounterRef.current += 1;
		return `${prefix}-${idCounterRef.current}`;
	}

	const logEvent = (message: string) => {
		const time = new Date().toLocaleTimeString();
		setLog((previous) => [`${time}  ${message}`, ...previous].slice(0, 50));
	}

	const currentFolderId = path.length > 0 ? path[path.length - 1].id : null;

	const currentChildren = useMemo<Array<DemoNode>>(() => {
		if (currentFolderId === null) {
			return tree;
		}
		return findNode(tree, currentFolderId)?.children ?? [];
	}, [tree, currentFolderId]);

	const sortNodes = (nodes: Array<DemoNode>): Array<DemoNode> => {
		return [...nodes].sort((a, b) => {
			if (foldersFirst && a.type !== b.type) {
				return a.type === IFileSystemType.FOLDER ? -1 : 1;
			}
			return compareNodes(a, b, orderBy);
		});
	}

	/** Flattens the current folder, splicing in the children of any folder expanded inline. */
	const buildRows = (nodes: Array<DemoNode>, indent: number): Array<VisibleRow> => {
		const rows: Array<VisibleRow> = [];
		sortNodes(nodes).forEach((node) => {
			rows.push({node: node, indent: indent});
			if (node.children && expandedIds.includes(node.id)) {
				rows.push(...buildRows(node.children, indent + 1));
			}
		});
		return rows;
	}

	const visibleRows = useMemo<Array<VisibleRow>>(
		() => buildRows(currentChildren, 0),
		[currentChildren, expandedIds, orderBy, foldersFirst]
	);

	const selectedNodes = useMemo<Array<DemoNode>>(
		() => selectedIds.map((id) => findNode(tree, id)).filter((node): node is DemoNode => node !== null),
		[tree, selectedIds]
	);

	const toFileSystemItem = (row: VisibleRow): IFileSystemItem => {
		const node = row.node;
		const isCut = clipboard?.mode === "CUT" && clipboard.ids.includes(node.id);
		return {
			id: node.id,
			reference: node.id,
			indent: row.indent,
			type: node.type,
			label: node.label,
			description: node.description,
			icon: node.icon,
			iconColor: node.iconColor,
			showDropdown: node.type === IFileSystemType.FOLDER,
			dropdownOpen: expandedIds.includes(node.id),
			rename: renameId === node.id,
			cut: isCut,
			copy: clipboard?.mode === "COPY" && clipboard.ids.includes(node.id),
			progress: node.progress,
			selected: selectedIds.includes(node.id),
			size: nodeSize(node),
			lastModified: node.lastModified,
			fileType: node.fileType
		};
	}

	// ---------------------------------------------------------------- selection

	const selectSingle = (node: DemoNode, index: number) => {
		lastSelectedIndexRef.current = index;
		setSelectedIds([node.id]);
	}

	const selectToggle = (node: DemoNode, index: number) => {
		lastSelectedIndexRef.current = index;
		setSelectedIds((previous) => previous.includes(node.id)
			? previous.filter((id) => id !== node.id)
			: [...previous, node.id]);
	}

	const selectRange = (index: number) => {
		const anchor = lastSelectedIndexRef.current === -1 ? index : lastSelectedIndexRef.current;
		const start = Math.min(anchor, index);
		const end = Math.max(anchor, index);
		setSelectedIds(visibleRows.slice(start, end + 1).map((row) => row.node.id));
	}

	const rowClicked = (item: IFileSystemItem, ctrlKey: boolean, shiftKey: boolean) => {
		const index = visibleRows.findIndex((row) => row.node.id === item.id);
		if (index === -1) {
			return;
		}
		const node = visibleRows[index].node;
		if (ctrlKey) {
			selectToggle(node, index);
		} else if (shiftKey) {
			selectRange(index);
		} else {
			selectSingle(node, index);
		}
	}

	const selectAll = () => {
		setSelectedIds(visibleRows.map((row) => row.node.id));
		logEvent(`Selected all ${visibleRows.length} rows`);
	}

	const clearSelection = () => {
		setSelectedIds([]);
		lastSelectedIndexRef.current = -1;
	}

	// ---------------------------------------------------------------- navigation

	const openFolder = (node: DemoNode) => {
		setPath((previous) => [...previous, {id: node.id, label: node.label}]);
		clearSelection();
		logEvent(`Opened folder "${node.label}"`);
	}

	const navigateUp = () => {
		setPath((previous) => previous.slice(0, -1));
		clearSelection();
		logEvent("Navigated to the parent directory");
	}

	const navigateToCrumb = (crumb: BreadCrumb) => {
		if (crumb.reference === "root") {
			setPath([]);
		} else {
			const index = path.findIndex((entry) => entry.id === crumb.reference);
			setPath(path.slice(0, index + 1));
		}
		clearSelection();
		logEvent(`Navigated to "${crumb.label}"`);
	}

	const toggleExpanded = (item: IFileSystemItem) => {
		const id = item.id!;
		setExpandedIds((previous) => previous.includes(id)
			? previous.filter((expanded) => expanded !== id)
			: [...previous, id]);
		logEvent(`${expandedIds.includes(id) ? "Collapsed" : "Expanded"} "${item.label}"`);
	}

	/**
	 * Rows report their double clicks through the table's onDblClick rather than
	 * their own onDoubleClick — subscribing to both would handle every double
	 * click twice.
	 */
	const rowDoubleClicked = (item: IFileSystemItem) => {
		if (item.type === IFileSystemType.PARENT_DIRECTORY) {
			// The parent directory row reports itself through parentDirectoryEvent as well.
			return;
		}
		const node = findNode(tree, item.id!);
		if (!node) {
			return;
		}
		if (node.type !== IFileSystemType.FOLDER) {
			logEvent(`Opened file "${node.label}"`);
			return;
		}
		if (openFoldersInNewView) {
			openFolder(node);
		} else {
			toggleExpanded(item);
		}
	}

	// ---------------------------------------------------------------- mutations

	const createFolder = () => {
		const id = nextId("folder");
		const newFolder = folder(id, "New Folder", new Date(), []);
		setTree((previous) => insertNodes(previous, currentFolderId, [newFolder]));
		setSelectedIds([id]);
		setRenameId(id);
		logEvent("Created a new folder — type a name and press enter");
	}

	const startRename = () => {
		if (selectedIds.length !== 1) {
			logEvent("Rename needs exactly one selected row");
			return;
		}
		setRenameId(selectedIds[0]);
	}

	const renameComplete = (item: IFileSystemItem, label: string) => {
		const trimmed = label.trim();
		setRenameId(null);
		if (trimmed.length === 0 || trimmed === item.label) {
			logEvent(`Rename of "${item.label}" cancelled`);
			return;
		}
		setTree((previous) => updateNode(previous, item.id!, (node) => {
			const isFolder = node.type === IFileSystemType.FOLDER;
			const type = fileTypeForName(trimmed);
			return {
				...node,
				label: trimmed,
				lastModified: new Date(),
				icon: isFolder ? node.icon : type.icon,
				iconColor: isFolder ? node.iconColor : type.iconColor,
				fileType: isFolder ? node.fileType : type.fileType
			};
		}));
		logEvent(`Renamed "${item.label}" to "${trimmed}"`);
	}

	const deleteSelected = () => {
		if (selectedIds.length === 0) {
			logEvent("Nothing selected to delete");
			return;
		}
		const labels = selectedNodes.map((node) => node.label).join(", ");
		setTree((previous) => removeNodes(previous, selectedIds, []));
		clearSelection();
		logEvent(`Deleted ${selectedIds.length} item(s): ${labels}`);
	}

	const copySelected = () => {
		if (selectedIds.length === 0) {
			return;
		}
		setClipboard({ids: [...selectedIds], mode: "COPY"});
		logEvent(`Copied ${selectedIds.length} item(s) — ctrl/cmd + v to paste`);
	}

	const cutSelected = () => {
		if (selectedIds.length === 0) {
			return;
		}
		setClipboard({ids: [...selectedIds], mode: "CUT"});
		logEvent(`Cut ${selectedIds.length} item(s) — ctrl/cmd + v to paste`);
	}

	const cloneNode = (node: DemoNode): DemoNode => {
		return {
			...node,
			id: nextId("copy"),
			children: node.children ? node.children.map(cloneNode) : undefined
		};
	}

	const paste = () => {
		if (!clipboard) {
			logEvent("Clipboard is empty");
			return;
		}
		if (clipboard.mode === "COPY") {
			const copies = clipboard.ids
				.map((id) => findNode(tree, id))
				.filter((node): node is DemoNode => node !== null)
				.map((node) => ({...cloneNode(node), label: `${node.label} (copy)`}));
			setTree((previous) => insertNodes(previous, currentFolderId, copies));
			setSelectedIds(copies.map((node) => node.id));
			logEvent(`Pasted ${copies.length} copied item(s)`);
			return;
		}
		moveNodes(clipboard.ids, currentFolderId, "Pasted");
		setClipboard(null);
	}

	/** Shared by paste-after-cut and drag-and-drop onto a folder row. */
	const moveNodes = (ids: Array<string>, targetFolderId: string | null, verb: string) => {
		const movable = ids.filter((id) => {
			const node = findNode(tree, id);
			// A folder cannot be moved into itself or into one of its own descendants.
			return node !== null && (targetFolderId === null || !collectIds(node).includes(targetFolderId));
		});
		if (movable.length === 0) {
			logEvent("Those items cannot be moved there");
			return;
		}
		const removed: Array<DemoNode> = [];
		const withoutMoved = removeNodes(tree, movable, removed);
		setTree(insertNodes(withoutMoved, targetFolderId, removed));
		setSelectedIds(removed.map((node) => node.id));
		const target = targetFolderId === null ? "Home" : findNode(tree, targetFolderId)?.label ?? "folder";
		logEvent(`${verb} ${removed.length} item(s) into "${target}"`);
	}

	const rowDropped = (item: IFileSystemItem) => {
		if (!movingRef.current) {
			return;
		}
		movingRef.current = false;
		if (item.type !== IFileSystemType.FOLDER || selectedIds.includes(item.id!)) {
			return;
		}
		moveNodes(selectedIds, item.id!, "Moved");
	}

	const parentDirectoryDropped = () => {
		if (!movingRef.current) {
			return;
		}
		movingRef.current = false;
		moveNodes(selectedIds, path.length > 1 ? path[path.length - 2].id : null, "Moved");
	}

	// ---------------------------------------------------------------- uploads

	/** Walks the new rows from 0 to 100 percent so the inline progress bar has something to show. */
	const runUploadProgress = (nodes: Array<DemoNode>) => {
		let progress = 0;
		const timer = window.setInterval(() => {
			progress += 20;
			const complete = progress >= 100;
			setTree((previous) => nodes.reduce((updated, node) => updateNode(updated, node.id, (current) => ({
				...current,
				progress: complete ? undefined : progress,
				description: complete ? "Uploaded just now" : `Uploading… ${progress}%`
			})), previous));
			if (complete) {
				window.clearInterval(timer);
				uploadTimersRef.current = uploadTimersRef.current.filter((id) => id !== timer);
				logEvent(`Uploaded ${nodes.length} file(s)`);
			}
		}, 250);
		uploadTimersRef.current.push(timer);
	}

	const addFiles = (files: Array<{name: string, size: number, lastModified: number}>) => {
		const newNodes = files.map((uploaded) => ({
			...file(nextId("upload"), uploaded.name, uploaded.size, new Date(uploaded.lastModified), "Uploading… 0%"),
			progress: 0
		}));
		setTree((previous) => insertNodes(previous, currentFolderId, newNodes));
		setSelectedIds(newNodes.map((node) => node.id));
		logEvent(`Dropped ${newNodes.length} file(s) into "${currentFolderId === null ? "Home" : path[path.length - 1].label}"`);
		runUploadProgress(newNodes);
	}

	const filesDropped = (files: FileList) => {
		addFiles(Array.from(files).map((dropped) => ({
			name: dropped.name,
			size: dropped.size,
			lastModified: dropped.lastModified
		})));
	}

	const simulateUpload = () => {
		const samples = [
			{name: "quarterly-report.pdf", size: 1_820_000},
			{name: "screenshot.png", size: 740_000},
			{name: "dataset.json", size: 92_000},
		];
		const sample = samples[idCounterRef.current % samples.length];
		addFiles([{...sample, lastModified: new Date().getTime()}]);
	}

	// ---------------------------------------------------------------- context menu

	const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Actions", value: ""},
		{type: IContextMenuType.CONTENT, label: "Open", icon: "ri-folder-open-line", value: "OPEN"},
		{type: IContextMenuType.CONTENT, label: "Rename", icon: "ri-edit-line", value: "RENAME"},
		{type: IContextMenuType.SEPARATOR, label: "", value: ""},
		{type: IContextMenuType.CONTENT, label: "Copy", icon: "ri-file-copy-line", value: "COPY"},
		{type: IContextMenuType.CONTENT, label: "Cut", icon: "ri-scissors-line", value: "CUT"},
		{type: IContextMenuType.CONTENT, label: "Paste", icon: "ri-clipboard-line", value: "PASTE"},
		{type: IContextMenuType.SEPARATOR, label: "", value: ""},
		{
			type: IContextMenuType.GROUP,
			label: "Sort by",
			icon: "ri-sort-asc",
			value: "SORT",
			children: [
				{type: IContextMenuType.CONTENT, label: "Name", icon: "ri-sort-alphabet-asc", value: IFileSystemOrderBy.NAME_ASC},
				{type: IContextMenuType.CONTENT, label: "Date modified", icon: "ri-calendar-line", value: IFileSystemOrderBy.LAST_MOD_DESC},
				{type: IContextMenuType.CONTENT, label: "Size", icon: "ri-scales-3-line", value: IFileSystemOrderBy.FILE_SIZE_DESC},
				{type: IContextMenuType.CONTENT, label: "Type", icon: "ri-file-list-line", value: IFileSystemOrderBy.FILE_TYPE_ASC},
			]
		},
		{type: IContextMenuType.SEPARATOR, label: "", value: ""},
		{type: IContextMenuType.CONTENT, label: "New folder", icon: "ri-folder-add-line", value: "NEW_FOLDER"},
		{type: IContextMenuType.CONTENT, label: "Delete", icon: "ri-delete-bin-line", value: "DELETE"},
	];

	const contextMenuItemClicked = (menuItem: IContextMenuItem, node: DemoNode) => {
		switch (menuItem.value) {
			case "OPEN":
				node.type === IFileSystemType.FOLDER ? openFolder(node) : logEvent(`Opened file "${node.label}"`);
				return;
			case "RENAME":
				setRenameId(node.id);
				return;
			case "COPY":
				copySelected();
				return;
			case "CUT":
				cutSelected();
				return;
			case "PASTE":
				paste();
				return;
			case "NEW_FOLDER":
				createFolder();
				return;
			case "DELETE":
				deleteSelected();
				return;
			default:
				if (typeof menuItem.value === "string" && menuItem.value in IFileSystemOrderBy) {
					setOrderBy(menuItem.value as IFileSystemOrderBy);
					logEvent(`Sorted by ${menuItem.value}`);
				}
		}
	}

	// ---------------------------------------------------------------- render

	const breadcrumbs: Array<BreadCrumb> = [
		{type: "reference", reference: "root", label: "Home"},
		...path.map((entry) => ({type: "reference" as const, reference: entry.id, label: entry.label}))
	];

	const orderByLabel = orderBy === IFileSystemOrderBy.UNSELECTED ? "Unsorted" : orderBy.replace("_", " ").toLowerCase();

	return (
		<HorizontalSplitPage uuid="file-system-development">
			<SplitPageMajor>
				<ComponentDoc
					title="File System"
					description="A file browser: rows of folders and files with selection, drag and drop, cut and paste, inline renaming and sortable columns. It holds no data of its own — the rows are its children, and every gesture is reported for the application to act on."
					name="FileSystem"
					previewHeight={320}
					previewCentered={false}
					imports={["FileSystemRow", "IFileSystemItem", "IFileSystemType", "IFileSystemOrderBy"]}
					interfaces={[FILE_SYSTEM_ITEM_INTERFACE, FILE_SYSTEM_ROW_INTERFACE]}
					props={FILE_SYSTEM_PROPS}
					snippetChildren={() => "{items.map(item => (\n\t<FileSystemRow key={item.reference} item={item} onClick={select}></FileSystemRow>\n))}"}
					preview={values => (
						<div style={{width: "100%"}}>
							<FileSystem
								showHeader={values.showHeader}
								showFileSize={values.showFileSize}
								showFileType={values.showFileType}
								showLastModified={values.showLastModified}
								orderBy={values.orderBy}
								showParentDirectory={values.showParentDirectory}
								parentDirectoryLabel={values.parentDirectoryLabel}>
								{DEMO_FILE_SYSTEM_ITEMS.map(item => (
									<FileSystemRow key={item.reference} item={item}></FileSystemRow>
								))}
							</FileSystem>
						</div>
					)}>

					<div className="file-system-demo-toolbar">
						<div className="file-system-demo-toolbar-row">
							<Button
								text="Up"
								icon="ri-arrow-up-line"
								size={ButtonSize.SMALL}
								buttonType={ButtonType.SECONDARY}
								isDisabled={path.length === 0}
								onClick={navigateUp}></Button>
							<Breadcrumbs items={breadcrumbs} onClick={navigateToCrumb}></Breadcrumbs>
						</div>
						<div className="file-system-demo-toolbar-row">
							<Button text="New folder" icon="ri-folder-add-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.PRIMARY} onClick={createFolder}></Button>
							<Button text="Rename" icon="ri-edit-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.SECONDARY} isDisabled={selectedIds.length !== 1}
									onClick={startRename}></Button>
							<Button text="Copy" icon="ri-file-copy-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.SECONDARY} isDisabled={selectedIds.length === 0}
									onClick={copySelected}></Button>
							<Button text="Cut" icon="ri-scissors-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.SECONDARY} isDisabled={selectedIds.length === 0}
									onClick={cutSelected}></Button>
							<Button text="Paste" icon="ri-clipboard-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.SECONDARY} isDisabled={clipboard === null}
									onClick={paste}></Button>
							<Button text="Delete" icon="ri-delete-bin-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.DANGER} isDisabled={selectedIds.length === 0}
									onClick={deleteSelected}></Button>
							<Button text="Simulate upload" icon="ri-upload-cloud-line" size={ButtonSize.SMALL}
									buttonType={ButtonType.CLEAR} onClick={simulateUpload}></Button>
							<Button text="Select all" size={ButtonSize.SMALL} buttonType={ButtonType.CLEAR}
									onClick={selectAll}></Button>
							<Button text="Clear" size={ButtonSize.SMALL} buttonType={ButtonType.CLEAR}
									onClick={clearSelection}></Button>
							<Button text="Reset" size={ButtonSize.SMALL} buttonType={ButtonType.CLEAR} onClick={() => {
								setTree(SEED_TREE);
								setPath([]);
								setExpandedIds([]);
								setClipboard(null);
								clearSelection();
								logEvent("Reset the demo tree");
							}}></Button>
						</div>
						<div className="file-system-demo-toolbar-row file-system-demo-toggles">
							<div className="file-system-demo-toggle">
								<Checkbox checked={showHeader} onCheckboxChange={setShowHeader}></Checkbox><span>Header row</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={showLastModified} onCheckboxChange={setShowLastModified}></Checkbox><span>Date modified</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={showFileSize} onCheckboxChange={setShowFileSize}></Checkbox><span>Size</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={showFileType} onCheckboxChange={setShowFileType}></Checkbox><span>Type</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={foldersFirst} onCheckboxChange={setFoldersFirst}></Checkbox><span>Folders first</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={openFoldersInNewView} onCheckboxChange={setOpenFoldersInNewView}></Checkbox>
								<span>Double click opens folder as new view</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={showParentDirectory} onCheckboxChange={setShowParentDirectory}></Checkbox>
								<span>Parent directory row</span>
							</div>
							<div className="file-system-demo-toggle">
								<Checkbox checked={parentDirectoryDots} onCheckboxChange={setParentDirectoryDots}></Checkbox>
								<span>Label it "..." instead of ".."</span>
							</div>
						</div>
					</div>

					<FileSystem
						showHeader={showHeader}
						showFileSize={showFileSize}
						showFileType={showFileType}
						showLastModified={showLastModified}
						orderBy={orderBy}
						orderByEvent={(newOrderBy) => {
							setOrderBy(newOrderBy);
							logEvent(`Sorted by ${newOrderBy}`);
						}}
						showParentDirectory={showParentDirectory && path.length > 0}
						parentDirectoryLabel={parentDirectoryDots ? "..." : ".."}
						parentDirectoryEvent={navigateUp}
						parentDirectoryDropEvent={parentDirectoryDropped}
						copyEvent={copySelected}
						cutEvent={cutSelected}
						pasteEvent={paste}
						movingEvent={(state) => movingRef.current = state}
						dropEvent={filesDropped}
						onClick={(item) => logEvent(`Clicked "${item.label}"`)}
						onRightClick={(items) => logEvent(`Right clicked ${items.length} item(s)`)}
						onDblClick={rowDoubleClicked}>

						{visibleRows.map((row) => {
							const item = toFileSystemItem(row);
							return (
								<FileSystemRow
									key={row.node.id}
									item={item}
									indent={row.indent}
									style={item.cut ? {opacity: 0.45} : {}}
									contextMenuItems={contextMenuItems}
									contextMenuItemClicked={(menuItem) => contextMenuItemClicked(menuItem, row.node)}
									onClick={rowClicked}
									onDropdownClick={toggleExpanded}
									onRenameComplete={renameComplete}
									onDrop={() => rowDropped(item)}></FileSystemRow>
							);
						})}
					</FileSystem>

					{visibleRows.length === 0 &&
						<div className="file-system-demo-empty">This folder is empty — drop files onto it or create a
							folder.</div>
					}

					<div className="file-system-demo-status">
						<span>{visibleRows.length} item(s)</span>
						<span>{selectedIds.length} selected</span>
						<span>Sort: {orderByLabel}</span>
						<span>Clipboard: {clipboard ? `${clipboard.ids.length} ${clipboard.mode.toLowerCase()}` : "empty"}</span>
					</div>

					<GeneralHeading>Try it</GeneralHeading>
					<ul className="file-system-demo-hints">
						<li>Click a column header to sort, click again to reverse.</li>
						<li>Click the chevron to expand a folder inline, double click it to open it as the new view.</li>
						<li>Click, ctrl/cmd + click and shift + click to build a selection.</li>
						<li>Drag a selection onto a folder row (or the ".." row) to move it.</li>
						<li>Drag files from your desktop onto the table to upload them.</li>
						<li>Right click a row for the context menu, ctrl/cmd + c / x / v for the clipboard.</li>
					</ul>
				</ComponentDoc>
			</SplitPageMajor>
			<SplitPageMinor>
				<div className="workspace-output-window">
					<div style={{marginBottom: "20px"}}>Events:</div>
					<div className="file-system-demo-log">
						{log.length === 0 && <div className="file-system-demo-log-empty">No events yet</div>}
						{log.map((entry, index) => (
							<div key={index} className="file-system-demo-log-entry">{entry}</div>
						))}
					</div>
				</div>
			</SplitPageMinor>
		</HorizontalSplitPage>
	)
}
