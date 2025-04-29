import { AxiosError } from "axios";
import util from "util";
export declare class TigrmailError extends Error {
    constructor({ error }: {
        error: AxiosError | Error;
    });
    /**
     * Call this to log your TigrmailError nicely:
     *    new TigrmailError({error:…}).log()
     */
    log(): void;
    [util.inspect.custom](): string;
}
