import "server-only";

import { z } from "zod";

import { publicEnv } from "./public-env";

const serverEnvSchema = z.object({
  // Where the Next rewrite sends /api/*; the API listens on loopback only
  INTERNAL_API_URL: z.url().default("http://localhost:7781"),
});

export const env = {
  ...publicEnv,
  ...serverEnvSchema.parse({ INTERNAL_API_URL: process.env.INTERNAL_API_URL }),
};
