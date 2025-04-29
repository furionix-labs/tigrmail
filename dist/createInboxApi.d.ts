export type CreateInboxResponse = {
    inbox: string;
};
export declare const createInboxApi: ({ authToken, }: {
    authToken: string;
}) => Promise<CreateInboxResponse>;
