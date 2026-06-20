import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, "Google Maps API Key is required"),
  NEXT_PUBLIC_API_URL: z.string().optional(),
  NEXT_PUBLIC_CLIMATE_TRACE_API: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const validateEnv = () => {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIMATE_TRACE_API: process.env.NEXT_PUBLIC_CLIMATE_TRACE_API,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables configuration:", result.error.format());
    throw new Error("Invalid environment variables configuration");
  }

  return result.data;
};

export const env = typeof window === "undefined" ? validateEnv() : {} as ReturnType<typeof validateEnv>;
export default env;
