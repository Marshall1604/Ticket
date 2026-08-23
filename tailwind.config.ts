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
        luxury: {
          ivory: "#F7F6F2",
          white: "#FFFFFF",
          dark: "#0A1C18",
          ink: "#10231E",
          sage: "#66736E",
          muted: "#9BA5A1",
        },
        emerald: {
          DEFAULT: "#0E4437",
          hover: "#093027",
          dark: "#08251E",
          light: "rgba(14, 68, 55, 0.08)",
          subtle: "rgba(14, 68, 55, 0.04)",
        },
        champagne: {
          DEFAULT: "#D7BE8A",
          light: "rgba(215, 190, 138, 0.15)",
          border: "rgba(215, 190, 138, 0.4)",
        },
        border: {
          subtle: "rgba(16, 35, 30, 0.10)",
          hover: "rgba(16, 35, 30, 0.22)",
          dark: "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        serif: ["var(--font-bodoni)", "Bodoni Moda", "Didot", "Cormorant Garamond", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "Inter", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        editorial: "0 10px 30px -10px rgba(16, 35, 30, 0.06)",
        "editorial-hover": "0 20px 40px -15px rgba(16, 35, 30, 0.12)",
        "card-dark": "0 20px 40px -10px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
