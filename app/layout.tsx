import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Varnit & Akshita",
    template: "%s · Varnit & Akshita",
  },
  description:
    "Together with our families, we invite you to celebrate our wedding — 12 December 2026, Lucknow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${manrope.variable} h-full`}
    >
      <body className="min-h-dvh bg-ivory font-sans text-charcoal antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
