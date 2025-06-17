import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dateformat from "dateformat";

export const latencyTimeFormat = (latency: number) => {
  return dateformat(latency, "mmm dd|hh:MM:ss|l").split("|");
};

export enum SortingEnum {
  ASCENDING = 1,
  DESCENDING = -1,
}

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

const adjs = [
  // Colors
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "silver",
  "golden",
  "teal",
  "crimson",
  "navy",
  "lime",
  "coral",
  "indigo",

  // Personality
  "happy",
  "brave",
  "clever",
  "calm",
  "gentle",
  "kind",
  "proud",
  "wise",
  "funny",
  "lucky",
  "peaceful",
  "bright",
  "honest",
  "jolly",
  "friendly",
  "merry",

  // Size & Feel
  "big",
  "small",
  "tiny",
  "giant",
  "tall",
  "round",
  "square",
  "flat",
  "smooth",
  "soft",
  "warm",
  "cool",
  "light",
  "fluffy",
  "cozy",
  "snug",

  // Weather & Nature
  "sunny",
  "rainy",
  "snowy",
  "windy",
  "misty",
  "foggy",
  "stormy",
  "breezy",
  "forest",
  "mountain",
  "river",
  "ocean",
  "desert",
  "garden",
  "meadow",
  "jungle",
];

const nouns = [
  // Animals
  "panda",
  "tiger",
  "lion",
  "eagle",
  "dolphin",
  "turtle",
  "rabbit",
  "fox",
  "wolf",
  "bear",
  "duck",
  "penguin",
  "koala",
  "squirrel",
  "monkey",
  "elephant",

  // Food
  "apple",
  "banana",
  "cookie",
  "donut",
  "pizza",
  "taco",
  "burger",
  "cupcake",
  "lemon",
  "berry",
  "coffee",
  "honey",
  "pepper",
  "noodle",
  "pasta",
  "muffin",

  // Objects
  "basket",
  "button",
  "candle",
  "door",
  "window",
  "pillow",
  "blanket",
  "mirror",
  "book",
  "pencil",
  "clock",
  "chair",
  "table",
  "camera",
  "phone",
  "bridge",

  // Nature
  "moon",
  "star",
  "cloud",
  "mountain",
  "lake",
  "river",
  "forest",
  "beach",
  "island",
  "flower",
  "garden",
  "tree",
  "rock",
  "leaf",
  "valley",
  "hill",
];

export function generateName() {
  return `${adjs[getRandomInt(adjs.length)]}-${
    nouns[getRandomInt(nouns.length)]
  }`;
}

function getRandomInt(length: number) {
  return Math.floor(Math.random() * (length - 1));
}

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
