import { api } from "@/lib/axios";
import { Car, CarsReponse, Filters, GetCarsParams } from "@/types";

export const carService = {
  getAll: async (params: GetCarsParams): Promise<CarsReponse> => {
    const { data } = await api.get<CarsReponse>("/cars", { params });
    return data;
  },

  create: async (formData: FormData): Promise<Car> => {
    const { data } = await api.post<Car>("/cars", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  getFilters: async (): Promise<Filters> => {
    const { data } = await api.get("/cars/filters");

    return data;
  },
};
