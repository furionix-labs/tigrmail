export type EmailMessage = {
    from: string;
    to: string[];
    subject: string;
    body: string;
};
export type MessageFilterApi = {
    inbox: string;
    subjectEquals?: string;
    subjectContains?: string;
    fromEmail?: string;
    fromDomain?: string;
};
export declare const pollNextMessageApi: ({ authToken, filter, }: {
    authToken: string;
    filter: MessageFilterApi;
}) => Promise<EmailMessage>;
