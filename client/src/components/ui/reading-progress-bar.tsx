import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReadingProgressBarProps {
  className?: string;
}

// Throttle function to limit calculation frequency
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

export function ReadingProgressBar({ className = "" }: ReadingProgressBarProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const docHeightRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Cache document height and update only when needed
  const updateDocHeight = useCallback(() => {
    docHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
  }, []);

  // Optimized progress calculation using RAF and cached values
  const updateReadingProgress = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = docHeightRef.current;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    });
  }, []);

  // Throttled scroll handler to reduce frequency
  const throttledScrollHandler = useCallback(
    throttle(updateReadingProgress, 16), // ~60fps
    [updateReadingProgress]
  );

  // Throttled resize handler for height recalculation
  const throttledResizeHandler = useCallback(
    throttle(() => {
      updateDocHeight();
      updateReadingProgress();
    }, 250), // Less frequent for resize
    [updateDocHeight, updateReadingProgress]
  );

  useEffect(() => {
    // Initial calculations
    updateDocHeight();
    updateReadingProgress();

    // Add optimized listeners
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

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-[9999] ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-150 ease-out"
        style={{ 
          transform: `translateX(${readingProgress - 100}%)`,
          willChange: 'transform'
        }}
      />
    </div>
  );
}