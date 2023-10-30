"use client";

import { SessionProvider } from "next-auth/react";

export interface SessionProviderProps {
  children: React.ReactNode;
}

export default function Sessionprovider({ 
  children
}: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}