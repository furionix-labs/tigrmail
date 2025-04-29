// inboxApi.ts
import { api } from "./apiService";

export type CreateInboxResponse = {
  inbox: string;
};
export const createInboxApi = ({
  authToken,
}: {
  authToken: string;
}): Promise<CreateInboxResponse> => {
  return api.post("/v1/inboxes", null, {
    headers: { Authorization: `Bearer ${authToken}` },
  }).then((response) => response.data);
};
