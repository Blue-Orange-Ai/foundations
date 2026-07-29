import React, {useCallback, useEffect, useRef, useState} from "react";

import './Command.css'
import {CommandContext, CommandContextValue, CommandItemRegistration} from "./CommandContext";

interface Props {
	children: React.ReactNode;
	/** Controls the search text from the outside. */
	search?: string;
	onSearchChange?: (search: string) => void;
	/** Turn off to filter the items yourself. */
	shouldFilter?: boolean;
	/** Replaces the default "contains, ignoring case" match. */
	filter?: (value: string, search: string) => boolean;
	/** Wraps the highlight around when it runs off either end of the list. */
	loop?: boolean;
	classes?: string;
	style?: React.CSSProperties;
}

const defaultFilter = (value: string, search: string): boolean => {
	return value.toLowerCase().includes(search.toLowerCase());
}

/**
 * A searchable command palette. Nest a CommandInput and a CommandList holding
 * CommandGroups and CommandItems — filtering and keyboard navigation are
 * handled here.
 */
export const Command: React.FC<Props> = ({
											 children,
											 search,
											 onSearchChange,
											 shouldFilter = true,
											 filter = defaultFilter,
											 loop = true,
											 classes = "",
											 style = {}}) => {

	const [internalSearch, setInternalSearch] = useState(search ?? "");

	const [activeId, setActiveId] = useState<string | null>(null);

	// Items register themselves as they mount, so the map keeps them in the
	// order they appear in the list — which is the order the arrow keys follow.
	const itemsRef = useRef<Map<string, CommandItemRegistration>>(new Map());

	// bumped whenever the registrations change so the palette re-renders
	const [registrationVersion, setRegistrationVersion] = useState(0);

	useEffect(() => {
		if (search !== undefined) {
			setInternalSearch(search);
		}
	}, [search]);

	const updateSearch = (next: string) => {
		setInternalSearch(next);
		if (onSearchChange) {
			onSearchChange(next);
		}
	}

	const matches = (value: string): boolean => {
		if (!shouldFilter || internalSearch.trim().length === 0) {
			return true;
		}
		return filter(value, internalSearch);
	}

	// Stable identities: the items depend on these inside an effect, so a new
	// function on every render would re-register them in a loop. Only a change
	// that affects the list bumps the version.
	const registerItem = useCallback((registration: CommandItemRegistration) => {
		const existing = itemsRef.current.get(registration.id);
		itemsRef.current.set(registration.id, registration);
		const changed = !existing
			|| existing.visible !== registration.visible
			|| existing.disabled !== registration.disabled
			|| existing.value !== registration.value;
		if (changed) {
			setRegistrationVersion(version => version + 1);
		}
	}, []);

	const unregisterItem = useCallback((id: string) => {
		if (itemsRef.current.delete(id)) {
			setRegistrationVersion(version => version + 1);
		}
	}, []);

	const selectableItems = (): CommandItemRegistration[] => {
		return Array.from(itemsRef.current.values()).filter(item => item.visible && !item.disabled);
	}

	const visibleCount = Array.from(itemsRef.current.values()).filter(item => item.visible).length;

	// keep the highlight on something that is actually on screen
	useEffect(() => {
		const selectable = selectableItems();
		if (selectable.length === 0) {
			if (activeId !== null) {
				setActiveId(null);
			}
			return;
		}
		if (activeId === null || !selectable.some(item => item.id === activeId)) {
			setActiveId(selectable[0].id);
		}
	}, [registrationVersion, internalSearch, activeId]);

	const moveActive = (delta: number) => {
		const selectable = selectableItems();
		if (selectable.length === 0) {
			return;
		}
		const currentIndex = selectable.findIndex(item => item.id === activeId);
		var nextIndex = currentIndex + delta;
		if (currentIndex === -1) {
			nextIndex = delta > 0 ? 0 : selectable.length - 1;
		} else if (nextIndex < 0) {
			nextIndex = loop ? selectable.length - 1 : 0;
		} else if (nextIndex > selectable.length - 1) {
			nextIndex = loop ? 0 : selectable.length - 1;
		}
		setActiveId(selectable[nextIndex].id);
	}

	const selectActive = () => {
		if (activeId === null) {
			return;
		}
		const item = itemsRef.current.get(activeId);
		if (item && item.visible && !item.disabled) {
			item.select();
		}
	}

	const contextValue: CommandContextValue = {
		search: internalSearch,
		setSearch: updateSearch,
		matches: matches,
		registerItem: registerItem,
		unregisterItem: unregisterItem,
		activeId: activeId,
		setActiveId: setActiveId,
		moveActive: moveActive,
		selectActive: selectActive,
		visibleCount: visibleCount
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			moveActive(1);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			moveActive(-1);
		} else if (event.key === "Enter") {
			event.preventDefault();
			selectActive();
		}
	}

	return (
		<CommandContext.Provider value={contextValue}>
			<div
				className={"blue-orange-command" + (classes ? " " + classes : "")}
				onKeyDown={handleKeyDown}
				style={style}>
				{children}
			</div>
		</CommandContext.Provider>
	)
}
