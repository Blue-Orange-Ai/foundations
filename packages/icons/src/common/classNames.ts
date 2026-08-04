type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Joins truthy class names with a space. A local stand-in for the `classnames`
 * package so that this package ships with no runtime dependencies.
 */
export function classNames(...values: ClassValue[]): string | undefined {
    const classes: string[] = [];

    for (const value of values) {
        if (value == null || value === false || value === "") {
            continue;
        }
        if (Array.isArray(value)) {
            const nested = classNames(...value);
            if (nested !== undefined) {
                classes.push(nested);
            }
        } else {
            classes.push(String(value));
        }
    }

    return classes.length > 0 ? classes.join(" ") : undefined;
}
