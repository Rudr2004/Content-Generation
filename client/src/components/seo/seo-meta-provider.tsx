import { useEffect } from "react";
import { usePageIndexing } from "@/hooks/use-page-indexing";

interface SeoMetaProviderProps {
  children: React.ReactNode;
  pageUrl?: string;
  pageTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
  customMetaRobots?: string;
  enabled?: boolean;
}

/**
 * Comprehensive SEO Meta Provider that integrates with page indexing status
 * This component handles all meta tags including robots tags from indexing manager
 */
export function SeoMetaProvider({
  children,
  pageUrl,
  pageTitle,
  metaDescription,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  canonicalUrl,
  customMetaRobots,
  enabled = true,
}: SeoMetaProviderProps) {
  // Get page indexing status and apply robots meta tag
  const { isIndexable, metaRobotsTag, isLoading } = usePageIndexing({ 
    pageUrl, 
    enabled 
  });

  // Apply all other meta tags
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      if (!content) return;
      
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        tag.setAttribute('data-source', 'seo-meta-provider');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    if (pageTitle) {
      document.title = pageTitle;
    }
    
    updateMetaTag('description', metaDescription || '');
    updateMetaTag('keywords', keywords || '');
    
    // Open Graph tags
    updateMetaTag('og:title', ogTitle || pageTitle || '', 'property');
    updateMetaTag('og:description', ogDescription || metaDescription || '', 'property');
    updateMetaTag('og:image', ogImage || '', 'property');
    updateMetaTag('og:url', canonicalUrl || (window.location.origin + window.location.pathname), 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle || ogTitle || pageTitle || '');
    updateMetaTag('twitter:description', twitterDescription || ogDescription || metaDescription || '');
    updateMetaTag('twitter:image', ogImage || '');
    
    // Canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('data-source', 'seo-meta-provider');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Handle custom robots meta tag (overrides page indexing manager)
    if (customMetaRobots) {
      // Remove page indexing manager robots tag if custom one is provided
      const existingRobotsTag = document.querySelector('meta[name="robots"][data-source="page-indexing-manager"]');
      if (existingRobotsTag) {
        existingRobotsTag.remove();
      }
      updateMetaTag('robots', customMetaRobots);
    }

    // Cleanup function
    return () => {
      // Remove meta tags added by this provider
      const metaTags = document.querySelectorAll('meta[data-source="seo-meta-provider"]');
      metaTags.forEach(tag => tag.remove());
      
      const canonicalLinks = document.querySelectorAll('link[rel="canonical"][data-source="seo-meta-provider"]');
      canonicalLinks.forEach(link => link.remove());
    };
  }, [
    pageTitle,
    metaDescription,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    canonicalUrl,
    customMetaRobots,
  ]);

  return (
    <div data-seo-meta-provider data-indexable={isIndexable} data-robots={metaRobotsTag}>
      {children}
    </div>
  );
}

/**
 * Hook to get current page SEO status
 */
export function useSeoStatus() {
  const pageIndexing = usePageIndexing({ enabled: true });
  
  return {
    ...pageIndexing,
    isSeoReady: !pageIndexing.isLoading && pageIndexing.isIndexable,
    seoWarnings: pageIndexing.isIndexable ? [] : ['Page is set to noindex'],
  };
}