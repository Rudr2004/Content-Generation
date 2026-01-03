import React, { useState, useEffect } from 'react';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, MapPin, Building2, Calendar, Users, Target, CheckCircle, Lightbulb, Rocket, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaseStudyData {
  id: number;
  title: string;
  slug: string;
  category?: string;
  problemStatement?: string; // Main content field in simplified structure
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  userExperienceDesign?: string;
  businessOutcomes?: string;
  clientTestimonial?: string;
  clientName?: string;
  clientIndustry?: string;
}

interface IndividualCaseStudyDisplayProps {
  caseStudy: CaseStudyData;
}

function parseJsonSafely(jsonString: string | undefined, fallback: any = []): any {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

export function IndividualCaseStudyDisplay({ caseStudy }: IndividualCaseStudyDisplayProps) {
  const readingProgress = useScrollProgress();

  // Reading progress is now handled by the optimized useScrollProgress hook

  // For simplified structure, we'll parse the content from problemStatement
  const content = caseStudy.problemStatement || '';
  
  // Try to parse as JSON first, then fall back to text parsing
  const parseCaseStudyContent = (content: string) => {
    let parsedData: any = {};
    
    // Try JSON parsing first
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, use text parsing
      const sections: any = {};
      const lines = content.split('\n');
      let currentSection = '';
      let currentContent = '';
      
      for (const line of lines) {
        if (line.includes(':') && (line.startsWith('Title:') || line.startsWith('Client Information:') || 
            line.startsWith('Project Overview:') || line.startsWith('Challenges:') || 
            line.startsWith('Solution:') || line.startsWith('Results & Impact:') || 
            line.startsWith('Client Testimonial:') || line.startsWith('Conclusion:'))) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = line.split(':')[0].toLowerCase().replace(/\s+/g, '_');
          currentContent = line.split(':').slice(1).join(':').trim() + '\n';
        } else if (currentSection) {
          currentContent += line + '\n';
        }
      }
      
      if (currentSection && currentContent) {
        sections[currentSection] = currentContent.trim();
      }
      
      parsedData = sections;
    }
    
    return parsedData;
  };
  
  const sections = parseCaseStudyContent(content);
  
  // Extract data with fallbacks
  const clientName = sections.client_overview?.client_name || sections.clientName || '';
  const clientIndustry = sections.client_overview?.industry || sections.clientIndustry || caseStudy.category || '';
  const clientLocation = sections.client_overview?.location || sections.clientLocation || '';
  const projectDuration = sections.client_overview?.project_duration || sections.projectDuration || '';
  const objectives = sections.project_overview?.objectives || sections.objectives || [];
  const challenges = sections.challenges_addressed || sections.challenges || [];
  const solutionStrategy = sections.solution_approach?.overview || sections.solutionStrategy || sections.solution || '';
  const featuresCapabilities = sections.key_features || sections.featuresCapabilities || [];
  const userExperienceDesign = sections.user_experience?.design_approach || sections.userExperienceDesign || '';
  const technologiesUsed = sections.technology_stack || sections.technologiesUsed || [];
  const implementationProcess = sections.implementation_process || sections.implementationProcess || [];
  const quantitativeMetrics = sections.results_and_impact?.quantitative_metrics || sections.quantitativeMetrics || {};
  const qualitativeBenefits = sections.results_and_impact?.qualitative_benefits || sections.qualitativeBenefits || [];
  const businessOutcomes = sections.results_and_impact?.business_outcomes || sections.businessOutcomes || '';
  const clientTestimonial = sections.client_testimonial?.testimonial_text || sections.clientTestimonial || '';
  const futureScopeEnhancements = sections.future_scope_enhancements || sections.futureScopeEnhancements || '';
  const conclusion = sections.conclusion || '';
  const tags = sections.tags || [];

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-3 py-1">
              {caseStudy.category}
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-4 sm:px-0 text-white">
              {caseStudy.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              {caseStudy.metaDescription || 'Comprehensive case study showcasing innovative technology solutions and measurable business results.'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Client Information */}
        {(clientName || clientIndustry || clientLocation) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Client Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {clientName && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Client</h4>
                      <p className="text-gray-800 text-sm sm:text-base">Client</p>
                    </div>
                  )}
                  {clientIndustry && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Industry</h4>
                      <p className="text-gray-800 text-sm sm:text-base">{clientIndustry}</p>
                    </div>
                  )}
                  {clientLocation && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Location</h4>
                      <p className="text-gray-800 flex items-center gap-1 text-sm sm:text-base">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        {clientLocation}
                      </p>
                    </div>
                  )}
                </div>
                {projectDuration && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <span className="font-semibold">Project Duration:</span>
                      <span className="text-gray-800">{projectDuration}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Project Objectives */}
        {objectives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Project Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {objectives.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{objective}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Challenges */}
        {challenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                  Challenges Addressed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <span className="text-orange-600 font-bold text-sm">#{index + 1}</span>
                      <span className="text-gray-800">{challenge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Solution Strategy */}
        {solutionStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Solution Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base lg:text-lg">{solutionStrategy}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features & Capabilities */}
        {featuresCapabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Key Features & Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuresCapabilities.map((feature: string, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* User Experience Design */}
        {caseStudy.userExperienceDesign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Experience Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 leading-relaxed">{caseStudy.userExperienceDesign}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Technologies Used */}
        {technologiesUsed && Array.isArray(technologiesUsed) && technologiesUsed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-white text-lg sm:text-xl">Technologies Used</CardTitle>
                    <p className="text-purple-100 text-sm mt-1">Cutting-edge tools powering this solution</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {technologiesUsed.map((tech: string, index: number) => (
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
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Implementation Process */}
        {implementationProcess.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Implementation Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {implementationProcess.map((phase: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-6 pb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Phase {index + 1}: {phase.phase}
                      </h4>
                      {phase.activities && (
                        <ul className="space-y-2">
                          {phase.activities.map((activity: string, actIndex: number) => (
                            <li key={actIndex} className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-800">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results & Impact */}
        {(Object.keys(quantitativeMetrics).length > 0 || qualitativeBenefits.length > 0 || caseStudy.businessOutcomes) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Results & Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quantitative Metrics */}
                {Object.keys(quantitativeMetrics).length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Quantitative Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(quantitativeMetrics).map(([key, value], index) => (
                        <div key={index} className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-600 mb-1">{String(value)}</div>
                          <div className="text-sm text-gray-800 capitalize">{key.replace(/_/g, ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qualitative Benefits */}
                {qualitativeBenefits.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Qualitative Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {qualitativeBenefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Business Outcomes */}
                {caseStudy.businessOutcomes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Outcomes</h4>
                    <p className="text-gray-800 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      {caseStudy.businessOutcomes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Client Testimonial */}
        {caseStudy.clientTestimonial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <div className="text-center">
                  <Quote className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <blockquote className="text-xl italic text-gray-800 leading-relaxed mb-4">
                    "{caseStudy.clientTestimonial}"
                  </blockquote>
                  {caseStudy.clientName && (
                    <div className="text-gray-800">
                      <strong>Client</strong>
                      {caseStudy.clientIndustry && ` • ${caseStudy.clientIndustry}`}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Future Scope & Conclusion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {futureScopeEnhancements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Future Scope & Enhancements</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{futureScopeEnhancements}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {conclusion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Conclusion</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{conclusion}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tags</h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-gray-300 text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                Let's discuss how we can help you achieve similar results with a customized solution for your business.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                onClick={() => window.location.href = '/contact'}
              >
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </>
  );
}