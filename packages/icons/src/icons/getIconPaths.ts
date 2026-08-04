import { type IconName, isIconName } from "../generated/iconNames";
import { IconSvgPaths } from "../generated/iconPaths";
import type { IconPaths } from "./iconTypes";

/**
 * Returns the SVG path data for an icon, or `undefined` if no icon goes by
 * that name. Useful when rendering glyphs outside of React.
 */
export function getIconPaths(iconName: IconName | string): IconPaths | undefined {
    return isIconName(iconName) ? IconSvgPaths[iconName] : undefined;
}
