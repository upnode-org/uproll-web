"use client"
import VerticalAnimatedLinks from "./VerticalAnimatedLinks";
import HorizontalAnimatedLinks from "./HorizontalAnimatedLinks";
import { useIsMobile } from '@/hooks/use-mobile';

export const AnimatedConfigs: React.FC = () => {
    const isMobile = useIsMobile(1024);

    return (
        <>
            {isMobile ? (
                <HorizontalAnimatedLinks />
            ) : (
                <VerticalAnimatedLinks />
            )}
        </> 
    );
}

export default AnimatedConfigs;