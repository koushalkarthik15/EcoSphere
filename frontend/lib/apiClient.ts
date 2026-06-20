import { env } from "./env";

console.log("ENV:", env);
console.log("NEXT_PUBLIC_API_URL:", env.NEXT_PUBLIC_API_URL);

export const API_BASE_URL =
    env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

console.log("API_BASE_URL:", API_BASE_URL);