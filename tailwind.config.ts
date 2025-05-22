import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          100: "#aefeff",
          200: "#7cf3f8",
          300: "#3be8f1",
          400: "#00dee9",
          500: "#00cdd6",
          600: "#00b5bc",
          700: "#009fa5",
          800: "#008a8f",
          900: "#00757a",
        },
        black: "#0a0a0a",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 30px #00ffff88",
        "inner-cyan": "inset 0 0 20px #00ffff44",
      },
      animation: {
        pingSlow: "pingSlow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
        fadeIn: "fadeIn 0.6s ease-out forwards",
        slideInLeft: "slideInLeft 0.3s ease-out forwards",
      },
      keyframes: {
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(1.75)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
