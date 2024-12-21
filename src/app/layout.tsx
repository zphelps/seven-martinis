import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { config } from "@/config";
import React, { Suspense } from "react";
import { getMetadata } from "@/utils/seo/get-metadata";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
