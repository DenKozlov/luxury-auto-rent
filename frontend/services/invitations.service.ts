import { UseGetInvitations } from "@/hooks/use-get-invitations";
import { api } from "@/lib/axios";
import { getCustomRequestParams } from "@/lib/utils";
import { Invitation, ListInvitationsResponse } from "@/types";

type ValidateResponse = {
  valid: boolean;
  email?: string;
  reason?: string;
};
const baseUrl = "/invitations";

export const invitationsService = {
  validate: async (token: string) => {
    const { data } = await api.get<ValidateResponse>(`${baseUrl}/validate`, {
      params: { token },
    });
    return data;
  },
  accept: async (payload: {
    token: string;
    name: string;
    password: string;
  }) => {
    const { data } = await api.post<Invitation>(`${baseUrl}/accept`, payload);
    return data;
  },
  send: async (payload: {
    email: string;
    role?: string;
  }): Promise<Invitation> => {
    const { data } = await api.post(`${baseUrl}/send`, payload);
    return data;
  },
  getAll: async (
    rawParams: UseGetInvitations,
  ): Promise<ListInvitationsResponse> => {
    const params = getCustomRequestParams(rawParams);
    const { data } = await api.get(baseUrl, { params });
    return data;
  },
  resend: async (id: string) => {
    const { data } = await api.patch(`${baseUrl}/${id}/resend`);
    return data;
  },
  revoke: async (id: string) => {
    const { data } = await api.patch(`${baseUrl}/${id}/revoke`);
    return data;
  },
};
