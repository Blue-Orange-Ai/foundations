import React, {useContext} from "react";

export enum TimelineOrientation {
	VERTICAL = "VERTICAL",
	HORIZONTAL = "HORIZONTAL"
}

export enum TimelineAlign {
	/** Every item sits on the same side of the rail. */
	START = "START",
	/** Items alternate either side of a centred rail (vertical only). */
	ALTERNATE = "ALTERNATE"
}

/** Colours the marker of an item, and picks its fallback icon. */
export enum TimelineItemState {
	DEFAULT = "DEFAULT",
	ACTIVE = "ACTIVE",
	SUCCESS = "SUCCESS",
	WARNING = "WARNING",
	ERROR = "ERROR",
	LOADING = "LOADING"
}

export interface TimelineContextValue {
	orientation: TimelineOrientation;
	align: TimelineAlign;
	/** Position of the item in the timeline, counted from 0. */
	index: number;
	/** The last item drops its connector so the rail stops at the final marker. */
	last: boolean;
}

/**
 * Handed to each item by the Timeline. Kept in its own module so the items do
 * not have to import the component that lays them out.
 */
export const TimelineContext = React.createContext<TimelineContextValue | null>(null);

export const useTimeline = (): TimelineContextValue | null => {
	return useContext(TimelineContext);
}
