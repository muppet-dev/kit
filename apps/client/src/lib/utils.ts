import type { Tool } from "@/constants";
import { DEFAULT_TOOLS } from "@/providers";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToolName(name: Tool) {
  return DEFAULT_TOOLS.find((tool) => tool.name === name)?.label ?? name;
}
