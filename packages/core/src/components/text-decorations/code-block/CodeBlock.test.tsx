import React from "react";
import {render, waitFor} from "@testing-library/react";
import {CodeBlock} from "./CodeBlock";

const shikiTheme = (container: HTMLElement): string | null => {
	const pre = container.querySelector("pre");
	return pre ? pre.className : null;
};

describe("CodeBlock", () => {

	afterEach(() => {
		document.body.classList.remove("dark");
	});

	it("highlights with the light theme by default", async () => {
		const {container} = render(<CodeBlock value={{code: "const a = 1", lang: "javascript"}}></CodeBlock>);

		await waitFor(() => expect(shikiTheme(container)).toContain("github-light"));
	});

	it("highlights with the dark theme when the page is dark", async () => {
		document.body.classList.add("dark");

		const {container} = render(<CodeBlock value={{code: "const a = 1", lang: "javascript"}}></CodeBlock>);

		await waitFor(() => expect(shikiTheme(container)).toContain("github-dark"));
	});

	it("re-highlights when the page switches theme while mounted", async () => {
		const {container} = render(<CodeBlock value={{code: "const a = 1", lang: "javascript"}}></CodeBlock>);
		await waitFor(() => expect(shikiTheme(container)).toContain("github-light"));

		document.body.classList.add("dark");

		await waitFor(() => expect(shikiTheme(container)).toContain("github-dark"));
	});

	it("keeps an explicitly set theme regardless of the page", async () => {
		document.body.classList.add("dark");

		const {container} = render(
			<CodeBlock value={{code: "const a = 1", lang: "javascript", theme: "github-light"}}></CodeBlock>);

		await waitFor(() => expect(shikiTheme(container)).toContain("github-light"));
	});
});
