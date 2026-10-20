import "server-only";

import { z } from "zod";

const envSchema = z.object({
  INTERNAL_API_URL: z.url().default("http://localhost:7781"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:7782"),
});

export const env = envSchema.parse({
  INTERNAL_API_URL: process.env.INTERNAL_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
