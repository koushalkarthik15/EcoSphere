import { env } from "./env";

/**
 * Centralized API Base URL for all frontend requests.
 * Uses NEXT_PUBLIC_API_URL from the environment, and falls back to localhost 
 * only if not defined (suitable for local development).
 */
export const API_BASE_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// You can optionally export a configured fetch wrapper or axios instance here in the future
// if further standardization is needed. For now, exposing the dynamic URL is sufficient.
