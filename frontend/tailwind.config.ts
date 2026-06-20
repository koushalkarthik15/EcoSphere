import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6FAF4", // Clean pale organic green-gray
        surface: "#FFFFFF",    // Premium white surface container
        border: "#E6EFE3",     // Gentle light green boundary lines
        text: {
          deep: "#1B5E20",     // Editorial deep forest green
          muted: "#558B2F",    // Secondary leaf text
        },
        telemetry: {
          healthy: "#2E7D32",   // Leaf green
          neutral: "#81D4FA",   // Sky blue
          warning: "#FFB300",   // Amber
          critical: "#E53935",  // Danger red
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-merriweather)", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
