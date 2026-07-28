import React from "react";

import './ButtonDevelopment.css'
import {PaddedPage} from "../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../components/text-decorations/page-heading/PageHeading";
import {Button, ButtonIconPos, ButtonSize, ButtonType} from "../../../components/buttons/button/Button";
import {ButtonIcon} from "../../../components/buttons/button-icon/ButtonIcon";
import {ButtonIconDropdown} from "../../../components/buttons/button-icon-dropdown/ButtonIconDropdown";
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
			<h2>Button Sizes</h2>
			<div className={"button-development-row"}>
				<Button text={"Small"} buttonType={ButtonType.PRIMARY} size={ButtonSize.SMALL}></Button>
				<Button text={"Medium (default)"} buttonType={ButtonType.PRIMARY} size={ButtonSize.MEDIUM}></Button>
				<Button text={"Large"} buttonType={ButtonType.PRIMARY} size={ButtonSize.LARGE}></Button>
			</div>
			<h2>Button Sizes With Icon</h2>
			<div className={"button-development-row"}>
				<Button text={"Small"} buttonType={ButtonType.SECONDARY} size={ButtonSize.SMALL} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
				<Button text={"Medium"} buttonType={ButtonType.SECONDARY} size={ButtonSize.MEDIUM} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
				<Button text={"Large"} buttonType={ButtonType.SECONDARY} size={ButtonSize.LARGE} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
			</div>
			<h2>Custom Classes</h2>
			<div className={"button-development-row"}>
				<Button text={"Custom Class Button"} buttonType={ButtonType.CUSTOM} classes={"button-development-custom-class"}></Button>
				<Button text={"Custom Class Large"} buttonType={ButtonType.CUSTOM} size={ButtonSize.LARGE} classes={"button-development-custom-class"}></Button>
			</div>
			<h2>Button Icon Left</h2>
			<Button text={"Custom Button"} icon={"ri-planet-fill"} iconPos={ButtonIconPos.LEFT}></Button>
			<h2>Button Icon Right</h2>
			<Button text={"Custom Button"} icon={"ri-planet-fill"} iconPos={ButtonIconPos.RIGHT}></Button>
			<h2>Button Only Icon</h2>
			<ButtonIcon label={"Only Icon"} icon={"ri-planet-fill"}></ButtonIcon>
			<h2>Button Only Icon Sizes</h2>
			<div className={"button-development-row"}>
				<ButtonIcon label={"Small"} icon={"ri-planet-fill"} size={ButtonSize.SMALL}></ButtonIcon>
				<ButtonIcon label={"Medium (default)"} icon={"ri-planet-fill"} size={ButtonSize.MEDIUM}></ButtonIcon>
				<ButtonIcon label={"Large"} icon={"ri-planet-fill"} size={ButtonSize.LARGE}></ButtonIcon>
			</div>
			<h2>Button Icon Dropdown</h2>
			<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Options"} filter={true}
								 onSelection={(ref) => console.log("selected", ref)}>
				<DropdownItemHeading label={"Actions"} value={"heading-1"} selected={false}></DropdownItemHeading>
				<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
				<DropdownItemText label={"Duplicate"} value={"duplicate"} selected={false}></DropdownItemText>
				<DropdownItemIcon src={"ri-delete-bin-line"} label={"Delete"} value={"delete"} selected={false}></DropdownItemIcon>
			</ButtonIconDropdown>
			<h2>Button Icon Dropdown Sizes</h2>
			<div className={"button-development-row"}>
				<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Small"} size={ButtonSize.SMALL}>
					<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Delete"} value={"delete"} selected={false}></DropdownItemText>
				</ButtonIconDropdown>
				<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Medium (default)"} size={ButtonSize.MEDIUM}>
					<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Delete"} value={"delete"} selected={false}></DropdownItemText>
				</ButtonIconDropdown>
				<ButtonIconDropdown icon={"ri-more-2-fill"} label={"Large"} size={ButtonSize.LARGE}>
					<DropdownItemText label={"Edit"} value={"edit"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Delete"} value={"delete"} selected={false}></DropdownItemText>
				</ButtonIconDropdown>
			</div>
			<h2>File Upload Button</h2>
			<FileUploadBtn accept={"*"} label={"File Upload Button"} icon={"ri-planet-fill"}></FileUploadBtn>
			<h2>File Upload Button Sizes</h2>
			<div className={"button-development-row"}>
				<FileUploadBtn accept={"*"} label={"Small"} icon={true} size={ButtonSize.SMALL}></FileUploadBtn>
				<FileUploadBtn accept={"*"} label={"Medium (default)"} icon={true} size={ButtonSize.MEDIUM}></FileUploadBtn>
				<FileUploadBtn accept={"*"} label={"Large"} icon={true} size={ButtonSize.LARGE}></FileUploadBtn>
			</div>
			<h2>Button Dropdown</h2>
			<ButtonDropdown text={"Primary Button"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY}>
				<DropdownItemHeading label={"Hello World"} value={"heading-1"} selected={false}></DropdownItemHeading>
				<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
				<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				<DropdownItemIcon src={"ri-dribbble-line"} label={"Dribble"} value={"option-3"} selected={false}></DropdownItemIcon>
			</ButtonDropdown>
			<h2>Button Dropdown Sizes</h2>
			<div className={"button-development-row"}>
				<ButtonDropdown text={"Small"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY} size={ButtonSize.SMALL}>
					<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				</ButtonDropdown>
				<ButtonDropdown text={"Medium (default)"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY} size={ButtonSize.MEDIUM}>
					<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				</ButtonDropdown>
				<ButtonDropdown text={"Large"} filter={true} contextWidth={"max-content"} buttonType={ButtonType.PRIMARY} size={ButtonSize.LARGE}>
					<DropdownItemText label={"Option 1"} value={"option-1"} selected={false}></DropdownItemText>
					<DropdownItemText label={"Option 2"} value={"option-2"} selected={true}></DropdownItemText>
				</ButtonDropdown>
			</div>
		</PaddedPage>
	)
}