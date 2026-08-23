/*
 * Local copy of the map marker design constants.
 *
 * The shapes, dimensions and positioning tables mirror the ones published in
 * Uber's Base Web map-marker package (MIT licensed) so that the markers keep
 * the proportions the design was drawn against. Everything styletron specific
 * has been dropped — colours come from CSS variables and the sizes below are
 * applied as inline dimensions.
 */

export const NEEDLE_SIZES = {
	none: 'none',
	short: 'short',
	medium: 'medium',
	tall: 'tall'
} as const;

export const NEEDLE_HEIGHTS = {
	none: 0,
	short: 4,
	medium: 12,
	tall: 20
} as const;

export const NEEDLE_WIDTH = 4;

// Keep this sorted smallest to largest: the label size steps down one entry in
// this order when a pin head renders a secondary label.
export const PINHEAD_SIZES_SHAPES = {
	xxSmallCircle: 'xx-small-circle',
	xxSmallSquare: 'xx-small-square',
	xSmallCircle: 'x-small-circle',
	xSmallSquare: 'x-small-square',
	small: 'small',
	medium: 'medium',
	large: 'large'
} as const;

export const PINHEAD_DIMENSIONS = {
	'xx-small-circle': {height: 8, icon: 4},
	'xx-small-square': {height: 8, icon: 4},
	'x-small-circle': {height: 16, icon: 4},
	'x-small-square': {height: 16, icon: 4},
	'small': {height: 24, icon: 16},
	'medium': {height: 36, icon: 16},
	'large': {height: 48, icon: 24}
} as const;

export const PINHEAD_TYPES = {
	floating: 'floating',
	fixed: 'fixed'
} as const;

export const MAP_MARKER_KINDS = {
	default: 'default',
	accent: 'accent',
	negative: 'negative',
	surface: 'surface'
} as const;

export const FLOATING_MARKER_ANCHOR_POSITIONS = {
	none: 'none',
	topLeft: 'top-left',
	topRight: 'top-right',
	bottomRight: 'bottom-right',
	bottomLeft: 'bottom-left'
} as const;

export const FLOATING_MARKER_ANCHOR_TYPES = {
	circle: 'circle',
	square: 'square',
	xxSmallCircle: 'xx-small-circle',
	xxSmallSquare: 'xx-small-square'
} as const;

export const DRAG_SHADOW_HEIGHT = 4;
export const DRAG_SHADOW_MARGIN_TOP = 6;
export const DRAG_SHADOW_WIDTH = 6;

export const LABEL_SIZES = {
	'xx-small-circle': 'small',
	'xx-small-square': 'small',
	'x-small-circle': 'small',
	'x-small-square': 'small',
	'small': 'small',
	'medium': 'medium',
	'large': 'large'
} as const;

export const LABEL_ENHANCER_POSITIONS = {
	none: 'none',
	top: 'top',
	left: 'left',
	right: 'right',
	bottom: 'bottom'
} as const;

export const BADGE_ENHANCER_SIZES = {
	none: 'none',
	xSmall: 'x-small',
	small: 'small',
	mediumText: 'medium-text',
	mediumIcon: 'medium-icon'
} as const;

const X_SMALL_PINHEAD_BADGE_POSITIONS = {
	'none': null,
	'x-small': {x: -5, y: -3},
	'small': null,
	'medium-text': null,
	'medium-icon': null
};

/**
 * Where a badge sits relative to its pin head. A null entry means the badge
 * size cannot be rendered against that pin head size.
 */
export const BADGE_ENHANCER_POSITIONS: {
	[pinHead: string]: {[badge: string]: {x: number, y: number} | null} | null
} = {
	'xx-small-square': null,
	'xx-small-circle': null,
	'x-small-square': X_SMALL_PINHEAD_BADGE_POSITIONS,
	'x-small-circle': X_SMALL_PINHEAD_BADGE_POSITIONS,
	'small': {
		'none': null,
		'x-small': {x: -7, y: -1},
		'small': {x: -8, y: -8},
		'medium-text': null,
		'medium-icon': null
	},
	'medium': {
		'none': null,
		'x-small': {x: -9, y: 1},
		'small': {x: -10, y: -4},
		'medium-text': {x: -12, y: -8},
		'medium-icon': {x: -12, y: -8}
	},
	'large': {
		'none': null,
		'x-small': {x: -11, y: 3},
		'small': null,
		'medium-text': {x: -14, y: -6},
		'medium-icon': {x: -14, y: -6}
	}
};

export const BADGE_ENHANCER_CONTENT_SIZE = {
	'none': 0,
	'x-small': 0,
	'small': 10,
	'medium-text': 12,
	'medium-icon': 12
} as const;

export const LOCATION_PUCK_SIZES = {
	small: 'small',
	medium: 'medium',
	large: 'large'
} as const;

export const LOCATION_PUCK_TYPES = {
	consumer: 'consumer',
	earner: 'earner'
} as const;

export const EARNER_LOCATION_PUCK_CORE_SCALES = {
	small: 0.5,
	medium: 0.75,
	large: 1
} as const;

export const FLOATING_ROUTE_MARKER_ANCHOR_POSITIONS = {
	topLeft: 'top-left',
	topCenter: 'top-center',
	topRight: 'top-right',
	rightCenter: 'right-center',
	bottomRight: 'bottom-right',
	bottomCenter: 'bottom-center',
	bottomLeft: 'bottom-left',
	leftCenter: 'left-center'
} as const;

export const FLOATING_ROUTE_MARKER_POINTER_TYPES = {
	diagonal: 'diagonal',
	horizontal: 'horizontal',
	vertical: 'vertical'
} as const;

export const FLOATING_ROUTE_MARKER_POINTERS = {
	'top-left': {type: 'diagonal', path: 'M0 0L24 8L8 24L0 0Z'},
	'top-right': {type: 'diagonal', path: 'M24 0L0 8L16 24L24 0Z'},
	'top-center': {type: 'vertical', path: 'M8.49928 0L0.499411 8L16.5006 8L8.49928 0Z'},
	'bottom-left': {type: 'diagonal', path: 'M0 24L24 16L8 0L0 24Z'},
	'bottom-right': {type: 'diagonal', path: 'M24 24L0 16L16 0L24 24Z'},
	'bottom-center': {type: 'vertical', path: 'M8.00133 8L16.0012 0H0L8.00133 8Z'},
	'left-center': {type: 'horizontal', path: 'M0.000610352 8.00059L8.00061 16.0005L8.00061 -0.000732422L0.000610352 8.00059Z'},
	'right-center': {type: 'horizontal', path: 'M8.00061 7.99916L0.000610352 -0.000711441L0.000610352 16.0005L8.00061 7.99916Z'}
} as const;

export const FLOATING_ROUTE_MARKER_POINTER_SIZES = {
	diagonal: {height: 24, width: 24, viewBox: '0 0 24 24'},
	vertical: {height: 8, width: 17, viewBox: '0 0 17 8'},
	horizontal: {height: 16, width: 8, viewBox: '0 0 8 16'}
} as const;

export const FLOATING_ROUTE_MARKER_POINTER_OFFSET = 8;

export const MAP_MARKER_ANCHOR_MODES = {
	bottomCenter: 'bottom-center',
	center: 'center',
	topLeft: 'top-left',
	topCenter: 'top-center',
	topRight: 'top-right',
	rightCenter: 'right-center',
	bottomRight: 'bottom-right',
	bottomLeft: 'bottom-left',
	leftCenter: 'left-center'
} as const;
