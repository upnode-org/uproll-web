"use client"
import VerticalAnimatedLinks from "./VerticalAnimatedLinks";
import HorizontalAnimatedLinks from "./HorizontalAnimatedLinks";
import { useIsMobile } from '@/hooks/use-mobile';

export const PreconfiguredList: React.FC = () => {
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

export default PreconfiguredList;