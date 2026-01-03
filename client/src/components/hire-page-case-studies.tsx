import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, Code, Users, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  clientName?: string;
  clientIndustry?: string;
  clientLocation?: string;
  problemStatement?: string;
  solutionOverview?: string;
  keyResults?: string;
  slug?: string;
  imageUrl?: string;
  technologies?: string[];
  metrics?: Record<string, string>;
  // Additional parsed fields
  projectOverview?: string;
  challenges?: string;
  solution?: string;
  businessOutcomes?: string;
}

interface HirePageCaseStudiesProps {
  selectedCaseStudyIds?: string;
  title?: string;
  className?: string;
}

export function HirePageCaseStudies({ selectedCaseStudyIds, title = "Success Stories", className = "" }: HirePageCaseStudiesProps) {
  // Parse selected case study IDs
  const caseStudyIds = selectedCaseStudyIds ? JSON.parse(selectedCaseStudyIds) : [];

  // Helper function to parse case study content
  const parseCaseStudyData = (caseStudy: any) => {
    let parsedData: any = {};

    // Try to parse problemStatement as JSON first (it might contain the structured data)
    if (caseStudy.problemStatement) {
      try {
        // Check if it starts with JSON structure
        if (caseStudy.problemStatement.trim().startsWith('{')) {
          parsedData = JSON.parse(caseStudy.problemStatement);
        } else {
          // If it's plain text, use it as description
          parsedData.description = caseStudy.problemStatement;
        }
      } catch (e) {
        // If parsing fails, use as plain text
        parsedData.description = caseStudy.problemStatement;
      }
    }

    // Use parsed data with fallbacks to original fields
    return {
      id: caseStudy.id,
      title: parsedData.title || caseStudy.title,
      category: caseStudy.category,
      slug: caseStudy.slug,
      imageUrl: parsedData.imageUrl || caseStudy.imageUrl,
      clientName: parsedData.client?.name || caseStudy.clientName,
      clientIndustry: parsedData.client?.industry || caseStudy.clientIndustry,
      clientLocation: parsedData.client?.location,
      problemStatement: parsedData.problemStatement || parsedData.description || caseStudy.solutionOverview,
      technologies: parsedData.technologies || caseStudy.technologies || [],
      keyResults: parsedData.keyResults || parsedData.results || caseStudy.keyResults,
      metrics: parsedData.metrics || caseStudy.metrics || {},
      // Additional parsed fields
      projectOverview: parsedData.projectOverview,
      challenges: parsedData.challenges,
      solution: parsedData.solution,
      businessOutcomes: parsedData.businessOutcomes,
    };
  };

  // Fetch case studies by IDs
  const { data: rawCaseStudies = [], isLoading } = useQuery({
    queryKey: ['case-studies', caseStudyIds],
    queryFn: async () => {
      if (!caseStudyIds.length) return [];

      const promises = caseStudyIds.map(async (id: string) => {
        const response = await fetch(`/api/case-study-pages/${id}`);
        if (!response.ok) return null;
        return response.json();
      });

      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    enabled: caseStudyIds.length > 0
  });

  // Parse the case studies data
  const caseStudies = rawCaseStudies.map(parseCaseStudyData);

  // Animation variants
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (!caseStudyIds.length || (!isLoading && !caseStudies.length)) {
    return null;
  }

  if (isLoading) {
    return (
      <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50/20 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-8 shadow-lg">
            <Users className="w-5 h-5 mr-2" />
            Success Stories
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Related Case Studies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real projects, real results. See how we've helped companies like yours transform their business through innovative development.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {caseStudies.map((caseStudy: CaseStudy, index: number) => (
            <motion.div key={caseStudy.id} variants={fadeInUp}>
              <Card className="group h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30">
                {/* Image/Visual Header */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  {caseStudy.imageUrl ? (
                    <img
                      src={caseStudy.imageUrl}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Code className="w-12 h-12 mx-auto mb-2 opacity-90" />
                        <div className="text-sm font-medium opacity-90">Case Study</div>
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <Badge className="absolute top-4 left-4 bg-white/95 text-gray-800 border-0 shadow-sm">
                    {caseStudy.category}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {caseStudy.title}
                  </h3>

                  {/* Client Info */}
                  {caseStudy.clientName && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-800 font-semibold">{caseStudy.clientName}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {caseStudy.problemStatement && (
                          <Badge variant="outline" className="text-xs mr-2">
                            {caseStudy.problemStatement}
                          </Badge>
                        )}
                        {caseStudy.clientLocation && (
                          <span className="text-xs text-gray-500">📍 {caseStudy.clientLocation}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Overview/Problem Statement */}
                  {(caseStudy.projectOverview || caseStudy.problemStatement) && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {caseStudy.projectOverview || caseStudy.problemStatement}
                    </p>
                  )}

                  {/* Key Results/Business Outcomes */}
                  {(caseStudy.keyResults || caseStudy.businessOutcomes) && (
                    <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                      <p className="text-green-800 text-xs font-medium mb-1">🎯 Key Results</p>
                      <p className="text-green-700 text-sm line-clamp-2">
                        {caseStudy.keyResults || caseStudy.businessOutcomes}
                      </p>
                    </div>
                  )}

                  {/* Technologies */}
                  {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {caseStudy.technologies.slice(0, 3).map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {caseStudy.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{caseStudy.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Key Metrics */}
                  {caseStudy.metrics && Object.keys(caseStudy.metrics).length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      {Object.entries(caseStudy.metrics).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-blue-600">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300"
                    onClick={() => {
                      if (caseStudy.slug) {
                        window.open(`/case-studies/${caseStudy.slug}`, '_blank');
                      }
                    }}
                  >
                    <span>View Case Study</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {caseStudies.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              onClick={() => window.open('/case-studies', '_blank')}
            >
              <Zap className="w-5 h-5 mr-2" />
              View All Case Studies
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}