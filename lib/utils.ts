import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 *
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param file
 * @returns
 */
export const getCharacter = (file: number): string =>
  String.fromCharCode(file + 96);

/**
 * Utility function to capitalize the first letter of a string.
 * @param str - The string to capitalize.
 * @returns A string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Utility function that turns a word slug into a proper noun phrase.
 * It replaces hyphens and underscores with spaces and capitalizes the first letter of each word.
 * @param slug - The slug string to convert.
 * @returns A properly formatted noun phrase.
 */
export function unslugify(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Utility function to slugify a given text.
 * It converts the text to lowercase, trims whitespace, replaces spaces with hyphens,
 * removes non-word characters, and collapses multiple hyphens into a single hyphen.
 * @param text - The text to slugify.
 * @returns A slugified version of the text.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}
