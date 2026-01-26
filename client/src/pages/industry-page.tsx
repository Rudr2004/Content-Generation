import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Clock, Users, TrendingUp, ArrowRight, Star, CheckCircle, Quote, Heart, Stethoscope, Activity, Brain, Thermometer, Microscope, Pill, Zap, Database, Monitor, Wifi, FileText, UserCheck, AlertCircle, Plus, Sparkles, Layers, Cpu, Code, Settings } from "lucide-react";
import { getProfileImageByGender, getGenderFromName } from "@/lib/profile-images";
import { HomeContactSection } from "@/components/home-contact-section";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo-head";
import { PerformanceOptimizer } from "@/components/performance-optimizer";
import { SEOAnalytics } from "@/components/seo-analytics";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

interface IndustryPage {
  id: number;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Hero Section
  heroHeadline?: string;
  heroSubheading?: string;
  heroBackgroundImage?: string;
  heroBackgroundImageAlt?: string;
  heroBackgroundImageS3Key?: string;
  heroCtaText?: string;
  heroCtaLink?: string;

  // Overview Section
  overviewTitle?: string;
  overviewContent?: string;
  industryStatistics?: string;

  // Industries Detail Section
  industriesDetailTitle?: string;
  industries?: string;

  // Technology Stack Section
  technologyStackTitle?: string;
  keyTechnologies?: string;
  platforms?: string;
  tools?: string;

  // Engagement Process Section
  engagementProcessTitle?: string;
  engagementSteps?: string;

  // Unique Value Propositions Section
  uniqueValuePropositionsTitle?: string;
  uniqueValuePropositionsPoints?: string;

  // Testimonials Section
  testimonialsTitle?: string;
  testimonialsEntries?: string;

  // FAQs Section
  faqsTitle?: string;
  faqsItems?: string;

  // Call to Action Section
  ctaHeadline?: string;
  ctaSubtext?: string;
  ctaPrimaryButtonText?: string;
  ctaPrimaryButtonLink?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonLink?: string;

  // Visibility controls
  showOverview?: boolean;
  showIndustriesDetail?: boolean;
  showTechnologyStack?: boolean;
  showEngagementProcess?: boolean;
  showUniqueValuePropositions?: boolean;
  showTestimonials?: boolean;
  showFaqs?: boolean;
  showCta?: boolean;

  status: string;
  published: boolean;
}

function parseJSONSafely<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

// Helper function to safely render string or object values
function safeRenderValue(value: any): string {
  // Early return for null/undefined
  if (value == null) {
    return '';
  }

  // If it's already a string, return it
  if (typeof value === 'string') {
    return value;
  }

  // If it's a number or boolean, convert to string
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  // If it's an object, try to extract meaningful text
  if (typeof value === 'object') {
    // Handle arrays by joining them
    if (Array.isArray(value)) {
      return value.map(v => safeRenderValue(v)).join(', ');
    }

    // Try common text properties
    if (value.name && typeof value.name === 'string') return value.name;
    if (value.title && typeof value.title === 'string') return value.title;
    if (value.text && typeof value.text === 'string') return value.text;
    if (value.value && typeof value.value === 'string') return value.value;
    if (value.label && typeof value.label === 'string') return value.label;
    if (value.description && typeof value.description === 'string') return value.description;

    // Log problematic objects for debugging
    console.warn('Attempting to render object as text:', value);

    // Last resort: return empty string to avoid React error
    return '';
  }

  // Fallback
  return String(value);
}

// Helper function to detect healthcare-related industry pages
function isHealthcareIndustry(slug: string | undefined, title: string | undefined): boolean {
  if (!slug && !title) return false;
  const healthcareKeywords = ['health', 'healthcare', 'medical', 'medicine', 'hospital', 'clinic', 'pharma', 'pharmaceutical', 'biotech', 'biotechnology'];
  const searchText = `${slug || ''} ${title || ''}`.toLowerCase();
  return healthcareKeywords.some(keyword => searchText.includes(keyword));
}

