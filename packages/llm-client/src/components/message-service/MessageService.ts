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
        headers["Authorization"] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjZiZmRlYi1hMjIzLTRmOWMtODJlYy01MTY3MmUyYzY2NGUiLCJleHAiOjE3NjcyNjEyNDR9.47oAqZSYCC2gs-RZbo1XbGxthG-7L_rE5csGY0alYwsFa86LRrP-U_JZ3aTbw1qzMlsZCkO4z_2vUVM-QxGIVw"
        // headers["Authorization"] = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjZiZmRlYi1hMjIzLTRmOWMtODJlYy01MTY3MmUyYzY2NGUiLCJleHAiOjE3NjcyNjEyNDR9.47oAqZSYCC2gs-RZbo1XbGxthG-7L_rE5csGY0alYwsFa86LRrP-U_JZ3aTbw1qzMlsZCkO4z_2vUVM-QxGIV"
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