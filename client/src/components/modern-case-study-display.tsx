import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Building2, Target, CheckCircle, Lightbulb, Rocket, Star, Quote, Users, TrendingUp, Award, Clock, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeContactSection } from './home-contact-section';
import { getProfileImageByGender, getGenderFromName } from '@/lib/profile-images';
import { parseMarkdownToHtml } from '@/lib/markdown-utils';
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

interface CaseStudyData {
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

interface ModernCaseStudyDisplayProps {
  caseStudy: CaseStudyData;
}

export function ModernCaseStudyDisplay({ caseStudy }: ModernCaseStudyDisplayProps) {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Parse JSON content or use fallback
  const parseContent = (content: string) => {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  };

  const content = caseStudy.problemStatement || '';
  const parsedData = parseContent(content);

  // Enhanced fallback content with modern structure
  const fallbackData = {
    title: caseStudy.title,
    client: {
      name: "Innovation Partner",
      industry: caseStudy.category || "Technology",
      location: "Global"
    },
    project_overview: {
      duration: "8 months",
      problem_statement: `Transforming business operations through innovative ${caseStudy.category} solutions, delivering measurable results and enhanced user experiences.`,
      objectives: [
        "Modernize legacy systems",
        "Enhance operational efficiency",
        "Improve user experience",
        "Ensure scalable growth"
      ]
    },
    challenges: [
      "Outdated technology infrastructure limiting growth",
      "Complex integration requirements across platforms",
      "User adoption and change management concerns",
      "Performance and scalability bottlenecks",
      "Security and compliance requirements"
    ],
    solution: {
      strategy: "End-to-end digital transformation with modern architecture",
      features_and_capabilities: [
        "Cloud-native architecture implementation",
        "Responsive user interface design",
        "Real-time data analytics dashboard",
        "Automated workflow optimization",
        "Advanced security measures"
      ],
      user_experience_design: "Intuitive, mobile-first design with focus on user adoption",
      technologies_used: ["React", "Node.js", "AWS", "PostgreSQL", "Docker", "Kubernetes"]
    },
    implementation: {
      phases: [
        {
          phase_name: "Discovery & Planning",
          activities: ["Requirements analysis", "Architecture design", "Technology selection"],
          duration: "2 months"
        },
        {
          phase_name: "Development & Testing",
          activities: ["Core development", "Integration testing", "Security testing"],
          duration: "4 months"
        },
        {
          phase_name: "Deployment & Training",
          activities: ["Production deployment", "User training", "Go-live support"],
          duration: "2 months"
        }
      ]
    },
    results_and_impact: {
      quantitative_metrics: {
        performance_improvement: "65% faster processing times",
        cost_reduction: "40% reduction in operational costs",
        user_satisfaction: "94% user satisfaction score"
      },
      qualitative_benefits: [
        "Streamlined business processes",
        "Enhanced decision-making capabilities",
        "Improved customer satisfaction",
        "Increased team productivity"
      ],
      business_outcomes: "Achieved 200% ROI within 18 months and positioned for future growth"
    },
    client_testimonial: `The transformation has been remarkable. ${siteName} delivered beyond our expectations, and the new system has revolutionized how we operate. Our team is more productive, and our customers are happier than ever.`,
    conclusion: `This project showcases the power of strategic technology transformation. By combining innovative ${caseStudy.category} solutions with expert implementation, we helped our client achieve sustainable growth and competitive advantage.`
  };

  const displayData = parsedData || fallbackData;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  };

