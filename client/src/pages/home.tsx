import { Navigation } from "@/components/ui/navigation";
import { Hero } from "@/components/ui/hero";
import { Footer } from "@/components/ui/footer";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";
import { WhoWeHelpSection } from "@/components/who-we-help-section";
import { ValuePropositionSection } from "@/components/value-proposition-section";
import { InteractiveServiceTabs } from "@/components/interactive-service-tabs";
import { ProcessSection } from "@/components/process-section";
import { BootsoloCaseStudiesSection } from "@/components/bootsolo-case-studies-section";
import { ResourcesSection } from "@/components/resources-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { AboutBootsoloSection } from "@/components/about-bootsolo-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { SEOAnalytics } from "@/components/seo-analytics";
import { SEOHead } from "@/components/seo-head";
import { PerformanceOptimizer } from "@/components/performance-optimizer";

import { SEO_PAGES } from "@/lib/seo";
import { getOrganizationStructuredData, getWebsiteStructuredData, getServiceStructuredData, getLocalBusinessStructuredData, getFAQStructuredData } from "@/lib/structured-data";

export default function Home() {
  const seoData = SEO_PAGES.home;
  const { settings, isLoading } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  if (isLoading && !settings) {
    return <div className="min-h-screen" />;
  }

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogTitle={seoData.ogTitle?.replace("Bootsolo", siteName)}
        ogDescription={seoData.ogDescription?.replace("Bootsolo", siteName)}
        ogImage="https://greenapplex.com/attached_assets/1_1752498834690.png"
        structuredData={combinedStructuredData}
      />
      <PerformanceOptimizer />
      <SEOAnalytics pageName="Home" />
      <Navigation />
      <main id="main-content">
        <Hero />
        <WhoWeHelpSection />
        <ValuePropositionSection />
        <InteractiveServiceTabs />
        <ProcessSection />
        <BootsoloCaseStudiesSection />
        <ResourcesSection />
        <NewsletterSection />
        <AboutBootsoloSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
