import React, {useState} from "react";

import './PaginationDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Pagination} from "../../../components/pagination/pagination/Pagination";
import {PaginationLink} from "../../../components/pagination/pagination-link/PaginationLink";
import {PaginationEllipsis} from "../../../components/pagination/pagination-ellipsis/PaginationEllipsis";

interface Props {
}

export const PaginationDevelopment: React.FC<Props> = ({}) => {

	const [page, setPage] = useState(1);

	const [longPage, setLongPage] = useState(12);

	return (
		<PaddedPage>
			<PageHeading>Pagination</PageHeading>
			<Description>
				Page navigation. Give it the current page and the total — long runs collapse into an
				ellipsis on their own.
			</Description>

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
		</PaddedPage>
	)
}
