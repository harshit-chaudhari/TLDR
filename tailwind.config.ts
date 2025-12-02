import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tldr: {
          dark: "#0a0a0a",
          darkGray: "#1a1a1a",
          gray: "#2a2a2a",
          lightGray: "#3a3a3a",
          warm: "#2d2416",
          gold: "#d4af37",
          accent: "#ff6b6b",
        },
      },
      fontFamily: {
        sans: ["var(--font-red-hat-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
