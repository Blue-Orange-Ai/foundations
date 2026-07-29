export enum StepperOrientation {
	HORIZONTAL = "HORIZONTAL",
	VERTICAL = "VERTICAL"
}

/** What the circle at the head of a step shows. */
export enum StepperIndicatorVariant {
	/** The position of the step, counted from 1. */
	NUMBER = "NUMBER",
	/** The icon declared on the step. */
	ICON = "ICON",
	/** A small filled dot. */
	DOT = "DOT"
}

export enum StepperSize {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE"
}

/**
 * Where the title and description of a step sit relative to its indicator.
 * Horizontal steppers only — a vertical one always runs its text beside the
 * rail.
 */
export enum StepperTitlePlacement {
	/** Beside the indicator, on the same line. */
	INLINE = "INLINE",
	/** Stacked underneath the indicator and centred on it. */
	BELOW = "BELOW",
	/**
	 * Drops the per step text and names only the active step, above a bare rail
	 * of indicators. Stays narrow however many steps there are, which is what
	 * makes it fit the top of a modal or a drawer.
	 */
	CAPTION = "CAPTION"
}

/**
 * The state of a single step. A step works its own state out from where it sits
 * relative to the active one, so only LOADING and ERROR (and pinning a step to
 * COMPLETED) normally need declaring.
 */
export enum StepperStepState {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	COMPLETED = "COMPLETED",
	LOADING = "LOADING",
	ERROR = "ERROR"
}
