import axios from "axios";

const getBodyData = (formObj) => {
    const bodyData = new FormData();
    for (const key in formObj) {
        bodyData.append(key, formObj[key]);
    }
    return bodyData;
};

export const http = (method, url, data) => {

    const bodyData = getBodyData(data);

    return axios({
        baseURL: url,
        method: method,
        data: bodyData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
        },
    });
};

export const jasminAdapter = (method, endpoint) => (

    axios({
        url: endpoint,
        baseURL: "https://my.jasminsoftware.com/api/224836/224836-0001/",
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
        },
    })
);

export const setToken = (token) => {
    axios.defaults.headers.common = { "Authorization": `bearer ${token}` };
};
