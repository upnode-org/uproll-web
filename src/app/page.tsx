import Link from "next/link";
import HeroWrapper from "@/components/HeroWrapper";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import CommandCopy from "@/components/CommandCopy";
import GradientBackground from "@/components/GradientBackground";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <HeroWrapper
        className="pt-4 relative"
        backgroundElement={
          <GradientBackground className="absolute inset-0 h-full w-full" />
        }
      >
        <div className="w-full lg:mx-auto lg:max-w-content-max">
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-xl mx-auto relative">
            {/* Left Grid Cell */}
            <div className="relative uppercase w-full flex items-center">
              <div className="mx-auto px-5 py-8 md:px-5 lg:p-10">
                <p className="text-white text-sm">
                  The easiest way to spin up your OP stack rollups
                </p>
                <h1 className="text-white text-8xl font-bold flex-wrap">Uproll CLI</h1>
                <Link href="/config">
                  <Button className="mt-4">Get Started</Button>
                </Link>
              </div>
              <svg width="50" height="50" className="absolute bottom-0 left-0 hidden md:block xl:hidden">
                <mask id="inverted-mask-left">
                  <rect width="50" height="50" fill="white" />
                  <circle cx="50" cy="0" r="50" fill="black" />
                </mask>
                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  fill="white"
                  mask="url(#inverted-mask-left)"
                />
              </svg>
              <svg width="50" height="50" className="absolute bottom-0 right-0">
                <mask id="inverted-mask-right">
                  <rect width="50" height="50" fill="white" />
                  <circle cx="0" cy="0" r="50" fill="black" />
                </mask>
                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  fill="white"
                  mask="url(#inverted-mask-right)"
                />
              </svg>
            </div>

            {/* Right Grid Cell */}
            <div className="relative bg-white rounded-ss-3xl xl:rounded-t-3xl p-5 sm:p-7 py-7">
              <svg width="50" height="50" className="absolute bottom-0 right-0  translate-x-[100%]">
                <mask id="inverted-mask-right-2">
                  <rect width="50" height="50" fill="white" />
                  <circle cx="50" cy="0" r="50" fill="black" />
                </mask>
                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  fill="white"
                  mask="url(#inverted-mask-right-2)"
                />
              </svg>
              <div className="size-full flex flex-col justify-evenly overflow-hidden gap-4 space-y-6 sm:space-y-0">
                <div className="flex flex-col gap-4 overflow-hidden">
                  <h2 className="text-stone-900 text-xl font-bold">
                    <span className="text-white bg-black text-2xl p-1 mr-2">1.</span>
                    Install in one click
                  </h2>
                  <CommandCopy
                    command="CURL -sSL https://uproll.org/install.sh | sh"
                  />
                </div>
                <div className="flex flex-col gap-4 overflow-hidden">
                  <h2 className="text-stone-900 text-xl font-bold">
                    <span className="text-white bg-black text-2xl p-1 mr-2">2.</span>
                    Deploy in one more
                  </h2>
                  <CommandCopy
                    command="uproll deploy --config config.json"
                    description="For a minimal default OP stack rollup config"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroWrapper>

      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Customize Your Rollup Configuration
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Take full control of your deployment with our intuitive configurator.
            Edit, save, and deploy your OP stack rollup configuration with just one
            click. Enjoy a seamless experience from setup to launch.
          </p>
          <div className="mt-8">
            <Link
              href="/config"
              className="px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Create Config <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Deploy Premade Configs for Every Use Case
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Choose from a variety of pre-configured OP stack rollups tailored for
            different applications. Whether it&apos;s a quick prototype, a secure
            production environment, or a scalable testnet, we&apos;ve got you covered.
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
