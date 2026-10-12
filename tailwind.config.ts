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
        industrial: {
          950: "#070c14",
          900: "#0b1320",
          850: "#0f1a2e",
          800: "#16233b",
          700: "#223554",
          600: "#344c75",
          500: "#4b689a",
          400: "#7190c4",
          300: "#a3bbe2",
          200: "#cddcf3",
          100: "#e9f0fc",
          50: "#f5f8ff",
        },
        orisTeal: {
          light: "#2dd4bf",
          DEFAULT: "#14b8a6",
          dark: "#0f766e",
          muted: "rgba(20, 184, 166, 0.15)",
        },
        orisAmber: {
          light: "#fbbf24",
          DEFAULT: "#f59e0b",
          dark: "#b45309",
          muted: "rgba(245, 158, 11, 0.15)",
        },
        orisBlue: {
          light: "#60a5fa",
          DEFAULT: "#3b82f6",
          dark: "#1d4ed8",
          muted: "rgba(59, 130, 246, 0.15)",
        },
        orisRed: {
          light: "#f87171",
          DEFAULT: "#ef4444",
          dark: "#b91c1c",
          muted: "rgba(239, 68, 68, 0.15)",
        },
        orisGreen: {
          light: "#34d399",
          DEFAULT: "#10b981",
          dark: "#047857",
          muted: "rgba(16, 185, 129, 0.15)",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
