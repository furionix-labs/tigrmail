"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInboxApi = void 0;
// inboxApi.ts
const apiService_1 = require("./apiService");
const createInboxApi = ({ authToken, }) => {
    return apiService_1.api.post("/v1/inboxes", null, {
        headers: { Authorization: `Bearer ${authToken}` },
    }).then((response) => response.data);
};
exports.createInboxApi = createInboxApi;
