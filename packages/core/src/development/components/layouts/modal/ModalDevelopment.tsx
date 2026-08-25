import React, {useState} from "react";

import './ModalDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {Modal} from "../../../../components/layouts/modal/modal/Modal";
import {ModalHeader} from "../../../../components/layouts/modal/modal-header/ModalHeader";
import {ModalBody} from "../../../../components/layouts/modal/modal-body/ModalBody";
import {ModalFooter} from "../../../../components/layouts/modal/modal-footer/ModalFooter";
import {ModalFooterLeft} from "../../../../components/layouts/modal/modal-footer-left/ModalFooterLeft";
import {ModalFooterRight} from "../../../../components/layouts/modal/modal-footer-right/ModalFooterRight";
import {Input} from "../../../../components/inputs/input/Input";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {Dropdown} from "../../../../components/inputs/dropdown/basic/Dropdown";
import {DropdownItemIcon} from "../../../../components/inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {InputForm} from "../../../../components/inputs/form/InputForm";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";
import {ModalDescription} from "../../../../components/layouts/modal/modal-description/ModalDescription";

const MODAL_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The modal's parts — a header, a description, a body and a footer."
	},
	{
		name: "open",
		type: "boolean",
		description: "Whether the modal is showing. It is controlled, so this is the caller's to hold."
	},
	{
		name: "width",
		type: "number",
		default: "375",
		control: "slider",
		min: 280,
		max: 900,
		step: 25,
		description: "Width of the window, in pixels."
	},
	{
		name: "minWidth",
		type: "number",
		default: "375",
		control: "number",
		description: "How narrow the window is allowed to get on a small screen."
	},
	{
		name: "minHeight",
		type: "number",
		default: "0",
		control: "number",
		description: "A floor under the window's height, for a modal that would otherwise be very short."
	},
	{
		name: "container",
		type: "HTMLElement | null",
		description: "Where the modal is portalled to. It goes to the document body by default, so no ancestor with a transform can trap it."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires on a backdrop click and on the header's close icon."
	}
];

const MODAL_HEADER_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Delete run",
		description: "The modal's title."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires when the close icon is clicked."
	}
];

const MODAL_DESCRIPTION_PROPS: Array<PropSpec> = [
	{
		name: "description",
		type: "string",
		required: true,
		control: "text",
		value: "This cannot be undone.",
		description: "The line under the title."
	}
];

const MODAL_CHILDREN_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The section's content."
	}
];

interface Props {
}

type OpenModal = "NONE" | "BASIC" | "FORM" | "WIDE" | "CONFIRM" | "DROPDOWN";

const USAGE = `const [open, setOpen] = useState(false);

<Modal open={open} width={480} onClose={() => setOpen(false)}>
    <ModalHeader label="Invite a teammate" onClose={() => setOpen(false)}></ModalHeader>
    <ModalDescription description="They will receive an email invitation."></ModalDescription>
    <ModalBody>
        <Input label="Email" placeholder="person@company.com"></Input>
    </ModalBody>
    <ModalFooter>
        <ModalFooterLeft>
            <Button text="Cancel" buttonType={ButtonType.CLEAR} onClick={() => setOpen(false)}></Button>
        </ModalFooterLeft>
        <ModalFooterRight>
            <Button text="Send invite" buttonType={ButtonType.PRIMARY}></Button>
        </ModalFooterRight>
    </ModalFooter>
</Modal>`;

const UNCONTROLLED_USAGE = `{open &&
    <Modal onClose={() => setOpen(false)}>
        ...
    </Modal>
}`;

