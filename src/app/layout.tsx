import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { config } from "@/config";
import React from "react";
import { getMetadata } from "@/utils/seo/get-metadata";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
