import { api } from "@/lib/axios";
import { getParams } from "@/lib/utils";
import { GetParams, ListUsersResponse } from "@/types";
import { User } from "better-auth";

export const usersService = {
  updateMe: async (formData: FormData): Promise<User> => {
    const { data } = await api.patch<User>("/users/me", formData);
    return data;
  },
  deactivateMe: async (): Promise<User> => {
    const { data } = await api.patch<User>("/users/me/deactivate");
    return data;
  },
  deactivateUser: async (id: string): Promise<{ user: User }> => {
    const { data } = await api.post(`/users/${id}/deactivate`);
    return data;
  },
  reactivateUser: async (id: string): Promise<{ user: User }> => {
    const { data } = await api.patch(`/users/${id}/reactivate`);
    return data;
  },
  getUsers: async (rawParams: GetParams): Promise<ListUsersResponse> => {
    const params = getParams(rawParams);
    const { data } = await api.get<ListUsersResponse>("/users", {
      params,
    });
    return data;
  },
};
