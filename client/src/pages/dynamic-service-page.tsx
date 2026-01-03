import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/home-contact-section";
import { UniversalServiceDisplay } from "@/components/universal-service-display";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface Service {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  subCategory?: string;
  technologies?: string[];
  aiTechnologies?: string[];
  startingPrice?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function DynamicServicePage() {
  const [location] = useLocation();
  
  // Extract slug from URL path like /services/service-slug
  const slug = location.split('/').pop() || '';

  // Fetch service data
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: ['/api/services/slug', slug],
    enabled: !!slug,
  });

  // Set document title and meta tags
  useEffect(() => {
    if (service) {
      document.title = service.metaTitle || `${service.title} | GreenAppleX Services`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', service.metaDescription || service.excerpt || '');
      }
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service page you're looking for doesn't exist.</p>
            <a 
              href="/services" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Services
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Main Service Content */}
      <UniversalServiceDisplay service={service} />
      
      {/* Contact Section */}
      <div id="contact">
        <HomeContactSection />
      </div>
      
      <Footer />
    </div>
  );
}