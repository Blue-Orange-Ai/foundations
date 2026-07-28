import React, {RefObject, useContext, useEffect} from "react";
import tippy from "tippy.js";

// The sidebar creates these tooltips itself rather than the consumer opting in
// to a tooltip component, so it has to bring the styling with it.
import 'tippy.js/dist/tippy.css';

export interface SideBarContextValue {
	/**
	 * Whether the surrounding {@link SideBar} is collapsed to its icon-only
	 * width. Items are styled for the collapsed state through the
	 * `.blue-orange-sidebar-closed` ancestor class; anything that needs the
	 * state in JavaScript — the icon tooltips, the group expansion — reads it
	 * from here.
	 */
	collapsed: boolean;

	/**
	 * Whether groups force themselves open while the sidebar is collapsed, so
	 * that every item's icon stays reachable rather than being hidden behind a
	 * group header that the collapsed sidebar does not render.
	 */
	expandGroupsOnCollapse: boolean;
}

/**
 * State of the surrounding {@link SideBar}.
 *
 * Defaults to an expanded sidebar so items and groups can be rendered
 * standalone without a provider.
 */
export const SideBarContext = React.createContext<SideBarContextValue>({
	collapsed: false,
	expandGroupsOnCollapse: true
});

/**
 * Access the surrounding {@link SideBar}.
 */
export const useSideBar = (): SideBarContextValue => {
	return useContext(SideBarContext);
};

/**
 * Show an item's label as a tooltip while the sidebar is collapsed.
 *
 * Collapsed items render nothing but their icon, so the label is the only way
 * to tell them apart. The tooltip is created on the item itself rather than
 * around it so the flex layout of the row is untouched, and is torn down again
 * as soon as the sidebar reopens.
 */
export const useSideBarCollapsedTooltip = (
	ref: RefObject<HTMLElement | null>,
	label: string) => {

	const {collapsed} = useSideBar();

	useEffect(() => {
		const current = ref.current;

		if (!collapsed || !current || !label) {
			return;
		}

		const instance = tippy(current, {
			content: label,
			placement: "right",
			zIndex: 999999999999999
		});

		return () => {
			instance.destroy();
		};
	}, [collapsed, label, ref]);
};
