'use client'
import { Righteous } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const righteous = Righteous({
    weight: "400",
    variable: "--font-righteous",
    subsets: ["latin"],
});

export default function NavBar() {
    const { data: session, status } = useSession()

    return (
        <header className="flex items-center justify-between pt-4 px-6 max-w-7xl fixed left-[50%] translate-x-[-50%] w-full z-[1000]">
            {/* Navbar */}
            <div className="flex items-center rounded-full bg-stone-900 border border-white w-full justify-between px-3 py-3 mx-auto">
                <Link href="/">
                    <h1 className={righteous.className + " text-4xl text-white"}>Uproll</h1>
                </Link>
                <div className="flex items-center gap-3">
                    {status === "authenticated" ? (
                        <div className="flex items-center gap-3">
                            {/* Probably delete this, dont think i like it */}
                            <h2 className="text-white text-xs hidden sm:block">
                                Welcome, {session.user.email}: {session.user.id}
                            </h2>
                            <div className="flex items-center rounded-full bg-stone-900 border border-white">
                                <button 
                                className="text-white rounded-full  px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150" 
                                onClick={() => signOut()}>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center rounded-full bg-stone-900 border border-white">
                            <Link href="/auth/signin" className="text-white rounded-l-full  px-4 py-2 hover:bg-white hover:text-black transition-colors duration-150">
                                Sign in
                            </Link>
                            <Link href="/auth/signup" className="text-white rounded-r-full px-4 py-2 border-l border-white hover:bg-white hover:text-black transition-colors duration-150">
                                Sign up
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center text-white">
                        <Button variant="ghost" size="icon" className="text-white rounded-full border border-white">
                            <Menu />
                        </Button>
                    </div>
                </div>
            </div>
            {/* Dropdown Menu */}
            <div className="flex items-center">

            </div>
        </header>
    )
}