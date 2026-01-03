import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    /** ===============================
     *  Preconnect & Load Fonts (Google Fonts)
     * =============================== */
    const setupGoogleFonts = () => {
      const preconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      preconnects.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Load fonts stylesheet (do not preload it)
      const fontStylesheet = document.createElement('link');
      fontStylesheet.rel = 'stylesheet';
      fontStylesheet.href =
        'https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap';
      document.head.appendChild(fontStylesheet);
    };

    /** ===============================
     *  Preload Critical Images (Above-the-Fold Only)
     * =============================== */
    const preloadCriticalImages = () => {
      const criticalImages = [
        {
          href: '/attached_assets/hero-banner.png', // example LCP image
          as: 'image',
          fetchPriority: 'high'
        },
        {
          href: '/attached_assets/logo.png',
          as: 'image',
          fetchPriority: 'high'
        }
      ];

      criticalImages.forEach(({ href, as, fetchPriority }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = href;
        link.fetchPriority = fetchPriority;
        document.head.appendChild(link);
      });
    };

    /** ===============================
     *  Lazy Load Non-Critical Images
     * =============================== */
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          });
        });

        images.forEach((img) => observer.observe(img));
      }
    };

    /** ===============================
     *  Optimize CSS Delivery
     * =============================== */
    const optimizeCSSDelivery = () => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => {
        const el = link as HTMLLinkElement;
        if (el.href.includes('fonts.googleapis.com')) {
          el.media = 'print';
          el.onload = () => {
            el.media = 'all';
          };
        }
      });
    };

    /** ===============================
     *  Monitor Performance Metrics (LCP, FID)
     * =============================== */
    const monitorPerformance = () => {
      if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log('📊 LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
              console.log('📊 FID:', entry.processingStart - entry.startTime);
            }
          });
        });
        perfObserver.observe({
          entryTypes: ['largest-contentful-paint', 'first-input']
        });
      }
    };

    /** ===============================
     *  Accessibility Enhancements
     * =============================== */
    const addAccessibility = () => {
      const style = document.createElement('style');
      style.textContent = `
        *:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          z-index: 100;
        }
        .skip-link:focus {
          top: 6px;
        }
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    };

    /** ===============================
     *  Mobile Optimization
     * =============================== */
    const optimizeMobile = () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
          body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          input[type="text"], input[type="email"], textarea {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      `;
      document.head.appendChild(style);
    };

    /** ===============================
     *  Run All Optimizations
     * =============================== */
    setupGoogleFonts();
    preloadCriticalImages();
    optimizeImages();
    optimizeCSSDelivery();
    monitorPerformance();
    addAccessibility();
    optimizeMobile();

    return () => {
      // Optional cleanup if observers need to be disconnected
    };
  }, []);

  return null;
}