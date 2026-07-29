import React from "react";

import './CommandDialog.css'
import {Modal} from "../../layouts/modal/modal/Modal";
import {Command} from "../command/Command";

interface Props {
	children: React.ReactNode;
	open?: boolean;
	onClose?: () => void;
	width?: number;
	search?: string;
	onSearchChange?: (search: string) => void;
	shouldFilter?: boolean;
	filter?: (value: string, search: string) => boolean;
}

/**
 * A command palette in a modal — the ⌘K pattern. Everything passed as children
 * (a CommandInput and a CommandList) sits inside the Command.
 */
export const CommandDialog: React.FC<Props> = ({
												   children,
												   open = false,
												   onClose,
												   width = 520,
												   search,
												   onSearchChange,
												   shouldFilter = true,
												   filter}) => {

	return (
		<Modal open={open} width={width} minWidth={280} onClose={onClose}>
			<div className="blue-orange-command-dialog">
				<Command
					search={search}
					onSearchChange={onSearchChange}
					shouldFilter={shouldFilter}
					filter={filter}>
					{children}
				</Command>
			</div>
		</Modal>
	)
}
