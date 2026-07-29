import React, {useContext} from "react";

export interface InputOTPContextValue {
	/** One entry per slot, blank where nothing has been typed yet. */
	chars: string[];
	/** The slot the caret currently sits on, or -1 when the input is not focused. */
	activeIndex: number;
	disabled: boolean;
	isError: boolean;
	/** Moves the caret to a slot and focuses the underlying input. */
	focusSlot: (index: number) => void;
}

/**
 * Shares the state of an InputOTP with its slots. Kept in its own module so the
 * slots do not have to import the component that renders them.
 */
export const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

export const useInputOTP = (): InputOTPContextValue | null => {
	return useContext(InputOTPContext);
}
