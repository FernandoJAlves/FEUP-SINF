import { http, jasminAdapter, setToken } from "../http/http";
import axios from "axios";

export const requestAccessToken = () => {
    const client_id = "SNIFApp";
    const client_secret = "8b14478b-6f0f-437a-86af-187eca1281d7";

    const bodyData = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials",
        "scope": "application",
    };

    const url = "https://identity.primaverabss.com/core/connect/token";

    return http("post", url, bodyData);

};

export const requestOrders = () => (
    jasminAdapter("get", "/sales/orders", {}).then(
        (res) => (res.data),
    )
);

axios.interceptors.response.use((response) => (response),
    (error) => {
        // Return any error which is not due to authentication back to the calling service
        if (error.response.status !== 401) {
            return new Promise((_resolve, reject) => {
                reject(error);
            });
        }

        // Try request again with new token
        return requestAccessToken()
            .then((res) => {

                const config = error.config;

                if (res.data.access_token) {
                    setToken(res.data.access_token);
                }

                return new Promise((resolve, reject) => {
                    axios.request(config).then((response) => {
                        resolve(response);
                    }).catch((error) => {
                        reject(error);
                    });
                });

            })
            .catch((error) => {
                Promise.reject(error);
            });
    },
);
