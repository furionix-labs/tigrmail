"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TigrmailError = void 0;
const axios_1 = require("axios");
const util_1 = __importDefault(require("util"));
const chalk_1 = __importDefault(require("chalk"));
const prefix = "[Tigrmail] 🐅";
class TigrmailError extends Error {
    constructor({ error }) {
        var _a;
        // build a single message
        let msg;
        if (error instanceof axios_1.AxiosError) {
            const data = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
            if (data && typeof data === "object") {
                const { error: errMsg, code } = data;
                msg = `${code} ${errMsg}`;
            }
            else {
                msg = error.message;
            }
        }
        else {
            msg = error.message;
        }
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Call this to log your TigrmailError nicely:
     *    new TigrmailError({error:…}).log()
     */
    log() {
        if (typeof window !== "undefined") {
            // browser: CSS‐styled console
            console.error("%c" + prefix + " %c" + this.name + ": %s", "color: orange; font-weight: bold;", "color: red;", this.message);
        }
        else {
            // terminal: chalk‐coloured
            console.error(chalk_1.default.red.bold(`${prefix} ${this.name}: `) + this.message);
        }
    }
    // so `console.log(err)` in Node also uses our chalk formatting
    [util_1.default.inspect.custom]() {
        return chalk_1.default.red.bold(`${prefix} ${this.name}: `) + this.message;
    }
}
exports.TigrmailError = TigrmailError;
