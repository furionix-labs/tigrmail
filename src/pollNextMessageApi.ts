import { api } from "./apiService";

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

export const pollNextMessageApi = ({
  authToken,
  filter,
}: {
  authToken: string;
  filter: MessageFilterApi;
}): Promise<EmailMessage> => {
  const filterNormalized = Object.fromEntries(
    Object.entries(filter).filter(
      ([_, value]) => value
    )
  );
  const queryString = new URLSearchParams(filterNormalized).toString();
  return api.get(`/v1/messages?${queryString}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  }).then((response) => response.data);
};
