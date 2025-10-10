import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { config } from "@/config";
import React, { Suspense } from "react";
import { getMetadata } from "@/utils/seo/get-metadata";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '600'], // adjust as needed
    variable: '--font-cormorant',
})

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <body className={cn(inter.className)}>
        <Suspense fallback={<p>Loading...</p>}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
