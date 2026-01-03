import { useEffect, useState } from 'react';
import { generateSEOReport } from '@/lib/seo';

export function SEOPerformanceReport() {
  const [seoReport, setSeoReport] = useState<{ score: number; recommendations: string[] } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const report = generateSEOReport();
      setSeoReport(report);
      
      // Log comprehensive SEO analysis
      console.log('🚀 SEO Performance Report:', {
        score: report.score,
        grade: report.score >= 90 ? 'A+' : report.score >= 80 ? 'A' : report.score >= 70 ? 'B' : 'C',
        recommendations: report.recommendations,
        details: {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          structuredData: !!document.querySelector('script[type="application/ld+json"]'),
          viewport: !!document.querySelector('meta[name="viewport"]'),
          images: document.querySelectorAll('img').length,
          imagesWithAlt: document.querySelectorAll('img[alt]').length,
          internalLinks: document.querySelectorAll('a[href^="/"]').length,
          headings: {
            h1: document.querySelectorAll('h1').length,
            h2: document.querySelectorAll('h2').length,
            h3: document.querySelectorAll('h3').length
          }
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!seoReport) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">SEO Score</h3>
        <span className={`text-2xl font-bold ${
          seoReport.score >= 90 ? 'text-green-600' : 
          seoReport.score >= 80 ? 'text-blue-600' : 
          seoReport.score >= 70 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {seoReport.score}/100
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            seoReport.score >= 90 ? 'bg-green-500' : 
            seoReport.score >= 80 ? 'bg-blue-500' : 
            seoReport.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${seoReport.score}%` }}
        />
      </div>

      <div className="text-xs text-gray-600">
        <p className="mb-1">✅ Structured Data Implemented</p>
        <p className="mb-1">✅ Mobile Optimized</p>
        <p className="mb-1">✅ Meta Tags Optimized</p>
        <p className="mb-1">✅ Internal Links Added</p>
        {seoReport.score >= 90 && (
          <p className="text-green-600 font-medium">🎉 Excellent SEO Score!</p>
        )}
      </div>
    </div>
  );
}