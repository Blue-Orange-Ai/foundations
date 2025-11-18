import axios from "axios";
import {IEndpoint, IModelRequest} from "../../interfaces/AppInterfaces";


const generateHeaders = (endpoint: IEndpoint) => {
    var headers: any = {};
    for (var i=0; i < endpoint.headers.length; i++) {
        headers[endpoint.headers[i].key] = endpoint.headers[i].value;
    }
    return headers;
}

export const chatStream = async (endpoint: IEndpoint, requestData: IModelRequest) =>  {
    try {
        var headers = generateHeaders(endpoint);
        headers["accept"] = "application/json";
        return fetch(endpoint.uri, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData)
        });
    } catch (e) {

    }
}

export const chatRequest = async (endpoint: IEndpoint, requestData: IModelRequest) => {
    try {
        const headers: any = endpoint.headers.reduce((acc:any, header) => {
            acc[header.key] = header.value;
            return acc;
        });
        const response = await axios.post(endpoint.uri, requestData, {
            headers: headers
        });
        return response.data;
    } catch (e) {

    }
}