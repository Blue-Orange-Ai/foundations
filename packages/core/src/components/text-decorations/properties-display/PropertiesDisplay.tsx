import React, {ReactNode} from "react";

import './PropertiesDisplay.css'
import {CopyableText, CopyToastOptions} from "../copyable-text/CopyableText";

export type PropertyValue = ReactNode | ReactNode[];

export interface Property {
	label: string;
	value: PropertyValue;
	/** Overrides the component level maxArrayItems for this property only. */
	maxArrayItems?: number;
	/** Overrides the component level copyable for this property only. */
	copyable?: boolean;
	/** Text placed on the clipboard instead of the rendered value. Ignored for array values. */
	copyValue?: string;
}

interface Props {
	properties: Property[];
	/** vertical stacks the label above the value, horizontal places them side by side. */
	orientation?: "vertical" | "horizontal";
	/** Number of properties rendered per row. */
	columns?: number;
	/** Number of array items shown before the see more button appears. */
	maxArrayItems?: number;
	seeMoreLabel?: string;
	/** Fired when the see more button is clicked for a truncated array value. */
	onSeeMore?: (property: Property) => void;
	/** Rendered when a value is undefined, null or an empty array. */
	emptyValue?: ReactNode;
	labelWidth?: string;
	/** Makes every value clickable to copy. Individual properties can opt in or out with Property.copyable. */
	copyable?: boolean;
	/** Shows a toast when a value is copied. Pass true for the defaults or an object to override them. */
	copyToast?: boolean | CopyToastOptions;
	/** Leaves the value as plain selectable text and puts a copy icon beside it instead of making the text clickable. */
	copyIconOnly?: boolean;
	onCopy?: (value: string, property: Property) => void;
	style?: React.CSSProperties;
}

export const PropertiesDisplay: React.FC<Props> = ({
	properties,
	orientation = "vertical",
	columns = 1,
	maxArrayItems = 3,
	seeMoreLabel = "See more",
	onSeeMore,
	emptyValue = "-",
	labelWidth = "140px",
	copyable = false,
	copyToast = false,
	copyIconOnly = false,
	onCopy,
	style = {}
}) => {

	const isEmpty = (value: PropertyValue) => {
		if (Array.isArray(value)) {
			return value.length === 0;
		}
		return value === undefined || value === null || value === "";
	}

	const wrapCopyable = (property: Property, node: ReactNode, copyValue?: string) => {
		if (!(property.copyable ?? copyable)) {
			return node;
		}
		const copyableText = (
			<CopyableText
				copyValue={copyValue}
				toast={copyToast}
				iconOnHover={!copyIconOnly}
				iconOnly={copyIconOnly}
				onCopy={(value) => onCopy && onCopy(value, property)}
			>{node}</CopyableText>
		)
		if (!copyIconOnly) {
			return copyableText;
		}
		return (
			<>
				{node}
				{copyableText}
			</>
		)
	}

	const renderValue = (property: Property) => {
		if (isEmpty(property.value)) {
			return <span className="blue-orange-properties-display-empty">{emptyValue}</span>
		}

		if (!Array.isArray(property.value)) {
			return (
				<span className="blue-orange-properties-display-value-text">
					{wrapCopyable(property, property.value, property.copyValue)}
				</span>
			)
		}

		const limit = property.maxArrayItems ?? maxArrayItems;
		const visible = property.value.slice(0, limit);
		const remaining = property.value.length - visible.length;

		return (
			<span className="blue-orange-properties-display-value-text">
				{visible.map((item, index) => (
					<React.Fragment key={index}>
						{index > 0 && <span className="blue-orange-properties-display-separator">, </span>}
						{wrapCopyable(property, item)}
					</React.Fragment>
				))}
				{remaining > 0 && (
					<button
						type="button"
						className="blue-orange-properties-display-see-more"
						onClick={() => onSeeMore && onSeeMore(property)}
					>{seeMoreLabel} ({remaining})</button>
				)}
			</span>
		)
	}

	const gridStyle: React.CSSProperties = {
		gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
		...style
	}

	return (
		<div className={`blue-orange-properties-display blue-orange-properties-display-${orientation}`} style={gridStyle}>
			{properties.map((property, index) => (
				<div className="blue-orange-properties-display-item" key={`${property.label}-${index}`}>
					<div
						className="blue-orange-properties-display-label"
						style={orientation === "horizontal" ? {width: labelWidth, minWidth: labelWidth} : {}}
					>{property.label}</div>
					<div className="blue-orange-properties-display-value">{renderValue(property)}</div>
				</div>
			))}
		</div>
	)
}
