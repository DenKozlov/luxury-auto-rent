import { api } from "@/lib/axios";
import { Invitation } from "@/types";

type ValidateResponse = {
  valid: boolean;
  email?: string;
  reason?: string;
};

export const invitationsService = {
  validate: async (token: string) => {
    const { data } = await api.get<ValidateResponse>("/invitations/validate", {
      params: { token },
    });
    return data;
  },
  accept: async (payload: {
    token: string;
    name: string;
    password: string;
  }) => {
    const { data } = await api.post<Invitation>("/invitations/accept", payload);
    return data;
  },
  send: async (payload: {
    email: string;
    role?: string;
  }): Promise<Invitation> => {
    const { data } = await api.post("/invitations/send", payload);
    return data;
  },
};
