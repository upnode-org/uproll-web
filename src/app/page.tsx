import Link from "next/link";
import HeroWrapper from "@/components/HeroWrapper";
import Footer from "@/components/Footer";
import CommandCopy from "@/components/CommandCopy";
import GradientBackground from "@/components/GradientBackground";
import { Button } from "@/components/ui/button";
import AnimatedConfigs from "@/components/AnimatedConfigs";
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
            <div className="relative w-full flex items-center">
              <div className="mx-auto px-5 py-14 md:px-5 lg:px-10">
                {/* <span className="inline-block px-3 py-1  bg-stone-900 rounded-full text-white text-xs font-medium mb-4">
                  OP STACK DEPLOYMENT SIMPLIFIED
                </span> */}
                <h1 className="text-white text-6xl md:text-7xl font-bold leading-tight">
                  Deploy Rollups in<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 opacity-80" style={{ WebkitTextStroke: '0.1px rgba(1,1,1,0.1)', textShadow: 'none' }}> Seconds</span>
                </h1>
                <p className="text-muted text-lg mt-4 max-w-md">
                  The fastest way to configure and deploy your OP stack rollups.
                </p>
                <div className="flex gap-4 mt-6 flex-row">
                  <Link href="/config" className="flex-1 max-w-[200px]">
                    <Button size="lg" className="font-semibold px-6 w-full h-full min-h-[44px]">
                      Create Your Rollup
                    </Button>
                  </Link>
                  <Link href="/docs" className="flex-1 max-w-[200px]">
                    <Button variant="outline" size="lg" className="text-black border-white hover:bg-white/90 font-semibold w-full h-full min-h-[44px]">
                      Read the Guide
                    </Button>
                  </Link>
                </div>
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
            <div className="relative bg-white rounded-ss-[50px] xl:rounded-t-[50px] px-6 sm:px-8 md:px-14 py-10">
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
              <div className="size-full flex flex-col justify-evenly overflow-hidden gap-4 space-y-8">
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

      <div className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            POWERFUL CUSTOMIZATION
          </span>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            Build Your Perfect <span className="text-blue-600">Rollup Solution</span>
          </h2>
          <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Our intuitive configurator puts you in control. Tailor every aspect of your OP stack
            deployment with confidence – no deep technical expertise required.
          </p>
        
          <div className="mt-10 flex flex-row justify-center gap-4">
            <Link href="/config" className="flex-1 max-w-[200px]">
              <Button size="lg" className="font-semibold px-6 w-full h-full min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:shadow-xl">
                Create Your Rollup
              </Button>
            </Link>
            <Link href="/docs" className="flex-1 max-w-[200px]">
              <Button variant="outline" size="lg" className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all  font-semibold w-full h-full min-h-[44px] hover:shadow-xl hover:text-blue-600">
                Read the Guide
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-50 to-violet-100 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              READY-TO-DEPLOY TEMPLATES
            </span>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Launch <span className="text-purple-600">Pre-Configured</span> Rollups Instantly
            </h2>
            <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Skip the setup process with our expertly crafted templates. From rapid prototyping
              to production-ready environments, our premade configs give you a head start.
            </p>
          </div>
          <AnimatedConfigs />
        </div>
      </div>

      <Footer />
    </>
  );
}
