import React, {useContext} from "react";

import './ToasterDevelopment.css'
import {PaddedPage} from "../../../../components/layouts/pages/padded-page/PaddedPage";
import {PageHeading} from "../../../../components/text-decorations/page-heading/PageHeading";
import {Button, ButtonType} from "../../../../components/buttons/button/Button";
import {Toast, ToastContext, ToastLocation} from "../../../../components/alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../../../components/alerts/toast/toaster/Toaster";
import {v4 as uuidv4} from 'uuid';

interface Props {
}

export const ToasterDevelopment: React.FC<Props> = ({}) => {

	const {addToast} = useContext(ToastContext);

	const createToast = (location: ToastLocation, toastType: ToasterType) => {
		const toast: Toast = {
			id: uuidv4(),
			location,
			ttl: 4000,
			heading: "Toast Heading",
			toastType,
			description: "This is a toast description",
			icon: <i className={toastType === ToasterType.ERROR ? "ri-error-warning-line" : "ri-information-line"}></i>,
			action: <div className="blue-orange-toaster-development-action">UNDO</div>
		}
		addToast(toast);
	}

	return (
		<PaddedPage>
			<PageHeading>Toaster</PageHeading>
			<div className="blue-orange-toaster-development-grid">
				<Button
					text={"Top Left (Success)"}
					buttonType={ButtonType.SUCCESS}
					onClick={() => createToast(ToastLocation.TOP_LEFT, ToasterType.SUCCESS)}
				></Button>
				<Button
					text={"Top Right (Default)"}
					buttonType={ButtonType.PRIMARY}
					onClick={() => createToast(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT)}
				></Button>
				<Button
					text={"Bottom Left (Warning)"}
					buttonType={ButtonType.WARNING}
					onClick={() => createToast(ToastLocation.BOTTOM_LEFT, ToasterType.WARNING)}
				></Button>
				<Button
					text={"Bottom Right (Error)"}
					buttonType={ButtonType.DANGER}
					onClick={() => createToast(ToastLocation.BOTTOM_RIGHT, ToasterType.ERROR)}
				></Button>
			</div>
		</PaddedPage>
	)
}
