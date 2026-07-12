import { api } from "./apiService";

export type GetDomainsResponse = {
  domains: string[];
};

export const getDomainsApi = ({
  authToken,
}: {
  authToken: string;
}): Promise<GetDomainsResponse> => {
  return api.get("/v1/domains", {
    headers: { Authorization: `Bearer ${authToken}` },
  }).then((response) => response.data);
};
