"use client"
import { useState, useEffect } from 'react';
import VerticalAnimatedLinks from "./VerticalAnimatedLinks";
import HorizontalAnimatedLinks from "./HorizontalAnimatedLinks";

// Custom hook to determine if the device is mobile based on window width
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Update state based on current window width
        function handleResize() {
            setIsMobile(window.innerWidth < 1024); // breakpoint at 1024px
        }

        // Perform initial check
        handleResize();

        // Listen for window resize events
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

export default function Index() {
    const isMobile = useIsMobile();

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
