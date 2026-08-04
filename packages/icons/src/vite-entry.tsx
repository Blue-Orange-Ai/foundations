// Class name helpers
export * as Classes from './common/classes';
export { Intent, type IntentProps } from './common/intent';
export { isFoundationsIconElement } from './common/utils';

// Types
export { ICON_VIEWBOX_SIZE, IconSize, type IconPaths, type MaybeElement } from './icons/iconTypes';
export type {
    DefaultSVGIconAttributes,
    DefaultSVGIconProps,
    SVGIconAttributes,
    SVGIconComponent,
    SVGIconOwnProps,
    SVGIconProps,
} from './icons/svgIconProps';

// Icon set
export { IconNames, IconNamesSet, isIconName, type IconName } from './generated/iconNames';
export { IconSvgPaths } from './generated/iconPaths';
export { IconCategories, IconCategoryNames, type IconCategory } from './generated/iconCategories';
export { getIconPaths } from './icons/getIconPaths';

// Components
export {
    SVGIconContainer,
    type SVGIconContainerComponent,
    type SVGIconContainerProps,
} from './components/svg-icon-container/SVGIconContainer';
export {
    Icon,
    type DefaultIconProps,
    type IconComponent,
    type IconOwnProps,
    type IconProps,
} from './components/icon/Icon';

// One statically defined component per icon, e.g. <AddLine />
export * from './generated/components';
