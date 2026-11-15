import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#060A17", // Deepest space navy background
          900: "#0B1226", // Deep space navy canvas
          850: "#101B36", // Clean card surface
          800: "#17254A", // Elevated surface / hover
          700: "#223566", // Borders and dividers
          600: "#324B8C", // Subtle active borders
        },
        navy: {
          950: "#060A17",
          900: "#0B1226",
          850: "#101B36",
          800: "#17254A",
          700: "#223566",
        },
        surface: {
          base: "#060A17",
          card: "#0E1730",
          cardHover: "#131F3F",
          border: "#1C2C54",
          borderLight: "#2A3F74",
        },
        cyan: {
          neon: "#38BDF8", // Refined subtle cyan (Sky-400), softer and more readable
          glow: "#0EA5E9",
        },
        coral: {
          neon: "#F87171",
        },
      },
      boxShadow: {
        "subtle": "0 2px 10px rgba(0, 0, 0, 0.35)",
        "card": "0 4px 20px -2px rgba(3, 7, 18, 0.6)",
        "card-hover": "0 8px 30px -4px rgba(3, 7, 18, 0.75)",
        "cyan-glow": "0 0 12px -2px rgba(56, 189, 248, 0.25)",
        "amber-glow": "0 0 12px -2px rgba(245, 158, 11, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
