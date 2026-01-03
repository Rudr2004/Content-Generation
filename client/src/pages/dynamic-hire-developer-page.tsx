import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ExternalLink, Users, Briefcase, Star, Clock, DollarSign, CheckCircle, ArrowRight, MessageSquare, Shield, Code, Trophy, Zap, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import type { HirePage } from '@shared/schema';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/contact-form-light";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { cleanTitleText } from '@/lib/markdown-utils';
import { parseMarkdownToHtml } from '@/lib/markdown-utils';

import { HireDeveloperTestimonials } from "@/components/hire-developer-testimonials";
import { HireDeveloperTechnologyStack } from "@/components/hire-developer-technology-stack";
import { HirePageCaseStudies } from "@/components/hire-page-case-studies";
import { HireDeveloperProcessSection } from "@/components/hire-developer-process-section";

export default function DynamicHireDeveloperPage() {
  const { slug } = useParams();
  const [location] = useLocation();
  
  console.log('DynamicHireDeveloperPage mounted!', { slug, location });
  
  // Extract slug from location if not in params (for direct routes)
  // Handle both /hire-developers/:slug and /hire-:fullslug patterns
  const actualSlug = slug || location.split('/').pop()?.replace(/^hire-/, '') || location.split('/').pop();

  // Get hire developer page by slug
  const { data: pageData, isLoading, error } = useQuery({
    queryKey: [`/api/hire-developer-pages/slug/${actualSlug}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/hire-developer-pages/slug/${actualSlug}`);
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The hire developer page you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const page: HirePage = pageData;

  const scrollToContact = () => {
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants from blockchain page
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

  // Hero stats from blockchain page structure
  const heroStats = [
    { icon: Users, text: "3:1 Hire Ratio" },
    { icon: Clock, text: "Two weeks trial available" },
    { icon: Shield, text: "NDA-Backed Teams" },
    { icon: Globe, text: "Instant Timezone Match" },
    { icon: Trophy, text: "Fortune 500 Trusted" },
    { icon: Zap, text: "2x Faster Hiring" }
  ];

  const usps = [
    {
      icon: Clock,
      title: "10+ years of Experience",
      description: "Test our developers risk-free"
    },
    {
      icon: Users,
      title: "Reduce Cost by 50%",
      description: "Significant cost savings on development projects"
    },
    {
      icon: Zap,
      title: "Faster Delivery",
      description: "Accelerated development timelines"
    },
    {
      icon: Globe,
      title: "Time-Zone Matching",
      description: "Perfect timezone alignment for global teams"
    },
    {
      icon: Award,
      title: "Certified Developers",
      description: "Pre-vetted experts with proven track records"
    }
  ];

  return (
    <>
      <ReadingProgressBar />

      <div className="min-h-screen">
        <Navigation />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <h1 
                  className="text-4xl lg:text-6xl font-bold mb-6 leading-tight mt-1.5"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHtml(cleanTitleText(page.title) || '')
                  }}
                />

                <div 
                  className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHtml(page.heroDescription || '')
                  }}
                />

                {/* Hero Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
                    >
                      <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-300" />
                      <p className="text-sm font-medium">{stat.text}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex justify-center lg:justify-start"
                >
                  <Button
                    onClick={scrollToContact}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg rounded-full w-full sm:w-auto max-w-xs sm:max-w-none"
                  >
                    <span className="truncate">Hire Developer</span>
                    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right side - Badges and Stats */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center lg:text-right space-y-6"
              >
                {/* Professional Badges */}
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-center lg:justify-end space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span className="text-sm font-medium text-green-400">CERTIFIED 2024</span>
                    </div>
                    <p className="text-white font-bold">{cleanTitleText(page.title).replace('Hire ', '').replace(' Developers', ' Development Company 2024')}</p>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                    <div className="text-2xl font-bold text-white">100+</div>
                    <div className="text-sm text-gray-300">Projects</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-300" />
                    <div className="text-2xl font-bold text-white">$50M+</div>
                    <div className="text-sm text-gray-300">Value Created</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-2">10+ years of Experience</div>
                  <p className="text-gray-300">Test our developers risk-free</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* USPs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={staggerChildren} animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {usps.map((usp, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="text-center group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <usp.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{usp.title}</h3>
                    <p className="text-gray-600 text-sm">{usp.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Key Skills and Qualifications Section */}
        {(page.whyHirePoints || page.whyHireDescription) && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-20 bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {page.whyHireTitle || "Key Skills and Qualifications of Our Developers"}
                </h2>
                {page.whyHireDescription && (
                  <div 
                    className="text-lg text-gray-600 max-w-4xl mx-auto"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdownToHtml(page.whyHireDescription || '')
                    }}
                  />
                )}
              </motion.div>

              {/* Display structured whyHirePoints or parse whyHireDescription */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                  // First try to use structured whyHirePoints JSON data
                  if (page.whyHirePoints) {
                    try {
                      const whyHirePoints = typeof page.whyHirePoints === 'string'
                        ? JSON.parse(page.whyHirePoints)
                        : page.whyHirePoints;

                      if (Array.isArray(whyHirePoints) && whyHirePoints.length > 0) {
                        // Icon mapping for whyHirePoints
                        const iconMap: { [key: string]: any } = {
                          'Brain': '🧠',
                          'Code': '💻',
                          'Database': '🗄️',
                          'Shield': '🛡️',
                          'Zap': '⚡',
                          'Settings': '⚙️',
                          'Star': '⭐',
                          'Users': '👥',
                          'Globe': '🌍'
                        };

                        return whyHirePoints.map((point: any, index: number) => (
                          <motion.div
                            key={index}
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="group"
                          >
                            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full border border-gray-100">
                              <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                  {iconMap[point.icon] || iconMap['Code'] || '💻'}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {point.title}
                                  </h3>
                                </div>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                {point.description}
                              </p>
                            </div>
                          </motion.div>
                        ));
                      }
                    } catch (error) {
                      console.error('Error parsing whyHirePoints JSON:', error);
                    }
                  }

                  // Fallback to parsing whyHireDescription if whyHirePoints not available
                  try {
                    // Parse the HTML content to extract benefits
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(page.whyHireDescription || '', 'text/html');
                    const benefitItems = [];

                    // Look for list items, headings, or structured content
                    const listItems = doc.querySelectorAll('li');
                    const headings = doc.querySelectorAll('h3, h4');

                    if (listItems.length > 0) {
                      // Extract from list items
                      listItems.forEach((item, index) => {
                        if (item.textContent?.trim()) {
                          const text = item.textContent.trim();
                          benefitItems.push({
                            title: text.split('.')[0] || text.split(':')[0] || `Benefit ${index + 1}`,
                            description: text.includes('.') ? text.split('.').slice(1).join('.').trim() :
                              text.includes(':') ? text.split(':').slice(1).join(':').trim() :
                                'Professional development services tailored to your needs.'
                          });
                        }
                      });
                    } else {
                      // Default benefits if no structured content found
                      const defaultBenefits = [
                        {
                          title: "Expert Knowledge",
                          description: "Deep expertise in the latest technologies and industry best practices."
                        },
                        {
                          title: "Proven Experience",
                          description: "Track record of delivering successful projects across various industries."
                        },
                        {
                          title: "Quality Assurance",
                          description: "Rigorous testing and code review processes to ensure high-quality deliverables."
                        },
                        {
                          title: "Security Focus",
                          description: "Strong emphasis on security best practices and compliance requirements."
                        },
                        {
                          title: "Performance Optimization",
                          description: "Skilled in optimizing applications for speed, scalability, and efficiency."
                        },
                        {
                          title: "Architecture Design",
                          description: "Expertise in designing robust, scalable system architectures."
                        }
                      ];
                      benefitItems.push(...defaultBenefits);
                    }

                    // Icons for benefits
                    const benefitIcons = [
                      "🧠", "💻", "🗄️", "🛡️", "⚡", "⚙️"
                    ];

                    return benefitItems.slice(0, 6).map((benefit, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="group"
                      >
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full border border-gray-100">
                          <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                              {benefitIcons[index % benefitIcons.length]}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {benefit.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    ));
                  } catch (error) {
                    console.error('Error parsing Why Hire content:', error);
                    // Return default fallback benefits
                    const defaultBenefits = [
                      { title: "Expert Knowledge", description: "Deep expertise in cutting-edge technologies." },
                      { title: "Proven Experience", description: "Track record of successful project delivery." },
                      { title: "Quality Assurance", description: "Rigorous testing and code review processes." },
                      { title: "Security Focus", description: "Strong emphasis on security and compliance." },
                      { title: "Performance Optimization", description: "Skilled in application optimization." },
                      { title: "Architecture Design", description: "Expertise in scalable system design." }
                    ];
                    const benefitIcons = ["🧠", "💻", "🗄️", "🛡️", "⚡", "⚙️"];
                    return defaultBenefits.map((benefit, index) => (
                      <motion.div key={index} variants={fadeInUp} className="group">
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full border border-gray-100">
                          <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                              {benefitIcons[index % benefitIcons.length]}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {benefit.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ));
                  }
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Section - Structured Cards Format */}
        {page.servicesDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-20 bg-gray-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Hire {cleanTitleText(page.title).replace('Hire ', '').replace(' Developers', '')} Developers with Deep {cleanTitleText(page.title).replace('Hire ', '').replace(' Developers', '')} Expertise
                </h2>
                <div 
                  className="text-lg text-gray-600 max-w-4xl mx-auto"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHtml(page.servicesDescription || '')
                  }}
                />
              </motion.div>

              {/* Parse and display services as cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                  // Parse the HTML content to extract service items
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(page.servicesDescription, 'text/html');
                  const serviceItems = [];

                  // Look for list items, headings, or structured content
                  const listItems = doc.querySelectorAll('li');
                  const headings = doc.querySelectorAll('h3, h4');

                  if (listItems.length > 0) {
                    // Extract from list items
                    listItems.forEach((item, index) => {
                      if (item.textContent?.trim()) {
                        serviceItems.push({
                          title: item.textContent.trim().split('.')[0] || `Service ${index + 1}`,
                          description: item.textContent.trim()
                        });
                      }
                    });
                  } else if (headings.length > 0) {
                    // Extract from headings and following content
                    headings.forEach((heading, index) => {
                      let description = '';
                      let nextElement = heading.nextElementSibling;
                      if (nextElement && (nextElement.tagName === 'P' || nextElement.tagName === 'DIV')) {
                        description = nextElement.textContent?.trim() || '';
                      }
                      serviceItems.push({
                        title: heading.textContent?.trim() || `Service ${index + 1}`,
                        description: description || 'Professional development services tailored to your needs.'
                      });
                    });
                  } else {
                    // Default services if no structured content found
                    const defaultServices = [
                      {
                        title: "Smart Contract Development",
                        description: "Build secure, efficient smart contracts on leading blockchain platforms with comprehensive testing and audit support."
                      },
                      {
                        title: "DeFi Protocol Development",
                        description: "Create innovative DeFi platforms, yield farming, staking mechanisms, and liquidity pools with advanced tokenomics."
                      },
                      {
                        title: "NFT Marketplace Development",
                        description: "Generate full-featured NFT marketplaces with minting, trading, auction systems, royalty management, and cross-chain compatibility."
                      },
                      {
                        title: `${cleanTitleText(page.title).replace('Hire ', '').replace(' Developers', '')} Integration Services`,
                        description: "Seamlessly integrate blockchain technology into existing applications with custom APIs, wallet connections, and transaction management systems."
                      },
                      {
                        title: "Cryptocurrency & Token Development",
                        description: "Create custom cryptocurrencies, utility tokens, governance tokens, and implement tokenomics with advanced features like burning, staking, and vesting."
                      },
                      {
                        title: `${cleanTitleText(page.title).replace('Hire ', '').replace(' Developers', '')} Security & Auditing`,
                        description: "Comprehensive security audits, vulnerability assessments, and penetration testing to ensure your applications are secure and compliant."
                      }
                    ];
                    serviceItems.push(...defaultServices);
                  }

                  return serviceItems.slice(0, 6).map((service, index) => (
                    <motion.div
                      key={index}
                      variants={fadeUp}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                        <Code className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </motion.div>
                  ));
                })()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Section - Always show with fallback to default steps */}
        <HireDeveloperProcessSection
          processTitle={page.processTitle || "Our Hiring Process"}
          processDescription={page.processDescription || "We follow a streamlined process to connect you with the best developers for your project needs."}
          processSteps={page.content ? (() => {
            try {
              console.log('Process Section Debug - page.content:', page.content);
              const content = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
              console.log('Process Section Debug - parsed content:', content);
              console.log('Process Section Debug - content.process:', content?.process);
              return content?.process || undefined;
            } catch (error) {
              console.log('Process Section Debug - parsing error:', error);
              return undefined;
            }
          })() : undefined}
        />

        {/* Engagement Models Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Pick the Right Model to {cleanTitleText(page.title)}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you need a full development team or flexible expertise, we've got a hiring model that fits your project needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contract & C2H Model</h3>
                <p className="text-gray-600 mb-6">
                  Quickly onboard experts for specific projects or pilot phases. Our contract and contract-to-hire models offer flexibility for short-term development needs without compromising on quality.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Permanent Models</h3>
                <p className="text-gray-600 mb-6">
                  Build in-house capabilities with full-time developers. Ideal for long-term innovation and companies investing in digital transformation with dedicated development teams.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dedicated Teams</h3>
                <p className="text-gray-600 mb-6">
                  Deploy a dedicated development team focused solely on your project. Ensure continuity and efficient collaboration for complex applications without hiring overhead.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to {cleanTitleText(page.title)} Today?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Share your project, and we'll match you with experts in 48 hours.
              </p>
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold"
              >
                Hire Developer
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Technology Stack Section - Display AI-generated technologies */}
        {(page.technologyStack || page.aiTechnologies) && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Technology Stack
                </h2>
                {(() => {
                  try {
                    const techStack = page.technologyStack ? JSON.parse(page.technologyStack) : null;
                    return (
                      <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                        {techStack?.description || `Our ${page.developerType} developers utilize cutting-edge technologies to deliver robust and scalable solutions`}
                      </p>
                    );
                  } catch {
                    return (
                      <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                        Our {page.developerType} developers utilize cutting-edge technologies to deliver robust and scalable solutions
                      </p>
                    );
                  }
                })()}
              </motion.div>

              <HireDeveloperTechnologyStack
                technologyStack={page.technologyStack}
                aiTechnologies={page.aiTechnologies}
                developerType={page.developerType || 'Developer'}
              />
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-gray-900 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div variants={fadeUp}>
                <div className="text-4xl font-bold text-blue-400 mb-2">150+</div>
                <div className="text-gray-300">Projects Completed</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="text-4xl font-bold text-purple-400 mb-2">8+</div>
                <div className="text-gray-300">Years of Experience</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
                <div className="text-gray-300">Expert Developers</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Case Studies Section */}
        {page.selectedCaseStudies && (
          <HirePageCaseStudies 
            selectedCaseStudyIds={page.selectedCaseStudies}
            title={`${cleanTitleText(page.title).replace('Hire ', '').replace(' Developers', '')} Success Stories`}
          />
        )}

        {/* Dynamic Testimonials Section */}
        <HireDeveloperTestimonials
          hirePageId={page.id}
          developerType={page.developerType || "Developer"}
          hirePageTitle={cleanTitleText(page.title)}
        />

        {/* Contact Section */}
        <div id="contact">
          <HomeContactSection />
        </div>

        <Footer />
      </div>
    </>
  );
}