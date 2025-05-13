'use client'
import { useState, useRef, useEffect } from "react";
import { Righteous } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Eye, LogOut, Menu, X } from "lucide-react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking on the menu button itself
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }

      // Close if clicking outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="flex flex-col items-center justify-between pt-2 px-2 sm:pt-4 sm:px-6 max-w-7xl fixed left-[50%] translate-x-[-50%] w-full z-1000">
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
                View Configs
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
              ref={buttonRef}
              variant="ghost"
              size="icon"
              className="text-white rounded-full border border-white hover:bg-white hover:text-black transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
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
      <div
        ref={menuRef}
        className={`sm:hidden w-full bg-stone-900 backdrop-blur-xs text-white my-2 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isMenuOpen && status === "authenticated"
            ? "max-h-[200px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <ul className="flex flex-col divide-y divide-stone-700/50">
          <li>
            <Link
              href="/config/view"
              onClick={() => setIsMenuOpen(false)}
              className="px-5 py-3 hover:bg-white hover:text-black transition-colors duration-150 flex items-center gap-3"
            >
              <Eye className="w-5 h-5" />
              View Configurations
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-5 py-3 hover:bg-white hover:text-black transition-colors duration-150 flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </li>
        </ul>
      </div>
      {/* Overlay backdrop when menu is open */}
      {isMenuOpen && status === "authenticated" && (
        <div
          className="fixed inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/0  z-[-1] sm:hidden transition-all duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
