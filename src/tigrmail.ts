import { AxiosError } from "axios";
import { createInboxApi } from "./createInboxApi";
import { pollNextMessageApi, EmailMessage } from "./pollNextMessageApi";
import { TigrmailError } from "./TigrmailError";

export type MessageFilter = {
  inbox: string;
  subject?:
    | { contains: string; equals?: undefined }
    | { contains?: undefined; equals: string };
  from?:
    | { email: string; domain?: undefined }
    | { email?: undefined; domain: string };
};

export class Tigrmail {
  private token: string;

  constructor({ token }: { token: string }) {
    this.token = token;
  }

  async generateInbox(): Promise<string> {
    return createInboxApi({
      authToken: this.token,
    })
      .then((response) => response.inbox)
      .catch((error: AxiosError<{ error: string }>) => {
        throw new TigrmailError({
          generalMessage: `Failed to generate a new inbox.`,
          error,
        });
      });
  }

  async pollNextMessage({
    inbox,
    subject,
    from,
  }: MessageFilter): Promise<EmailMessage> {
    return pollNextMessageApi({
      authToken: this.token,
      filter: {
        inbox,
        subjectContains: subject?.contains,
        subjectEquals: subject?.equals,
        fromEmail: from?.email,
        fromDomain: from?.domain,
      },
    }).catch((error) => {
      throw new TigrmailError({
        generalMessage: `Failed to poll the next message for inbox: ${inbox}.`,
        error,
      });
    });
  }
}
