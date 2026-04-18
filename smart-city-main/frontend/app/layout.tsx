import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const fontBody = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart City Geospatial Intelligence",
  description: "Dashboard for monitoring smart city metrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontBody.className}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
