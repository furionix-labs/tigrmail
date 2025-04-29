import { AxiosError } from "axios";

export class TigrmailError extends Error {
  public generalMessage: string;
  public techMessage: string;

  constructor({
    error,
    generalMessage = "",
  }: {
    error: AxiosError | Error;
    generalMessage?: string;
  }) {
    // extract the technical message
    let techMessage: string;
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      const statusCode = error.response?.status ? `[${error.response.status}]` : '';
      if (data && typeof data === "object") {
        const { error: errMsg } = data as {
          error: string;
        };
        techMessage = `${statusCode} ${errMsg}`;
      } else {
        techMessage = `${statusCode} ${error.message}`;
      }
    } else {
      techMessage = error.message;
    }

    const finalMsg = `\n\n  🐅 [Message]:\n      ${generalMessage}\n\n  🐅 [Details]:\n      ${techMessage}\n`;
    super(finalMsg);

    this.name = this.constructor.name;
    this.generalMessage = generalMessage || techMessage;
    this.techMessage = techMessage;
  }
}