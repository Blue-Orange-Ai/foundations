import React, {createContext, useContext, useMemo} from "react";

import {CommentsStore, defaultCommentsStore} from "./CommentsStore";

/**
 * Presentation options shared by every comment component below the provider.
 *
 * `showAvatar` is off by default: comments are most often shown in a narrow
 * panel next to a document, where the author's picture costs more room than it
 * earns. Hosts that want the picture back opt in — per provider, or per
 * component with the matching prop.
 *
 * `dark` puts the comment tree in dark mode on its own, without the host
 * having to carry a `dark` class down from its root. It is additive: comments
 * inside an already-dark app stay dark whether or not it is set.
 */
export interface CommentsOptions {
	showAvatar: boolean,
	dark: boolean,
}

export interface CommentsContextValue extends CommentsOptions {
	store: CommentsStore,
}

const DEFAULT_CONTEXT: CommentsContextValue = {
	store: defaultCommentsStore,
	showAvatar: false,
	dark: false,
};

export const CommentsContext = createContext<CommentsContextValue>(DEFAULT_CONTEXT);

export interface BlueOrangeCommentsProviderProps {
	children: React.ReactNode,
	/** Where comments are read from and written to. Defaults to the comments service. */
	store?: CommentsStore,
	showAvatar?: boolean,
	dark?: boolean,
}

export const BlueOrangeCommentsProvider: React.FC<BlueOrangeCommentsProviderProps> = ({
																						  children,
																						  store,
																						  showAvatar,
																						  dark,
																					  }) => {

	const parent = useContext(CommentsContext);

	const value = useMemo<CommentsContextValue>(() => ({
		store: store ?? parent.store,
		showAvatar: showAvatar ?? parent.showAvatar,
		dark: dark ?? parent.dark,
	}), [store, showAvatar, dark, parent]);

	return (
		<CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>
	)
}

/**
 * Resolves the store and display options for one comment component: its own
 * props win, then the nearest provider, then the defaults.
 */
export const useComments = (overrides?: {
	store?: CommentsStore,
	showAvatar?: boolean,
	dark?: boolean,
}): CommentsContextValue => {

	const context = useContext(CommentsContext);

	const store = overrides?.store;
	const showAvatar = overrides?.showAvatar;
	const dark = overrides?.dark;

	return useMemo<CommentsContextValue>(() => ({
		store: store ?? context.store,
		showAvatar: showAvatar ?? context.showAvatar,
		dark: dark ?? context.dark,
	}), [store, showAvatar, dark, context]);
}

/**
 * Class names every comment component puts on its root element, so the avatar
 * override and dark mode apply to anything nested inside it.
 */
export const commentsRootClassNames = (base: string, options: CommentsOptions): string => {
	let className = base;
	if (!options.showAvatar) {
		className += " blue-orange-comments-hide-avatar";
	}
	if (options.dark) {
		className += " dark blue-orange-comments-dark";
	}
	return className;
}
