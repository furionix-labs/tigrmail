import { AxiosError } from "axios";
export declare class TigrmailError extends Error {
    generalMessage: string;
    techMessage: string;
    constructor({ error, generalMessage, }: {
        error: AxiosError | Error;
        generalMessage?: string;
    });
    toString(): string;
}
