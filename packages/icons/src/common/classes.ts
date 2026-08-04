import { Intent } from "./intent";

/** Class name prefix shared with the rest of the foundations packages. */
export const NAMESPACE = "foundations";

export const ICON = `${NAMESPACE}-icon`;
export const ICON_STANDARD = `${NAMESPACE}-icon-standard`;
export const ICON_LARGE = `${NAMESPACE}-icon-large`;

export const INTENT_PRIMARY = `${NAMESPACE}-intent-primary`;
export const INTENT_SUCCESS = `${NAMESPACE}-intent-success`;
export const INTENT_WARNING = `${NAMESPACE}-intent-warning`;
export const INTENT_DANGER = `${NAMESPACE}-intent-danger`;

/** The modifier class for a named icon, e.g. `foundations-icon-add-line`. */
export function iconClass(iconName: string | undefined | null): string | undefined {
    if (iconName == null) {
        return undefined;
    }
    return iconName.startsWith(`${ICON}-`) ? iconName : `${ICON}-${iconName}`;
}

/** The modifier class for an intent, or `undefined` for `Intent.NONE`. */
export function intentClass(intent: Intent | undefined | null): string | undefined {
    switch (intent) {
        case Intent.PRIMARY:
            return INTENT_PRIMARY;
        case Intent.SUCCESS:
            return INTENT_SUCCESS;
        case Intent.WARNING:
            return INTENT_WARNING;
        case Intent.DANGER:
            return INTENT_DANGER;
        default:
            return undefined;
    }
}

/** The modifier class for one of the two standard icon sizes. */
export function iconSizeClass(size: number): string | undefined {
    if (size === 16) {
        return ICON_STANDARD;
    }
    return size === 20 ? ICON_LARGE : undefined;
}
