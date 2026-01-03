import { useState, useEffect, useCallback, useRef } from 'react';

// Optimized throttle function for better performance
function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  
  return ((...args: any[]) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(null, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(null, args);
      }, remaining);
    }
  }) as T;
}

/**
 * Optimized hook for tracking scroll progress without causing forced reflows
 * Uses requestAnimationFrame and throttling to minimize performance impact
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const docHeightRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Cache document height to avoid repeated DOM queries
  const updateDocHeight = useCallback(() => {
    docHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
  }, []);

  // Optimized progress calculation using RAF
  const updateProgress = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = docHeightRef.current;
      const newProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, newProgress)));
    });
  }, []);

  // Throttled event handlers to reduce frequency
  const throttledScrollHandler = useCallback(
    throttle(updateProgress, 16), // ~60fps
    [updateProgress]
  );

  const throttledResizeHandler = useCallback(
    throttle(() => {
      updateDocHeight();
      updateProgress();
    }, 250), // Less frequent for resize
    [updateDocHeight, updateProgress]
  );

  useEffect(() => {
    // Initial calculations
    updateDocHeight();
    updateProgress();

    // Add passive listeners for better performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', throttledResizeHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledResizeHandler);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [throttledScrollHandler, throttledResizeHandler]);

  return progress;
}