import React, {useContext, useRef} from "react";

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

	const {addToast, addPromiseToast} = useContext(ToastContext);
	const promiseToastRef = useRef<ReturnType<typeof addPromiseToast> | null>(null);

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
			<div className="blue-orange-toaster-development-grid">
				<Button
					text={"Promise Toast (Start - Top Right)"}
					buttonType={ButtonType.PRIMARY}
					onClick={() => createPromiseToast(ToastLocation.TOP_RIGHT)}
				></Button>
				<Button
					text={"Promise Toast (Update)"}
					buttonType={ButtonType.PRIMARY}
					onClick={updatePromiseToast}
				></Button>
				<Button
					text={"Promise Toast (Close)"}
					buttonType={ButtonType.DANGER}
					onClick={closePromiseToast}
				></Button>
			</div>
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
