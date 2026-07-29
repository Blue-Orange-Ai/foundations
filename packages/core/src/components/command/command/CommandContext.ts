import React, {useContext} from "react";

export interface CommandItemRegistration {
	id: string;
	/** The text the item is filtered on. */
	value: string;
	visible: boolean;
	disabled: boolean;
	select: () => void;
}

export interface CommandContextValue {
	search: string;
	setSearch: (search: string) => void;
	/** Whether an item with this text survives the current search. */
	matches: (value: string) => boolean;
	registerItem: (registration: CommandItemRegistration) => void;
	unregisterItem: (id: string) => void;
	/** The item the keyboard is currently on. */
	activeId: string | null;
	setActiveId: (id: string | null) => void;
	/** Moves the highlight by `delta` items, skipping filtered out and disabled ones. */
	moveActive: (delta: number) => void;
	/** Runs the highlighted item's onSelect. */
	selectActive: () => void;
	visibleCount: number;
}

export const CommandContext = React.createContext<CommandContextValue | null>(null);

export const useCommand = (): CommandContextValue | null => {
	return useContext(CommandContext);
}

export interface CommandGroupContextValue {
	/** Items tell their group whether they survived the search so it can hide itself. */
	registerItemVisibility: (id: string, visible: boolean) => void;
	unregisterItem: (id: string) => void;
}

export const CommandGroupContext = React.createContext<CommandGroupContextValue | null>(null);

export const useCommandGroup = (): CommandGroupContextValue | null => {
	return useContext(CommandGroupContext);
}

/**
 * Falls back to the rendered text of an item when no explicit `value` was
 * given, so plain text items are searchable without any extra wiring.
 */
export const commandTextFromChildren = (node: React.ReactNode): string => {
	if (node === null || node === undefined || typeof node === "boolean") {
		return "";
	}
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}
	if (Array.isArray(node)) {
		return node.map(commandTextFromChildren).join(" ");
	}
	if (React.isValidElement(node)) {
		return commandTextFromChildren((node.props as {children?: React.ReactNode}).children);
	}
	return "";
}
