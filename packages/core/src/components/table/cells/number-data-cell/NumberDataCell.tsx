import React from "react";

import './NumberDataCell.css'
import {CellAlignment} from "../../../interfaces/AppInterfaces";
import {CenteredDiv} from "../../../layouts/centered-div/CenteredDiv";
import {RightAlignedDiv} from "../../../layouts/right-aligned-div/RightAlignedDiv";
import {NumberText} from "../../../text-decorations/number-text/NumberText";
import {ContextMenu, IContextMenuItem} from "../../../contextmenu/contextmenu/ContextMenu";

interface Props {
	value: any,
	multipleValues?: boolean,
	decimalPlaces?: number,
	/** Locale-formats the number (thousands separators). Off by default: the cell shows the digits as they are. */
	pretty?: boolean,
	alignment?: CellAlignment,
	onClick?: () => void,
    dropdownItems?: Array<IContextMenuItem>,
    onDropdownSelected?: (arg0: IContextMenuItem) => void,
	style?: React.CSSProperties,
	tdProps?: React.TdHTMLAttributes<HTMLTableCellElement>
}
export const NumberDataCell: React.FC<Props> = ({
								  value,
								  multipleValues=false,
								  decimalPlaces,
								  pretty=false,
								  alignment=CellAlignment.CENTER,
                                          dropdownItems,
                                          onDropdownSelected,
								  style= {},
								  tdProps,
								  onClick}) => {

	const formatScalar = (v: number): string => {
		if (pretty) {
			return new Intl.NumberFormat("en-AU", typeof decimalPlaces === "number"
				? {minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces}
				: {}).format(v);
		}
		if (typeof decimalPlaces === "number") {
			return v.toFixed(decimalPlaces);
		}
		return v.toString();
	}

	const getDisplayValue = () => {
		if (multipleValues && Array.isArray(value)) {
			return value
				.map((v) => (typeof v === "number" ? v : Number(v)))
				.filter((v) => !Number.isNaN(v))
				.map((v) => formatScalar(v))
				.join(", ");
		}
		if (value === null || value === undefined) {
			return "";
		}
		if (typeof value === "number") {
			return value;
		}
		const asNumber = Number(value);
		if (Number.isNaN(asNumber)) {
			return "";
		}
		return asNumber;
	}

	// Arrays arrive pre-formatted as a joined string; a scalar is formatted here,
	// through NumberText when pretty so both paths share the same locale rules.
	const renderValue = (): React.ReactNode => {
		const display = getDisplayValue();
		if (typeof display === "string") {
			return display;
		}
		if (pretty) {
			return <NumberText value={display} decimalPlaces={decimalPlaces}></NumberText>;
		}
		return formatScalar(display);
	}

	const getTextAlignment = () => {
		try{
			if (alignment == CellAlignment.RIGHT) {
				return "right";
			} else if (alignment == CellAlignment.CENTER) {
				return "center";
			}
			return "left";
		} catch (e) {
			return "left";
		}

	}

	const cellAlignment: React.CSSProperties = {
		textAlign: getTextAlignment()
	}

	const cellClicked = () => {
		if (onClick) {
			onClick();
		}
	}

	const {className: tdClassNameProp, onClick: _tdOnClickIgnored, style: _tdStyleIgnored, ...restTdProps} = tdProps ?? {};
	const tdClassName = ["blue-orange-data-table-text-cell", tdClassNameProp].filter(Boolean).join(" ");

	return (
        <>
            {dropdownItems && dropdownItems.length > 0 &&
                <td
                    {...restTdProps}
                    className={tdClassName}
                    onClick={cellClicked}
                    style={{...cellAlignment, ...style}}>
                    {alignment == CellAlignment.CENTER &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <CenteredDiv>
															{renderValue()}
                            </CenteredDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <RightAlignedDiv>
															{renderValue()}
                            </RightAlignedDiv>
                        </ContextMenu>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <ContextMenu maxHeight={200} items={dropdownItems} onClick={onDropdownSelected} rightClick={true}>
                            <>
															{renderValue()}
                            </>
                        </ContextMenu>
                    }
                </td>
            }
            {(!dropdownItems || dropdownItems.length <= 0) &&
                <td
                    {...restTdProps}
                    className={tdClassName}
                    onClick={cellClicked}
                    style={{...cellAlignment, ...style}}>
                    {alignment == CellAlignment.CENTER &&
                        <CenteredDiv>
															{renderValue()}
                        </CenteredDiv>
                    }
                    {alignment == CellAlignment.RIGHT &&
                        <RightAlignedDiv>
															{renderValue()}
                        </RightAlignedDiv>
                    }
                    {alignment == CellAlignment.LEFT &&
                        <>
															{renderValue()}
                        </>
                    }
                </td>
            }
        </>


	)
}