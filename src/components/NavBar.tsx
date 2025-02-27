'use client'
import { useState } from "react";
import { Righteous } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Eye, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const righteous = Righteous({
  weight: "400",
  variable: "--font-righteous",
  subsets: ["latin"],
});

export default function NavBar() {
  const { status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex flex-col items-center justify-between pt-2 px-2 sm:pt-4 sm:px-6 max-w-7xl fixed left-[50%] translate-x-[-50%] w-full z-[1000]">
      {/* Main Navbar */}
      <div className="flex items-center rounded-full bg-stone-900 w-full justify-between px-3 py-3 mx-auto">
        <Link href="/">
          <h1 className={righteous.className + " text-4xl text-white"}>Uproll</h1>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3 text-white">
          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/config/view"
                className="text-white rounded-full px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150"
              >
                View
              </Link>
              <div className="flex items-center rounded-full bg-stone-900 border border-white">
                <button
                  className="text-white rounded-full px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center rounded-full bg-stone-900 border border-white">
              <Link
                href="/auth/signin"
                className="text-white rounded-l-full px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="text-white rounded-r-full px-4 py-2 border-l border-white hover:bg-white hover:text-black transition-colors duration-150"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
        {/* Mobile Navigation */}
        {status === "authenticated" ? (
          <div className="sm:hidden flex items-center text-white">
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full border border-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu />
            </Button>
          </div>
        ) : (
          <div className="sm:hidden flex items-center gap-3 text-white">
            <div className="flex items-center rounded-full bg-stone-900 border border-white w-full justify-center">
              <Link
                href="/auth/signin"
                className="text-white rounded-l-full px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="text-white rounded-r-full px-4 py-2 border-l border-white hover:bg-white hover:text-black transition-colors duration-150"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* Mobile Dropdown Menu for authenticated users */}
      {isMenuOpen && status === "authenticated" && (
        <div className="sm:hidden w-full bg-stone-900 text-white mt-2 rounded-lg shadow-lg overflow-hidden">
          <ul className="flex flex-col">
            <li>
              <Link
                href="/config/view"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
