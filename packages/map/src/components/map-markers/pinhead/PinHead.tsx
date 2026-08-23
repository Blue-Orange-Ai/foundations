import React from "react";

import "./PinHead.css";
import "../MapMarkerTokens.css";

import {
	LABEL_SIZES,
	NEEDLE_SIZES,
	PINHEAD_DIMENSIONS,
	PINHEAD_SIZES_SHAPES,
	PINHEAD_TYPES
} from "../constants";
import {PinHeadProps, PinHeadSize} from "../types";
import {classNames, hasContent, kindClassName, kindColourStyle, renderEnhancer} from "../utils/MapMarkerUtils";
import {BadgeEnhancer} from "../badgeenhancer/BadgeEnhancer";
import {LabelEnhancer} from "../labelenhancer/LabelEnhancer";

// Smallest to largest. A head that renders a secondary label drops its primary
// label one step down this order to make room for it.
const PINHEAD_SIZE_ORDER: Array<PinHeadSize> = [
	PINHEAD_SIZES_SHAPES.xxSmallCircle,
	PINHEAD_SIZES_SHAPES.xxSmallSquare,
	PINHEAD_SIZES_SHAPES.xSmallCircle,
	PINHEAD_SIZES_SHAPES.xSmallSquare,
	PINHEAD_SIZES_SHAPES.small,
	PINHEAD_SIZES_SHAPES.medium,
	PINHEAD_SIZES_SHAPES.large
];

const labelSizeClassName = (size: PinHeadSize, renderSecondaryLabel: boolean): string => {
	const index = PINHEAD_SIZE_ORDER.indexOf(size);
	const effective = PINHEAD_SIZE_ORDER[renderSecondaryLabel ? Math.max(index - 1, 0) : index];
	return "foundations-map-marker-label-" + LABEL_SIZES[effective];
}

const XX_SMALL_SIZES: Array<PinHeadSize> = [
	PINHEAD_SIZES_SHAPES.xxSmallCircle,
	PINHEAD_SIZES_SHAPES.xxSmallSquare
];

const X_SMALL_SIZES: Array<PinHeadSize> = [
	PINHEAD_SIZES_SHAPES.xSmallCircle,
	PINHEAD_SIZES_SHAPES.xSmallSquare
];

/**
 * The body of a marker — the part that carries the label and the icons. Fixed
 * markers sit it on a needle, floating markers hang it off an anchor dot, and
 * the two smallest sizes are the anchor dots themselves.
 */
export const PinHead: React.FC<PinHeadProps> = (props) => {

	const {
		size = PINHEAD_SIZES_SHAPES.medium,
		label,
		secondaryLabel,
		startEnhancer,
		endEnhancer,
		kind,
		color,
		background,
		type = PINHEAD_TYPES.fixed,
		needle = NEEDLE_SIZES.none,
		labelEnhancerContent,
		labelEnhancerPosition,
		badgeEnhancerSize,
		badgeEnhancerContent,
		className
	} = props;

	const {height, icon} = PINHEAD_DIMENSIONS[size];

	// Only claim the colours when this head was given a kind of its own —
	// otherwise it inherits whatever the marker root resolved.
	const colours = {
		className: kind ? kindClassName(kind) : undefined,
		style: kindColourStyle(color, background)
	};

	const badge = (
		<BadgeEnhancer
			markerType={type}
			pinHeadSize={size}
			badgeEnhancerSize={badgeEnhancerSize}
			badgeEnhancerContent={badgeEnhancerContent} />
	);

	// The two smallest sizes are dots rather than heads: an outer shape in the
	// background colour with an inner shape in the foreground colour.
	if (type === PINHEAD_TYPES.fixed && (XX_SMALL_SIZES.indexOf(size) >= 0 || X_SMALL_SIZES.indexOf(size) >= 0)) {
		const round = size === PINHEAD_SIZES_SHAPES.xxSmallCircle || size === PINHEAD_SIZES_SHAPES.xSmallCircle;
		const anchor = (
			<div
				className={classNames("foundations-pin-head-anchor-outer", "foundations-map-marker-shadow",
					round && "foundations-pin-head-round", colours.className, className)}
				style={{height: height + "px", width: height + "px", ...colours.style}}>
				<div
					className={classNames("foundations-pin-head-anchor-inner", round && "foundations-pin-head-round")}
					style={{height: icon + "px", width: icon + "px"}} />
			</div>
		);
		// The xx-small sizes carry no badge, so they need no relative container.
		if (XX_SMALL_SIZES.indexOf(size) >= 0) {
			return anchor;
		}
		return (
			<div className="foundations-pin-head-container">
				{badge}
				{anchor}
			</div>
		)
	}

	const activeSlots = [label, startEnhancer, endEnhancer].filter((slot) => hasContent(slot));
	const forceCircle = activeSlots.length === 1 && !hasContent(label);
	const renderSecondaryLabel = (size === PINHEAD_SIZES_SHAPES.large || size === PINHEAD_SIZES_SHAPES.medium)
		&& hasContent(secondaryLabel);
	const labelClassName = labelSizeClassName(size, renderSecondaryLabel);

	const enhancerSlot = (enhancer: PinHeadProps["startEnhancer"]) => (
		<div
			className="foundations-map-marker-enhancer-slot"
			style={{height: height + "px", lineHeight: height + "px", fontSize: icon + "px"}}>
			{renderEnhancer(enhancer, icon)}
		</div>
	);

	return (
		<div className={classNames("foundations-pin-head-container", colours.className)} style={colours.style}>
			<LabelEnhancer
				labelEnhancerContent={labelEnhancerContent}
				labelEnhancerPosition={labelEnhancerPosition}
				needle={needle}
				size={size} />
			{badge}
			<div
				className={classNames("foundations-pin-head", "foundations-map-marker-shadow",
					"foundations-pin-head-" + type, forceCircle && "foundations-pin-head-circle", className)}
				style={{
					height: height + "px",
					gridTemplateColumns: activeSlots.map(() => "auto").join(" "),
					...(forceCircle ? {width: height + "px"} : {})
				}}>
				{hasContent(startEnhancer) && enhancerSlot(startEnhancer)}
				{hasContent(label) &&
					<div className="foundations-pin-head-label-slot">
						<div className={classNames("foundations-pin-head-label", labelClassName)}>{label}</div>
						{renderSecondaryLabel &&
							<div className={classNames("foundations-pin-head-label",
								"foundations-pin-head-secondary-label", labelClassName)}>{secondaryLabel}</div>}
					</div>}
				{hasContent(endEnhancer) && enhancerSlot(endEnhancer)}
			</div>
		</div>
	)
}
