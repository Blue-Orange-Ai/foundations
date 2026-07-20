import React from "react";

import './FormSection.css';
import {HelpIcon} from "../help/HelpIcon";

interface Props {
	children: React.ReactNode;
	/** Heading rendered above the section. */
	label?: string;
	/** Supporting copy rendered underneath the heading. */
	description?: string;
	/** Help tooltip rendered next to the heading. */
	help?: string;
	/** Space between each row of the section. */
	verticalMargin?: number;
	/** Set to false to drop the separating line above the section. */
	divider?: boolean;
	style?: React.CSSProperties;
	labelStyle?: React.CSSProperties;
}

/**
 * Groups related fields under a heading inside a {@link FormGroup}.
 *
 * Every direct child is treated as a row, so a section can hold fields
 * directly or {@link FormRow} children for side by side layouts.
 */
export const FormSection: React.FC<Props> = ({
												 children,
												 label,
												 description,
												 help,
												 verticalMargin = 10,
												 divider = false,
												 style = {},
												 labelStyle = {}
											 }) => {

	const sectionItems: React.ReactNode[] = [];

	React.Children.forEach(children, child => {
		if (React.isValidElement(child)) {
			sectionItems.push(child);
		}
	});

	return (
		<div
			className={"blue-orange-form-section" + (divider ? " blue-orange-form-section-divider" : "")}
			style={style}>
			{(label || description) &&
				<div className="blue-orange-form-section-header">
					{label &&
						<div className="blue-orange-form-section-label" style={labelStyle}>
							{label}
							{help && <HelpIcon label={help}></HelpIcon>}
						</div>
					}
					{description && <div className="blue-orange-form-section-description">{description}</div>}
				</div>
			}
			<div className="blue-orange-form-section-body">
				{sectionItems.map((child, index) => (
					<div
						key={index}
						className="blue-orange-form-section-row"
						style={{marginBottom: index === sectionItems.length - 1 ? 0 : verticalMargin + "px"}}>
						{child}
					</div>
				))}
			</div>
		</div>
	);
};
