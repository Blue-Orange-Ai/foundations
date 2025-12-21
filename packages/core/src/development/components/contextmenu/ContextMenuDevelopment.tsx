import React, {useState} from "react";

import './ContextMenuDevelopment.css'


import {ContextMenu, IContextMenuItem, IContextMenuType} from "../../../components/contextmenu/contextmenu/ContextMenu";
import {Button, ButtonType} from "../../../components/buttons/button/Button";
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {SplitPageMajor} from "../../../components/layouts/pages/split-pages/split-page-major/SplitPageMajor";
import {RichText} from "../../../components/inputs/richtext/default/RichText";
import {SplitPageMinor} from "../../../components/layouts/pages/split-pages/split-page-minor/SplitPageMinor";
import {
    HorizontalSplitPage
} from "../../../components/layouts/pages/split-pages/horizontal-split-page/HorizontalSplitPage";


interface Props {
}

export const ContextMenuDevelopment: React.FC<Props> = ({}) => {

	const [selection, setSelection] = useState<IContextMenuItem>()

    const contextMenuItems: Array<IContextMenuItem> = [
		{type: IContextMenuType.HEADING, label: "Sort Direction", value:""},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{type: IContextMenuType.SEPARATOR, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
		{
			type: IContextMenuType.GROUP,
			label: "More Options",
			icon: "ri-more-2-fill",
			children: [
				{type: IContextMenuType.CONTENT, label: "Rename", icon: "ri-edit-fill", value: "RENAME"},
				{type: IContextMenuType.CONTENT, label: "Duplicate", icon: "ri-file-copy-line", value: "DUPLICATE"},
				{
					type: IContextMenuType.GROUP,
					label: "Advanced",
					children: [
						{type: IContextMenuType.CONTENT, label: "Export", icon: "ri-download-2-line", value: "EXPORT"},
						{type: IContextMenuType.CONTENT, label: "Archive", icon: "ri-inbox-archive-line", value: "ARCHIVE"},
					]
				}
			]
		},
		{type: IContextMenuType.CONTENT, label: "Sort Asc", icon: "ri-sort-asc", value: "SORT_ASC"},
		{type: IContextMenuType.CONTENT, label: "Sort Desc", icon: "ri-sort-asc", value: "SORT_DESC"},
	]

	return (
        <HorizontalSplitPage>
            <SplitPageMajor>
                <PaddedPage>
                    <PageHeading>Context Menu</PageHeading>
                    <ContextMenu items={contextMenuItems} onClick={setSelection}>
                        <Button text={"Click to Display Context Menu"} buttonType={ButtonType.PRIMARY}></Button>
                    </ContextMenu>
                </PaddedPage>
            </SplitPageMajor>
            <SplitPageMinor>
                <div className="workspace-output-window">
                    <div style={{marginBottom: "20px"}}>Output:</div>
                    <div style={{whiteSpace: "pre-wrap", fontFamily: "monospace"}}>
                        {JSON.stringify(selection, null, 2)}
                    </div>
                </div>
            </SplitPageMinor>
        </HorizontalSplitPage>




	)
}