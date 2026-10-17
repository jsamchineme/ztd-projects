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
        ink: "#292116",
        paper: "#ffffff",
        cream: "#fef3e5",
        soft: "#fcfbfa",
        line: "#e8e6e6",
        gold: "#db8707",
        "gold-dark": "#925a05",
        "gold-light": "#f3d4a5",
        green: "#068e78",
        "green-dark": "#03473c",
        "teal-bar": "#5ba596",
        mint: "#a5ded4",
        brown: "#492d02",
        burgundy: "#068e78",
        "burgundy-dark": "#03473c",
        muted: "#737373",
        white: "#ffffff",
      },
      fontFamily: {
        serif: ['"Assistant"', "system-ui", "sans-serif"],
        display: ['"Assistant"', '"Avenir"', "system-ui", "sans-serif"],
        sans: ['"Assistant"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
        full: "2px",
        input: "2px",
      },
      boxShadow: {
        card: "0 12px 34px rgba(30,22,10,.08)",
      },
      maxWidth: {
        wrap: "1240px",
        faq: "820px",
        "section-head": "680px",
      },
    },
  },
};

export default config;
