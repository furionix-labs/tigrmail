"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollNextMessageApi = void 0;
const apiService_1 = require("./apiService");
const pollNextMessageApi = ({ authToken, filter, }) => {
    const filterNormalized = Object.fromEntries(Object.entries(filter).filter(([_, value]) => value));
    const queryString = new URLSearchParams(filter).toString();
    return apiService_1.api.get(`/v1/messages?${queryString}`, {
        headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => response.data);
};
exports.pollNextMessageApi = pollNextMessageApi;
