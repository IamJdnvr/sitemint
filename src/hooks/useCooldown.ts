// ─── useCooldown Hook ─────────────────────────────────────────
// Prevents rapid form submissions by enforcing a cooldown after
// each submit attempt. Displays a countdown on the button.
//
// Usage:
//   const { cooldown, startCooldown } = useCooldown(3);
//
//   <button disabled={cooldown > 0 || loading}>
//     {cooldown > 0 ? `Wait ${cooldown}s` : loading ? "..." : "Submit"}
//   </button>

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const DEFAULT_DURATION = 3; // seconds

interface UseCooldownReturn {
  /** Remaining cooldown seconds (0 = ready to submit) */
  cooldown: number;
  /** Start the cooldown timer */
  startCooldown: () => void;
  /** Immediately reset the cooldown to 0 */
  resetCooldown: () => void;
}

/**
 * A hook that enforces a `duration`-second cooldown after
 * `startCooldown()` is called. Tracks remaining seconds and
 * cleans up the interval on unmount.
 */
export function useCooldown(duration: number = DEFAULT_DURATION): UseCooldownReturn {
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCooldown = useCallback(() => {
    clear(); // Clear any existing timer
    setCooldown(duration);

    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, clear]);

  const resetCooldown = useCallback(() => {
    clear();
    setCooldown(0);
  }, [clear]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clear();
  }, [clear]);

  return { cooldown, startCooldown, resetCooldown };
}
