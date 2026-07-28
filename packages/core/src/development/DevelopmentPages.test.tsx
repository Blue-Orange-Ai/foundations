import React from "react";
import {render, screen} from "@testing-library/react";
import {ModalDevelopment} from "./components/layouts/modal/ModalDevelopment";
import {DrawerDevelopment} from "./components/layouts/drawer/DrawerDevelopment";
import {TabsDevelopment} from "./components/layouts/tabs/TabsDevelopment";
import {PagesDevelopment} from "./components/layouts/pages/PagesDevelopment";
import {SideBarDevelopment} from "./components/layouts/sidebar/SideBarDevelopment";
import {LoadingDevelopment} from "./components/loading/LoadingDevelopment";
import {MediaDevelopment} from "./components/media/MediaDevelopment";
import {MetricsDevelopment} from "./components/metrics/metrics/MetricsDevelopment";
import {TableDevelopment} from "./components/table/table/TableDevelopment";
import {TimeInputDevelopment} from "./components/inputs/time-input/TimeInputDevelopment";
import {EmailRecipientDevelopment} from "./components/inputs/email-recipient/EmailRecipientDevelopment";
import {AvatarDevelopment} from "./components/avatar/AvatarDevelopment";
import {ButtonDevelopment} from "./components/buttons/ButtonDevelopment";

// Every page is rendered in both themes: a component that only styles itself for
// light mode still renders, but these at least prove no page throws in either.
const PAGES: Array<[string, React.FC<any>]> = [
	["Modal", ModalDevelopment],
	["Drawer", DrawerDevelopment],
	["Tabs", TabsDevelopment],
	["Page Layouts", PagesDevelopment],
	["Side Bar", SideBarDevelopment],
	["Loading", LoadingDevelopment],
	["Media", MediaDevelopment],
	["Metrics", MetricsDevelopment],
	["Table", TableDevelopment],
	["Time Input", TimeInputDevelopment],
	["Email Recipient Input", EmailRecipientDevelopment],
	["Avatar", AvatarDevelopment],
	["Buttons", ButtonDevelopment],
];

describe("development pages", () => {

	afterEach(() => {
		document.body.classList.remove("dark");
	});

	PAGES.forEach(([heading, Page]) => {
		it(`renders the ${heading} page in light mode`, () => {
			render(<Page/>);
			expect(screen.getAllByText(heading).length).toBeGreaterThan(0);
		});

		it(`renders the ${heading} page in dark mode`, () => {
			document.body.classList.add("dark");
			render(<Page/>);
			expect(screen.getAllByText(heading).length).toBeGreaterThan(0);
		});
	});
});
