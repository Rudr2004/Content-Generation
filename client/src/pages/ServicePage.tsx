import React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/home-contact-section";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { EnhancedStructuredServiceDisplay } from "@/components/enhanced-structured-service-display";
import { UniversalServiceDisplay } from "@/components/universal-service-display";
import { SEOHead } from "@/components/seo-head";

interface ServicePageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
}

export default function ServicePage() {
  const params = useParams();
  const serviceSlug = params.slug;
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/services/slug/${serviceSlug}`],
    enabled: !!serviceSlug,
    queryFn: async () => {
      const res = await fetch(`/api/services/slug/${serviceSlug}`);
      if (!res.ok) throw new Error("Failed to fetch service");
      return res.json();
    },
  });

  // Scroll to contact section function
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const service = data?.service;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={service.metaTitle || service.title}
        description={service.metaDescription}
        keywords={`${service.primaryKeyword || ''}, ${service.secondaryKeywords || ''}`.trim()}
        canonicalUrl={`/services/${service.slug}`}
      />
      <Navigation />
      
      {/* Check if content is structured JSON data and use UniversalServiceDisplay */}
      {(() => {
        try {
          const parsedContent = JSON.parse(service.content);
          if (parsedContent && typeof parsedContent === 'object' && parsedContent.heroSection) {
            // Convert the structured content to the format expected by UniversalServiceDisplay
            const universalData = {
              ...service,
              content: JSON.stringify(parsedContent)
            };
            return (
              <UniversalServiceDisplay 
                service={universalData} 
                onContactClick={scrollToContact}
              />
            );
          }
        } catch (e) {
          // Content is not valid JSON, fall back to regular display
        }
        
        // Fall back to regular structured display
        return (
          <EnhancedStructuredServiceDisplay 
            service={service} 
            onContactClick={scrollToContact}
          />
        );
      })()}
      
      {/* Contact Section */}
      <div id="contact">
        <HomeContactSection />
      </div>
      
      <Footer />
    </div>
  );
}