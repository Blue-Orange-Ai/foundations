// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './IframeCanvas.css';

export interface IframeCanvasProps {
    /** Logical viewport width in CSS pixels. `null` fills the available pane. */
    width: number | null;
    /** Logical viewport height in CSS pixels. `null` fills the available pane. */
    height: number | null;
    /** Display scale (1 = 100%). Ignored in responsive/fill mode. */
    zoom?: number;
    /** Toggles the library's class-based dark theme inside the frame. */
    dark?: boolean;
    /** The component(s) to render inside the isolated viewport. */
    children?: React.ReactNode;
}

const MOUNT_ID = 'bo-preview-root';
const CLONED_ATTR = 'data-bo-cloned';

/**
 * Prepare a freshly created (about:blank) iframe document: a viewport meta tag,
 * a zero-margin body, and a mount node for the portalled React tree.
 */
const setupDocument = (doc: Document): HTMLElement => {
    const existing = doc.getElementById(MOUNT_ID);
    if (existing) {
        return existing;
    }

    const meta = doc.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1');
    doc.head.appendChild(meta);

    const baseStyle = doc.createElement('style');
    baseStyle.textContent =
        'html,body{margin:0;padding:0;}' +
        `#${MOUNT_ID}{min-height:100vh;}`;
    doc.head.appendChild(baseStyle);

    const mount = doc.createElement('div');
    mount.id = MOUNT_ID;
    doc.body.appendChild(mount);
    return mount;
};

/**
 * Copy every stylesheet from the parent document into the iframe head so the
 * previewed component is styled identically. Vite injects component CSS as
 * <style> tags (and global CSS as <link>/<style>) into the parent head; those
 * are cloned here. Re-run on parent-head mutations to track HMR updates.
 */
const syncStyles = (doc: Document) => {
    doc.head
        .querySelectorAll(`[${CLONED_ATTR}]`)
        .forEach((node) => node.parentNode?.removeChild(node));

    const sources = document.head.querySelectorAll(
        'style, link[rel="stylesheet"]'
    );
    sources.forEach((source) => {
        const clone = source.cloneNode(true) as HTMLElement;
        clone.setAttribute(CLONED_ATTR, 'true');
        doc.head.appendChild(clone);
    });
};

/**
 * Renders its children inside a real <iframe>. Because an iframe is a separate
 * browsing context with its own viewport, resizing it re-evaluates the CSS
 * `@media` queries of the content — which is exactly what a plain resized
 * <div> cannot do. This is the mechanism behind the responsive preview.
 */
export const IframeCanvas: React.FC<IframeCanvasProps> = ({
    width,
    height,
    zoom = 1,
    dark = false,
    children,
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

    // Initialise the iframe document and keep its styles in sync with the host.
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }

        let observer: MutationObserver | undefined;

        const init = () => {
            const doc = iframe.contentDocument;
            if (!doc) {
                return;
            }
            const mount = setupDocument(doc);
            syncStyles(doc);
            setMountNode(mount);

            observer = new MutationObserver(() => syncStyles(doc));
            observer.observe(document.head, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        };

        // about:blank iframes are same-origin and usually ready synchronously,
        // but fall back to the load event when they are not.
        if (iframe.contentDocument?.readyState === 'complete') {
            init();
        } else {
            iframe.addEventListener('load', init);
        }

        return () => {
            observer?.disconnect();
            iframe.removeEventListener('load', init);
        };
    }, []);

    // Apply / remove the class-based dark theme inside the frame.
    useEffect(() => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) {
            return;
        }
        const method = dark ? 'add' : 'remove';
        doc.documentElement.classList[method]('dark');
        doc.body?.classList[method]('dark');
    }, [dark, mountNode]);

    const responsive = width == null || height == null;
    const scale = responsive ? 1 : zoom;
    const logicalW = width ?? 0;
    const logicalH = height ?? 0;

    const wrapStyle: React.CSSProperties = responsive
        ? { width: '100%', height: '100%' }
        : { width: logicalW * scale, height: logicalH * scale };

    const iframeStyle: React.CSSProperties = responsive
        ? { width: '100%', height: '100%' }
        : {
              width: logicalW,
              height: logicalH,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
          };

    return (
        <div className="bo-iframe-canvas">
            <div className="bo-iframe-frame-wrap" style={wrapStyle}>
                <iframe
                    ref={iframeRef}
                    className="bo-iframe-frame"
                    title="Component preview"
                    style={iframeStyle}
                />
                {mountNode && createPortal(children, mountNode)}
            </div>
        </div>
    );
};
