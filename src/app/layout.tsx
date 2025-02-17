import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";
import { getSession } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uproll",
  description: "Uproll is a tool for deploying and managing rollup's.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()

  return (
    <html lang="en">
      <body
        className={`${robotoMono.variable} antialiased`}
      >
        <AuthWrapper session={session}>
          <NavBar />
          <div className=" min-h-screen overflow-y-scroll overflow-x-hidden">
            <main>
              {children}
            </main>
          </div>
        </AuthWrapper>
        <Toaster />
      </body>
    </html>
  );
}
