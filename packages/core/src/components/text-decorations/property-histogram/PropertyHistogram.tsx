import React from "react";

import './PropertyHistogram.css'
import {PropertyHistogramItem} from "./items/PropertyHistogramItem";

export interface PropertyHistogramProperty {
	label: string;
	value: number;
	/** Overrides the component level color for this property only. */
	color?: string;
}

interface Props {
	properties: PropertyHistogramProperty[];
	/** Number of properties rendered before the rest are hidden behind the see more button. */
	maxProperties?: number;
	/** Renders the see more button even when nothing has been truncated. */
	seeMore?: boolean;
	seeMoreLabel?: string;
	onSeeMore?: () => void;
	/** The value a full bar represents. Defaults to the sum of every property value. */
	total?: number;
	/** Shows a tooltip with the percentage when a bar is hovered. */
	tooltip?: boolean;
	/** Colour of every bar. Individual properties can override it with Property.color. */
	color?: string;
	classes?: string;
	style?: React.CSSProperties;
}

export const PropertyHistogram: React.FC<Props> = ({
	properties,
	maxProperties,
	seeMore = false,
	seeMoreLabel = "See more",
	onSeeMore,
	total,
	tooltip = true,
	color,
	classes = "",
	style = {}
}) => {

	const generateClassName = () => {
		var className = "blue-orange-property-histogram";
		if (classes) {
			className += " " + classes;
		}
		return className;
	}

	const visible = maxProperties === undefined ? properties : properties.slice(0, Math.max(0, maxProperties));
	const remaining = properties.length - visible.length;

	const calculateTotal = () => {
		if (total !== undefined) {
			return total;
		}
		return properties.reduce((sum, property) => sum + Math.max(0, property.value), 0);
	}

	const totalValue = calculateTotal();

	const calculatePercentage = (value: number) => {
		if (totalValue <= 0) {
			return 0;
		}
		return Math.min(100, Math.max(0, (value / totalValue) * 100));
	}

	return (
		<div className={generateClassName()} style={style}>
			{visible.map((property, index) => (
				<PropertyHistogramItem
					key={`${property.label}-${index}`}
					label={property.label}
					percentage={calculatePercentage(property.value)}
					color={property.color ?? color}
					tooltip={tooltip}
				></PropertyHistogramItem>
			))}
			{(seeMore || remaining > 0) && (
				<button
					type="button"
					className="blue-orange-property-histogram-see-more"
					onClick={() => onSeeMore && onSeeMore()}
				>{remaining > 0 ? `${seeMoreLabel} (${remaining})` : seeMoreLabel}</button>
			)}
		</div>
	)
}
