import React, {useState} from "react";

import './DrawerDevelopment.css'
import {FormHeading} from "../../../../components/text-decorations/form-heading/FormHeading";
import {Paragraph} from "../../../../components/text-decorations/paragraph/Paragraph";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {Drawer, DrawerPosition} from "../../../../components/layouts/drawer/drawer/Drawer";
import {DrawerHeader} from "../../../../components/layouts/drawer/drawer-header/DrawerHeader";
import {DrawerDescription} from "../../../../components/layouts/drawer/drawer-description/DrawerDescription";
import {DrawerBody} from "../../../../components/layouts/drawer/drawer-body/DrawerBody";
import {DrawerFooter} from "../../../../components/layouts/drawer/drawer-footer/DrawerFooter";
import {DrawerFooterLeft} from "../../../../components/layouts/drawer/drawer-footer-left/DrawerFooterLeft";
import {DrawerFooterRight} from "../../../../components/layouts/drawer/drawer-footer-right/DrawerFooterRight";
import {Input} from "../../../../components/inputs/input/Input";
import {CodeBlock} from "../../../../components/text-decorations/code-block/CodeBlock";
import {ComponentDoc} from "../../../framework/ComponentDoc";
import {PropSpec} from "../../../framework/PropSpec";

const DRAWER_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The drawer's parts — a header, a description, a body and a footer."
	},
	{
		name: "open",
		type: "boolean",
		description: "Whether the drawer is showing. It is controlled, so this is the caller's to hold."
	},
	{
		name: "position",
		type: "DrawerPosition",
		default: "DrawerPosition.TOP",
		defaultValue: DrawerPosition.TOP,
		control: "select",
		options: [
			{label: "Top", value: DrawerPosition.TOP, code: "DrawerPosition.TOP"},
			{label: "Right", value: DrawerPosition.RIGHT, code: "DrawerPosition.RIGHT"},
			{label: "Bottom", value: DrawerPosition.BOTTOM, code: "DrawerPosition.BOTTOM"},
			{label: "Left", value: DrawerPosition.LEFT, code: "DrawerPosition.LEFT"}
		],
		description: "Which edge the drawer comes in from."
	},
	{
		name: "width",
		type: "string",
		default: "\"375px\"",
		control: "text",
		description: "Width of the panel. Applies to the left and right positions."
	},
	{
		name: "height",
		type: "string",
		default: "\"375px\"",
		control: "text",
		description: "Height of the panel. Applies to the top and bottom positions."
	},
	{
		name: "container",
		type: "HTMLElement | null",
		description: "Where the drawer is portalled to. It goes to the document body by default."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires on a backdrop click and on the header's close icon."
	}
];

const DRAWER_HEADER_PROPS: Array<PropSpec> = [
	{
		name: "label",
		type: "string",
		required: true,
		control: "text",
		value: "Filters",
		description: "The drawer's title."
	},
	{
		name: "onClose",
		type: "() => void",
		description: "Fires when the close icon is clicked."
	}
];

const DRAWER_CHILDREN_PROPS: Array<PropSpec> = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The section's content."
	}
];

interface Props {
}

const USAGE = `const [open, setOpen] = useState(false);

<Drawer open={open} position={DrawerPosition.RIGHT} width="420px" onClose={() => setOpen(false)}>
    <DrawerHeader label="Filters" onClose={() => setOpen(false)}></DrawerHeader>
    <DrawerDescription description="Narrow the result set."></DrawerDescription>
    <DrawerBody>
        <Input label="Search" placeholder="Anything"></Input>
    </DrawerBody>
    <DrawerFooter>
        <DrawerFooterLeft>
            <Button text="Reset" buttonType={ButtonType.CLEAR}></Button>
        </DrawerFooterLeft>
        <DrawerFooterRight>
            <Button text="Apply" buttonType={ButtonType.PRIMARY}></Button>
        </DrawerFooterRight>
    </DrawerFooter>
</Drawer>`;

const UNCONTROLLED_USAGE = `{open &&
    <Drawer position={DrawerPosition.RIGHT} width="420px" onClose={() => setOpen(false)}>
        ...
    </Drawer>
}`;

