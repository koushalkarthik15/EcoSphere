import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1),
  NEXT_PUBLIC_API_URL: z.string().optional(),
  NEXT_PUBLIC_CLIMATE_TRACE_API: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const rawEnv = {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_CLIMATE_TRACE_API: process.env.NEXT_PUBLIC_CLIMATE_TRACE_API,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
  NODE_ENV: process.env.NODE_ENV,
};

const result = envSchema.safeParse(rawEnv);

if (!result.success) {
  console.error(result.error.format());
  throw new Error("Invalid environment configuration");
}

export const env = result.data;

export default env;