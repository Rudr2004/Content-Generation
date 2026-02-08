import React from 'react';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ModernCaseStudyListing } from "@/components/modern-case-study-listing";
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  category?: string;
  problemStatement?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CaseStudies() {
  const { data: caseStudies = [], isLoading, error } = useQuery({
    queryKey: ['/api/case-study-pages/published'],
    queryFn: async () => {
      const response = await fetch('/api/case-study-pages/published');
      if (!response.ok) {
        throw new Error('Failed to fetch case studies');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--homepage-section-bg, #f8fafc)" }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading case studies...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Case Studies
            </h2>
            <p className="text-gray-600">
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--homepage-section-bg, #f8fafc)" }}>
      <Navigation />
      <ModernCaseStudyListing caseStudies={caseStudies} isLoading={isLoading} />
      <Footer />
    </div>
  );
}