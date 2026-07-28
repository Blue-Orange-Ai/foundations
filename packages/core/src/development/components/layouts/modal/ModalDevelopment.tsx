import React, {useState} from "react";

import './ModalDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {Modal} from "../../../../components/layouts/modal/modal/Modal";
import {ModalHeader} from "../../../../components/layouts/modal/modal-header/ModalHeader";
import {ModalDescription} from "../../../../components/layouts/modal/modal-description/ModalDescription";
import {ModalBody} from "../../../../components/layouts/modal/modal-body/ModalBody";
import {ModalFooter} from "../../../../components/layouts/modal/modal-footer/ModalFooter";
import {ModalFooterLeft} from "../../../../components/layouts/modal/modal-footer-left/ModalFooterLeft";
import {ModalFooterRight} from "../../../../components/layouts/modal/modal-footer-right/ModalFooterRight";
import {Input} from "../../../../components/inputs/input/Input";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";

interface Props {
}

type OpenModal = "NONE" | "BASIC" | "FORM" | "WIDE" | "CONFIRM";

const USAGE = `const [open, setOpen] = useState(false);

{open &&
    <Modal width={480} onClose={() => setOpen(false)}>
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
    </Modal>
}`;

export const ModalDevelopment: React.FC<Props> = ({}) => {

	const [open, setOpen] = useState<OpenModal>("NONE");

	const close = () => setOpen("NONE");

	return (
		<PaddedPage>
			<PageHeading>Modal</PageHeading>
			<Paragraph>
				A modal renders over the page with its own backdrop. Clicking the backdrop, the header's close icon or
				any of your own buttons calls back through onClose — the modal itself holds no open state, the caller
				decides when it is mounted.
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
				</div>
			</div>

			<div className="modal-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>

			{open === "BASIC" &&
				<Modal onClose={close}>
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
			}

			{open === "FORM" &&
				<Modal width={480} onClose={close}>
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
			}

			{open === "WIDE" &&
				<Modal width={720} minHeight={320} onClose={close}>
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
			}

			{open === "CONFIRM" &&
				<Modal onClose={close}>
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
			}
		</PaddedPage>
	)
}
