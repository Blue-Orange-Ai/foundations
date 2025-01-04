import React, {useEffect, useRef, useState} from "react";

import './UserTableFooter.css'
import {ContextMenu} from "../../../utils/contextmenu/ContextMenu";
import {IContextMenuItem} from "../../../../interfaces/AppInterfaces";
import {UserSearchResult} from "../../../utils/sdks/passport/Passport";

interface Props {
	userSearchResult: UserSearchResult,
	updatePage: (page: number) => void;
	updateSize: (size: number) => void;
}

export const UserTableFooter: React.FC<Props> = ({userSearchResult, updatePage, updateSize}) => {
	const generateItemsPerPageContextMenu = () => {
		var contextMenu: Array<IContextMenuItem> = []
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>10</div>",
			value: 10
		});
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>25</div>",
			value: 25
		});
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>50</div>",
			value: 50
		});
		contextMenu.push({
			label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Items per page:</span>100</div>",
			value: 100
		});
		return contextMenu;
	}

	const generateItemsPageContextMenu = () => {
		var contextMenu: Array<IContextMenuItem> = []
		var items = Math.ceil(userSearchResult.count / userSearchResult.query.size);
		for (var i=0; i < items; i++) {
			contextMenu.push({
				label: "<div class='passport-default-context-menu-row-general-text'><span class='passport-user-management-table-footer-select-info'>Page number:</span>" + (i + 1) + "</div>",
				value: i
			});
		}
		return contextMenu;
	}

	const contextMenuItemsPerPage = generateItemsPerPageContextMenu();

	const contextMenuItemsPerPageClicked = (item: IContextMenuItem) => {
		updateSize(item.value);
	}

	const contextMenuPageClicked = (item: IContextMenuItem) => {
		updatePage(item.value + 1);
	}

	return (
		<div className="passport-user-management-table-footer">
			<div className="passport-user-management-table-footer-left">
				<ContextMenu
					width={150}
					items={contextMenuItemsPerPage}
					maxHeight={250}
					onClick={(item) => contextMenuItemsPerPageClicked(item)}
				>
					<div className="passport-user-management-table-footer-general-btn passport-user-management-table-footer-batch-size-select no-select">
						<span className="passport-user-management-table-footer-select-info">Items per page:</span>
						{userSearchResult.query.size}
						<span className="passport-user-management-table-footer-select-control"><i className="ri-expand-up-down-fill"></i></span>
					</div>
				</ContextMenu>
				<div className="passport-user-management-table-footer-user-info">
					{userSearchResult.query.page * userSearchResult.query.size}-{Math.min(userSearchResult.count, userSearchResult.query.page * userSearchResult.query.size + userSearchResult.query.page * userSearchResult.query.size)} of {userSearchResult.count} items</div>
			</div>
			<div className="passport-user-management-table-footer-right">
				<div className="passport-user-management-table-footer-general-btn passport-user-management-table-footer-change-page no-select passport-user-management-table-footer-change-page-disabled">
					<i className="ri-arrow-right-s-fill"></i>
				</div>
				<div className="passport-user-management-table-footer-general-btn passport-user-management-table-footer-change-page no-select">
					<i className="ri-arrow-left-s-fill"></i>
				</div>
				<ContextMenu
					width={150}
					items={generateItemsPageContextMenu()}
					maxHeight={250}
					onClick={(item) => contextMenuPageClicked(item)}
				>
					<div className="passport-user-management-table-footer-general-btn passport-user-management-table-footer-page-select no-select">
						<span className="passport-user-management-table-footer-select-info">Page number:</span>
						{userSearchResult.query.page + 1}
						<span className="passport-user-management-table-footer-select-control"><i className="ri-expand-up-down-fill"></i></span>
					</div>
				</ContextMenu>
			</div>
		</div>
	)
}