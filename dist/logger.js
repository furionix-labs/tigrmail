"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static info(message, ...optionalParams) {
        console.log(`${this.prefix} Info:`, message, ...optionalParams);
    }
    static error(message, ...optionalParams) {
        console.error(`${this.prefix} Error:`, message, ...optionalParams);
    }
}
Logger.prefix = '[Tigrmail] 🐅';
exports.default = Logger;
