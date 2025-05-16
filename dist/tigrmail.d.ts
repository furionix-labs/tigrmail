import { EmailMessage } from "./pollNextMessageApi";
export type MessageFilter = {
    inbox: string;
    subject?: {
        contains: string;
        equals?: undefined;
    } | {
        contains?: undefined;
        equals: string;
    };
    from?: {
        email: string;
        domain?: undefined;
    } | {
        email?: undefined;
        domain: string;
    };
};
export declare class Tigrmail {
    private token;
    constructor({ token }: {
        token: string;
    });
    createEmailAddress(): Promise<string>;
    pollNextMessage({ inbox, subject, from, }: MessageFilter): Promise<EmailMessage>;
}
