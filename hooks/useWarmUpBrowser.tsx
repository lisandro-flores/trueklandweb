import { useEffect } from "react";

// Web-compatible version - no-op since browsers don't need warm-up
export const useWarmUpBrowser = () => {
  useEffect(() => {
    // No-op for web browsers
    return () => {
      // No-op cleanup
    };
  }, []);
};
