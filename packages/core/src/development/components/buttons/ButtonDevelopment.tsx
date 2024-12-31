import React from "react";

import './ButtonDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {Button, ButtonIconPos, ButtonType} from "../../../components/buttons/button/Button";
import {ButtonIcon} from "../../../components/buttons/button-icon/ButtonIcon";
import {FileUploadBtn} from "../../../components/buttons/file-upload-btn/FileUploadBtn";
import {ButtonDropdown} from "../../../components/buttons/button-dropdown/ButtonDropdown";
import {DropdownItem} from "../../../components/inputs/dropdown/items/DropdownItem/DropdownItem";
import {DropdownItemImage} from "../../../components/inputs/dropdown/items/DropdownItemImage/DropdownItemImage";
import {DropdownItemIcon} from "../../../components/inputs/dropdown/items/DropdownItemIcon/DropdownItemIcon";
import {DropdownItemText} from "../../../components/inputs/dropdown/items/DropdownItemText/DropdownItemText";
import {DropdownItemHeading} from "../../../components/inputs/dropdown/items/DropdownItemHeading/DropdownItemHeading";

interface Props {
}

export const ButtonDevelopment: React.FC<Props> = ({}) => {


	return (
		<PaddedPage>
			<PageHeading>Advanced Tooltip</PageHeading>
			<h2>Primary Button</h2>
			<Button text={"Primary Button"} buttonType={ButtonType.PRIMARY}></Button>
			<h2>Secondary Button</h2>
			<Button text={"Secondary Button"} buttonType={ButtonType.SECONDARY}></Button>
			<h2>Success Button</h2>
			<Button text={"Success Button"} buttonType={ButtonType.SUCCESS}></Button>
			<h2>Warning Button</h2>
			<Button text={"Warning Button"} buttonType={ButtonType.WARNING}></Button>
			<h2>Danger Button</h2>
			<Button text={"Danger Button"} buttonType={ButtonType.DANGER}></Button>
			<h2>Clear Button</h2>
			<Button text={"Clear Button"} buttonType={ButtonType.CLEAR}></Button>
			<h2>Custom Button</h2>
			<Button text={"Custom Button"} buttonType={ButtonType.CUSTOM}></Button>
			<h2>Button Icon Left</h2>
			<Button text={"Custom Button"} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
			<h2>Button Icon Right</h2>
			<Button text={"Custom Button"} icon={"ri-planet-fill"} iconPos={ButtonIconPos.RIGHT}></Button>
			<h2>Button Only Icon</h2>
			<ButtonIcon label={"Only Icon"} icon={"ri-planet-fill"}></ButtonIcon>
			<h2>File Upload Button</h2>
			<FileUploadBtn accept={"*"} label={"File Upload Button"} icon={"ri-planet-fill"}></FileUploadBtn>
			<h2>Button Dropdown</h2>
			<ButtonDropdown text={"Primary Button"} filter={true} buttonType={ButtonType.PRIMARY}>
				<DropdownItemHeading label={"Hello World"} value={"heading-1"} selected={false}></DropdownItemHeading>
				<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
				<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				<DropdownItemIcon src={"ri-dribbble-line"} label={"Dribble"} value={"option-3"} selected={false}></DropdownItemIcon>
			</ButtonDropdown>
		</PaddedPage>
	)
}