import { createLoader, parseAsJson, parseAsString } from "nuqs/server";
import { querySchema } from "@/lib/schemas/query-params";

export const dataSearchParams = {
  data: parseAsJson(querySchema),
  input: parseAsString,
};
export const loadSearchParams = createLoader(dataSearchParams);
