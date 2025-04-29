"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TigrmailError = void 0;
const axios_1 = require("axios");
const chalk_1 = __importDefault(require("chalk"));
const prefix = "🐅 [Tigrmail Error]";
class TigrmailError extends Error {
    constructor({ error, generalMessage = "", }) {
        var _a, _b;
        // extract the technical message
        let techMessage;
        if (error instanceof axios_1.AxiosError) {
            const data = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
            const statusCode = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) ? `[${error.response.status}]` : '';
            if (data && typeof data === "object") {
                const { error: errMsg } = data;
                techMessage = `${statusCode} ${errMsg}`;
            }
            else {
                techMessage = `${statusCode} ${error.message}`;
            }
        }
        else {
            techMessage = error.message;
        }
        const finalMsg = `\n\n  🐅 [Message]:\n      ${generalMessage}\n\n  🐅 [Details]:\n      ${techMessage}\n`;
        super(finalMsg);
        this.name = this.constructor.name;
        this.generalMessage = generalMessage || techMessage;
        this.techMessage = techMessage;
    }
    toString() {
        if (typeof window !== "undefined") {
            // browser: collapsible group w/ CSS styling
            return `${prefix} ${this.message}`;
        }
        else {
            // terminal: chalk‐coloured
            return `${chalk_1.default.red.bold(prefix)} ${this.message}`;
        }
    }
}
exports.TigrmailError = TigrmailError;