export const ModalDevelopment: React.FC<Props> = ({}) => {

	const [open, setOpen] = useState<OpenModal>("NONE");

	const close = () => setOpen("NONE");

	const [docsModalOpen, setDocsModalOpen] = useState(false);

	return (
		<ComponentDoc
			title="Modal"
			description="A window over the page with its own backdrop. Clicking the backdrop, the header's close icon or any of your own buttons calls back through onClose — the caller decides what open is next."
			name="Modal"
			previewHeight={160}
			imports={["ModalHeader", "ModalDescription", "ModalBody", "ModalFooter", "ModalFooterLeft", "ModalFooterRight"]}
			props={MODAL_PROPS}
			snippetChildren={() => "<ModalHeader label={\"Delete run\"} onClose={close}></ModalHeader>\n<ModalDescription description={\"This cannot be undone.\"}></ModalDescription>\n<ModalBody>\n\t<p>The run and everything it produced will be removed.</p>\n</ModalBody>\n<ModalFooter>\n\t<ModalFooterRight>\n\t\t<Button text={\"Delete\"} buttonType={ButtonType.DANGER}></Button>\n\t</ModalFooterRight>\n</ModalFooter>"}
			preview={values => (
				<>
					<Button
						text="Open the modal"
						buttonType={ButtonType.PRIMARY}
						onClick={() => setDocsModalOpen(true)}></Button>
					<Modal
						open={docsModalOpen}
						width={values.width}
						minWidth={values.minWidth}
						minHeight={values.minHeight}
						onClose={() => setDocsModalOpen(false)}>
						<ModalHeader label="Delete run" onClose={() => setDocsModalOpen(false)}></ModalHeader>
						<ModalDescription description="This cannot be undone."></ModalDescription>
						<ModalBody>
							<p>The run and everything it produced will be removed.</p>
						</ModalBody>
						<ModalFooter>
							<ModalFooterRight>
								<Button text="Cancel" buttonType={ButtonType.SECONDARY} onClick={() => setDocsModalOpen(false)}></Button>
								<Button text="Delete" buttonType={ButtonType.DANGER} onClick={() => setDocsModalOpen(false)}></Button>
							</ModalFooterRight>
						</ModalFooter>
					</Modal>
				</>
			)}
			siblings={[
				{
					name: "ModalHeader",
					description: "The title bar, with the close icon on the right.",
					props: MODAL_HEADER_PROPS,
					previewHeight: 110,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<ModalHeader label={values.label}></ModalHeader>
						</div>
					)
				},
				{
					name: "ModalDescription",
					description: "The muted line under the title, saying what the modal is about to do.",
					props: MODAL_DESCRIPTION_PROPS,
					previewHeight: 110,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<ModalDescription description={values.description}></ModalDescription>
						</div>
					)
				},
				{
					name: "ModalBody",
					description: "The scrolling middle of the modal.",
					props: MODAL_CHILDREN_PROPS,
					previewHeight: 120,
					previewCentered: false,
					snippetChildren: () => "<p>The run and everything it produced will be removed.</p>",
					preview: () => (
						<div style={{width: "100%"}}>
							<ModalBody><p style={{margin: 0}}>The run and everything it produced will be removed.</p></ModalBody>
						</div>
					)
				},
				{
					name: "ModalFooter",
					description: "The button bar. It reads ModalFooterLeft and ModalFooterRight out of its children and pushes each to its own end.",
					props: MODAL_CHILDREN_PROPS,
					previewHeight: 120,
					previewCentered: false,
					imports: ["ModalFooterLeft", "ModalFooterRight"],
					snippetChildren: () => "<ModalFooterLeft>\n\t<Button text={\"Help\"} buttonType={ButtonType.CLEAR}></Button>\n</ModalFooterLeft>\n<ModalFooterRight>\n\t<Button text={\"Delete\"} buttonType={ButtonType.DANGER}></Button>\n</ModalFooterRight>",
					preview: () => (
						<div style={{width: "100%"}}>
							<ModalFooter>
								<ModalFooterLeft>
									<Button text="Help" buttonType={ButtonType.CLEAR}></Button>
								</ModalFooterLeft>
								<ModalFooterRight>
									<Button text="Delete" buttonType={ButtonType.DANGER}></Button>
								</ModalFooterRight>
							</ModalFooter>
						</div>
					)
				}
			]}>
			<Paragraph>
				Pass a single boolean through open to control it. The modal stays mounted while it animates out, so
				closing fades and scales back down instead of disappearing. Leaving open off keeps the old behaviour —
				rendering the modal means it is open, and unmounting it removes it with no closing animation.
			</Paragraph>

			<div className="modal-dev-section">
				<FormHeading label="Variants"></FormHeading>
				<div className="modal-dev-buttons">
					<Button text="Basic modal" buttonType={ButtonType.PRIMARY}
							onClick={() => setOpen("BASIC")}></Button>
					<Button text="With a form" buttonType={ButtonType.SECONDARY}
							onClick={() => setOpen("FORM")}></Button>
					<Button text="Wide (720px)" buttonType={ButtonType.SECONDARY}
							onClick={() => setOpen("WIDE")}></Button>
					<Button text="Destructive confirm" buttonType={ButtonType.DANGER}
							onClick={() => setOpen("CONFIRM")}></Button>
					<Button text="With dropdowns" buttonType={ButtonType.SECONDARY}
							onClick={() => setOpen("DROPDOWN")}></Button>
				</div>
			</div>

			<div className="modal-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<Paragraph>
					One boolean opens and closes the modal, and both animations run off it.
				</Paragraph>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
				<Paragraph>
					Mounting the modal conditionally still works — it opens with the same animation, but React removes
					it before the closing one can run.
				</Paragraph>
				<CodeBlock value={{code: UNCONTROLLED_USAGE, lang: "tsx"}}></CodeBlock>
			</div>

			<Modal open={open === "BASIC"} onClose={close}>
				<ModalHeader label="Basic modal" onClose={close}></ModalHeader>
				<ModalBody>
					<Paragraph>
						The default width is 375px. Everything between the header and the footer is yours.
					</Paragraph>
				</ModalBody>
				<ModalFooter>
					<ModalFooterRight>
						<Button text="Close" buttonType={ButtonType.PRIMARY} onClick={close}></Button>
					</ModalFooterRight>
				</ModalFooter>
			</Modal>

			<Modal open={open === "FORM"} width={480} onClose={close}>
				<ModalHeader label="Invite a teammate" onClose={close}></ModalHeader>
				<ModalDescription description="They will receive an email invitation."></ModalDescription>
				<ModalBody>
					<Input label="Full name" placeholder="Ada Lovelace"></Input>
					<div style={{height: "12px"}}></div>
					<Input label="Email" placeholder="person@company.com" isEmail={true}></Input>
				</ModalBody>
				<ModalFooter>
					<ModalFooterLeft>
						<Button text="Cancel" buttonType={ButtonType.CLEAR} onClick={close}></Button>
					</ModalFooterLeft>
					<ModalFooterRight>
						<Button text="Send invite" buttonType={ButtonType.PRIMARY} onClick={close}></Button>
					</ModalFooterRight>
				</ModalFooter>
			</Modal>

			<Modal open={open === "WIDE"} width={720} minHeight={320} onClose={close}>
				<ModalHeader label="Wide modal" onClose={close}></ModalHeader>
				<ModalDescription description="width and minHeight size the card."></ModalDescription>
				<ModalBody>
					<Paragraph>
						Use a wider card for side by side content, tables or anything that reads badly in a narrow
						column.
					</Paragraph>
				</ModalBody>
				<ModalFooter>
					<ModalFooterRight>
						<Button text="Done" buttonType={ButtonType.PRIMARY} onClick={close}></Button>
					</ModalFooterRight>
				</ModalFooter>
			</Modal>

			{/* A dropdown positions its popup off viewport coordinates, so the card must not become the
			    containing block for the popup's `position: fixed` — see Modal.css. */}
			<Modal open={open === "DROPDOWN"} width={600} minWidth={600} onClose={close}>
				<ModalHeader label="Add Member" onClose={close}></ModalHeader>
				<ModalBody>
					<InputForm paddingBottom={40}>
						<Dropdown label={"Member Type"}>
							<DropdownItemIcon src={"ri-shield-star-fill"} label={"Group"} value={"GROUP"} selected={false}></DropdownItemIcon>
							<DropdownItemIcon src={"ri-pencil-fill"} label={"User"} value={"USER"} selected={true}></DropdownItemIcon>
						</Dropdown>
						<Dropdown label={"Permission"}>
							<DropdownItemIcon src={"ri-shield-star-fill"} label={"Owner"} value={"OWNER"} selected={false}></DropdownItemIcon>
							<DropdownItemIcon src={"ri-pencil-fill"} label={"Edit"} value={"EDIT"} selected={false}></DropdownItemIcon>
							<DropdownItemIcon src={"ri-eye-fill"} label={"Read"} value={"READ"} selected={true}></DropdownItemIcon>
						</Dropdown>
					</InputForm>
				</ModalBody>
				<ModalFooter>
					<ModalFooterLeft>
						<Button text="Cancel" buttonType={ButtonType.CLEAR} onClick={close}></Button>
					</ModalFooterLeft>
					<ModalFooterRight>
						<Button text="Save" buttonType={ButtonType.PRIMARY} onClick={close}></Button>
					</ModalFooterRight>
				</ModalFooter>
			</Modal>

			<Modal open={open === "CONFIRM"} onClose={close}>
				<ModalHeader label="Delete workspace" onClose={close}></ModalHeader>
				<ModalDescription description="This cannot be undone."></ModalDescription>
				<ModalBody>
					<Paragraph>Every project, file and comment in this workspace will be removed.</Paragraph>
				</ModalBody>
				<ModalFooter>
					<ModalFooterLeft>
						<Button text="Cancel" buttonType={ButtonType.CLEAR} onClick={close}></Button>
					</ModalFooterLeft>
					<ModalFooterRight>
						<Button text="Delete" buttonType={ButtonType.DANGER} onClick={close}></Button>
					</ModalFooterRight>
				</ModalFooter>
			</Modal>
		</ComponentDoc>
	)
}
