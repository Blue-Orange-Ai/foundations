import React, {useContext, useEffect} from "react";

import './SocketWorkspace.css'
import {Button, ButtonType} from "../../components/buttons/button/Button";
import {ToastContext, ToastLocation} from "../../components/alerts/toast/toastcontext/ToastContext";
import {ToasterType} from "../../components/alerts/toast/toaster/Toaster";
import {Sockets} from "@blue-orange-ai/foundations-clients";
import {TippyHTMLElement} from "../../components/interfaces/AppInterfaces";
import tippy from "tippy.js";
import Cookies from "js-cookie";

interface Props {
}

export const SocketWorkspace: React.FC<Props> = ({}) => {

	const { addToast } = useContext(ToastContext);

	const topic = "8b4ef56d-c61e-4c41-bb25-942e9a7c684c";

	Cookies.set("authorization", "tom-test-auth-id")

	const sockets = new Sockets(
		"http://localhost:8087",
		() => {
			addToast({
				id: "abcdefghi",
				heading: "Stomp Connection Successful",
				location: ToastLocation.BOTTOM_RIGHT,
				toastType: ToasterType.DEFAULT,
				ttl: 5000
			})

			sockets.subscribe('/topic/' + topic, (message: any) => {
				console.log('Received message:', message.body);
			});
		}
	)

	const sendMessage = () => {
		sockets.send(topic, {"msg": "Hello world this is the message sent"})
	}

	useEffect(() => {
		sockets.connect();
		return () => {
			sockets.disconnect();
		}
	}, []);

	return (
		<div>
			<Button text={"Send Test Message Open Console"} buttonType={ButtonType.PRIMARY} onClick={() => sendMessage()}></Button>
		</div>
	)
}