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
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'progress-circle': {
          '0%': { strokeDashoffset: '50.27' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'progress-circle': 'progress-circle 1s linear forwards',
      },
    },
  },
  plugins: [],
};
export default config;
