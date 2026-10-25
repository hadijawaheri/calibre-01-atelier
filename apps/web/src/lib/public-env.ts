import { z } from "zod";

// NEXT_PUBLIC_* values are inlined into the browser bundle, so this module is safe on both sides
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:7782"),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
