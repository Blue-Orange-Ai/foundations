import React from "react";
import {describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import {NumberDataCell} from "./NumberDataCell";

const renderCell = (cell: React.ReactNode) =>
	render(
		<table>
			<tbody>
				<tr>{cell}</tr>
			</tbody>
		</table>
	);

describe("NumberDataCell", () => {
	it("renders the digits as they are by default", () => {
		renderCell(<NumberDataCell value={1234567.89}></NumberDataCell>);

		expect(screen.getByText("1234567.89")).toBeInTheDocument();
	});

	it("locale-formats only when pretty is asked for", () => {
		renderCell(<NumberDataCell value={1234567.89} pretty={true}></NumberDataCell>);

		expect(screen.getByText("1,234,567.89")).toBeInTheDocument();
	});

	it("applies decimal places in both styles", () => {
		renderCell(<NumberDataCell value={1234.5} decimalPlaces={2}></NumberDataCell>);
		expect(screen.getByText("1234.50")).toBeInTheDocument();

		renderCell(<NumberDataCell value={1234.5} decimalPlaces={2} pretty={true}></NumberDataCell>);
		expect(screen.getByText("1,234.50")).toBeInTheDocument();
	});

	it("formats every element of a multi-value cell the same way", () => {
		renderCell(
			<NumberDataCell value={[1000, 2500.5]} multipleValues={true} pretty={true}></NumberDataCell>
		);

		expect(screen.getByText("1,000, 2,500.5")).toBeInTheDocument();
	});
});
