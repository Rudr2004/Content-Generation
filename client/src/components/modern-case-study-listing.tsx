import React, { useState } from 'react';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search, Filter, Calendar, Building2, TrendingUp, Star, Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeContactSection } from './home-contact-section';
import { parseMarkdownToHtml } from '@/lib/markdown-utils';

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

interface ModernCaseStudyListingProps {
  caseStudies: CaseStudyData[];
  isLoading?: boolean;
}

export function ModernCaseStudyListing({ caseStudies, isLoading }: ModernCaseStudyListingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Filter case studies based on search and category
  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.metaDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || study.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(caseStudies.map(study => study.category).filter(Boolean)));

  // Extract preview content from problemStatement
  const getPreviewContent = (problemStatement: string) => {
    if (!problemStatement) return "Discover how we delivered innovative solutions and achieved measurable results for our client.";

    try {
      // Try to parse as JSON and extract relevant info
      const jsonMatch = problemStatement.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const content = parsed.project_overview?.problem_statement ||
          parsed.conclusion ||
          "Comprehensive case study showcasing innovative technology solutions.";
        
        // Parse markdown/HTML and then strip HTML for preview
        const htmlContent = parseMarkdownToHtml(content);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        return textContent.slice(0, 150) + (textContent.length > 150 ? "..." : "");
      }
    } catch (e) {
      // Fallback to text extraction
    }

    // Parse markdown/HTML content properly
    const htmlContent = parseMarkdownToHtml(problemStatement);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Extract first meaningful sentence
    const sentences = textContent.split('.').filter(s => s.trim().length > 20);
    return sentences[0] ? sentences[0] + '.' : textContent.slice(0, 150) + (textContent.length > 150 ? "..." : "");
  };

  // Extract key metrics from content
  const getKeyMetrics = (problemStatement: string) => {
    try {
      const jsonMatch = problemStatement.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const metrics = parsed.results_and_impact?.quantitative_metrics;
        if (metrics) {
          return Object.values(metrics).slice(0, 2) as string[];
        }
      }
    } catch (e) {
      // Fallback metrics
    }
    return ["Improved efficiency", "Enhanced user experience"];
  };

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

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
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
    rest: {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: {
      scale: 1.02,
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case studies...</p>
        </div>
      </div>
    );
  }

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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center mb-8 sm:mb-12 mt-10 sm:mt-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent px-4 sm:px-0"
            >
              Success Stories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              Discover how we've helped businesses transform their operations and achieve remarkable results through innovative technology solutions.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20 text-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">{caseStudies.length}+</p>
              <p className="text-sm sm:text-base text-blue-200">Success Stories</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20 text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">95%</p>
              <p className="text-sm sm:text-base text-blue-200">Client Satisfaction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20 text-center sm:col-span-2 md:col-span-1">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">{categories.length}+</p>
              <p className="text-sm sm:text-base text-blue-200">Industries Served</p>
            </div>
          </motion.div>
          <div className='flex justify-center items-center mt-6 sm:mt-8 px-4 sm:px-0'>
            <Button
              size="lg"
              onClick={scrollToContact}
              className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              Start Your Project
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search case studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base lg:text-lg"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 z-10" />
                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                  <SelectTrigger className="w-full pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base lg:text-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="All Categories" className="text-gray-700" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-lg">
                    <SelectItem 
                      value="all" 
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">All Categories</span>
                      </div>
                    </SelectItem>
                    {categories.map(category => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <span className="font-medium text-gray-700">{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredCaseStudies.map((caseStudy, index) => {
              const metrics = getKeyMetrics(caseStudy.problemStatement || '');
              const preview = getPreviewContent(caseStudy.problemStatement || '');

              return (
                <motion.div
                  key={caseStudy.id}
                  variants={cardVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  onHoverStart={() => setHoveredCard(caseStudy.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    variants={cardHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    className="h-full"
                  >
                    <Card className="h-full border-0 bg-white/90 backdrop-blur-sm overflow-hidden group cursor-pointer">
                      {/* Card Header with Gradient */}
                      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          {caseStudy.category && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">
                              <Building2 className="w-3 h-3 mr-1" />
                              {caseStudy.category}
                            </Badge>
                          )}
                          {caseStudy.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                          {caseStudy.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                          {preview}
                        </p>

                        {/* Key Metrics Preview */}
                        {metrics.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Results:</h4>
                            <div className="space-y-2">
                              {metrics.map((metric, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">{metric}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {caseStudy.publishedAt ?
                                new Date(caseStudy.publishedAt).toLocaleDateString() :
                                new Date(caseStudy.createdAt || '').toLocaleDateString()
                              }
                            </span>
                          </div>

                          <Link href={`/case-studies/${caseStudy.slug}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Study
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredCaseStudies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No case studies found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          {/* <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Join the growing list of successful businesses that have transformed their operations with our innovative solutions.
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Project
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </CardContent>
          </Card> */}
        </motion.div>
      </motion.div>
      <div id="contact">
        <HomeContactSection />
      </div>
    </div>
  );
}