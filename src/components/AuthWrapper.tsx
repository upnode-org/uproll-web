"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth"

export default function AuthWrapper({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
