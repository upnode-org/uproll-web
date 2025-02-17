"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeroWrapper from "@/components/HeroWrapper";
import Footer from "@/components/Footer";
import { Copy } from "lucide-react";
import CommandCopy from "@/components/CommandCopy";
export default function HomePage() {
  const router = useRouter();

  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <>
        <HeroWrapper className="">
          <div className=" w-full lg:mx-auto lg:max-w-content-max flex flex-col md:flex-row border border-stone-900 z-10">
            <div className="basis-1/2 p-4 md:border-r md:border-r-stone-900 md:p-10 uppercase">
              <p className="text-white text-sm">The easiest way to spin up your OP stack rollups</p>
              <h1 className="text-white text-6xl font-bold">Uproll Rollup deployment tool</h1>
            </div>
            <div className="basis-1/2 bg-gray-50 ">
              <div className="flex flex-col border-b border-stone-900 p-4 md:p-10 h-[50%] gap-4 ">
                <h2 className="text-stone-900 text-xl font-bold">Install in one click</h2>
                <CommandCopy command="CURL -sSL https://uproll.xyz/install.sh | sh" />
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-10 h-[50%]">
                <h2 className="text-stone-900 text-xl font-bold">Deploy in one more</h2>
                <CommandCopy command="uproll deploy --config config.json" description="For a minimal default OP stack rollup config" />
              </div>
            </div>
          </div>
        </HeroWrapper >
        <Link href="/config">Create Config</Link>
        <Footer />
      </>
    );
  }
}
