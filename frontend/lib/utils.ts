import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays } from "date-fns";
import { DELETE_RETENTION_DAYS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExpiryDate = (days = DELETE_RETENTION_DAYS): Date => {
  return addDays(new Date(), days);
};
