// inboxApi.ts
import { api } from "./apiService";

export type CreateInboxResponse = {
  inbox: string;
};
export const createInboxApi = ({
  authToken,
  domain,
}: {
  authToken: string;
  domain?: string;
}): Promise<CreateInboxResponse> => {
  const queryString = domain ? `?${new URLSearchParams({ domain })}` : "";

  return api.post(`/v1/inboxes${queryString}`, null, {
    headers: { Authorization: `Bearer ${authToken}` },
  }).then((response) => response.data);
};
