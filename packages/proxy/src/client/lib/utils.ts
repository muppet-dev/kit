import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const numberFormatter = (
  value: number | bigint,
  type: keyof Intl.NumberFormatOptionsStyleRegistry
) =>
  new Intl.NumberFormat("en-US", {
    style: type,
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

export function downloadJSON(jsonData: unknown, filename: string) {
  // Convert the JSON object to a string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Create a blob with the JSON data
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Simulate a click on the anchor element
  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link and revoking the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
