import React, {useContext, useRef, useState} from "react";

import './ToasterDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {Modal} from "../../../../components/layouts/modal/modal/Modal";
import {Toast, ToastContext, ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../../../components/alerts/toast/toaster/Toaster";
import {v4 as uuidv4} from 'uuid';

interface Props {
}

// The six positions a toast can be anchored to, together with the entry
// animation each one uses (from animate.css). This mapping is the single source
// of truth for the "Locations & animations" section below.
const LOCATIONS: { location: ToastLocation, label: string, animation: string }[] = [
    {location: ToastLocation.TOP_LEFT, label: "Top Left", animation: "fadeInLeft"},
    {location: ToastLocation.TOP_RIGHT, label: "Top Right", animation: "fadeInRight"},
    {location: ToastLocation.CENTRE_TOP, label: "Centre Top", animation: "fadeInDown"},
    {location: ToastLocation.BOTTOM_LEFT, label: "Bottom Left", animation: "fadeInLeft"},
    {location: ToastLocation.BOTTOM_RIGHT, label: "Bottom Right", animation: "fadeInRight"},
    {location: ToastLocation.CENTRE_BOTTOM, label: "Centre Bottom", animation: "fadeInUp"},
];

const TYPES: { type: ToasterType, label: string, buttonType: ButtonType, icon: string }[] = [
    {type: ToasterType.DEFAULT, label: "Default", buttonType: ButtonType.PRIMARY, icon: "ri-information-line"},
    {type: ToasterType.SUCCESS, label: "Success", buttonType: ButtonType.SUCCESS, icon: "ri-checkbox-circle-line"},
    {type: ToasterType.WARNING, label: "Warning", buttonType: ButtonType.WARNING, icon: "ri-alert-line"},
    {type: ToasterType.ERROR, label: "Error", buttonType: ButtonType.DANGER, icon: "ri-error-warning-line"},
];

export const ToasterDevelopment: React.FC<Props> = ({}) => {

    const {addToast, addPromiseToast} = useContext(ToastContext);
    const promiseToastRef = useRef<ReturnType<typeof addPromiseToast> | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const iconForType = (toastType: ToasterType) => {
        const match = TYPES.find(t => t.type === toastType);
        return <i className={match ? match.icon : "ri-information-line"}></i>;
    }

    // A temporary toast: auto-dismisses after `ttl` and shows a progress bar.
    const createToast = (location: ToastLocation, toastType: ToasterType, overrides: Partial<Toast> = {}) => {
        const toast: Toast = {
            id: uuidv4(),
            location,
            ttl: 4000,
            toastType,
            heading: "Notification",
            description: "This is a toast description",
            icon: iconForType(toastType),
            ...overrides
        }
        addToast(toast);
    }

    // A persistent toast: no `ttl`, so it stays until the user dismisses it via
    // the close button (or a click, if closeOnClick is enabled).
    const createToastPersistent = (location: ToastLocation, toastType: ToasterType, overrides: Partial<Toast> = {}) => {
        const toast: Toast = {
            id: uuidv4(),
            location,
            toastType,
            heading: "Persistent notification",
            description: "Stays until dismissed",
            icon: iconForType(toastType),
            ...overrides
        }
        addToast(toast);
    }

    const createPromiseToast = (location: ToastLocation) => {
        const handle = addPromiseToast({
            location,
            heading: "Working...",
            description: "Starting job",
            toastType: ToasterType.DEFAULT,
            icon: <i className={"ri-loader-4-line"}></i>
        });
        promiseToastRef.current = handle;

        setTimeout(() => {
            handle.update({
                heading: "Still working...",
                description: "Half way there"
            });
        }, 1500);

        setTimeout(() => {
            handle.update({
                heading: "Done",
                description: "Completed successfully",
                toastType: ToasterType.SUCCESS,
                icon: <i className={"ri-checkbox-circle-line"}></i>
            });
            setTimeout(() => {
                handle.close();
                if (promiseToastRef.current?.id === handle.id) {
                    promiseToastRef.current = null;
                }
            }, 2000);
        }, 3000);
    }

    const updatePromiseToast = () => {
        promiseToastRef.current?.update({
            heading: "Updated programmatically",
            description: `Updated at ${new Date().toLocaleTimeString()}`
        });
    }

    const closePromiseToast = () => {
        promiseToastRef.current?.close();
        promiseToastRef.current = null;
    }

    return (
        <PaddedPage>
            <PageHeading>Toaster</PageHeading>

            <p className="blue-orange-toaster-development-intro">
                Toasts are transient notifications rendered through the <code>ToastContext</code> provider.
                Trigger one with <code>addToast(...)</code> (or <code>addPromiseToast(...)</code> for
                long-running work). Every toast is anchored to one of six screen positions, animates in
                from the nearest edge, and renders above <strong>all</strong> other layouts — including
                modals and drawers.
            </p>

            {/* ── 1. Locations & entry animations ───────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>1. Locations &amp; entry animations</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    Each position animates in from its nearest edge. Left/right columns slide horizontally,
                    while the centre-top and centre-bottom toasts drop down and rise up respectively.
                    These are temporary toasts (4s TTL) so you can watch the entry animation and the
                    progress bar countdown.
                </p>
                <div className="blue-orange-toaster-development-grid">
                    {LOCATIONS.map(({location, label, animation}) => (
                        <Button
                            key={label}
                            text={`${label} — ${animation}`}
                            buttonType={ButtonType.PRIMARY}
                            onClick={() => createToast(location, ToasterType.DEFAULT)}
                        ></Button>
                    ))}
                </div>
            </section>

            {/* ── 2. Toast types ────────────────────────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>2. Toast types</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    Four semantic styles convey intent: default, success, warning and error. Each colours
                    the background, text and progress bar accordingly.
                </p>
                <div className="blue-orange-toaster-development-grid">
                    {TYPES.map(({type, label, buttonType}) => (
                        <Button
                            key={label}
                            text={label}
                            buttonType={buttonType}
                            onClick={() => createToast(ToastLocation.TOP_RIGHT, type, {heading: `${label} toast`})}
                        ></Button>
                    ))}
                </div>
            </section>

            {/* ── 3. Content variations ─────────────────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>3. Content variations</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    A toast can render any combination of icon, heading, description and an action node.
                    Omit the heading for a compact single-line toast.
                </p>
                <div className="blue-orange-toaster-development-grid">
                    <Button
                        text={"Description only"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => createToast(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT, {
                            heading: undefined,
                            icon: undefined,
                            description: "A compact, single-line toast with no heading or icon."
                        })}
                    ></Button>
                    <Button
                        text={"Heading + description"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => createToast(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT, {
                            heading: "Heading",
                            description: "Supporting description text underneath the heading."
                        })}
                    ></Button>
                    <Button
                        text={"With icon"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => createToast(ToastLocation.TOP_RIGHT, ToasterType.SUCCESS, {
                            heading: "File uploaded",
                            description: "report.pdf is ready to share."
                        })}
                    ></Button>
                    <Button
                        text={"With action"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => createToast(ToastLocation.BOTTOM_RIGHT, ToasterType.DEFAULT, {
                            ttl: 8000,
                            heading: "Item deleted",
                            description: "The item was moved to trash.",
                            icon: <i className={"ri-delete-bin-line"}></i>,
                            action: (
                                <Button
                                    text={"Undo"}
                                    buttonType={ButtonType.SECONDARY}
                                    onClick={() => createToast(ToastLocation.BOTTOM_RIGHT, ToasterType.SUCCESS, {heading: "Restored", description: "The item was restored."})}
                                ></Button>
                            )
                        })}
                    ></Button>
                </div>
            </section>

            {/* ── 4. Persistent toasts ──────────────────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>4. Persistent toasts (no TTL)</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    Omit <code>ttl</code> and the toast stays until dismissed. Persistent toasts show a
                    close button by default (hide it with <code>showCloseButton=false</code>).
                </p>
                <div className="blue-orange-toaster-development-grid">
                    {TYPES.map(({type, label, buttonType}) => (
                        <Button
                            key={label}
                            text={`${label} persistent`}
                            buttonType={buttonType}
                            onClick={() => createToastPersistent(ToastLocation.TOP_RIGHT, type, {heading: `${label} (persistent)`})}
                        ></Button>
                    ))}
                    <Button
                        text={"No close button"}
                        buttonType={ButtonType.SECONDARY}
                        onClick={() => createToastPersistent(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT, {
                            heading: "No close button",
                            description: "Dismiss this one programmatically.",
                            showCloseButton: false
                        })}
                    ></Button>
                </div>
            </section>

            {/* ── 5. Click-to-dismiss ───────────────────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>5. Click-to-dismiss</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    Temporary toasts dismiss on click by default (<code>closeOnClick=true</code>).
                    Set it to <code>false</code> to keep a toast open when clicked.
                </p>
                <div className="blue-orange-toaster-development-grid">
                    <Button
                        text={"Click to dismiss (default)"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => createToast(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT, {
                            ttl: 10000,
                            heading: "Click me",
                            description: "Clicking this toast dismisses it."
                        })}
                    ></Button>
                    <Button
                        text={"Click ignored"}
                        buttonType={ButtonType.SECONDARY}
                        onClick={() => createToast(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT, {
                            ttl: 10000,
                            heading: "Not clickable",
                            description: "Clicking this toast does nothing; it waits for the TTL.",
                            closeOnClick: false
                        })}
                    ></Button>
                </div>
            </section>

            {/* ── 6. Promise toasts ─────────────────────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>6. Promise toasts</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    <code>addPromiseToast(...)</code> returns a handle with <code>update()</code> and
                    <code>close()</code> for reflecting the state of long-running work. Start one, then
                    update or close it programmatically. The demo below auto-advances through
                    working → done and dismisses itself.
                </p>
                <div className="blue-orange-toaster-development-grid">
                    <Button
                        text={"Start (auto lifecycle)"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => createPromiseToast(ToastLocation.TOP_RIGHT)}
                    ></Button>
                    <Button
                        text={"Update last handle"}
                        buttonType={ButtonType.SECONDARY}
                        onClick={updatePromiseToast}
                    ></Button>
                    <Button
                        text={"Close last handle"}
                        buttonType={ButtonType.DANGER}
                        onClick={closePromiseToast}
                    ></Button>
                </div>
            </section>

            {/* ── 7. Stacking above modals & drawers ────────────────────── */}
            <section className="blue-orange-toaster-development-section">
                <GeneralHeading>7. Stacking above modals &amp; drawers</GeneralHeading>
                <p className="blue-orange-toaster-development-note">
                    Toasts use the maximum z-index, so they always render above overlays such as modals
                    and drawers. Open the modal below, then fire a toast — it appears on top of the modal.
                </p>
                <div className="blue-orange-toaster-development-grid">
                    <Button
                        text={"Open a modal"}
                        buttonType={ButtonType.PRIMARY}
                        onClick={() => setModalOpen(true)}
                    ></Button>
                    <Button
                        text={"Fire toast over modal"}
                        buttonType={ButtonType.SUCCESS}
                        onClick={() => createToast(ToastLocation.CENTRE_TOP, ToasterType.SUCCESS, {
                            heading: "On top of the modal",
                            description: "Toasts win the z-index battle."
                        })}
                    ></Button>
                </div>
            </section>

            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <div className="blue-orange-toaster-development-modal">
                        <GeneralHeading>Modal</GeneralHeading>
                        <p className="blue-orange-toaster-development-note">
                            Fire a toast (button below) and confirm it renders in front of this modal.
                        </p>
                        <div className="blue-orange-toaster-development-grid">
                            <Button
                                text={"Fire toast"}
                                buttonType={ButtonType.SUCCESS}
                                onClick={() => createToast(ToastLocation.CENTRE_TOP, ToasterType.SUCCESS, {
                                    heading: "Above the modal",
                                    description: "z-index confirmed."
                                })}
                            ></Button>
                            <Button
                                text={"Close modal"}
                                buttonType={ButtonType.SECONDARY}
                                onClick={() => setModalOpen(false)}
                            ></Button>
                        </div>
                    </div>
                </Modal>
            )}
        </PaddedPage>
    )
}
