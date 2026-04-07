"use client";

import { Manrope, DM_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable}`}>
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <AppShell>{children}</AppShell>
          <Toaster theme="dark" position="top-center" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
