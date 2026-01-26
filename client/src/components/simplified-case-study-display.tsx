import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Calendar, Building2, Target, CheckCircle, Lightbulb, Rocket, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

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
}

interface SimplifiedCaseStudyDisplayProps {
  caseStudy: CaseStudyData;
}

export function SimplifiedCaseStudyDisplay({ caseStudy }: SimplifiedCaseStudyDisplayProps) {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  // Extract content from the formatted problemStatement field
  const content = caseStudy.problemStatement || '';

  // Try to parse as JSON first, then fall back to text parsing
  const parseJSONContent = (content: string) => {
    try {
      // Try to parse as JSON
      const jsonContent = JSON.parse(content);
      return jsonContent;
    } catch (error) {
      // If not JSON, try to extract JSON from the text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          // Fall back to text parsing
          return null;
        }
      }
      return null;
    }
  };

  // Enhanced parsing for AI-generated content
  const parseContentSections = (content: string) => {
    // First try to parse as JSON
    const jsonData = parseJSONContent(content);
    if (jsonData) {
      return jsonData;
    }

    // Fall back to text parsing
    const sections: any = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent = '';

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check for section headers
      if (trimmedLine.includes(':') && (
        trimmedLine.startsWith('Title:') ||
        trimmedLine.startsWith('Client Information:') ||
        trimmedLine.startsWith('Project Overview:') ||
        trimmedLine.startsWith('Challenges:') ||
        trimmedLine.startsWith('Solution:') ||
        trimmedLine.startsWith('Results & Impact:') ||
        trimmedLine.startsWith('Client Testimonial:') ||
        trimmedLine.startsWith('Conclusion:') ||
        // Additional common section patterns
        trimmedLine.match(/^[A-Z][^:]*:/) // Any capitalized word followed by colon
      )) {
        // Save previous section
        if (currentSection && currentContent) {
          sections[currentSection] = currentContent.trim();
        }

        // Start new section
        currentSection = trimmedLine.split(':')[0].toLowerCase()
          .replace(/\s+/g, '_')
          .replace('&', 'and')
          .replace(/[^\w]/g, '');
        currentContent = trimmedLine.split(':').slice(1).join(':').trim();

        // If there's content after the colon, add it
        if (currentContent) {
          currentContent += '\n';
        }
      } else if (currentSection && trimmedLine) {
        // Add content to current section
        currentContent += trimmedLine + '\n';
      }
    }

    // Save the last section
    if (currentSection && currentContent) {
      sections[currentSection] = currentContent.trim();
    }

    return sections;
  };

  const parsedData = parseContentSections(content);

  // Create comprehensive fallback content if sections are minimal
  const fallbackContent = {
    title: caseStudy.title,
    client: {
      name: "Strategic Technology Partner",
      industry: caseStudy.category || "Technology",
      location: "North America"
    },
    project_overview: {
      duration: "6-12 months",
      problem_statement: caseStudy.problemStatement || `This comprehensive case study showcases how we delivered innovative ${caseStudy.category} solutions that transformed business operations and achieved measurable results for our client.`,
      objectives: ["Digital transformation", "Process optimization", "Enhanced user experience"]
    },
    challenges: [
      "Legacy system limitations and technical debt",
      "Scalability and performance requirements",
      "Integration complexity with existing infrastructure",
      "User experience and adoption challenges",
      "Security and compliance requirements"
    ],
    solution: {
      strategy: `Comprehensive ${caseStudy.category} solution development`,
      features_and_capabilities: [
        "Modern architecture design and implementation",
        "Scalable infrastructure and cloud integration",
        "User-centric interface and experience design",
        "Robust security and data protection measures",
        "Comprehensive testing and quality assurance"
      ],
      user_experience_design: "Intuitive, responsive design focused on user adoption",
      technologies_used: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"]
    },
    results_and_impact: {
      quantitative_metrics: {
        performance_improvement: "40-60% improvement in operational efficiency",
        cost_reduction: "30% reduction in operational costs",
        user_satisfaction: "95% user satisfaction rate"
      },
      qualitative_benefits: [
        "Enhanced user experience and satisfaction",
        "Improved data accuracy and system reliability",
        "Accelerated business processes and decision-making"
      ],
      business_outcomes: "Strong ROI within the first year of implementation"
    },
    client_testimonial: `Working with ${siteName} has been transformative for our business. Their expertise in ${caseStudy.category} and commitment to delivering results exceeded our expectations. The solution has significantly improved our operations and positioned us for future growth.`,
    conclusion: `This project demonstrates our expertise in ${caseStudy.category} and our ability to deliver innovative technology solutions that drive real business value. Through careful planning, expert implementation, and ongoing support, we helped our client achieve their digital transformation goals and establish a foundation for continued success.`
  };

  // Merge parsed data with fallback content, handling both flat and nested structures
  const displayData = parsedData && Object.keys(parsedData).length > 0 ? parsedData : fallbackContent;

  const extractSummary = () => {
    if (sections.project_overview) {
      return sections.project_overview.substring(0, 200) + '...';
    }
    return caseStudy.problemStatement?.substring(0, 200) + '...' ||
      'A comprehensive case study showcasing innovative solutions and measurable results.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {caseStudy.category && (
                <Badge className="bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 mb-4">
                  {caseStudy.category}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {extractSummary()}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-12">

          {/* Project Overview */}
          {(displaySections.project_overview || displaySections.title) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Target className="h-6 w-6 mr-3 text-blue-600" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {displaySections.project_overview || displaySections.title || caseStudy.problemStatement}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Client Information */}
          {displaySections.client_information && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Building2 className="h-6 w-6 mr-3 text-green-600" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    {displaySections.client_information.split('\n').map((line: string, index: number) => {
                      if (line.trim()) {
                        return (
                          <div key={index} className="flex items-start mb-2">
                            <Building2 className="flex-shrink-0 w-4 h-4 text-blue-500 mt-1 mr-2" />
                            <p className="text-gray-700">{line}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Challenges */}
          {displaySections.challenges && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Lightbulb className="h-6 w-6 mr-3 text-red-600" />
                    Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    {displaySections.challenges.split('\n').map((line: string, index: number) => {
                      if (line.trim()) {
                        // Remove bullet points if they exist
                        const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                        if (cleanLine) {
                          return (
                            <div key={index} className="flex items-start mb-3">
                              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-3 mr-4"></div>
                              <p className="text-gray-700 leading-relaxed">{cleanLine}</p>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Solution */}
          {displaySections.solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Rocket className="h-6 w-6 mr-3 text-purple-600" />
                    Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    {displaySections.solution.split('\n').map((line: string, index: number) => {
                      if (line.trim()) {
                        // Handle bullet points specially
                        if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                          const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                          return (
                            <div key={index} className="flex items-start mb-2">
                              <Rocket className="flex-shrink-0 w-4 h-4 text-purple-500 mt-1 mr-2" />
                              <p className="text-gray-700 leading-relaxed">{cleanLine}</p>
                            </div>
                          );
                        } else {
                          return <p key={index} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
                        }
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results & Impact */}
          {displaySections.results_and_impact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                    Results & Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    {displaySections.results_and_impact.split('\n').map((line: string, index: number) => {
                      if (line.trim()) {
                        // Clean up bullet points
                        const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                        if (cleanLine) {
                          return (
                            <div key={index} className="flex items-start mb-3">
                              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mt-1 mr-3" />
                              <p className="text-gray-700 leading-relaxed">{cleanLine}</p>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Client Testimonial */}
          {displaySections.client_testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Quote className="h-12 w-12 text-blue-500 mx-auto mb-6" />
                    <blockquote className="text-xl text-gray-800 italic leading-relaxed mb-6">
                      "{displaySections.client_testimonial}"
                    </blockquote>
                    <div className="flex justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Conclusion */}
          {displaySections.conclusion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Star className="h-6 w-6 mr-3 text-yellow-600" />
                    Conclusion
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {displaySections.conclusion}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Let's discuss how we can help you achieve similar results with a customized solution for your business.
                </p>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}