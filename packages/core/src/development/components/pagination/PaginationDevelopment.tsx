import React, {useState} from "react";

import './PaginationDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Pagination} from "../../../components/pagination/pagination/Pagination";
import {PaginationLink} from "../../../components/pagination/pagination-link/PaginationLink";
import {PaginationEllipsis} from "../../../components/pagination/pagination-ellipsis/PaginationEllipsis";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const PAGINATION_PROPS: Array<PropSpec> = [
	{
		name: "page",
		type: "number",
		required: true,
		control: "slider",
		min: 1,
		max: 20,
		step: 1,
		value: 4,
		description: "The page being viewed, counted from 1."
	},
	{
		name: "totalPages",
		type: "number",
		required: true,
		control: "slider",
		min: 1,
		max: 40,
		step: 1,
		value: 20,
		description: "How many pages there are altogether."
	},
	{
		name: "onPageChange",
		type: "(page: number) => void",
		description: "Fires with the page that was asked for."
	},
	{
		name: "siblingCount",
		type: "number",
		default: "1",
		control: "slider",
		min: 0,
		max: 4,
		step: 1,
		description: "How many pages are kept either side of the current one before the run is collapsed."
	},
	{
		name: "showPrevNext",
		type: "boolean",
		default: "true",
		control: "toggle",
		description: "Draws the previous and next controls at either end."
	},
	{
		name: "showFirstLast",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Adds jump to first and jump to last controls outside those."
	},
	{
		name: "previousLabel",
		type: "string",
		default: "\"Previous\"",
		control: "text",
		description: "What the previous control reads."
	},
	{
		name: "nextLabel",
		type: "string",
		default: "\"Next\"",
		control: "text",
		description: "What the next control reads."
	},
	{
		name: "compact",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Drops the labels from the previous and next controls, leaving the arrows."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the whole run out and stops it responding."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Replaces the generated items — compose PaginationLink and PaginationEllipsis by hand instead."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the run."
	}
];

const PAGINATION_LINK_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		control: "text",
		value: "3",
		hideFromSnippet: true,
		description: "What the control reads — usually the page number."
	},
	{
		name: "active",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Marks the control as the page currently being viewed."
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Greys the control out and stops it responding."
	},
	{
		name: "icon",
		type: "string",
		control: "text",
		description: "A remixicon class drawn before the label."
	},
	{
		name: "iconRight",
		type: "string",
		control: "text",
		description: "A remixicon class drawn after the label."
	},
	{
		name: "href",
		type: "string",
		control: "text",
		description: "Makes the control a real link, for pagination that changes the URL."
	},
	{
		name: "ariaLabel",
		type: "string",
		control: "text",
		description: "What a screen reader announces the control as, where the label alone is not enough."
	},
	{
		name: "onClick",
		type: "() => void",
		description: "Fires when the control is clicked."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the control."
	}
];

const PAGINATION_ELLIPSIS_PROPS: Array<PropSpec> = [
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the ellipsis."
	}
];

interface Props {
}

export const PaginationDevelopment: React.FC<Props> = ({}) => {

	const [page, setPage] = useState(1);

	const [longPage, setLongPage] = useState(12);

	return (
		<ComponentDoc
			title="Pagination"
			description="Page navigation. Give it the page you are on and how many there are, and it works out which numbers to show — a long run collapses into an ellipsis on its own."
			name="Pagination"
			previewHeight={140}
			props={PAGINATION_PROPS}
			preview={values => (
				<Pagination
					page={values.page}
					totalPages={values.totalPages}
					siblingCount={values.siblingCount}
					showPrevNext={values.showPrevNext}
					showFirstLast={values.showFirstLast}
					previousLabel={values.previousLabel}
					nextLabel={values.nextLabel}
					compact={values.compact}
					disabled={values.disabled}
					onPageChange={() => {}}></Pagination>
			)}
			siblings={[
				{
					name: "PaginationLink",
					description: "One page control. Compose these by hand as the children of Pagination when the generated run is not the one you want.",
					props: PAGINATION_LINK_PROPS,
					previewHeight: 120,
					snippetChildren: values => values.children,
					preview: values => (
						<PaginationLink
							active={values.active}
							disabled={values.disabled}
							icon={values.icon}
							iconRight={values.iconRight}
							ariaLabel={values.ariaLabel}>
							{values.children}
						</PaginationLink>
					)
				},
				{
					name: "PaginationEllipsis",
					description: "The gap between two runs of pages. It is decorative, and hidden from screen readers.",
					props: PAGINATION_ELLIPSIS_PROPS,
					previewHeight: 110,
					preview: () => (<PaginationEllipsis></PaginationEllipsis>)
				}
			]}>

			<GeneralHeading>Default</GeneralHeading>
			<Description>{"Page " + page + " of 5."}</Description>
			<Pagination page={page} totalPages={5} onPageChange={setPage}></Pagination>

			<GeneralHeading>Many pages</GeneralHeading>
			<Description>{"Page " + longPage + " of 40, with first and last controls."}</Description>
			<Pagination
				page={longPage}
				totalPages={40}
				siblingCount={1}
				showFirstLast={true}
				onPageChange={setLongPage}></Pagination>

			<GeneralHeading>Compact</GeneralHeading>
			<Description>Drops the previous and next labels, leaving the arrows.</Description>
			<Pagination page={longPage} totalPages={40} compact={true} onPageChange={setLongPage}></Pagination>

			<GeneralHeading>Wider window</GeneralHeading>
			<Description>Two siblings either side of the current page.</Description>
			<Pagination page={longPage} totalPages={40} siblingCount={2} onPageChange={setLongPage}></Pagination>

			<GeneralHeading>Composed by hand</GeneralHeading>
			<Description>Pass children to lay the row out yourself.</Description>
			<Pagination page={1} totalPages={1}>
				<PaginationLink icon="ri-arrow-left-s-line" disabled={true}>Newer</PaginationLink>
				<PaginationLink active={true}>1</PaginationLink>
				<PaginationLink>2</PaginationLink>
				<PaginationEllipsis></PaginationEllipsis>
				<PaginationLink>99</PaginationLink>
				<PaginationLink iconRight="ri-arrow-right-s-line">Older</PaginationLink>
			</Pagination>

			<GeneralHeading>Disabled</GeneralHeading>
			<Pagination page={3} totalPages={10} disabled={true}></Pagination>
		</ComponentDoc>
	)
}
