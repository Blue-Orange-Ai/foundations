import React, { useContext } from "react";
import { SideBarBodyItem } from "@blue-orange-ai/foundations-core";
import { IChatCustomPage } from "../../../interfaces/ChatInterfaces";
import { ChatSidebarContext } from "../ChatSidebar";

import './ChatSidebarCustomPages.css';

interface Props {
    pages: IChatCustomPage[];
    activePageId?: string;
    onPageClick?: (page: IChatCustomPage) => void;
}

export const ChatSidebarCustomPages: React.FC<Props> = ({
    pages,
    activePageId,
    onPageClick
}) => {
    const { filterQuery } = useContext(ChatSidebarContext);

    if (pages.length === 0) return null;

    const filteredPages = filterQuery.trim()
        ? pages.filter(p => p.label.toLowerCase().includes(filterQuery.trim().toLowerCase()))
        : pages;

    return (
        <div className="blue-orange-chat-sidebar-custom-pages">
            {filteredPages.map(page => (
                <SideBarBodyItem
                    key={page.id}
                    label={page.label}
                    sortable={false}
                    active={activePageId === page.id}
                    focused={false}
                    icon={<i className={page.icon} />}
                    badge={page.badge}
                    activeStyle={{ color: '#ffffff' }}
                    onClick={() => {
                        onPageClick?.(page);
                        page.onClick?.();
                    }}
                />
            ))}
        </div>
    );
};
