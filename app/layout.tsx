import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// The live site uses Avenir Light (body/headings), DIN Next Light (menu) and
// Assistant (reviews). Nunito Sans and Barlow are the closest free matches.
// Fonts are self-hosted (app/fonts, SIL OFL) so builds never depend on
// downloading from Google Fonts.
const nunito = localFont({
  src: [
    { path: "./fonts/NunitoSans-300-700-normal.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/NunitoSans-300-700-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-nunito",
  display: "swap",
});
const barlow = localFont({
  src: [
    { path: "./fonts/Barlow-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Barlow-400-normal.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});
const assistant = localFont({
  src: [{ path: "./fonts/Assistant-400-700-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Debb's Kitchen — Spices, Blends & Seasonings",
    template: "%s | Debb's Kitchen",
  },
  description:
    "Chef-crafted spices, blends, oils and seasonings. Afro-continental flavor for every kitchen — elevate your taste, savor every moment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${barlow.variable} ${assistant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
