/**
 * Mobile detection hook
 *
 * Provides responsive detection for mobile devices based on viewport width.
 */

import * as React from "react";
import { MOBILE_BREAKPOINT } from "@/models/constants/responsive";

/**
 * Hook to detect if the current viewport is mobile-sized
 *
 * Uses window.matchMedia for efficient viewport detection.
 * Updates automatically when viewport size changes.
 *
 * @returns Boolean indicating if viewport is mobile-sized
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
