import React, {useState} from "react";

import './DrawerDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
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

interface Props {
}

const USAGE = `const [open, setOpen] = useState(false);

{open &&
    <Drawer position={DrawerPosition.RIGHT} width="420px" onClose={() => setOpen(false)}>
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
    </Drawer>
}`;

export const DrawerDevelopment: React.FC<Props> = ({}) => {

	const [position, setPosition] = useState<DrawerPosition | null>(null);

	const close = () => setPosition(null);

	const isVertical = position === DrawerPosition.TOP || position === DrawerPosition.BOTTOM;

	return (
		<PaddedPage>
			<PageHeading>Drawer</PageHeading>
			<Paragraph>
				A drawer slides in from any edge over its own backdrop and takes the same header, description, body and
				footer parts as the modal. Width applies to the left and right positions, height to top and bottom.
			</Paragraph>

			<div className="drawer-dev-section">
				<FormHeading label="Positions"></FormHeading>
				<div className="drawer-dev-buttons">
					<Button text="Left" icon="ri-align-left" buttonType={ButtonType.SECONDARY}
							onClick={() => setPosition(DrawerPosition.LEFT)}></Button>
					<Button text="Right" icon="ri-align-right" buttonType={ButtonType.PRIMARY}
							onClick={() => setPosition(DrawerPosition.RIGHT)}></Button>
					<Button text="Top" icon="ri-align-top" buttonType={ButtonType.SECONDARY}
							onClick={() => setPosition(DrawerPosition.TOP)}></Button>
					<Button text="Bottom" icon="ri-align-bottom" buttonType={ButtonType.SECONDARY}
							onClick={() => setPosition(DrawerPosition.BOTTOM)}></Button>
				</div>
			</div>

			<div className="drawer-dev-section">
				<FormHeading label="Usage"></FormHeading>
				<CodeBlock value={{code: USAGE, lang: "tsx"}}></CodeBlock>
			</div>

			{position !== null &&
				<Drawer
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
			}
		</PaddedPage>
	)
}
