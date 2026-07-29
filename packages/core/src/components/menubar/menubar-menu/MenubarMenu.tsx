import React from "react";

import './MenubarMenu.css'
import {IContextMenuItem} from "../../contextmenu/contextmenu/ContextMenu";

interface Props {
	/** The text shown in the bar. */
	label: string;
	/** Rows of the drop down — the same shape the ContextMenu takes. */
	items: Array<IContextMenuItem>;
	/** A remixicon class shown before the label. */
	icon?: string;
	disabled?: boolean;
	/** Fires when one of this menu's rows is clicked. */
	onClick?: (item: IContextMenuItem) => void;
}

/**
 * Declares one menu of a Menubar. Like Tab it renders nothing itself — Menubar
 * reads its props.
 */
export const MenubarMenu: React.FC<Props> = ({}) => {

	return (
		<></>
	)
}
