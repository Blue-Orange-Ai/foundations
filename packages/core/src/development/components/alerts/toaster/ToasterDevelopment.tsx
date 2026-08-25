import React, {useContext, useRef, useState} from "react";

import './ToasterDevelopment.css'
import {GeneralHeading} from "../../../../components/text-decorations/general-heading/GeneralHeading";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {Modal} from "../../../../components/layouts/modal/modal/Modal";
import {Toast, ToastContext, ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../../../components/alerts/toast/toaster/Toaster";
import {v4 as uuidv4} from 'uuid';
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const LOCATION_NAMES: Record<number, string> = {
	[ToastLocation.TOP_LEFT]: "TOP_LEFT",
	[ToastLocation.TOP_RIGHT]: "TOP_RIGHT",
	[ToastLocation.BOTTOM_LEFT]: "BOTTOM_LEFT",
	[ToastLocation.BOTTOM_RIGHT]: "BOTTOM_RIGHT",
	[ToastLocation.CENTRE_TOP]: "CENTRE_TOP",
	[ToastLocation.CENTRE_BOTTOM]: "CENTRE_BOTTOM"
};

const TYPE_NAMES: Record<number, string> = {
	[ToasterType.DEFAULT]: "DEFAULT",
	[ToasterType.SUCCESS]: "SUCCESS",
	[ToasterType.WARNING]: "WARNING",
	[ToasterType.ERROR]: "ERROR"
};

const TOAST_INTERFACE = {
	name: "Toast",
	description: "What addToast takes. The same fields are the Toaster's own props, since the context renders one Toaster per toast it is holding.",
	props: [
		{name: "id", type: "string", required: true, description: "Identifies the toast, and is what updateToast and removeToast speak in."},
		{name: "location", type: "ToastLocation", required: true, description: "Which corner it is anchored to. The entry animation follows from it."},
		{name: "toastType", type: "ToasterType", required: true, description: "DEFAULT, SUCCESS, WARNING or ERROR."},
		{name: "ttl", type: "number", description: "Milliseconds before it dismisses itself, shown as a progress bar. Left off, it stays until it is closed."},
		{name: "heading", type: "string", description: "The bold first line."},
		{name: "description", type: "string", description: "The body."},
		{name: "icon", type: "ReactNode", description: "The glyph on the left."},
		{name: "action", type: "ReactNode", description: "A control inside the toast."},
		{name: "closeOnClick", type: "boolean", description: "Dismisses the toast when it is clicked anywhere."},
		{name: "showCloseButton", type: "boolean", description: "Puts a close button on it."}
	] as Array<PropSpec>
};

const TOAST_CONTEXT_INTERFACE = {
	name: "ToastContext",
	description: "The context toasts are raised through. Take it with useContext wherever a toast has to be put up.",
	props: [
		{name: "addToast", type: "(toast: Toast) => void", required: true, description: "Puts a toast up."},
		{name: "updateToast", type: "(id: string, updates: ToastUpdate) => void", required: true, description: "Changes a toast that is already showing."},
		{name: "removeToast", type: "(id: string) => void", required: true, description: "Takes a toast down."},
		{name: "addPromiseToast", type: "(options: PromiseToastOptions) => PromiseToastHandle", required: true, description: "Puts up a toast that follows a piece of work, and hands back a handle to update or close it."}
	] as Array<PropSpec>
};

const TOASTER_PROPS: Array<PropSpec> = [
	{
		name: "toastType",
		type: "ToasterType",
		required: true,
		control: "select",
		value: ToasterType.SUCCESS,
		options: [
			{label: "Default", value: ToasterType.DEFAULT, code: "ToasterType.DEFAULT"},
			{label: "Success", value: ToasterType.SUCCESS, code: "ToasterType.SUCCESS"},
			{label: "Warning", value: ToasterType.WARNING, code: "ToasterType.WARNING"},
			{label: "Error", value: ToasterType.ERROR, code: "ToasterType.ERROR"}
		],
		description: "Which treatment the toast wears."
	},
	{
		name: "location",
		type: "ToastLocation",
		required: true,
		control: "select",
		value: ToastLocation.TOP_RIGHT,
		options: [
			{label: "Top right", value: ToastLocation.TOP_RIGHT, code: "ToastLocation.TOP_RIGHT"},
			{label: "Top left", value: ToastLocation.TOP_LEFT, code: "ToastLocation.TOP_LEFT"},
			{label: "Centre top", value: ToastLocation.CENTRE_TOP, code: "ToastLocation.CENTRE_TOP"},
			{label: "Bottom right", value: ToastLocation.BOTTOM_RIGHT, code: "ToastLocation.BOTTOM_RIGHT"},
			{label: "Bottom left", value: ToastLocation.BOTTOM_LEFT, code: "ToastLocation.BOTTOM_LEFT"},
			{label: "Centre bottom", value: ToastLocation.CENTRE_BOTTOM, code: "ToastLocation.CENTRE_BOTTOM"}
		],
		description: "Which corner it is anchored to. Each one has its own entry animation."
	},
	{
		name: "heading",
		type: "string",
		control: "text",
		value: "Run finished",
		description: "The bold first line."
	},
	{
		name: "description",
		type: "string",
		control: "text",
		value: "Six of six stages completed.",
		description: "The body."
	},
	{
		name: "ttl",
		type: "number",
		control: "slider",
		min: 1000,
		max: 10000,
		step: 500,
		value: 4000,
		description: "Milliseconds before it dismisses itself, shown as a progress bar. Left off, it stays until it is closed."
	},
	{
		name: "icon",
		type: "ReactNode",
		description: "The glyph on the left."
	},
	{
		name: "action",
		type: "ReactNode",
		description: "A control inside the toast — undo, retry, open."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires when the toast is taken down."
	},
	{
		name: "closeOnClick",
		type: "boolean",
		control: "toggle",
		description: "Dismisses the toast when it is clicked anywhere."
	},
	{
		name: "showCloseButton",
		type: "boolean",
		control: "toggle",
		value: true,
		description: "Puts a close button on it."
	}
];

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
        <ComponentDoc
			title="Toaster"
			description="A notification that appears in a corner of the window and dismisses itself. Toasts are raised through the ToastContext rather than rendered directly — addToast puts one up, addPromiseToast puts up one that follows a piece of work from pending to its result."
			name="Toaster"
			previewHeight={160}
			imports={["ToasterType", "ToastLocation", "ToastContext"]}
			interfaces={[TOAST_INTERFACE, TOAST_CONTEXT_INTERFACE]}
			props={TOASTER_PROPS}
			usage={values => "import {ToastContext, ToastLocation, ToasterType} from \"@blue-orange-ai/foundations-core\";\nimport {v4 as uuidv4} from \"uuid\";\n\nconst {addToast} = useContext(ToastContext);\n\naddToast({\n\tid: uuidv4(),\n\tlocation: ToastLocation." + (LOCATION_NAMES[values.location] ?? "TOP_RIGHT") + ",\n\ttoastType: ToasterType." + (TYPE_NAMES[values.toastType] ?? "DEFAULT") + ",\n\tttl: " + (values.ttl ?? 4000) + ",\n\theading: " + JSON.stringify(values.heading) + ",\n\tdescription: " + JSON.stringify(values.description) + ",\n\tcloseOnClick: " + Boolean(values.closeOnClick) + ",\n\tshowCloseButton: " + Boolean(values.showCloseButton) + "\n});"}
			preview={values => (
				<Button
					text={"Raise the toast"}
					buttonType={ButtonType.PRIMARY}
					onClick={() => addToast({
						id: uuidv4(),
						location: values.location,
						toastType: values.toastType,
						ttl: values.ttl,
						heading: values.heading,
						description: values.description,
						closeOnClick: values.closeOnClick,
						showCloseButton: values.showCloseButton
					})}></Button>
			)}>


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
        </ComponentDoc>
    )
}
