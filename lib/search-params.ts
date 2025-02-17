import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsString,
} from "nuqs/server";

export const searchProfileParsers = {
  school: parseAsString.withDefault(""),
  skills: parseAsArrayOf(parseAsString).withDefault([]),
} as const;

export const searchProfileCache = createSearchParamsCache(searchProfileParsers);