// Helper function to get healthcare-specific icons
function getHealthcareIcon(sectionType: string) {
  const icons = {
    diagnostics: Brain,
    telemedicine: Monitor,
    ehr: FileText,
    ai: Brain,
    statistics: Activity,
    technology: Stethoscope,
    engagement: Heart,
    process: Plus,
    default: Heart
  };
  return icons[sectionType as keyof typeof icons] || icons.default;
}

export default function IndustryPage() {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  // Add scroll listener for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: industryPage, isLoading, error } = useQuery({
    queryKey: ['/api/industry-pages/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/industry-pages/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Industry page not found');
      }
      return response.json() as Promise<IndustryPage>;
    },
  });

  // Prepare SEO data
  const seoTitle = industryPage?.metaTitle || industryPage?.title || "Industry Solutions";
  const seoDescription = industryPage?.metaDescription || (industryPage?.title ? `Discover ${industryPage.title} solutions with ${siteName}` : `Industry solutions with ${siteName}`);
  const seoKeywords = industryPage?.metaKeywords || "";
  const seoKeywordsArray = seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
  const canonicalUrl = `https://www.greenapplex.com/industry/${slug}`;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SEOHead
          title={`Loading... | ${siteName}`}
          description="Loading industry page"
          canonicalUrl={canonicalUrl}
          keywords={["industry", "solutions", "technology"]}
        />
        <PerformanceOptimizer />
        <Navigation />
        <main id="main-content">
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center space-y-6 p-8 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/20 shadow-2xl">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 mx-auto"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400 mx-auto"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 animate-pulse">Loading industry page...</p>
                <div className="flex space-x-2 justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !industryPage) {
    return (
      <div className="min-h-screen">
        <SEOHead
          title={`Page Not Found | ${siteName}`}
          description="The industry page you're looking for doesn't exist"
          canonicalUrl={canonicalUrl}
          keywords={["industry", "solutions", "not found"]}
        />
        <PerformanceOptimizer />
        <Navigation />
        <main id="main-content">
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400">The industry page you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/')} data-testid="button-go-home">
                Go Home <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse JSON content safely
  const overviewContent = parseJSONSafely<string[]>(industryPage.overviewContent, []);
  const industryStatistics = parseJSONSafely<Array<{ statistic: string; description: string }>>(industryPage.industryStatistics, []);
  const industries = parseJSONSafely<Array<{ title: string; description: string; services: string[]; technologies: string[]; challenges: string[]; benefits: string[] }>>(industryPage.industries, []);
  const keyTechnologies = parseJSONSafely<string[]>(industryPage.keyTechnologies, []);
  const platforms = parseJSONSafely<string[]>(industryPage.platforms, []);
  const tools = parseJSONSafely<string[]>(industryPage.tools, []);
  const engagementSteps = parseJSONSafely<Array<{ step: string; title: string; description: string }>>(industryPage.engagementSteps, []);
  const uniqueValuePropositionsPoints = parseJSONSafely<string[]>(industryPage.uniqueValuePropositionsPoints, []);
  const testimonialsEntries = parseJSONSafely<Array<{ name: string; company: string; position: string; testimonial: string; rating: number }>>(industryPage.testimonialsEntries, []);
  const faqsItems = parseJSONSafely<Array<{ question: string; answer: string }>>(industryPage.faqsItems, []);

  // Detect if this is a healthcare industry page
  const isHealthcare = isHealthcareIndustry(slug, industryPage.title);

  // Healthcare-specific styling variables
  const healthcareColors = {
    primary: 'from-teal-50 to-blue-100 dark:from-teal-900 dark:to-blue-900',
    accent: 'from-teal-600/10 to-blue-600/10 dark:from-teal-900/20 dark:to-blue-900/20',
    button: 'bg-teal-600 hover:bg-teal-700',
    border: 'border-l-teal-600',
    statistic: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
  };

  const defaultColors = {
    primary: 'from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700',
    accent: 'from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20',
    button: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-l-blue-600',
    statistic: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  };

  const colors = isHealthcare ? healthcareColors : defaultColors;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywordsArray}
        canonicalUrl={canonicalUrl}
        ogTitle={seoTitle}
        ogDescription={seoDescription}
        ogImage="https://greenapplex.com/attached_assets/1_1752498834690.png"
      />
      <PerformanceOptimizer />
      <SEOAnalytics pageName={`Industry - ${industryPage.title}`} />
      <Navigation />
      <main id="main-content">
        {/* Hero Section */}
        <section className={`relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-screen flex items-center py-12 sm:py-16 lg:py-32 ${industryPage.heroBackgroundImage ? 'bg-gray-900' : `bg-gradient-to-br ${colors.primary}`} overflow-hidden`}>
          {/* Background Image (if available) */}
          {industryPage.heroBackgroundImage && (
            <div className="absolute inset-0">
              <img
                src={industryPage.heroBackgroundImage}
                alt={industryPage.heroBackgroundImageAlt || `${industryPage.title} background`}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="1792"
                height="1024"
                data-testid="img-hero-background"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60" />
            </div>
          )}

          {/* Enhanced Background Elements (fallback gradient when no image) */}
          {!industryPage.heroBackgroundImage && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-indigo-800/20 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-indigo-900/30" />
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            </>
          )}

          {/* Floating Geometric Shapes - Hidden on mobile */}
          <div className="absolute inset-0 overflow-hidden hidden sm:block">
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full animate-float delay-0 backdrop-blur-sm" />
            <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-xl rotate-45 animate-float delay-500" />
            <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full animate-float delay-1000" />
            <div className="absolute bottom-20 right-40 w-14 h-14 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-lg rotate-12 animate-float delay-700" />
          </div>

          {/* Healthcare-specific floating elements - Hidden on mobile */}
          {isHealthcare && (
            <div className="absolute inset-0 opacity-10 hidden sm:block">
              <div className="absolute top-10 left-10 animate-float delay-0">
                <Heart className="h-12 w-12 lg:h-16 lg:w-16 text-teal-600 animate-pulse" />
              </div>
              <div className="absolute top-20 right-20 animate-float delay-300">
                <Stethoscope className="h-8 w-8 lg:h-12 lg:w-12 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute bottom-20 left-20 animate-float delay-500">
                <Brain className="h-10 w-10 lg:h-14 lg:w-14 text-teal-600 animate-pulse" />
              </div>
              <div className="absolute bottom-10 right-10 animate-float delay-700">
                <Activity className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute top-1/2 left-1/4 animate-float delay-200">
                <Microscope className="h-6 w-6 lg:h-8 lg:w-8 text-teal-600 animate-pulse" />
              </div>
              <div className="absolute top-1/3 right-1/3 animate-float delay-600">
                <Thermometer className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 animate-pulse" />
              </div>
            </div>
          )}

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-4xl mt-10 mx-auto text-center">
              {/* Glassmorphism Hero Card */}
              <div className="relative p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
                {isHealthcare && (
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="relative p-4 sm:p-6 bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10 rounded-full shadow-2xl backdrop-blur-lg border border-white/30 animate-float">
                      <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-teal-600 animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/20 to-blue-500/20 animate-ping" />
                    </div>
                  </div>
                )}

                {/* Enhanced Typography */}
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-gradient-x leading-tight ${industryPage.heroBackgroundImage
                  ? 'text-white drop-shadow-2xl'
                  : 'bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent'
                  }`} data-testid="text-hero-headline">
                  {industryPage.heroHeadline || industryPage.title}
                </h1>

                {industryPage.heroSubheading && (
                  <p className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 lg:mb-10 leading-relaxed font-light max-w-3xl mx-auto ${industryPage.heroBackgroundImage
                    ? 'text-white/90 drop-shadow-lg'
                    : 'text-gray-700 dark:text-gray-200'
                    }`} data-testid="text-hero-subheading">
                    {industryPage.heroSubheading}
                  </p>
                )}

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0"
                    data-testid="button-hero-cta"
                    onClick={() => {
                      const contactSection = document.getElementById('contact-section');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Today
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse opacity-60" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse opacity-60" />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Overview Section */}
        {industryPage.showOverview !== false && (
          <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
            {/* Animated background elements - Hidden on mobile */}
            <div className="absolute inset-0 opacity-30 hidden sm:block">
              <div className="absolute top-20 right-10 w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full animate-float delay-1000" />
              <div className="absolute bottom-20 left-10 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-indigo-100/50 to-pink-100/50 dark:from-indigo-900/20 dark:to-pink-900/20 rounded-full animate-float delay-500" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center" data-testid="text-overview-title">
                  {industryPage.overviewTitle || "Industry Overview"}
                </h2>

                {overviewContent.length > 0 && (
                  <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 mb-12">
                    {overviewContent.map((paragraph, index) => (
                      <p key={index} className="mb-4 text-base sm:text-lg leading-relaxed" data-testid={`text-overview-paragraph-${index}`}>
                        {safeRenderValue(paragraph)}
                      </p>
                    ))}
                  </div>
                )}

                {/* Industry Statistics - Horizontal List Design */}
                {industryStatistics.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Key Industry Statistics</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {industryStatistics.map((stat, index) => {
                        const StatIcon = isHealthcare ? [Activity, Heart, Stethoscope, Activity][index % 4] : Activity;
                        return (
                          <div key={index} className="flex items-start space-x-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" data-testid={`stat-item-${index}`}>
                            {/* Icon */}
                            <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/30 flex items-center justify-center border-2 ${colors.border}`}>
                              <StatIcon className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                              {/* Statistic Number */}
                              <div className={`text-2xl lg:text-3xl font-bold ${colors.statistic} mb-2`} data-testid={`text-statistic-${index}`}>
                                {stat.statistic}
                              </div>

                              {/* Title */}
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                {index === 0 && 'Market Growth'}
                                {index === 1 && 'Patient Engagement'}
                                {index === 2 && 'Cost Efficiency'}
                                {index === 3 && 'Operational Efficiency'}
                              </h4>

                              {/* Description */}
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base" data-testid={`text-statistic-description-${index}`}>
                                {stat.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Industries Detail Section */}
        {industryPage.showIndustriesDetail !== false && industries.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
            {/* Animated background pattern - Hidden on mobile */}
            <div className="absolute inset-0 opacity-20 hidden sm:block">
              <div className="absolute top-10 left-1/4 w-40 h-40 lg:w-56 lg:h-56 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full animate-morphing" />
              <div className="absolute bottom-10 right-1/4 w-36 h-36 lg:w-48 lg:h-48 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 dark:from-indigo-900/10 dark:to-pink-900/10 rounded-full animate-morphing delay-1000" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center" data-testid="text-industries-detail-title">
                  {industryPage.industriesDetailTitle || "Our Industry Solutions"}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {industries.map((industry, index) => {
                    const IndustryIcon = isHealthcare
                      ? [Brain, Monitor, FileText, Microscope, Heart, Stethoscope][index % 6]
                      : Shield;
                    return (
                      <Card key={index} className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/60 to-gray-50/30 dark:from-gray-800/60 dark:to-gray-900/30 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 overflow-hidden" data-testid={`card-industry-${index}`}>
                        <CardHeader className="pb-6 relative z-10">
                          {isHealthcare && (
                            <div className="flex justify-center mb-6">
                              <div className="relative p-5 bg-gradient-to-br from-teal-50/80 to-blue-50/80 dark:from-teal-900/50 dark:to-blue-900/50 rounded-2xl shadow-lg backdrop-blur-sm group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                                <IndustryIcon className="h-12 w-12 text-teal-600 group-hover:text-teal-500 transition-colors duration-300" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-teal-400/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                              </div>
                            </div>
                          )}
                          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent text-center mb-4 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
                            {industry.title}
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center text-base sm:text-lg font-medium group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                            {industry.description}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                          {industry.services?.length > 0 && (
                            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 group-hover:from-blue-100/70 group-hover:to-indigo-100/70 dark:group-hover:from-blue-900/30 dark:group-hover:to-indigo-900/30 transition-all duration-300">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center">Services <Sparkles className="ml-2 h-4 w-4 text-blue-500" /></h4>
                              <div className="flex flex-wrap gap-2">
                                {industry.services.map((service, serviceIndex) => (
                                  <Badge key={serviceIndex} className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300 border-0 rounded-full hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 transform hover:scale-105" data-testid={`badge-service-${index}-${serviceIndex}`}>
                                    {safeRenderValue(service)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {industry.technologies?.length > 0 && (
                            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 group-hover:from-purple-100/70 group-hover:to-pink-100/70 dark:group-hover:from-purple-900/30 dark:group-hover:to-pink-900/30 transition-all duration-300">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center">Technologies <Cpu className="ml-2 h-4 w-4 text-purple-500" /></h4>
                              <div className="flex flex-wrap gap-2">
                                {industry.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/50 dark:to-pink-900/50 dark:text-purple-300 border-0 rounded-full hover:from-purple-200 hover:to-pink-200 transition-all duration-300 transform hover:scale-105" data-testid={`badge-technology-${index}-${techIndex}`}>
                                    {safeRenderValue(tech)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Technology Stack Section */}
        {industryPage.showTechnologyStack !== false && (keyTechnologies.length > 0 || platforms.length > 0 || tools.length > 0) && (
          <section className="py-12 sm:py-16 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 relative overflow-hidden">
            {/* Dynamic background elements - Hidden on mobile */}
            <div className="absolute inset-0 opacity-20 hidden sm:block">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-indigo-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-20 right-20 w-24 h-24 lg:w-32 lg:h-32 border border-blue-200/50 dark:border-blue-700/30 rounded-xl rotate-45 animate-spin-slow" />
              <div className="absolute bottom-20 left-20 w-20 h-20 lg:w-24 lg:h-24 border border-purple-200/50 dark:border-purple-700/30 rounded-full animate-bounce-slow" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-7xl mx-auto">
                {/* Enhanced Header Section */}
                <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl">
                    <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight" data-testid="text-technology-stack-title">
                    {industryPage.technologyStackTitle || "Our Technology Stack"}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                    Cutting-edge technologies and frameworks that power our innovative solutions
                  </p>
                </div>

                {/* Modern Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-stretch">
                  {/* Key Technologies Card */}
                  {keyTechnologies.length > 0 && (
                    <div className="group relative h-full">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl sm:rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-700" />
                      <Card className="relative h-full min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 overflow-hidden">
                        {/* Card Header */}
                        <CardHeader className="pb-6 sm:pb-8 text-center relative z-10 flex-shrink-0">
                          <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl shadow-xl">
                              <Code className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-cyan-600 dark:text-cyan-400" />
                              <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-xl sm:rounded-2xl blur-sm opacity-50" />
                            </div>
                          </div>
                          <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                            Core Technologies
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
                            Foundation frameworks and languages
                          </p>
                        </CardHeader>

                        {/* Technology Badges */}
                        <CardContent className="relative z-10 flex-grow flex items-center justify-center">
                          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-full">
                            {keyTechnologies.map((tech, index) => (
                              <div key={index} className="group/badge relative" data-testid={`badge-key-tech-${index}`}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl blur opacity-30 group-hover/badge:opacity-60 transition-opacity duration-300" />
                                <Badge className="relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/40 dark:to-blue-900/40 text-cyan-800 dark:text-cyan-200 border-0 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 break-words max-w-full">
                                  {safeRenderValue(tech)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        {/* Animated Background Elements */}
                        <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 animate-pulse" />
                        <div className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse delay-300" />
                      </Card>
                    </div>
                  )}

                  {/* Platforms Card */}
                  {platforms.length > 0 && (
                    <div className="group relative h-full">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-700" />
                      <Card className="relative h-full min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 overflow-hidden">
                        {/* Card Header */}
                        <CardHeader className="pb-6 sm:pb-8 text-center relative z-10 flex-shrink-0">
                          <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl sm:rounded-2xl shadow-xl">
                              <Layers className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-indigo-600 dark:text-indigo-400" />
                              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-xl sm:rounded-2xl blur-sm opacity-50" />
                            </div>
                          </div>
                          <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                            Cloud & Platforms
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
                            Infrastructure and deployment solutions
                          </p>
                        </CardHeader>

                        {/* Platform Badges */}
                        <CardContent className="relative z-10 flex-grow flex items-center justify-center">
                          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-full">
                            {platforms.map((platform, index) => (
                              <div key={index} className="group/badge relative" data-testid={`badge-platform-${index}`}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl blur opacity-30 group-hover/badge:opacity-60 transition-opacity duration-300" />
                                <Badge className="relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-800 dark:text-indigo-200 border-0 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 break-words max-w-full">
                                  {safeRenderValue(platform)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        {/* Animated Background Elements */}
                        <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 animate-pulse" />
                        <div className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-300" />
                      </Card>
                    </div>
                  )}

                  {/* Tools Card */}
                  {tools.length > 0 && (
                    <div className="group relative h-full">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-700" />
                      <Card className="relative h-full min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 overflow-hidden">
                        {/* Card Header */}
                        <CardHeader className="pb-6 sm:pb-8 text-center relative z-10 flex-shrink-0">
                          <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-xl sm:rounded-2xl shadow-xl">
                              <Settings className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-violet-600 dark:text-violet-400" />
                              <div className="absolute -inset-1 bg-gradient-to-br from-violet-400/30 to-fuchsia-500/30 rounded-xl sm:rounded-2xl blur-sm opacity-50" />
                            </div>
                          </div>
                          <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                            Development Tools
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
                            Productivity and workflow optimization
                          </p>
                        </CardHeader>

                        {/* Tools Badges */}
                        <CardContent className="relative z-10 flex-grow flex items-center justify-center">
                          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-full">
                            {tools.map((tool, index) => (
                              <div key={index} className="group/badge relative" data-testid={`badge-tool-${index}`}>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl sm:rounded-2xl blur opacity-30 group-hover/badge:opacity-60 transition-opacity duration-300" />
                                <Badge className="relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/40 dark:to-fuchsia-900/40 text-violet-800 dark:text-violet-200 border-0 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 break-words max-w-full">
                                  {safeRenderValue(tool)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        {/* Animated Background Elements */}
                        <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-full opacity-20 animate-pulse" />
                        <div className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-300" />
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Engagement Process Section - Card Grid Design (Same as Testimonials) */}
        {industryPage.showEngagementProcess !== false && engagementSteps.length > 0 && (
          <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4" data-testid="text-engagement-process-title">
                    {industryPage.engagementProcessTitle || "Our Proven Process"}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    From concept to deployment, our streamlined process ensures exceptional results at every stage.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {engagementSteps.map((step, index) => (
                    <Card key={index} className="group relative p-8 rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 overflow-hidden" data-testid={`card-process-step-${index}`}>
                      <CardContent className="pt-0 relative z-10">
                        {/* Step Number and Icon */}
                        <div className="relative mb-8 flex flex-col items-center">
                          {/* Step Number */}
                          <div className="relative mb-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl border-4 border-white dark:border-gray-700 flex items-center justify-center">
                              <span className="text-white font-bold text-2xl">{step.step}</span>
                            </div>
                          </div>

                          {/* Icon */}
                          <div className="relative">
                            <Layers className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>

                        {/* Enhanced Title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                          {step.title}
                        </h3>

                        {/* Enhanced Description */}
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg font-medium text-center">
                          {step.description}
                        </p>

                        {/* Background Decorative Elements */}
                        <div className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20" />
                        <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Unique Value Propositions Section */}
        {industryPage.showUniqueValuePropositions !== false && uniqueValuePropositionsPoints.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center px-4" data-testid="text-value-propositions-title">
                  {industryPage.uniqueValuePropositionsTitle || `Why Choose ${siteName}`}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {uniqueValuePropositionsPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3" data-testid={`value-proposition-${index}`}>
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {safeRenderValue(point)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section - Enhanced with Profile Images */}
        {industryPage.showTestimonials !== false && testimonialsEntries.length > 0 && (
          <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4" data-testid="text-testimonials-title">
                    {industryPage.testimonialsTitle || "Trusted by Industry Leaders"}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Discover how we've helped businesses transform and achieve remarkable success through our innovative solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonialsEntries.map((testimonial, index) => {
                    // Determine gender and get appropriate profile image
                    const clientGender = (testimonial as any).gender || getGenderFromName(testimonial.name);
                    const profileImageUrl = getProfileImageByGender(clientGender, testimonial.name, industryPage.title);

                    return (
                      <Card key={index} className="group relative p-8 rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 overflow-hidden" data-testid={`card-testimonial-${index}`}>
                        <CardContent className="pt-0 relative z-10">
                          {/* Profile Image and Quote Icon */}
                          <div className="relative mb-8 flex flex-col items-center">
                            {/* Profile Image */}
                            <div className="relative mb-4">
                              <img
                                src={profileImageUrl}
                                alt={`${testimonial.name} profile`}
                                className="w-20 h-20 rounded-2xl shadow-xl border-4 border-white dark:border-gray-700 object-cover"
                                loading="lazy"
                              />
                            </div>

                            {/* Quote Icon */}
                            <div className="relative">
                              <Quote className="w-8 h-8 text-blue-600" />
                            </div>
                          </div>

                          {/* Enhanced Quote Text */}
                          <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed text-lg font-medium italic text-center">
                            "{testimonial.testimonial}"
                          </p>

                          {/* Enhanced Rating */}
                          <div className="flex items-center justify-center mb-6 space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < testimonial.rating
                                  ? 'text-yellow-400 fill-current drop-shadow-lg'
                                  : 'text-gray-300 dark:text-gray-600'
                                  }`}
                              />
                            ))}
                          </div>

                          {/* Enhanced Author Info */}
                          <div className="text-center space-y-2">
                            <p className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{testimonial.name}</p>
                            <p className="text-gray-600 dark:text-gray-300 font-semibold">{testimonial.position}</p>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">{testimonial.company}</p>
                          </div>

                          {/* Background Decorative Elements */}
                          <div className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20" />
                          <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {industryPage.showFaqs !== false && faqsItems.length > 0 && (
          <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center" data-testid="text-faqs-title">
                  {industryPage.faqsTitle || "Frequently Asked Questions"}
                </h2>

                <div className="space-y-6">
                  {faqsItems.map((faq, index) => (
                    <Card key={index} className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/70 to-gray-50/50 dark:from-gray-800/70 dark:to-gray-900/50 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-102 hover:-translate-y-1" data-testid={`card-faq-${index}`}>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 leading-tight">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                          {faq.answer}
                        </p>
                      </CardContent>

                      {/* Decorative accent border */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full group-hover:h-16 transition-all duration-500" />
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <HomeContactSection />
      </main>
      <Footer />
    </div>
  );
}