  // Helper function to render array content
  const renderArrayContent = (items: string[], icon: React.ReactNode) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3"
        >
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
          <p className="text-gray-700 leading-relaxed">{item}</p>
        </motion.div>
      ))}
    </div>
  );

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

  // Put this helper function above your return statement
  const stripColors = (html: string) => {
    if (!html) return html;
    return html
      // Remove Tailwind text/bg/fill/stroke color classes
      .replace(/class="([^"]*)"/g, (_m, cls) => {
        const classes = cls
          .split(/\s+/)
          .filter((c: string) => !/^(text|bg|fill|stroke)-/.test(c));
        return classes.length ? `class="${classes.join(' ')}"` : '';
      })
      // Remove inline color styles
      .replace(/style="[^"]*?"/g, (m) =>
        m.replace(/\b(color|background|background-color)\s*:\s*[^;"]+;?/g, '')
      );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              {caseStudy.category && (
                <Badge className="bg-blue-500/20 text-blue-100 mt-4 hover:bg-blue-500/30 mb-6 px-4 py-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  {caseStudy.category}
                </Badge>
              )}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHtml(displayData.title || '')
              }}
            />

            <motion.p
              variants={itemVariants}
              className="text-xl text-white max-w-4xl mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHtml(displayData.project_overview?.problem_statement || '')
              }}
            />

            {/* Key metrics preview */}
            {displayData.results_and_impact?.quantitative_metrics && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
              >
                {Object.entries(displayData.results_and_impact.quantitative_metrics).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 flex flex-col items-center justify-center min-h-[260px]"
                  >
                    <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
                    <p className="text-2xl font-bold text-white text-center">{String(value)}</p>
                    <p className="text-blue-200 text-center mt-2 capitalize">{key.replace(/_/g, ' ')}</p>
                  </motion.div>
                ))}

              </motion.div>
            )}
          </motion.div>
          <div className='flex justify-center items-center mt-6'>
            <Button
              size="lg"
              onClick={scrollToContact}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Project
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="space-y-16">

          {/* Client Information */}
          {displayData.client && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <Building2 className="h-7 w-7 mr-3 text-blue-600" />
                      Client Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Client</p>
                            <p className="text-gray-600">{displayData.client.name}</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Industry</p>
                            <p className="text-gray-600">{displayData.client.industry}</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Location</p>
                            <p className="text-gray-600">{displayData.client.location}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {displayData.project_overview?.duration && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 pt-6 border-t border-gray-200"
                      >
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">Project Duration:</span>
                            <span className="text-gray-600">{displayData.project_overview.duration}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Project Overview */}
          {displayData.project_overview && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-green-50/50">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <Target className="h-7 w-7 mr-3 text-green-600" />
                      Project Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      {displayData.project_overview.problem_statement}
                    </p>
                    {displayData.project_overview.objectives && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Key Objectives</h4>
                        {renderArrayContent(
                          displayData.project_overview.objectives,
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Challenges */}
          {displayData.challenges && Array.isArray(displayData.challenges) && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-red-50/50">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <Lightbulb className="h-7 w-7 mr-3 text-red-600" />
                      Key Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayData.challenges.map((challenge: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
                          className="relative group h-full"
                        >
                          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full group-hover:shadow-xl group-hover:border-red-100 transition-all duration-300 transform group-hover:-translate-y-2">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                                <div className="w-4 h-4 bg-red-500 rounded-full" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed font-medium">{challenge.replace(/^[•\-\*]\s*/, '')}</p>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Solution */}
          {displayData.solution && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-purple-50/50">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <Rocket className="h-7 w-7 mr-3 text-purple-600" />
                      Our Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gray-700 leading-relaxed text-lg mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      {displayData.solution.strategy}
                    </motion.p>

                    <div className="space-y-8">
                      {displayData.solution.features_and_capabilities && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-6 flex items-center text-lg">
                            <Zap className="w-6 h-6 text-purple-600 mr-3" />
                            Key Features & Capabilities
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displayData.solution.features_and_capabilities.map((feature: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-5 bg-white rounded-lg shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                  <Rocket className="w-4 h-4 text-purple-600" />
                                </div>
                                <p className="text-gray-700 leading-relaxed">{feature.replace(/^[•\-\*]\s*/, '')}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayData.solution.user_experience_design && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                        >
                          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            User Experience Design
                          </h4>
                          <p className="text-purple-700">{displayData.solution.user_experience_design}</p>
                        </motion.div>
                      )}

                      {displayData.solution.technologies_used && Array.isArray(displayData.solution.technologies_used) && displayData.solution.technologies_used.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 lg:p-8 border border-purple-100"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white flex-shrink-0">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </div>
                            <div className="text-center sm:text-left">
                              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Technologies Used</h4>
                              <p className="text-gray-600 text-sm">Cutting-edge tools and frameworks powering this solution</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {displayData.solution.technologies_used.map((tech: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                  delay: index * 0.08,
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 25
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  y: -2,
                                  transition: { duration: 0.2 }
                                }}
                                className="group relative"
                              >
                                <div className="relative overflow-hidden bg-white rounded-xl p-4 py-3 shadow-sm border border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 cursor-default">
                                  {/* Gradient background on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                  {/* Tech icon dot */}
                                  <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

                                  <div className="relative z-10 flex items-center justify-center text-center">
                                    <span className="text-gray-800 font-medium text-sm group-hover:text-purple-700 transition-colors duration-300 leading-relaxed">
                                      {tech}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Bottom decoration */}
                          <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Implementation Timeline */}
          {displayData.implementation?.phases && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-indigo-50/50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 sm:px-6 py-4 sm:py-6">
                    <CardTitle className="flex items-center text-xl sm:text-2xl text-gray-900">
                      <Calendar className="h-6 w-6 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-indigo-600" />
                      Implementation Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="relative">
                      {/* Timeline Line - Hidden on mobile, visible on larger screens */}
                      <div className="hidden sm:block absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-blue-300 to-purple-200"></div>

                      <div className="space-y-8 sm:space-y-12">
                        {displayData.implementation.phases.map((phase: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2, type: "spring", damping: 20 }}
                            className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 group"
                          >
                            {/* Timeline Node */}
                            <div className="relative flex-shrink-0 self-center sm:self-start">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.2 + 0.3, type: "spring", damping: 15 }}
                                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-full shadow-lg border-2 sm:border-4 border-indigo-100 flex items-center justify-center group-hover:border-indigo-300 transition-all duration-300 relative z-10"
                              >
                                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                                </div>
                              </motion.div>

                              {/* Pulsing effect */}
                              <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                className="absolute inset-0 bg-indigo-200 rounded-full"
                              />
                            </div>

                            {/* Content Card */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.2 + 0.4 }}
                              className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 group-hover:shadow-xl group-hover:border-indigo-100 transition-all duration-300"
                            >
                              {/* Phase Header */}
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                                <div className="flex-1">
                                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                                    {phase.phase_name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 flex-shrink-0" />
                                    <span className="font-medium">Duration: {phase.duration}</span>
                                  </div>
                                </div>

                                {/* Phase Number Badge */}
                                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full self-start">
                                  <span className="text-indigo-700 font-semibold text-xs sm:text-sm whitespace-nowrap">Phase {index + 1}</span>
                                </div>
                              </div>

                              {/* Activities Grid - Responsive layout */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                                {phase.activities.map((activity: string, actIndex: number) => (
                                  <motion.div
                                    key={actIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 + actIndex * 0.1 + 0.5 }}
                                    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors group/item"
                                  >
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mt-1.5 sm:mt-2 group-hover/item:scale-125 transition-transform flex-shrink-0"></div>
                                    <span className="text-gray-700 text-xs sm:text-sm font-medium group-hover/item:text-indigo-700 transition-colors leading-relaxed">
                                      {activity}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-gray-600">Progress</span>
                                  <span className="text-xs font-bold text-indigo-600">100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: index * 0.2 + 0.8, duration: 1 }}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 sm:h-2 rounded-full"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Timeline End Marker - Responsive */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: displayData.implementation.phases.length * 0.2 + 1 }}
                        className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12"
                      >
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center relative z-10">
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center sm:justify-start">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 sm:px-6 sm:py-4 rounded-lg border border-green-200 text-center sm:text-left w-full sm:w-auto">
                            <p className="text-green-800 font-semibold text-sm sm:text-base">Project Successfully Completed!</p>
                            <p className="text-green-600 text-xs sm:text-sm mt-1">All phases delivered on time and within scope</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Results & Impact */}
          {displayData.results_and_impact && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-green-50/50 text-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <TrendingUp className="h-7 w-7 mr-3 text-green-600" />
                      Results & Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    {displayData.results_and_impact.quantitative_metrics && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {Object.entries(displayData.results_and_impact.quantitative_metrics).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
                            className="relative group"
                          >
                            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                <Award className="w-8 h-8 text-green-600" />
                              </div>
                              <p className="text-2xl font-bold  text-green-600 mb-2">{String(value)}</p>
                              <p className="text-gray-600 capitalize font-medium">{key.replace(/_/g, ' ')}</p>
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {displayData.results_and_impact.qualitative_benefits && (
                      <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-6 text-lg">Key Benefits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {displayData.results_and_impact.qualitative_benefits.map((benefit: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">{benefit}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {displayData.results_and_impact.business_outcomes && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm"
                      >
                        <h4 className="font-semibold text-green-800 mb-4 flex items-center text-lg">
                          <Star className="w-6 h-6 mr-3" />
                          Business Outcomes
                        </h4>
                        <p className="text-green-700 text-lg leading-relaxed">{displayData.results_and_impact.business_outcomes}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Client Testimonial */}
          {displayData.client_testimonial && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl"></div>

                      <div className="relative p-12 text-center">
                        <Quote className="h-16 w-16 text-blue-500 mx-auto mb-8 opacity-30" />

                        <blockquote
                          className="text-2xl text-gray-800 leading-relaxed mb-8 font-medium max-w-4xl mx-auto"
                          dangerouslySetInnerHTML={{
                            __html: '"' + parseMarkdownToHtml(displayData.client_testimonial || '') + '"'
                          }}
                        />

                        {/* Profile section with consistent image and rating */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          {/* Profile Image */}
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-lg">
                            <img
                              src={(() => {
                                // Extract client name for consistent image assignment
                                const clientName = displayData.client?.name || `${caseStudy.title} Client`;
                                const detectedGender = getGenderFromName(clientName);

                                // Use sophisticated profile image system for consistent images
                                return getProfileImageByGender(
                                  detectedGender,
                                  clientName,
                                  `Case Study Testimonial ${caseStudy.id}`
                                );
                              })()}
                              alt="Client"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const clientName = displayData.client?.name || `${caseStudy.title} Client`;
                                const detectedGender = getGenderFromName(clientName);

                                // Fallback to different consistent gender-based image
                                target.src = getProfileImageByGender(
                                  detectedGender,
                                  `${clientName}_fallback_${caseStudy.id}`,
                                  `Case Study Testimonial Fallback ${caseStudy.id}`
                                );
                              }}
                            />
                          </div>

                          {/* Star Rating with consistent score */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-gray-600 font-medium">
                              {(() => {
                                // Generate consistent rating based on case study ID
                                const rating = 4.2 + ((caseStudy.id * 7) % 8) * 0.1;
                                return Math.round(rating * 10) / 10;
                              })()}/5.0
                            </span>
                          </div>

                          {/* Client Info */}
                          <div className="text-gray-700">
                            <p className="font-semibold text-lg">{displayData.client?.name}</p>
                            <p className="text-gray-600">{displayData.client?.industry}</p>
                            {/* <p className="text-sm text-gray-500 mt-1">Verified Client</p> */}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Conclusion */}
          {displayData.conclusion && (
            <motion.div variants={itemVariants}>
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
              >
                <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-slate-50">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <Star className="h-7 w-7 mr-3 text-yellow-600" />
                      Conclusion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <p
                      className="text-gray-700 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdownToHtml(displayData.conclusion || '')
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Call to Action */}
          {/* <motion.div variants={itemVariants} className="text-center">
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
            > */}
          {/* <Card>
                <CardContent className="p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                  </motion.div>
                </CardContent>
              </Card> */}
          {/* </motion.div>
          </motion.div> */}
        </div>
      </motion.div>
      <div id="contact">
        <HomeContactSection />
      </div>
    </div>
  );
}