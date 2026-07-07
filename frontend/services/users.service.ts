import { api } from "@/lib/axios";
import { User } from "better-auth";

export const usersService = {
  updateMe: async (formData: FormData): Promise<User> => {
    const { data } = await api.patch<User>("/users/me", formData);
    return data;
  },
};
