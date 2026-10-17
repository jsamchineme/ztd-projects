import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";

// Assistant — the sans used on the live site (alongside Avenir Light).
const assistant = Assistant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
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
    <html lang="en" className={`${assistant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
