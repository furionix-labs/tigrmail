"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const api = axios_1.default.create({
    baseURL: 'https://api.tigrmail.com',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});
exports.api = api;
(0, axios_retry_1.default)(api, {
    retries: 3,
    retryDelay: axios_retry_1.default.exponentialDelay,
    retryCondition: () => true,
});
