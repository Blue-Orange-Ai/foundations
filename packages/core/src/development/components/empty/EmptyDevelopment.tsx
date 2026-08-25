import React from "react";

import './EmptyDevelopment.css'
import {GeneralHeading} from "../../../components/text-decorations/general-heading/GeneralHeading";
import {Description} from "../../../components/text-decorations/description/Description";
import {Empty} from "../../../components/empty/empty/Empty";
import {EmptyHeader} from "../../../components/empty/empty-header/EmptyHeader";
import {EmptyMedia, EmptyMediaVariant} from "../../../components/empty/empty-media/EmptyMedia";
import {EmptyTitle} from "../../../components/empty/empty-title/EmptyTitle";
import {EmptyDescription} from "../../../components/empty/empty-description/EmptyDescription";
import {EmptyContent} from "../../../components/empty/empty-content/EmptyContent";
import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {Spinner, SpinnerSize} from "../../../components/loading/spinner/Spinner";
import {ComponentDoc} from "../../framework/ComponentDoc";
import {PropSpec} from "../../framework/PropSpec";

const EMPTY_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The header and content that make up the state."
	},
	{
		name: "bordered",
		type: "boolean",
		default: "false",
		control: "toggle",
		description: "Draws a dashed outline around the whole thing, which reads as a placeholder rather than a panel."
	},
	{
		name: "classes",
		type: "string",
		default: "\"\"",
		control: "text",
		description: "Extra class names put on the empty state."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the empty state."
	}
];

const EMPTY_MEDIA_PROPS: Array<PropSpec> = [
	{
		name: "icon",
		type: "string",
		control: "text",
		value: "ri-inbox-line",
		description: "A remixicon class drawn inside the tile."
	},
	{
		name: "variant",
		type: "EmptyMediaVariant",
		default: "ICON when an icon is given, otherwise DEFAULT",
		control: "select",
		options: [
			{label: "Icon", value: EmptyMediaVariant.ICON, code: "EmptyMediaVariant.ICON"},
			{label: "Default", value: EmptyMediaVariant.DEFAULT, code: "EmptyMediaVariant.DEFAULT"}
		],
		description: "ICON puts the media in a rounded filled tile; DEFAULT renders whatever it is given untouched."
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Used instead of an icon — an illustration, an avatar, an image."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the media."
	}
];

const EMPTY_SECTION_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The section's content."
	},
	{
		name: "style",
		type: "React.CSSProperties",
		default: "{}",
		description: "Inline style put on the section."
	}
];

interface Props {
}

export const EmptyDevelopment: React.FC<Props> = ({}) => {

	return (
		<ComponentDoc
			title="Empty"
			description="The state a list, a table or a search result falls back to when there is nothing to show. It is composed the way Card is — media, a title, a description and whatever action gets the user out of it."
			name="Empty"
			previewHeight={280}
			imports={["EmptyHeader", "EmptyMedia", "EmptyTitle", "EmptyDescription", "EmptyContent"]}
			props={EMPTY_PROPS}
			snippetChildren={() => "<EmptyHeader>\n\t<EmptyMedia icon={\"ri-inbox-line\"}></EmptyMedia>\n\t<EmptyTitle>No runs yet</EmptyTitle>\n\t<EmptyDescription>Runs appear here once a pipeline has been started.</EmptyDescription>\n</EmptyHeader>\n<EmptyContent>\n\t<Button text={\"Start a run\"} buttonType={ButtonType.PRIMARY}></Button>\n</EmptyContent>"}
			preview={values => (
				<Empty bordered={values.bordered} classes={values.classes}>
					<EmptyHeader>
						<EmptyMedia icon={"ri-inbox-line"}></EmptyMedia>
						<EmptyTitle>No runs yet</EmptyTitle>
						<EmptyDescription>Runs appear here once a pipeline has been started.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button text={"Start a run"} buttonType={ButtonType.PRIMARY}></Button>
					</EmptyContent>
				</Empty>
			)}
			siblings={[
				{
					name: "EmptyMedia",
					description: "The graphic at the top. An icon gets a filled tile of its own; anything else is rendered as it is.",
					props: EMPTY_MEDIA_PROPS,
					previewHeight: 140,
					preview: values => (
						<EmptyMedia icon={values.icon} variant={values.variant}></EmptyMedia>
					)
				},
				{
					name: "EmptyHeader",
					description: "Holds the media, the title and the description together and centres them.",
					props: EMPTY_SECTION_PROPS,
					previewHeight: 160,
					imports: ["EmptyTitle", "EmptyDescription"],
					snippetChildren: () => "<EmptyTitle>No runs yet</EmptyTitle>\n<EmptyDescription>Runs appear here once a pipeline has been started.</EmptyDescription>",
					preview: () => (
						<EmptyHeader>
							<EmptyTitle>No runs yet</EmptyTitle>
							<EmptyDescription>Runs appear here once a pipeline has been started.</EmptyDescription>
						</EmptyHeader>
					)
				},
				{
					name: "EmptyTitle",
					description: "The one line that says what is missing.",
					props: EMPTY_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "No runs yet",
					preview: () => (<EmptyTitle>No runs yet</EmptyTitle>)
				},
				{
					name: "EmptyDescription",
					description: "The muted line underneath, saying how the state is got out of.",
					props: EMPTY_SECTION_PROPS,
					previewHeight: 110,
					snippetChildren: () => "Runs appear here once a pipeline has been started.",
					preview: () => (<EmptyDescription>Runs appear here once a pipeline has been started.</EmptyDescription>)
				},
				{
					name: "EmptyContent",
					description: "The block under the header, where the action that resolves the empty state goes.",
					props: EMPTY_SECTION_PROPS,
					previewHeight: 130,
					snippetChildren: () => "<Button text={\"Start a run\"} buttonType={ButtonType.PRIMARY}></Button>",
					preview: () => (
						<EmptyContent>
							<Button text={"Start a run"} buttonType={ButtonType.PRIMARY}></Button>
						</EmptyContent>
					)
				}
			]}>

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
		</ComponentDoc>
	)
}
