import React from "react";

import './EmptyDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Empty} from "../../../components/empty/empty/Empty";
import {EmptyHeader} from "../../../components/empty/empty-header/EmptyHeader";
import {EmptyMedia} from "../../../components/empty/empty-media/EmptyMedia";
import {EmptyTitle} from "../../../components/empty/empty-title/EmptyTitle";
import {EmptyDescription} from "../../../components/empty/empty-description/EmptyDescription";
import {EmptyContent} from "../../../components/empty/empty-content/EmptyContent";
import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {Spinner, SpinnerSize} from "../../../components/loading/spinner/Spinner";

interface Props {
}

export const EmptyDevelopment: React.FC<Props> = ({}) => {

	return (
		<PaddedPage>
			<PageHeading>Empty</PageHeading>
			<Description>
				The state a list, table or search result falls back to when there is nothing to show.
			</Description>

			<GeneralHeading>Default</GeneralHeading>
			<Empty bordered={true}>
				<EmptyHeader>
					<EmptyMedia icon="ri-folder-6-line"></EmptyMedia>
					<EmptyTitle>No documents yet</EmptyTitle>
					<EmptyDescription>
						Upload a file or connect a source and anything you add will appear here.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button
						text="Upload a file"
						buttonType={ButtonType.PRIMARY}
						size={ButtonSize.SMALL}
						icon="ri-upload-2-line"
						iconPos={ButtonIconPos.LEFT}></Button>
					<Button text="Connect a source" buttonType={ButtonType.SECONDARY} size={ButtonSize.SMALL}></Button>
				</EmptyContent>
			</Empty>

			<GeneralHeading>No search results</GeneralHeading>
			<Empty bordered={true}>
				<EmptyHeader>
					<EmptyMedia icon="ri-search-line"></EmptyMedia>
					<EmptyTitle>No results for “quarterly revenue”</EmptyTitle>
					<EmptyDescription>Check the spelling or try a broader term.</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button text="Clear search" buttonType={ButtonType.CLEAR} size={ButtonSize.SMALL}></Button>
				</EmptyContent>
			</Empty>

			<GeneralHeading>Without a border</GeneralHeading>
			<Empty>
				<EmptyHeader>
					<EmptyMedia icon="ri-error-warning-line"></EmptyMedia>
					<EmptyTitle>Nothing to review</EmptyTitle>
					<EmptyDescription>You are all caught up.</EmptyDescription>
				</EmptyHeader>
			</Empty>

			<GeneralHeading>Loading state</GeneralHeading>
			<Description>Any content works as the media — here a spinner stands in for the icon.</Description>
			<Empty bordered={true}>
				<EmptyHeader>
					<EmptyMedia>
						<Spinner size={SpinnerSize.LARGE}></Spinner>
					</EmptyMedia>
					<EmptyTitle>Indexing your documents</EmptyTitle>
					<EmptyDescription>This usually takes less than a minute.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</PaddedPage>
	)
}
