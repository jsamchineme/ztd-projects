import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 — primary token definitions live in app/globals.css via @theme.
 * This file provides content globbing + legacy-config compatibility.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2a1d16",
        paper: "#fcf8f2",
        cream: "#f5ebdd",
        soft: "#faf5ec",
        line: "#ead9c4",
        gold: "#e3a52c",
        "gold-dark": "#b87d12",
        burgundy: "#bf3c2b",
        "burgundy-dark": "#972a1d",
        muted: "#7a6b5d",
        white: "#ffffff",
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "18px",
        full: "50px",
        input: "12px",
      },
      boxShadow: {
        card: "0 20px 50px rgba(60,35,15,.12)",
      },
      maxWidth: {
        wrap: "1200px",
        faq: "820px",
        "section-head": "680px",
      },
    },
  },
};

export default config;
