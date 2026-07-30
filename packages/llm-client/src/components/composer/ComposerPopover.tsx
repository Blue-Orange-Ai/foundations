// ---------------------------------------------------------------------------
// ComposerPopover — a small panel anchored above a control in the composer bar.
//
// Core's ContextMenu covers list-shaped menus, but the settings panel holds real
// inputs (toggles, sliders), so it needs a plain container instead of menu rows.
// The composer bar sits at the bottom of the thread, so the panel always opens
// upwards — no flipping logic required. Closes on outside click and Escape.
// ---------------------------------------------------------------------------

import React, { ReactNode, useEffect, useRef } from 'react';

import './ComposerPopover.css';

interface Props {
    /** The button that opens the panel. */
    trigger: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    /** Which edge the panel lines up with (default 'right'). */
    align?: 'left' | 'right';
    width?: number;
}

export const ComposerPopover: React.FC<Props> = ({
    trigger,
    open,
    onOpenChange,
    children,
    align = 'right',
    width = 280,
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (target && wrapRef.current && !wrapRef.current.contains(target)) {
                onOpenChange(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onOpenChange(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onOpenChange]);

    return (
        <div className="blue-orange-llm-composer-popover-wrap" ref={wrapRef}>
            {trigger}
            {open && (
                <div
                    className={`blue-orange-llm-composer-popover blue-orange-llm-composer-popover-${align}`}
                    style={{ width: `${width}px` }}
                    role="dialog"
                >
                    {children}
                </div>
            )}
        </div>
    );
};
