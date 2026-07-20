import { api } from "@/lib/axios";
import { Car, CarsReponse, Filters, GetCarsParams } from "@/types";

export const carService = {
  getAll: async (params: GetCarsParams): Promise<CarsReponse> => {
    const { data } = await api.get<CarsReponse>("/cars", { params });
    return data;
  },

  create: async (formData: FormData): Promise<Car> => {
    const { data } = await api.post<Car>("/cars", formData);
    return data;
  },

  getFilters: async (): Promise<Filters> => {
    const { data } = await api.get<Filters>("/cars/filters");

    return data;
  },

  getById: async (id: string): Promise<Car> => {
    const { data } = await api.get<Car>(`/cars/details/${id}`);
    return data;
  },

  getTopRated: async (): Promise<Car[]> => {
    const { data } = await api.get<Car[]>("/cars/recommended");
    return data;
  },
};
