import { CheckoutPayload } from "@/components/rental-form";
import { api } from "@/lib/axios";
// import { Rental } from "@/types";
// import { getParams } from "@/lib/utils";

export const rentalsService = {
  checkout: async (
    payload: CheckoutPayload,
  ): Promise<{ redirectUrl: string }> => {
    const { data } = await api.post<{ redirectUrl: string }>(
      "/rentals/checkout",
      payload,
    );
    return data;
  },
};
