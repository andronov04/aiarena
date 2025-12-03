import { z } from "zod";

export const querySchema = z.array(
  z.object({
    p: z.string().describe("ProviderId"),
    m: z.string().describe("ModelId"),
  }),
);
