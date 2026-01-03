import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface PageIndexingStatus {
  isIndexable: boolean;
  metaRobotsTag: string;
  noindexReason?: string;
}

interface UsePageIndexingProps {
  pageUrl?: string;
  enabled?: boolean;
}

/**
 * Hook to check page indexing status and apply meta robots tags
 * This integrates with the page indexing management system
 */
export function usePageIndexing({ pageUrl, enabled = true }: UsePageIndexingProps) {
  const currentUrl = pageUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
  
  const { data, isLoading, error } = useQuery<{
    success: boolean;
    isIndexable: boolean;
    metaRobotsTag: string;
    status?: PageIndexingStatus;
  }>({
    queryKey: ["/api/seo/page-indexing/check", currentUrl],
    queryFn: async () => {
      const response = await fetch(`/api/seo/page-indexing/check?url=${encodeURIComponent(currentUrl)}`);
      return response.json();
    },
    enabled: enabled && !!currentUrl,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Apply meta robots tag to the document head
  useEffect(() => {
    if (typeof window === 'undefined' || !data?.metaRobotsTag) return;

    // Remove existing robots meta tag
    const existingRobotsTag = document.querySelector('meta[name="robots"]');
    if (existingRobotsTag) {
      existingRobotsTag.remove();
    }

    // Add new robots meta tag
    const robotsTag = document.createElement('meta');
    robotsTag.name = 'robots';
    robotsTag.content = data.metaRobotsTag;
    robotsTag.setAttribute('data-source', 'page-indexing-manager');
    document.head.appendChild(robotsTag);

    // Console log for debugging (remove in production)
    console.log(`[SEO] Applied robots meta tag for ${currentUrl}: ${data.metaRobotsTag}`);

    // Cleanup function
    return () => {
      const dynamicRobotsTag = document.querySelector('meta[name="robots"][data-source="page-indexing-manager"]');
      if (dynamicRobotsTag) {
        dynamicRobotsTag.remove();
      }
    };
  }, [data?.metaRobotsTag, currentUrl]);

  return {
    isIndexable: data?.isIndexable ?? true,
    metaRobotsTag: data?.metaRobotsTag || "index, follow",
    isLoading,
    error,
    status: data?.status,
    currentUrl,
  };
}

/**
 * Utility function to generate meta robots tag based on indexing status
 */
export function generateMetaRobotsTag(isIndexable: boolean, customTag?: string): string {
  if (customTag) return customTag;
  return isIndexable ? "index, follow" : "noindex, nofollow";
}

/**
 * Component that applies page indexing meta tags
 * Use this in your main layout or route components
 */
export function PageIndexingProvider({ 
  children, 
  pageUrl, 
  enabled = true 
}: { 
  children: React.ReactNode; 
  pageUrl?: string; 
  enabled?: boolean; 
}) {
  usePageIndexing({ pageUrl, enabled });
  return children;
}