import React, {useContext} from "react";

/**
 * Where a step is up to. Status is shown with colour and motion, so say it in
 * the title too: "Running pnpm build", "Failed to run pnpm lint".
 */
export enum TraceStatus {
	/** Work that is done: "Ran pnpm install". */
	DONE = "DONE",
	/** Work in progress. The title shimmers while it runs. */
	RUNNING = "RUNNING",
	/** Work that failed. The line takes the error colour. */
	ERROR = "ERROR",
	/** Work that has not started, such as a plan step. The line is dimmed. */
	PENDING = "PENDING"
}

export interface TraceCollapsibleContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	/** Ties the trigger's aria-controls to the panel it opens. */
	contentId: string;
	triggerId: string;
}

/**
 * Handed from a TraceCollapsible to its trigger and content. Kept in its own
 * module so the parts do not have to import the component that owns them.
 */
export const TraceCollapsibleContext = React.createContext<TraceCollapsibleContextValue | null>(null);

export const useTraceCollapsible = (): TraceCollapsibleContextValue | null => {
	return useContext(TraceCollapsibleContext);
}
