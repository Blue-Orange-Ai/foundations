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
import {CardDevelopment} from "./components/card/CardDevelopment";
import {CarouselDevelopment} from "./components/carousel/CarouselDevelopment";
import {CommandDevelopment} from "./components/command/CommandDevelopment";
import {EmptyDevelopment} from "./components/empty/EmptyDevelopment";
import {MenubarDevelopment} from "./components/menubar/MenubarDevelopment";
import {NavigationMenuDevelopment} from "./components/navigation-menu/NavigationMenuDevelopment";
import {PaginationDevelopment} from "./components/pagination/PaginationDevelopment";
import {PanelDevelopment} from "./components/panel/PanelDevelopment";
import {SpinnerDevelopment} from "./components/loading/spinner/SpinnerDevelopment";
import {SliderDevelopment} from "./components/inputs/slider/SliderDevelopment";
import {OTPInputDevelopment} from "./components/inputs/otp-input/OTPInputDevelopment";
import {PhraseInputDevelopment} from "./components/inputs/phrase-input/PhraseInputDevelopment";
import {KbdDevelopment} from "./components/text-decorations/kbd/KbdDevelopment";
import {IconTextDevelopment} from "./components/text-decorations/icon-text/IconTextDevelopment";
import {SeparatorDevelopment} from "./components/layouts/separator/SeparatorDevelopment";
import {ButtonTabsDevelopment} from "./components/layouts/button-tabs/ButtonTabsDevelopment";
import {FilterPillsDevelopment} from "./components/filters/filter-pills/FilterPillsDevelopment";
import {OptionCardsDevelopment} from "./components/inputs/option-cards/OptionCardsDevelopment";
import {HoverCardDevelopment} from "./components/tooltips/hover-card/HoverCardDevelopment";
import {StepperDevelopment} from "./components/stepper/StepperDevelopment";
import {QuestionnaireDevelopment} from "./components/questionnaire/QuestionnaireDevelopment";
import {TimelineDevelopment} from "./components/timeline/TimelineDevelopment";
import {WizardDevelopment} from "./components/wizard/WizardDevelopment";
import {RuleEditorDevelopment} from "./components/rules/rule-editor/RuleEditorDevelopment";
import {SearchQueryEditorDevelopment} from "./components/search/search-query-editor/SearchQueryEditorDevelopment";
import {JsonSchemaEditorDevelopment} from "./components/inputs/json-schema-editor/JsonSchemaEditorDevelopment";

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
	["Card", CardDevelopment],
	["Carousel", CarouselDevelopment],
	["Command", CommandDevelopment],
	["Empty", EmptyDevelopment],
	["Menubar", MenubarDevelopment],
	["Navigation Menu", NavigationMenuDevelopment],
	["Pagination", PaginationDevelopment],
	["Panel", PanelDevelopment],
	["Spinner", SpinnerDevelopment],
	["Slider", SliderDevelopment],
	["OTP Input", OTPInputDevelopment],
	["Phrase Input", PhraseInputDevelopment],
	["Kbd", KbdDevelopment],
	["Icon Text", IconTextDevelopment],
	["Separator", SeparatorDevelopment],
	["Button Tabs", ButtonTabsDevelopment],
	["Filter Pills", FilterPillsDevelopment],
	["Option Cards", OptionCardsDevelopment],
	["Hover Card", HoverCardDevelopment],
	["Stepper", StepperDevelopment],
	["Questionnaire", QuestionnaireDevelopment],
	["Timeline", TimelineDevelopment],
	["Wizard", WizardDevelopment],
	["Rule Editor", RuleEditorDevelopment],
	["Search Query Editor", SearchQueryEditorDevelopment],
	["JSON Schema Editor", JsonSchemaEditorDevelopment],
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
