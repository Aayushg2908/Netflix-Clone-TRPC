import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sessionprovider from "@/components/providers/session-provider";
import TRPCProvider from "@/components/providers/trpc-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflix",
  description: "Netflix clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sessionprovider>
          <TRPCProvider>
            <Toaster />
            {children}
          </TRPCProvider>
        </Sessionprovider>
      </body>
    </html>
  );
}
