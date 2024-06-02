import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from "js-cookie";

class Sockets {

    private client: Client;

    private authCookie: string;

    private baseUrl: string;

    constructor(baseUrl: string, onConnectCallback: () => void, authCookie: string = "authorization") {
        this.baseUrl = baseUrl;
        this.authCookie = authCookie;
        var authToken = Cookies.get(this.authCookie)
        const socket = new SockJS(this.baseUrl + '/ws?authentication=' + authToken);
        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization: authToken as string,
            },
            onConnect: onConnectCallback,
            onStompError: (frame) => {
                console.error(`Broker reported error: ${frame.headers['message']}`);
                console.error(`Additional details: ${frame.body}`);
            },
        });
    }

    connect() {
        this.client.activate();
    }

    disconnect() {
        this.client.deactivate();
    }

    subscribe(destination: string, callback: (message: IMessage) => void) {
        if (this.client.connected) {
            this.client.subscribe(destination, callback);
        } else {
            console.error('Client is not connected');
        }
    }

    async send(topic: string, payload: any) {
        var authToken = Cookies.get(this.authCookie)
        const response = await fetch(this.baseUrl + '/send/' + topic, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || ''
            }
        });
        if (!response.ok) {
            throw new Error('Failed to send message to topic to the');
        }
    }
}

export default Sockets;