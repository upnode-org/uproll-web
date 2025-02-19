"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import HeroWrapper from "@/components/HeroWrapper";
import Footer from "@/components/Footer";
import { ChevronRight, Copy } from "lucide-react";
import CommandCopy from "@/components/CommandCopy";
import GradientBackground from "@/components/GradientBackground";
import { Button } from "@/components/ui/button";
export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <HeroWrapper className="" backgroundElement={<GradientBackground className="absolute inset-0 h-full w-full" />
      }>
        <div className=" w-full lg:mx-auto lg:max-w-content-max border-stone-900 z-10 border-y">
          {/* TODO: Need a better media query or setting elements to wrap on smaller screens */}
          <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto">
            <div className="basis-1/2 p-4 md:border-r md:border-r-stone-900 md:p-10 uppercase">
              <p className="text-white text-sm">The easiest way to spin up your OP stack rollups</p>
              <h1 className="text-white text-8xl font-bold">Uproll CLI</h1>
              <Link href="/config">
                <Button className="mt-4">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="basis-1/2 bg-gray-50 ">
              <div className="flex flex-col border-b border-stone-900 p-4 md:p-10 h-[50%] gap-4 ">
                <h2 className="text-stone-900 text-xl font-bold">Install in one click</h2>
                <CommandCopy command="CURL -sSL https://uproll.org/install.sh | sh" />
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-10 h-[50%]">
                <h2 className="text-stone-900 text-xl font-bold">Deploy in one more</h2>
                <CommandCopy command="uproll deploy --config config.json" description="For a minimal default OP stack rollup config" />
              </div>
            </div>
          </div>
        </div>
      </HeroWrapper >
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Customize Your Rollup Configuration
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Take full control of your deployment with our intuitive configurator.
            Edit, save, and deploy your OP stack rollup configuration with just one click.
            Enjoy a seamless experience from setup to launch.
          </p>
          <div className="mt-8">
            <Link
              href="/config"
              className=" px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Create Config <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Deploy Premade Configs for Every Use Case
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Choose from a variety of pre-configured OP stack rollups tailored for different applications.
            Whether it's a quick prototype, a secure production environment, or a scalable testnet, we've got you covered.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/config/prototype"
              className="px-6 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              Prototype Rollup <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/config/production"
              className="px-6 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              Production Ready <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/config/testnet"
              className="px-6 py-3 bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-colors inline-flex items-center gap-2"
            >
              Testnet Setup <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}