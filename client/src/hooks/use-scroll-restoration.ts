import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    // Small delay to ensure page content is rendered
    const timer = setTimeout(() => {
      // Scroll to top when location changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant for immediate scroll to top
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [location]);
}