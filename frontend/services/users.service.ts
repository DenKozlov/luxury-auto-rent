import { api } from "@/lib/axios";
import { ListUsersParams, ListUsersResponse } from "@/types";
import { User } from "better-auth";

export const usersService = {
  updateMe: async (formData: FormData): Promise<User> => {
    const { data } = await api.patch<User>("/users/me", formData);
    return data;
  },
  deactivateAccount: async (id: string): Promise<User> => {
    const { data } = await api.post(`/users/${id}/deactivate`);
    return data;
  },
  getUsers: async ({
    debouncedSearch,
    searchBy,
    sorting,
    pagination,
  }: ListUsersParams): Promise<ListUsersResponse> => {
    console.log(pagination);
    const sort = sorting[0];
    const params = {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      sortBy: sort?.id,
      sortDirection: sort ? (sort.desc ? "desc" : "asc") : undefined,
      ...(!!debouncedSearch
        ? {
            search: debouncedSearch,
            searchBy,
          }
        : {}),
    };
    const { data } = await api.get<ListUsersResponse>("/users", {
      params,
    });
    return data;
  },
};
