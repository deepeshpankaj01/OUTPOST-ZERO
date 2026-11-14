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
          950: "#040711",
          900: "#070B19",
          850: "#0B1126",
          800: "#0F1734",
          700: "#18224B",
          600: "#243269",
        },
        cyan: {
          neon: "#00F0FF",
          glow: "#38bdf8",
        },
        emerald: {
          neon: "#10B981",
        },
        amber: {
          neon: "#F59E0B",
        },
        coral: {
          neon: "#EF4444",
        },
      },
      boxShadow: {
        "cyan-glow": "0 0 15px -3px rgba(0, 240, 255, 0.45), 0 0 6px -2px rgba(0, 240, 255, 0.3)",
        "emerald-glow": "0 0 15px -3px rgba(16, 185, 129, 0.45), 0 0 6px -2px rgba(16, 185, 129, 0.3)",
        "amber-glow": "0 0 15px -3px rgba(245, 158, 11, 0.45), 0 0 6px -2px rgba(245, 158, 11, 0.3)",
        "coral-glow": "0 0 15px -3px rgba(239, 68, 68, 0.5), 0 0 6px -2px rgba(239, 68, 68, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "spin 8s linear infinite",
        "orbit": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
