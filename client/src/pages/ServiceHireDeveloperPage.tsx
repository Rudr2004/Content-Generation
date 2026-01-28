import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Lightbulb,
  Shield,
  Settings,
  TrendingUp,
  Users,
  Code,
  Database,
  Zap,
  Target,
  MessageSquare,
  Globe,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Eye,
  Cpu,
  Building,
  Factory,
  Stethoscope,
  ShoppingCart,
  DollarSign,
  Wrench,
  Search
} from "lucide-react";
import { HomeContactSection } from "@/components/home-contact-section";
import { ServicePartnersSection } from "@/components/service-partners-section";
import { ServiceStatsSection } from "@/components/service-stats-section";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { HireDeveloperTestimonials } from "@/components/hire-developer-testimonials";
import { HireDeveloperTestimonialsSlider } from "@/components/hire-developer-testimonials-slider";
import { HireDeveloperProfiles } from "@/components/hire-developer-profiles";
import { HirePageCaseStudies } from "@/components/hire-page-case-studies";
import { InlineMarkdown } from '@/components/ui/inline-markdown';
import { parseMarkdownToHtml } from '@/lib/markdown-utils';
import type { HirePage } from '@shared/schema';

const iconList = [
  Star, Users, Clock, Shield, Award, Target, Brain, Cpu, MessageSquare, Zap,
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

function ServiceHireDeveloperPage() {
  const params = useParams();
  const pageSlug = params.slug;

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/hire-developer-pages/slug/${pageSlug}`],
    enabled: !!pageSlug,
    queryFn: async () => {
      const res = await fetch(`/api/hire-developer-pages/slug/${pageSlug}`);
      if (!res.ok) throw new Error("Failed to fetch hire developer page");
      return res.json();
    },
  });

  // Fetch testimonials separately
  const { data: testimonialsData } = useQuery({
    queryKey: [`/api/hire-developer-pages/${data?.id}/testimonials/public`],
    enabled: !!data?.id,
    queryFn: async () => {
      const res = await fetch(`/api/hire-developer-pages/${data.id}/testimonials/public`);
      if (!res.ok) return [];
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

  const page: HirePage = data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(to bottom right, var(--hiredev-hero-bg, #eff6ff), var(--hiredev-hero-bg, #dbeafe))'
        }}
      >
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-6">The hire developer page you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse JSON content safely
  const parseJsonContent = (content: string | null | undefined, fallback: any = {}) => {
    if (!content) return fallback;
    try {
      return JSON.parse(content);
    } catch {
      return fallback;
    }
  };


  // Parse all content sections
  const contentData = parseJsonContent(page.content, {});
  const referenceData = parseJsonContent(page.referenceContent, {});

  // Use content first (most recent generated), then reference_content as fallback
  const heroSection = contentData.hero_section || referenceData.hero_section || {};
  const introOverview = contentData.intro_overview || referenceData.intro_overview || "";
  const whyHire = contentData.why_hire || referenceData.why_hire || [];
  const hiringModels = contentData.hiring_models || referenceData.hiring_models || [];
  const skillsExpertise = contentData.skills_expertise || referenceData.skills_expertise || {};
  const technologyStack = contentData.technology_stack || referenceData.technology_stack || {};
  const hiringProcess = contentData.hiring_process || referenceData.hiring_process || [];
  const aiTestimonials = contentData.testimonials || referenceData.testimonials || [];
  const faqs = contentData.faqs || referenceData.faqs || [];
  const finalCta = contentData.final_cta || referenceData.final_cta || {};

  const whyHirePoints = parseJsonContent(page.whyHirePoints, []);
  const servicesOffered = parseJsonContent(page.servicesOffered, []);

  // Hero stats for the top section
  const heroStats = [
    { label: "250+", description: "Developers" },
    { label: "24/7", description: "Technical Support" },
    { label: "95%", description: "Client Retention Rate" }
  ];

  // Get icon component from icon name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Brain, Code, Settings, Shield, Zap, Database, MessageSquare, Globe,
      Users, Clock, Award, Target, Star, Building, Factory, Stethoscope,
      ShoppingCart, DollarSign, Cpu, Wrench
    };
    return iconMap[iconName] || Brain;
  };

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero Section - Matching Reference Design */}
        <section className="relative bg-white py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[50px]">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent mb-6 leading-tight"
                style={{
                  background: 'linear-gradient(to right, var(--hiredev-button-bg, #2563eb), var(--hiredev-button-bg, #9333ea), var(--hiredev-button-bg, #4f46e5))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                <InlineMarkdown>
                  {heroSection.headline || page.heroTitle || page.title || ''}
                </InlineMarkdown>
              </h1>

              <div
                className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdownToHtml(heroSection.subheading || page.heroDescription || "Get top-tier developers on-demand to accelerate your projects with expert solutions tailored to your business needs.")
                }}
              />

              <div className="flex flex-wrap justify-center gap-4 mb-12 px-4 sm:px-0">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{
                    background: 'linear-gradient(to right, var(--hiredev-button-bg, #2563eb), var(--hiredev-button-bg, #9333ea))',
                    color: 'var(--btn-primary-text, #ffffff)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--gradient-start, #2563eb), var(--gradient-middle, #9333ea), var(--gradient-end, #db2777))';
                    e.currentTarget.style.filter = 'brightness(0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, var(--hiredev-button-bg, #2563eb), var(--hiredev-button-bg, #9333ea))';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <span className="truncate">
                    {heroSection.primary_cta || page.heroCtaText || "Hire Developers"}
                  </span>
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                </Button>
              </div>

              {/* Hero Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {[
                  { label: "250+", description: "Developers", icon: Users },
                  { label: "24/7", description: "Technical Support", icon: Clock },
                  { label: "95%", description: "Client Retention Rate", icon: Award }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className="text-center"
                      variants={fadeUp}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <IconComponent className="h-8 w-8 text-blue-600 mr-2" />
                        <div className="text-3xl md:text-4xl font-bold text-blue-600">
                          {stat.label}
                        </div>
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.description}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>



        {/* Introduction Overview Section - Enhanced */}
        {introOverview && (
          <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-blue-600 font-semibold text-sm mb-6 shadow-lg">
                  <Star className="w-4 h-4 mr-2" />
                  Industry Leading Expertise
                </div>
                <h2 
                  className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-8"
                  style={{
                    background: 'linear-gradient(to right, var(--hiredev-button-bg, #2563eb), var(--hiredev-button-bg, #9333ea), var(--hiredev-button-bg, #db2777))',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  Why Choose Our Expert Developers?
                </h2>
                <div className="max-w-4xl mx-auto">
                  <div
                    className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdownToHtml(introOverview || '')
                    }}
                  />
                  <div className="flex flex-wrap justify-center gap-4">
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/80 text-blue-700 border border-blue-200">
                      🚀 Rapid Deployment
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/80 text-purple-700 border border-purple-200">
                      🎯 Expert Matching
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/80 text-pink-700 border border-pink-200">
                      🔒 Quality Assured
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Trusted Partners */}
        <ServicePartnersSection />

        {/* Key Skills and Expertise Section - Enhanced */}
        {whyHire.length > 0 && (
          <section className="py-20 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)', backgroundSize: '50px 50px' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div className="text-center mb-16" {...fadeInUp}>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-600 font-semibold text-sm mb-6">
                  <Brain className="w-4 h-4 mr-2" />
                  Core Competencies
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Key Skills and Qualifications of Our Developers
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our developers possess extensive expertise in developing advanced solutions with cutting-edge technologies
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {(whyHire.length > 0 ? whyHire : [
                  "Deep expertise in sophisticated algorithms and development",
                  "Prioritize code quality with rigorous standards and testing",
                  "Flexible, agile team adaptable to evolving requirements",
                  "Seamless integration with existing systems",
                  "Reduced project risks with experienced engineers",
                  "Rapid deployments ensuring timely delivery"
                ]).map((reason: string, index: number) => {
                  const icons = [Brain, Shield, Target, Zap, Award, Clock];
                  const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];
                  const IconComponent = icons[index % icons.length];
                  const color = colors[index % colors.length];

                  return (
                    <motion.div key={index} variants={fadeUp}>
                      <Card 
                        className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg group"
                        style={{
                          background: 'linear-gradient(to bottom right, var(--hiredev-card-bg, #ffffff), var(--hiredev-card-bg, #f9fafb))'
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div
                                className="text-gray-700 leading-relaxed font-medium"
                                dangerouslySetInnerHTML={{
                                  __html: parseMarkdownToHtml(reason || '')
                                }}
                              />
                              <div className={`mt-3 h-1 w-16 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}

        {/* Hiring Models Section - Enhanced */}
        {hiringModels.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div className="text-center mb-16" {...fadeInUp}>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-indigo-600 font-semibold text-sm mb-6">
                  <Users className="w-4 h-4 mr-2" />
                  Engagement Options
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Flexible Hiring Models
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the engagement model that best fits your project needs and timeline
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {hiringModels.map((model: any, index: number) => {
                  const modelIcons = [Clock, Users, Building];
                  const gradients = [
                    'from-blue-500 to-indigo-600',
                    'from-purple-500 to-pink-600',
                    'from-indigo-500 to-purple-600'
                  ];
                  const bgColors = [
                    'from-blue-50 to-indigo-50',
                    'from-purple-50 to-pink-50',
                    'from-indigo-50 to-purple-50'
                  ];
                  const IconComponent = modelIcons[index % modelIcons.length];
                  const gradient = gradients[index % gradients.length];
                  const bgGradient = bgColors[index % bgColors.length];

                  return (
                    <motion.div key={index} variants={fadeUp}>
                      <Card className={`h-full hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-gradient-to-br ${bgGradient} group overflow-hidden relative`}>
                        {/* Decorative corner */}
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`}></div>

                        <CardContent className="p-8 text-center relative z-10">
                          {/* Icon */}
                          <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>

                          {/* Title */}
                          <h3
                            className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-700 transition-colors duration-300"
                            dangerouslySetInnerHTML={{
                              __html: parseMarkdownToHtml(model.model || '')
                            }}
                          />

                          {/* Description */}
                          <div
                            className="text-gray-700 mb-6 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: parseMarkdownToHtml(model.description || '')
                            }}
                          />

                          {/* Best for section */}
                          <div className="border-t border-gray-200 pt-6">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-semibold mb-3`}>
                              <Target className="w-3 h-3 mr-1" />
                              Best For
                            </div>
                            <div
                              className="text-sm text-gray-600 font-medium"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(model.best_for || '')
                              }}
                            />
                          </div>

                          {/* Hover effect border */}
                          <div className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:${gradient} rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100`}></div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}

        {/* Skills & Expertise Section */}
        {(skillsExpertise.technical_skills || skillsExpertise.soft_skills) && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" {...fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Skills & Expertise
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive skill set for advanced development
                </p>
              </motion.div>
              <div className="grid gap-8 lg:grid-cols-2">
                {skillsExpertise.technical_skills && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                        <Code className="h-5 w-5 text-blue-500" />
                        Technical Skills
                      </h3>
                      <div className="space-y-3">
                        {skillsExpertise.technical_skills.map((skill: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span
                              className="text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(skill || '')
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {skillsExpertise.soft_skills && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                        <Brain className="h-5 w-5 text-purple-500" />
                        Soft Skills
                      </h3>
                      <div className="space-y-3">
                        {skillsExpertise.soft_skills.map((skill: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span
                              className="text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(skill || '')
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Technology Stack Display - Enhanced */}
        {Object.keys(technologyStack).length > 0 && (
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" {...fadeInUp}>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-600 font-semibold text-sm mb-6">
                  <Code className="w-4 h-4 mr-2" />
                  Advanced Technology Arsenal
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Technology Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Cutting-edge technologies our expert developers use for robust, scalable solutions
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                variants={staggerChildren}
                initial="initial"
                animate="animate"
              >
                {[
                  {
                    title: "Programming Languages",
                    items: technologyStack.languages || [],
                    icon: Code,
                    gradient: "from-blue-500 to-blue-600",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-600",
                    borderColor: "border-blue-200"
                  },
                  {
                    title: "Frameworks & Libraries",
                    items: technologyStack.frameworks_libraries || [],
                    icon: Settings,
                    gradient: "from-purple-500 to-purple-600",
                    bgColor: "bg-purple-50",
                    textColor: "text-purple-600",
                    borderColor: "border-purple-200"
                  },
                  {
                    title: "Databases",
                    items: technologyStack.databases || [],
                    icon: Database,
                    gradient: "from-green-500 to-green-600",
                    bgColor: "bg-green-50",
                    textColor: "text-green-600",
                    borderColor: "border-green-200"
                  },
                  {
                    title: "Tools & Platforms",
                    items: technologyStack.tools_platforms || [],
                    icon: Wrench,
                    gradient: "from-orange-500 to-orange-600",
                    bgColor: "bg-orange-50",
                    textColor: "text-orange-600",
                    borderColor: "border-orange-200"
                  }
                ].filter(category => category.items.length > 0).map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <motion.div key={index} variants={fadeUp}>
                      <Card className={`h-full border-2 ${category.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-6">
                            <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center mr-3 group-hover:rotate-6 transition-transform duration-300`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className={`text-lg font-bold ${category.textColor}`}>
                                {category.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {category.items.length} technologies
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {category.items.slice(0, 6).map((item: string, itemIndex: number) => (
                              <div key={itemIndex} className={`flex items-center gap-3 p-2 rounded-lg ${category.bgColor} hover:bg-opacity-80 transition-colors duration-200`}>
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient}`}></div>
                                <span className="text-gray-700 text-sm font-medium">{item}</span>
                              </div>
                            ))}
                            {category.items.length > 6 && (
                              <div className={`text-center py-2 ${category.textColor} text-sm font-medium`}>
                                +{category.items.length - 6} more
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}

        {/* Hiring Process Section */}
        {hiringProcess.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div className="text-center mb-20" {...fadeInUp}>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Clock className="h-4 w-4" />
                  Streamlined Process
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Hiring Process</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  A transparent, efficient journey from consultation to deployment - get your perfect developer in just 4 simple steps
                </p>
              </motion.div>

              {/* Desktop Process Flow - Hidden on mobile */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Process Flow Line */}
                  <div className="absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 rounded-full"></div>
                  <div className="absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-pulse opacity-50"></div>

                  <div className="grid grid-cols-4 gap-8 relative">
                    {hiringProcess.map((step: any, index: number) => {
                      const IconComponent = [Search, MessageSquare, Users, CheckCircle][index] || Users;
                      const colors = ['blue', 'purple', 'indigo', 'green'];
                      const currentColor = colors[index % colors.length];

                      return (
                        <motion.div
                          key={index}
                          className="relative"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2, duration: 0.6 }}
                          viewport={{ once: true }}
                        >
                          {/* Step Number Circle */}
                          <div className={`w-8 h-8 bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-lg ring-4 ring-white`}>
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>

                          {/* Arrow Connector - Not on last item */}
                          {index < hiringProcess.length - 1 && (
                            <div className="absolute top-4 -right-4 w-8 h-8 flex items-center justify-center z-20">
                              <ArrowRight className={`h-5 w-5 text-${currentColor}-400 animate-bounce`} style={{ animationDelay: `${index * 0.5}s` }} />
                            </div>
                          )}

                          {/* Process Card */}
                          <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card className={`border-2 border-${currentColor}-100 hover:border-${currentColor}-300 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm group`}>
                              <CardContent className="p-8 text-center">
                                {/* Icon */}
                                <div className={`w-20 h-20 bg-gradient-to-br from-${currentColor}-500 to-${currentColor}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                                  <IconComponent className="h-10 w-10 text-white" />
                                </div>

                                {/* Step Label */}
                                <div className={`inline-flex items-center gap-2 bg-${currentColor}-100 text-${currentColor}-700 px-3 py-1 rounded-full text-xs font-semibold mb-4`}>
                                  STEP {index + 1}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                                  {step.step}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed text-sm">
                                  {step.description}
                                </p>

                                {/* Bottom accent */}
                                <div className={`mt-4 h-1 w-12 bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet Process Flow */}
              <div className="lg:hidden">
                <div className="space-y-8">
                  {hiringProcess.map((step: any, index: number) => {
                    const IconComponent = [Search, MessageSquare, Users, CheckCircle][index] || Users;
                    const colors = ['blue', 'purple', 'indigo', 'green'];
                    const currentColor = colors[index % colors.length];

                    return (
                      <motion.div
                        key={index}
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-start gap-6">
                          {/* Left side - Step indicator */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            {/* Step Number */}
                            <div className={`w-12 h-12 bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white relative z-10`}>
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>

                            {/* Connecting Line - Not on last item */}
                            {index < hiringProcess.length - 1 && (
                              <div className={`w-0.5 h-20 bg-gradient-to-b from-${currentColor}-300 to-gray-200 mt-4`}></div>
                            )}
                          </div>

                          {/* Right side - Content */}
                          <div className="flex-1 min-w-0">
                            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                              <Card className={`border-2 border-${currentColor}-100 hover:border-${currentColor}-300 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group`}>
                                <CardContent className="p-6">
                                  <div className="flex items-center gap-4 mb-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 bg-gradient-to-br from-${currentColor}-500 to-${currentColor}-600 rounded-xl flex items-center justify-center group-hover:rotate-3 transition-transform duration-300 shadow-md flex-shrink-0`}>
                                      <IconComponent className="h-8 w-8 text-white" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      {/* Step Label */}
                                      <div className={`inline-flex items-center gap-2 bg-${currentColor}-100 text-${currentColor}-700 px-2 py-1 rounded-full text-xs font-semibold mb-2`}>
                                        STEP {index + 1}
                                      </div>

                                      {/* Title */}
                                      <h3 className="text-sm md:text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
                                        {step.step}
                                      </h3>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    {step.description}
                                  </p>

                                  {/* Bottom accent */}
                                  <div className={`mt-4 h-1 w-16 bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Call to Action */}
              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Start Your Hiring Journey?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Connect with our team today and get matched with your ideal developer in just 48 hours
                  </p>
                  <Button
                    size="lg"
                    className="text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(to right, var(--hiredev-button-bg, #2563eb), var(--hiredev-button-bg, #9333ea))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, var(--gradient-start, #2563eb), var(--gradient-middle, #9333ea), var(--gradient-end, #db2777))';
                      e.currentTarget.style.filter = 'brightness(0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, var(--hiredev-button-bg, #2563eb), var(--hiredev-button-bg, #9333ea))';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    Start Hiring Process
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Client Testimonials Section - Slider */}
        {testimonialsData && testimonialsData.length > 0 && (
          <HireDeveloperTestimonialsSlider
            testimonials={testimonialsData.map((t: any) => ({
              quote: t.testimonialText,
              client: t.clientName,
              role: t.clientPosition,
              company: t.clientCompany,
              rating: t.rating,
              gender: t.gender
            }))}
          />
        )}

        {/* Case Studies Section */}
        {page.selectedCaseStudies && (
          <HirePageCaseStudies
            selectedCaseStudyIds={page.selectedCaseStudies}
            title={`${page.developerType || 'Developer'} Success Stories`}
            className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
          />
        )}

        {/* FAQs Section */}
        {faqs.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-16" {...fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get answers to common questions about hiring developers
                </p>
              </motion.div>
              <div className="space-y-4">
                {faqs.map((faq: any, index: number) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <div id="contact">
          <HomeContactSection />
        </div>

        <Footer />
      </div>
    </>
  );
}

export default ServiceHireDeveloperPage;