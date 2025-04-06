interface MailtigerConfig {
    linkSelector: string;
}
interface MailtigerResult {
    emailAddress: string;
    verificationLinkPromise: Promise<string>;
}
export declare const mailtiger: ({ linkSelector }: MailtigerConfig) => MailtigerResult;
export {};
