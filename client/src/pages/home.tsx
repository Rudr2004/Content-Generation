import { Navigation } from "@/components/ui/navigation";
import { Hero } from "@/components/ui/hero";
import { Footer } from "@/components/ui/footer";
import { TrustedPartners } from "@/components/trusted-partners";
import { InteractiveServiceTabs } from "@/components/interactive-service-tabs";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { InsightsSection } from "@/components/insights-section";
import { ContactSection } from "@/components/contact-section";
import { HomeContactSection } from "@/components/home-contact-section";
import { GetInTouchSection } from "@/components/get-in-touch-section";
import { SEOAnalytics } from "@/components/seo-analytics";
import { SEOHead } from "@/components/seo-head";
import { ProcessSection } from "@/components/process-section";
import { TechnologyStackSection } from "@/components/technology-stack-section";
import { InternalLinks } from "@/components/internal-links";
import { HomeCaseStudiesSection } from "@/components/home-case-studies-section";
import { PerformanceOptimizer } from "@/components/performance-optimizer";

import { SEO_PAGES } from "@/lib/seo";
import { getOrganizationStructuredData, getWebsiteStructuredData, getServiceStructuredData, getLocalBusinessStructuredData, getFAQStructuredData } from "@/lib/structured-data";

export default function Home() {
  const seoData = SEO_PAGES.home;

  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationStructuredData(),
      getWebsiteStructuredData(),
      getServiceStructuredData(),
      getLocalBusinessStructuredData(),
      getFAQStructuredData()
    ]
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogTitle={seoData.ogTitle}
        ogDescription={seoData.ogDescription}
        ogImage="https://greenapplex.com/attached_assets/1_1752498834690.png"
        structuredData={combinedStructuredData}
      />
      <PerformanceOptimizer />
      <SEOAnalytics pageName="Home" />
      <Navigation />
      <main id="main-content">
        <Hero />
        <TrustedPartners />
        <InteractiveServiceTabs />
        <AboutSection />
        <ProcessSection />
        <TechnologyStackSection />
        <HomeCaseStudiesSection />
        <InternalLinks />
        <TestimonialsSection />
        <InsightsSection />
        <HomeContactSection />
      </main>
      <Footer />
    </div>
  );
}
