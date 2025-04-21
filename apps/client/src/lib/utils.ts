import { Tool } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToolName(name: Tool) {
  switch (name) {
    case Tool.TOOLS:
      return "Tool";
    case Tool.PROMPTS:
      return "Prompt";
    case Tool.STATIC_RESOURCES:
      return "Static Resource";
    case Tool.DYNAMIC_RESOURCES:
      return "Dynamic Resource";
  }
}
