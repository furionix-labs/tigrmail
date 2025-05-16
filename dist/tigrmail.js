"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tigrmail = void 0;
const createInboxApi_1 = require("./createInboxApi");
const pollNextMessageApi_1 = require("./pollNextMessageApi");
const TigrmailError_1 = require("./TigrmailError");
class Tigrmail {
    constructor({ token }) {
        this.token = token;
    }
    createEmailAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, createInboxApi_1.createInboxApi)({
                authToken: this.token,
            })
                .then((response) => response.inbox)
                .catch((error) => {
                throw new TigrmailError_1.TigrmailError({
                    generalMessage: `Failed to generate a new inbox.`,
                    error,
                });
            });
        });
    }
    pollNextMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ inbox, subject, from, }) {
            return (0, pollNextMessageApi_1.pollNextMessageApi)({
                authToken: this.token,
                filter: {
                    inbox,
                    subjectContains: subject === null || subject === void 0 ? void 0 : subject.contains,
                    subjectEquals: subject === null || subject === void 0 ? void 0 : subject.equals,
                    fromEmail: from === null || from === void 0 ? void 0 : from.email,
                    fromDomain: from === null || from === void 0 ? void 0 : from.domain,
                },
            }).catch((error) => {
                throw new TigrmailError_1.TigrmailError({
                    generalMessage: `Failed to poll the next message for inbox: ${inbox}.`,
                    error,
                });
            });
        });
    }
}
exports.Tigrmail = Tigrmail;
