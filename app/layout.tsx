import type { Metadata } from "next";
import { Assistant, Barlow, Nunito_Sans } from "next/font/google";
import "./globals.css";

// The live site uses Avenir Light (body/headings), DIN Next Light (menu) and
// Assistant (reviews). Nunito Sans and Barlow are the closest free matches.
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-barlow",
  display: "swap",
});
const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
