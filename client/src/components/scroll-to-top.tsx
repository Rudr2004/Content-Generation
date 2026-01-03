import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const toggleVisibility = () => {
      // Use requestAnimationFrame for better performance
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        if (window.pageYOffset > 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }, 10);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-20 right-4 sm:bottom-20 sm:right-6 z-50
        w-12 h-12 sm:w-14 sm:h-14
        rounded-full
        bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        text-white
        shadow-lg shadow-blue-500/25
        hover:shadow-xl hover:shadow-blue-500/40
        hover:scale-110
        active:scale-95
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}
      aria-label="Scroll to top"
      type="button"
    >
      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}