export const DrawerDevelopment: React.FC<Props> = ({}) => {

	const [position, setPosition] = useState<DrawerPosition>(DrawerPosition.RIGHT);
	const [open, setOpen] = useState(false);

	const show = (next: DrawerPosition) => {
		setPosition(next);
		setOpen(true);
	};

	const close = () => setOpen(false);

	const isVertical = position === DrawerPosition.TOP || position === DrawerPosition.BOTTOM;

	const [docsDrawerOpen, setDocsDrawerOpen] = useState(false);

	return (
		<ComponentDoc
			title="Drawer"
			description="A panel that slides in from an edge over its own backdrop, taking the same header, description, body and footer parts as the modal. Width applies to the left and right positions, height to top and bottom."
			name="Drawer"
			previewHeight={160}
			imports={["DrawerPosition", "DrawerHeader", "DrawerBody", "DrawerFooter", "DrawerFooterRight"]}
			props={DRAWER_PROPS}
			snippetChildren={() => "<DrawerHeader label={\"Filters\"} onClose={close}></DrawerHeader>\n<DrawerBody>\n\t<p>Narrow the runs down.</p>\n</DrawerBody>\n<DrawerFooter>\n\t<DrawerFooterRight>\n\t\t<Button text={\"Apply\"} buttonType={ButtonType.PRIMARY}></Button>\n\t</DrawerFooterRight>\n</DrawerFooter>"}
			preview={values => (
				<>
					<Button
						text="Open the drawer"
						buttonType={ButtonType.PRIMARY}
						onClick={() => setDocsDrawerOpen(true)}></Button>
					<Drawer
						open={docsDrawerOpen}
						position={values.position}
						width={values.width}
						height={values.height}
						onClose={() => setDocsDrawerOpen(false)}>
						<DrawerHeader label="Filters" onClose={() => setDocsDrawerOpen(false)}></DrawerHeader>
						<DrawerBody>
							<p>Narrow the runs down.</p>
						</DrawerBody>
						<DrawerFooter>
							<DrawerFooterRight>
								<Button text="Apply" buttonType={ButtonType.PRIMARY} onClick={() => setDocsDrawerOpen(false)}></Button>
							</DrawerFooterRight>
						</DrawerFooter>
					</Drawer>
				</>
			)}
			siblings={[
				{
					name: "DrawerHeader",
					description: "The title bar, with the close icon on the right.",
					props: DRAWER_HEADER_PROPS,
					previewHeight: 110,
					previewCentered: false,
					preview: values => (
						<div style={{width: "100%"}}>
							<DrawerHeader label={values.label}></DrawerHeader>
						</div>
					)
				},
				{
					name: "DrawerBody",
					description: "The scrolling middle of the drawer.",
					props: DRAWER_CHILDREN_PROPS,
					previewHeight: 120,
					previewCentered: false,
					snippetChildren: () => "<p>Narrow the runs down.</p>",
					preview: () => (
						<div style={{width: "100%"}}>
							<DrawerBody><p style={{margin: 0}}>Narrow the runs down.</p></DrawerBody>
						</div>
					)
				},
				{
					name: "DrawerFooter",
					description: "The button bar. It reads DrawerFooterLeft and DrawerFooterRight out of its children and pushes each to its own end.",
					props: DRAWER_CHILDREN_PROPS,
					previewHeight: 120,
					previewCentered: false,
					imports: ["DrawerFooterLeft", "DrawerFooterRight"],
					snippetChildren: () => "<DrawerFooterLeft>\n\t<Button text={\"Reset\"} buttonType={ButtonType.CLEAR}></Button>\n</DrawerFooterLeft>\n<DrawerFooterRight>\n\t<Button text={\"Apply\"} buttonType={ButtonType.PRIMARY}></Button>\n</DrawerFooterRight>",
					preview: () => (
						<div style={{width: "100%"}}>
							<DrawerFooter>
								<DrawerFooterLeft>
									<Button text="Reset" buttonType={ButtonType.CLEAR}></Button>
								</DrawerFooterLeft>
								<DrawerFooterRight>
									<Button text="Apply" buttonType={ButtonType.PRIMARY}></Button>
								</DrawerFooterRight>
							</DrawerFooter>
						</div>
					)
				}
			]}>
			<Paragraph>
				Pass a single boolean through open to control it. The drawer stays mounted while it animates out, so it
				slides back to the edge it came from. Leaving open off keeps the old behaviour — rendering the drawer
				means it is open, and unmounting it removes it with no closing animation.
			</Paragraph>

			<div className="drawer-dev-section">
				<FormHeading label="Positions"></FormHeading>
				<div className="drawer-dev-buttons">
					<Button text="Left" icon="ri-align-left" buttonType={ButtonType.SECONDARY}
							onClick={() => show(DrawerPosition.LEFT)}></Button>
					<Button text="Right" icon="ri-align-right" buttonType={ButtonType.PRIMARY}
							onClick={() => show(DrawerPosition.RIGHT)}></Button>
					<Button text="Top" icon="ri-align-top" buttonType={ButtonType.SECONDARY}
							onClick={() => show(DrawerPosition.TOP)}></Button>
					<Button text="Bottom" icon="ri-align-bottom" buttonType={ButtonType.SECONDARY}
							onClick={() => show(DrawerPosition.BOTTOM)}></Button>
				</div>
			</div>

			<div className="drawer-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<Paragraph>
					One boolean opens and closes the drawer, and both animations run off it.
				</Paragraph>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
				<Paragraph>
					Mounting the drawer conditionally still works — it slides in the same way, but React removes it
					before it can slide back out.
				</Paragraph>
				<CodeBlock value={{code: UNCONTROLLED_USAGE, lang: "tsx"}}></CodeBlock>
			</div>

			<Drawer
				open={open}
				position={position}
				width="420px"
				height="320px"
				onClose={close}>
				<DrawerHeader label="Filters" onClose={close}></DrawerHeader>
				<DrawerDescription description="Narrow the result set."></DrawerDescription>
				<DrawerBody>
					<Input label="Search" placeholder="Anything"></Input>
					<div style={{height: "12px"}}></div>
					<Paragraph>
						{isVertical
							? "Top and bottom drawers are sized with the height prop."
							: "Left and right drawers are sized with the width prop."}
					</Paragraph>
				</DrawerBody>
				<DrawerFooter>
					<DrawerFooterLeft>
						<Button text="Reset" buttonType={ButtonType.CLEAR} onClick={close}></Button>
					</DrawerFooterLeft>
					<DrawerFooterRight>
						<Button text="Apply" buttonType={ButtonType.PRIMARY} onClick={close}></Button>
					</DrawerFooterRight>
				</DrawerFooter>
			</Drawer>
		</ComponentDoc>
	)
}
