import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";
import AuthGuard from "@/guards/auth-guard";
import {Providers} from "@/providers";
import {config} from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: config.app.name,
  description: config.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
          {children}
      </Providers>
      </body>
    </html>
  );
}
