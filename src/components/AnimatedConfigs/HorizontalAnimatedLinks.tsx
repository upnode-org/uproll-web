import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import GradientBackground from "@/components/GradientBackground";
import links from "./links";

const duration = 30;

// Component to render a single copy of the links
const LinksList = ({ copyKey }: { copyKey: string }) => (
  <div className="flex items-center gap-4 px-4">
    {links.map((link, index) => (
      <Link href={link.href} key={`${copyKey}-${index}`}>
        <div
          className={`flex items-center gap-2 px-4 py-2 ${link.color} text-white font-semibold transition-colors rounded-full`}
        >
          <span className="whitespace-nowrap">{link.text}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </Link>
    ))}
  </div>
);

const AnimatedMarqueeLinksMobile = () => {
  return (
    // Ensure the parent container covers the full screen width
    <div className="relative h-[74px] w-screen">
      {/* Gradient background that breaks out of the parent's boundaries */}
      <div
        className=" top-0 left- h-full"
        style={{ marginLeft: "-8vw", width: "110vw" }}
      >
        <GradientBackground className="w-full h-full" />
      </div>

      {/* Animated container for the links */}
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute top-0 left-0 flex w-[200%] py-4"
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <LinksList copyKey="first" />
          <LinksList copyKey="second" />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedMarqueeLinksMobile;