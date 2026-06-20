import React from "react";
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { AppProviders } from "./providers";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoSphere | Environmental Intelligence Platform",
  description: "Carbon telemetry monitoring and marketplace for Urban Citizens, Farmers, and Industry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="organic">
      <body className={`${inter.variable} ${merriweather.variable} min-h-screen flex flex-col bg-background text-text-deep font-sans antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
