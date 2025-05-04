import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const numberFormatter = (
  value: number | bigint,
  type: keyof Intl.NumberFormatOptionsStyleRegistry,
) =>
  new Intl.NumberFormat("en-US", {
    style: type,
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
