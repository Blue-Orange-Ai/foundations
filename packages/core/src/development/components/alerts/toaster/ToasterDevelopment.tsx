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
			toastType,
			description: "This is a toast description",
			icon: <i className={toastType === ToasterType.ERROR ? "ri-error-warning-line" : "ri-information-line"}></i>
		}
		addToast(toast);
	}

    const createToastPersistent = (location: ToastLocation, toastType: ToasterType) => {
        const toast: Toast = {
            id: uuidv4(),
            location,
            toastType,
            description: "This is a toast description",
            icon: <i className={toastType === ToasterType.ERROR ? "ri-error-warning-line" : "ri-information-line"}></i>,
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
                <Button
                    text={"Centre Top (Default)"}
                    buttonType={ButtonType.PRIMARY}
                    onClick={() => createToast(ToastLocation.CENTRE_TOP, ToasterType.DEFAULT)}
                ></Button>
                <Button
                    text={"Centre Bottom (Default)"}
                    buttonType={ButtonType.PRIMARY}
                    onClick={() => createToast(ToastLocation.CENTRE_BOTTOM, ToasterType.DEFAULT)}
                ></Button>
			</div>
            <div className="blue-orange-toaster-development-grid">
                <Button
                    text={"Top Left Persistent (Success)"}
                    buttonType={ButtonType.SUCCESS}
                    onClick={() => createToastPersistent(ToastLocation.TOP_LEFT, ToasterType.SUCCESS)}
                ></Button>
                <Button
                    text={"Top Right Persistent (Default)"}
                    buttonType={ButtonType.PRIMARY}
                    onClick={() => createToastPersistent(ToastLocation.TOP_RIGHT, ToasterType.DEFAULT)}
                ></Button>
                <Button
                    text={"Bottom Left Persistent (Warning)"}
                    buttonType={ButtonType.WARNING}
                    onClick={() => createToastPersistent(ToastLocation.BOTTOM_LEFT, ToasterType.WARNING)}
                ></Button>
                <Button
                    text={"Bottom Right Persistent (Error)"}
                    buttonType={ButtonType.DANGER}
                    onClick={() => createToastPersistent(ToastLocation.BOTTOM_RIGHT, ToasterType.ERROR)}
                ></Button>
                <Button
                    text={"Centre Top Persistent (Default)"}
                    buttonType={ButtonType.PRIMARY}
                    onClick={() => createToastPersistent(ToastLocation.CENTRE_TOP, ToasterType.DEFAULT)}
                ></Button>
                <Button
                    text={"Centre Bottom Persistent (Default)"}
                    buttonType={ButtonType.PRIMARY}
                    onClick={() => createToastPersistent(ToastLocation.CENTRE_BOTTOM, ToasterType.DEFAULT)}
                ></Button>
            </div>
		</PaddedPage>
	)
}
