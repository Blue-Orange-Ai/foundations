import React from "react";
import {act, render, fireEvent, within} from "@testing-library/react";
import {FileSystemDevelopment} from "./FileSystemDevelopment";

const rowLabels = (container: HTMLElement) =>
	Array.from(container.querySelectorAll(".blue-orange-file-system-row-content-title")).map((el) => el.textContent);

// The page opens with a props playground carrying a browser of its own, so every
// assertion here is scoped to the worked example underneath it.
const examplesOf = (page: HTMLElement) =>
	page.querySelector(".blue-orange-docs-examples") as HTMLElement;

describe("FileSystem demo", () => {

	it("renders the seeded folder, sorts columns, expands folders and navigates", () => {
		const container = examplesOf(render(<FileSystemDevelopment/>).container);

		// folders first, name ascending
		expect(rowLabels(container).slice(0, 3)).toEqual(["Documents", "Media", "Projects"]);

		const thead = container.querySelector("thead") as HTMLElement;
		const header = (label: string) => within(thead).getByText(label).parentElement as HTMLElement;

		// clicking a header sorts, clicking again reverses
		fireEvent.click(header("Name"));
		expect(rowLabels(container).slice(0, 3)).toEqual(["Projects", "Media", "Documents"]);

		// size column sorts ascending first, then descending — Media holds the largest files
		fireEvent.click(header("Size"));
		expect(rowLabels(container)[0]).toEqual("Documents");
		fireEvent.click(header("Size"));
		expect(rowLabels(container)[0]).toEqual("Media");

		// back to name ascending
		fireEvent.click(header("Name"));
		const documentsRow = within(container).getByText("Documents").closest("tr") as HTMLElement;
		const chevron = documentsRow.querySelector(".blue-orange-default-btn-icon") as HTMLElement;
		fireEvent.click(chevron);
		expect(rowLabels(container)).toContain("Company Strategy.docx");

		// double click navigates into the folder and the parent directory row appears
		fireEvent.doubleClick(within(documentsRow).getByText("Documents"));
		expect(rowLabels(container)).toContain("..");
		expect(rowLabels(container)).toContain("Contracts");
		expect(rowLabels(container)).not.toContain("Media");

		// the parent directory row is the first row and walks back up a level
		expect(rowLabels(container)[0]).toEqual("..");
		fireEvent.doubleClick(within(container).getByText(".."));
		expect(rowLabels(container)).toContain("Media");
		expect(rowLabels(container)).not.toContain("..");
	});

	it("opens a folder as the new view through a full click, click, double click sequence", () => {
		const container = examplesOf(render(<FileSystemDevelopment/>).container);

		const label = within(container).getByText("Media");
		fireEvent.mouseDown(label);
		fireEvent.mouseUp(label);
		fireEvent.click(label);

		// selecting the row must not replace it — a browser only counts a second
		// click as a double click when it lands on the same element
		expect(label.isConnected).toBe(true);

		fireEvent.mouseDown(label);
		fireEvent.mouseUp(label);
		fireEvent.click(label);
		fireEvent.doubleClick(label);

		expect(rowLabels(container)[0]).toEqual("..");
		expect(rowLabels(container)).toContain("hero-banner.png");
	});

	it("expands folders in place when the new view toggle is off", () => {
		const container = examplesOf(render(<FileSystemDevelopment/>).container);

		const toggleRow = within(container).getByText("Double click opens folder as new view").parentElement as HTMLElement;
		fireEvent.click(toggleRow.querySelector("input") as HTMLElement);
		fireEvent.doubleClick(within(container).getByText("Media"));

		// still in the root folder, with the folder expanded underneath itself
		expect(rowLabels(container)).toContain("Documents");
		expect(rowLabels(container)).toContain("hero-banner.png");
		expect(rowLabels(container)).not.toContain("..");
	});

	it("selects rows and deletes them", () => {
		const container = examplesOf(render(<FileSystemDevelopment/>).container);

		const mediaRow = within(container).getByText("Media").closest("tr") as HTMLElement;
		fireEvent.mouseDown(mediaRow);
		fireEvent.click(mediaRow);
		expect(mediaRow.classList.contains("blue-orange-file-system-row-selected-style")).toBe(true);

		fireEvent.click(within(container).getByText("Delete"));
		expect(rowLabels(container)).not.toContain("Media");
	});

	it("hides a column in the body as well as the header", () => {
		const container = examplesOf(render(<FileSystemDevelopment/>).container);

		const cellsPerRow = () => (container.querySelector("tbody tr") as HTMLElement).querySelectorAll("td").length;
		const headerCells = () => container.querySelectorAll("thead th").length;

		expect(headerCells()).toEqual(4);
		expect(cellsPerRow()).toEqual(4);

		const toggles = container.querySelector(".file-system-demo-toggles") as HTMLElement;
		const sizeToggle = within(toggles).getByText("Size").parentElement as HTMLElement;
		fireEvent.click(sizeToggle.querySelector("input") as HTMLElement);

		expect(headerCells()).toEqual(3);
		expect(cellsPerRow()).toEqual(3);
	});

	it("shows an inline progress bar while a simulated upload runs", () => {
		vi.useFakeTimers();
		try {
			const container = examplesOf(render(<FileSystemDevelopment/>).container);

			act(() => {
				fireEvent.click(within(container).getByText("Simulate upload"));
			});
			expect(container.querySelector(".blue-orange-file-system-row-progress-bar")).not.toBeNull();

			act(() => {
				vi.advanceTimersByTime(500);
			});
			const bar = container.querySelector(".blue-orange-file-system-row-progress-bar") as HTMLElement;
			expect(bar.style.width).toEqual("40%");

			// the bar disappears once the upload completes
			act(() => {
				vi.advanceTimersByTime(1000);
			});
			expect(container.querySelector(".blue-orange-file-system-row-progress-bar")).toBeNull();
		} finally {
			vi.useRealTimers();
		}
	});

	it("creates a folder and renames it", () => {
		const container = examplesOf(render(<FileSystemDevelopment/>).container);

		fireEvent.click(within(container).getByText("New folder"));
		const input = container.querySelector(".blue-orange-file-system-row-primary input") as HTMLInputElement;
		expect(input).not.toBeNull();

		fireEvent.change(input, {target: {value: "Renamed Folder"}});
		fireEvent.keyDown(input, {key: "Enter", code: "Enter"});
		expect(rowLabels(container)).toContain("Renamed Folder");
	});
});
