import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import GradientBackground from "@/components/GradientBackground";
import links from "./links";

// Desktop only
const AnimatedMarqueeLinks = () => {
  // Duration of one complete scroll cycle
  const duration = 12;

  return (
    // The parent container is set as relative so that its children can be absolutely positioned.
    <div className="relative h-[300px] rounded-[50px]">
      {/* Gradient Background placed as an absolute element with a lower z-index */}
      <div className="absolute inset-0 z-0 w-[100vw] rounded-s-[50px] overflow-hidden">
        <GradientBackground className="w-full h-full" />
      </div>

      {/* Animated container for the links, placed above the gradient */}
      <div className="absolute inset-0 z-10 overflow-hidden rounded-s-[50px]">
        <motion.div
          className="absolute top-0 left-0 w-full space-y-4"
          initial={{ y: "-50%" }}
          animate={{ y: "0%" }}
          transition={{
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {/* First copy of links */}
          <div className="flex flex-col gap-4 mx-8">
            {links.map((link, index) => (
              <Link href={link.href} key={`first-${index}`}>
                <div
                  className={`flex items-center justify-between gap-2 px-6 py-3 ${link.color} text-white font-semibold transition-colors rounded-full`}
                >
                  <span>{link.text}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
          {/* Second copy for seamless looping */}
          <div className="flex flex-col gap-4 mx-8">
            {links.map((link, index) => (
              <Link href={link.href} key={`second-${index}`}>
                <div
                  className={`flex items-center justify-between gap-2 px-6 py-3 ${link.color} text-white font-semibold transition-colors rounded-full`}
                >
                  <span>{link.text}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedMarqueeLinks;
