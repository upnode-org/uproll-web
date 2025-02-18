import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { getSession } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uproll",
  description: "Uproll is a tool for deploying and configuring OP stack rollups.",
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
        <AuthProvider session={session}>
          <NavBar />
          <div className=" min-h-screen overflow-y-scroll overflow-x-hidden">
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
