import { useEffect, useMemo } from 'react';
import { COMPANY_INFO } from '@/lib/constants';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { generateDynamicKeywords } from '@/lib/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string[] | string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: any;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  structuredData
}: SEOHeadProps) {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  const dynamicKeywords = useMemo(() => {
    // Ensure keywords is always an array
    let keywordsArray: string[] = [];
    
    if (Array.isArray(keywords)) {
      keywordsArray = keywords;
    } else if (typeof keywords === 'string') {
      keywordsArray = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
    }
    
    return generateDynamicKeywords(keywordsArray, settings?.targetRegions || undefined, settings?.industryFocus || undefined);
  }, [keywords, settings?.targetRegions, settings?.industryFocus]);

  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };


    // Set basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', Array.isArray(dynamicKeywords) ? dynamicKeywords.join(', ') : '');
    setMetaTag('author', siteName);
    setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // Set viewport meta tag
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Set language
    setMetaTag('language', 'en-US');

    // Set Open Graph tags
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', ogDescription || description, true);
    setMetaTag('og:url', canonicalUrl || window.location.href, true);
    setMetaTag('og:site_name', siteName, true);
    setMetaTag('og:locale', 'en_US', true);

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('og:image:alt', `${siteName} - ${title}`, true);
      setMetaTag('og:image:width', '1200', true);
      setMetaTag('og:image:height', '630', true);
    }

    // Set Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', ogTitle || title);
    setMetaTag('twitter:description', ogDescription || description);
    setMetaTag('twitter:site', COMPANY_INFO.social.twitter);
    setMetaTag('twitter:creator', COMPANY_INFO.social.twitter);

    if (ogImage) {
      setMetaTag('twitter:image', ogImage);
      setMetaTag('twitter:image:alt', `${siteName} - ${title}`);
    }

    // Set canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Add additional SEO meta tags
    setMetaTag('theme-color', '#22c55e');
    setMetaTag('msapplication-TileColor', '#22c55e');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('apple-mobile-web-app-title', siteName);

    // Set HTML attributes
    document.documentElement.setAttribute('lang', 'en');

  }, [title, description, dynamicKeywords, canonicalUrl, ogTitle, ogDescription, ogImage, structuredData, siteName]);

  return null;
}