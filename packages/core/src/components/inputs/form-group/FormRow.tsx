import React from "react";

import './FormRow.css';

export enum FormRowAlignment {
	TOP = "TOP",
	CENTER = "CENTER",
	BOTTOM = "BOTTOM"
}

interface Props {
	children: React.ReactNode;
	/**
	 * Sizes each child in turn. A number is a share of the row (2 takes twice
	 * the space of 1), a string is a fixed css width ("160px", "25%"). Children
	 * without an entry share what is left evenly.
	 */
	columns?: Array<number | string>;
	/** Horizontal space between the fields. */
	gap?: number;
	/** Smallest width a field is allowed to shrink to before the row wraps. */
	minFieldWidth?: number;
	/** Set to false to keep every field on one line regardless of space. */
	wrap?: boolean;
	alignment?: FormRowAlignment;
	style?: React.CSSProperties;
}

const alignmentValue = (alignment: FormRowAlignment) => {
	switch (alignment) {
		case FormRowAlignment.CENTER:
			return "center";
		case FormRowAlignment.BOTTOM:
			return "flex-end";
		default:
			return "flex-start";
	}
};

/**
 * Lays its children out side by side, wrapping onto a new line once they can
 * no longer fit within `minFieldWidth`.
 *
 * Children share the row evenly unless `columns` says otherwise:
 *
 * ```tsx
 * <FormRow columns={[2, 1, "160px"]}>
 *     <Input name="line1" label="Address" .../>
 *     <Input name="city" label="City" .../>
 *     <Input name="postcode" label="Postcode" .../>
 * </FormRow>
 * ```
 */
export const FormRow: React.FC<Props> = ({
											 children,
											 columns,
											 gap = 10,
											 minFieldWidth = 180,
											 wrap = true,
											 alignment = FormRowAlignment.TOP,
											 style = {}
										 }) => {

	const rowItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			rowItems.push(child);
		}
	});

	const itemStyle = (index: number): React.CSSProperties => {
		const column = columns ? columns[index] : undefined;
		if (typeof column === "string") {
			return {flex: "0 0 " + column, maxWidth: column};
		}
		if (typeof column === "number") {
			return {flex: column + " 1 " + minFieldWidth + "px"};
		}
		return {flex: "1 1 " + minFieldWidth + "px"};
	};

	return (
		<div
			className="blue-orange-form-row"
			style={{
				gap: gap + "px",
				flexWrap: wrap ? "wrap" : "nowrap",
				alignItems: alignmentValue(alignment),
				...style
			}}>
			{rowItems.map((child, index) => (
				<div key={index} className="blue-orange-form-row-item" style={itemStyle(index)}>
					{child}
				</div>
			))}
		</div>
	);
};
