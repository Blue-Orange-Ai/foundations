/** The semantic colour an icon can be rendered in. */
export const Intent = {
    NONE: "none",
    PRIMARY: "primary",
    SUCCESS: "success",
    WARNING: "warning",
    DANGER: "danger",
} as const;

/** The semantic colour an icon can be rendered in. */
export type Intent = (typeof Intent)[keyof typeof Intent];

export interface IntentProps {
    /** Visual intent colour to apply to the element. */
    intent?: Intent;
}
