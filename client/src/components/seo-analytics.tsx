// SEO Analytics and Performance Tracking Component
import { useEffect } from "react";
import { PRIMARY_KEYWORDS, LONG_TAIL_KEYWORDS, optimizeKeywordDensity } from "@/lib/seo";

interface SEOAnalyticsProps {
  pageContent?: string;
  pageName?: string;
}

export function SEOAnalytics({ pageContent = "", pageName = "Unknown" }: SEOAnalyticsProps) {
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4 tracking (when implemented)
      if ((window as any).gtag) {
        (window as any).gtag('config', 'GA_TRACKING_ID', {
          page_title: document.title,
          page_location: window.location.href,
          content_group1: 'AI Development Services',
          content_group2: pageName,
          custom_map: {
            custom_parameter_1: 'ai_development_services',
            custom_parameter_2: 'enterprise_ai_solutions'
          }
        });
      }
      
      // Track keyword performance
      trackKeywordPerformance();
      
      // Monitor page performance metrics
      trackPagePerformance();
    }
  }, [pageName]);

  const trackKeywordPerformance = () => {
    const content = document.body.innerText.toLowerCase();
    const keywordMetrics: Record<string, number> = {};
    
    // Track primary keywords
    PRIMARY_KEYWORDS.forEach(keyword => {
      const matches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      keywordMetrics[keyword] = matches;
    });
    
    // Track long-tail keywords
    LONG_TAIL_KEYWORDS.forEach(keyword => {
      const matches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      keywordMetrics[keyword] = matches;
    });
    
    // Store metrics for reporting
    localStorage.setItem('seo_keyword_metrics', JSON.stringify({
      page: pageName,
      timestamp: new Date().toISOString(),
      keywords: keywordMetrics,
      totalWords: content.split(/\s+/).length
    }));
    
    // Log keyword density for optimization
    console.log('SEO Keyword Analysis:', {
      page: pageName,
      keywordDensity: keywordMetrics,
      totalWords: content.split(/\s+/).length
    });
  };
  
  const trackPagePerformance = () => {
    // Web Vitals tracking
    if ('web-vital' in window) {
      // Track Core Web Vitals for SEO
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navigationEntry = entry as PerformanceNavigationTiming;
            
            // Track page load metrics
            const metrics = {
              page: pageName,
              timestamp: new Date().toISOString(),
              loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
              domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
              firstContentfulPaint: 0, // Will be captured by paint observer
              largestContentfulPaint: 0, // Will be captured by LCP observer
            };
            
            localStorage.setItem('seo_performance_metrics', JSON.stringify(metrics));
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  };
  
  return null; // This is a tracking component, no UI
}

// SEO Reporting Functions
export const SEOReport = {
  
  // Generate keyword performance report
  getKeywordReport: () => {
    const stored = localStorage.getItem('seo_keyword_metrics');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return {
      ...data,
      recommendations: generateKeywordRecommendations(data.keywords, data.totalWords)
    };
  },
  
  // Generate performance report
  getPerformanceReport: () => {
    const stored = localStorage.getItem('seo_performance_metrics');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return {
      ...data,
      score: calculatePerformanceScore(data),
      recommendations: generatePerformanceRecommendations(data)
    };
  },
  
  // Generate comprehensive SEO audit
  getFullAudit: () => {
    const keywordReport = SEOReport.getKeywordReport();
    const performanceReport = SEOReport.getPerformanceReport();
    
    return {
      timestamp: new Date().toISOString(),
      keywords: keywordReport,
      performance: performanceReport,
      overallScore: calculateOverallSEOScore(keywordReport, performanceReport),
      recommendations: generateOverallRecommendations(keywordReport, performanceReport)
    };
  }
};

// Helper functions for analysis
function generateKeywordRecommendations(keywords: Record<string, number>, totalWords: number) {
  const recommendations = [];
  const targetDensity = 0.015; // 1.5%
  
  Object.entries(keywords).forEach(([keyword, count]) => {
    const density = count / totalWords;
    
    if (density < targetDensity * 0.5) {
      recommendations.push({
        type: 'keyword',
        priority: 'high',
        keyword,
        current: count,
        recommended: Math.ceil(totalWords * targetDensity),
        message: `Increase "${keyword}" usage for better SEO performance`
      });
    } else if (density > targetDensity * 2) {
      recommendations.push({
        type: 'keyword',
        priority: 'medium',
        keyword,
        current: count,
        recommended: Math.ceil(totalWords * targetDensity),
        message: `Consider reducing "${keyword}" density to avoid over-optimization`
      });
    }
  });
  
  return recommendations;
}

function generatePerformanceRecommendations(metrics: any) {
  const recommendations = [];
  
  if (metrics.loadTime > 3000) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      metric: 'Load Time',
      current: `${metrics.loadTime}ms`,
      target: '<3000ms',
      message: 'Optimize images and reduce bundle size to improve load time'
    });
  }
  
  if (metrics.domContentLoaded > 1500) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      metric: 'DOM Content Loaded',
      current: `${metrics.domContentLoaded}ms`,
      target: '<1500ms',
      message: 'Consider code splitting and lazy loading for faster DOM rendering'
    });
  }
  
  return recommendations;
}

function calculatePerformanceScore(metrics: any): number {
  let score = 100;
  
  // Penalize slow load times
  if (metrics.loadTime > 3000) score -= 20;
  else if (metrics.loadTime > 2000) score -= 10;
  
  // Penalize slow DOM content loaded
  if (metrics.domContentLoaded > 1500) score -= 15;
  else if (metrics.domContentLoaded > 1000) score -= 8;
  
  return Math.max(score, 0);
}

function calculateOverallSEOScore(keywordReport: any, performanceReport: any): number {
  if (!keywordReport || !performanceReport) return 0;
  
  const keywordScore = calculateKeywordScore(keywordReport);
  const performanceScore = performanceReport.score || 0;
  
  // Weight: 60% keywords, 40% performance
  return Math.round(keywordScore * 0.6 + performanceScore * 0.4);
}

function calculateKeywordScore(keywordReport: any): number {
  if (!keywordReport.keywords) return 0;
  
  const targetDensity = 0.015;
  let totalScore = 0;
  let keywordCount = 0;
  
  Object.entries(keywordReport.keywords as Record<string, number>).forEach(([keyword, count]) => {
    const density = count / keywordReport.totalWords;
    let score = 0;
    
    if (density >= targetDensity * 0.5 && density <= targetDensity * 2) {
      score = 100; // Perfect range
    } else if (density < targetDensity * 0.5) {
      score = (density / (targetDensity * 0.5)) * 50; // Partial score for low density
    } else {
      score = Math.max(50 - ((density - targetDensity * 2) * 1000), 0); // Penalty for over-optimization
    }
    
    totalScore += score;
    keywordCount++;
  });
  
  return keywordCount > 0 ? totalScore / keywordCount : 0;
}

function generateOverallRecommendations(keywordReport: any, performanceReport: any) {
  const recommendations = [];
  
  if (keywordReport?.recommendations) {
    recommendations.push(...keywordReport.recommendations);
  }
  
  if (performanceReport?.recommendations) {
    recommendations.push(...performanceReport.recommendations);
  }
  
  // Sort by priority
  return recommendations.sort((a, b) => {
    const priorities = { high: 3, medium: 2, low: 1 };
    return priorities[b.priority as keyof typeof priorities] - priorities[a.priority as keyof typeof priorities];
  });
}

// SEOReport is already exported above, no need to re-export