import React, {useEffect, useRef, useState} from "react";
import Cookies from "js-cookie";

import './ChatSidebar.css';

export enum ChatSidebarState {
    OPEN,
    CLOSED
}

interface ChatSidebarProps {
    header: React.ReactNode;
    footer: React.ReactNode;
    children: React.ReactNode;
    defaultWidth?: number;
    cookieId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    header,
    footer,
    children,
    defaultWidth = 300,
    cookieId = "blue-orange-chat-sidebar-width"
}) => {
    const savedWidth = Cookies.get(cookieId);
    const initialWidth = savedWidth ? +savedWidth : defaultWidth;

    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const controlRef = useRef<HTMLDivElement | null>(null);
    const moving = useRef<boolean>(false);
    const sidebarStateRef = useRef<ChatSidebarState>(ChatSidebarState.OPEN);

    const [width, setWidth] = useState<number>(initialWidth);
    const [sidebarState, setSidebarState] = useState<ChatSidebarState>(ChatSidebarState.OPEN);

    const handleMouseDown = () => {
        moving.current = true;
    };

    const handleMouseUp = (ev: MouseEvent) => {
        if (moving.current) {
            const targetWidth = Math.max(250, Math.min(700, ev.x));
            Cookies.set(cookieId, targetWidth.toString());
        }
        moving.current = false;
    };

    const handleMouseMove = (ev: MouseEvent) => {
        if (moving.current && sidebarRef.current && sidebarStateRef.current === ChatSidebarState.OPEN) {
            const newWidth = Math.max(250, Math.min(700, ev.x));
            setWidth(newWidth);
        }
        if (moving.current && ev.x < 250 && sidebarStateRef.current === ChatSidebarState.OPEN) {
            setSidebarState(ChatSidebarState.CLOSED);
        } else if (moving.current && ev.x > 250 && sidebarStateRef.current === ChatSidebarState.CLOSED) {
            setSidebarState(ChatSidebarState.OPEN);
        }
    };

    useEffect(() => {
        sidebarStateRef.current = sidebarState;
    }, [sidebarState]);

    useEffect(() => {
        const controlEl = controlRef.current;

        if (controlEl) {
            controlEl.addEventListener('mousedown', handleMouseDown);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            if (controlEl) {
                controlEl.removeEventListener('mousedown', handleMouseDown);
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const toggleSidebarState = () => {
        setSidebarState(prev =>
            prev === ChatSidebarState.OPEN ? ChatSidebarState.CLOSED : ChatSidebarState.OPEN
        );
    };

    const isOpen = sidebarState === ChatSidebarState.OPEN;

    const classNames = [
        "blue-orange-chat-sidebar",
        !isOpen ? "blue-orange-chat-sidebar-closed" : ""
    ].filter(Boolean).join(" ");

    return (
        <div
            ref={sidebarRef}
            className={classNames}
            style={{width: isOpen ? width + "px" : undefined}}
        >
            <div className="blue-orange-chat-sidebar-header">
                {isOpen && header}
                <button
                    className="blue-orange-chat-sidebar-collapse-button"
                    onClick={toggleSidebarState}
                    title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <i className={isOpen ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line"}></i>
                </button>
            </div>
            <div className="blue-orange-chat-sidebar-body">
                {isOpen && children}
            </div>
            <div className="blue-orange-chat-sidebar-footer">
                {isOpen && footer}
            </div>
            {isOpen && (
                <div ref={controlRef} className="blue-orange-chat-sidebar-control"></div>
            )}
        </div>
    );
};
