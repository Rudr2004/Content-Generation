import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building2, MapPin, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'wouter';

interface CaseStudyGridProps {
  caseStudies: any[];
  searchTerm: string;
  selectedCategory: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export function CaseStudyGrid({ caseStudies, searchTerm, selectedCategory }: CaseStudyGridProps) {
  // Filter case studies based on search and category
  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesSearch = !searchTerm || 
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || study.industry === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['All', ...Array.from(new Set(caseStudies.map(study => study.industry)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Results count */}
      <div className="mb-8">
        <p className="text-gray-600">
          Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Case Studies Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {filteredCaseStudies.map((study, index) => (
          <motion.div key={study.id || index} variants={fadeInUp}>
            <Card className="group h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={study.image} 
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Featured badge */}
                {study.featured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-white border-0">
                    Featured
                  </Badge>
                )}
                
                {/* Industry badge */}
                <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800 border-0">
                  {study.industry}
                </Badge>
              </div>

              <CardContent className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {study.title}
                </h3>
                
                {/* Subtitle */}
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {study.subtitle}
                </p>

                {/* Client info */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>{study.client}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{study.country}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {tag}
                    </Badge>
                  ))}
                  {study.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{study.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {Object.entries(study.metrics).slice(0, 3).map(([key, value], metricIndex) => (
                    <div key={metricIndex} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="font-bold text-blue-600 text-sm">{value as string}</div>
                      <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 group"
                >
                  <Link href={`/case-studies/${study.slug}`} className="flex items-center justify-center">
                    View Case Study
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state */}
      {filteredCaseStudies.length === 0 && (
        <motion.div 
          className="text-center py-16"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-gray-400 mb-4">
            <Building2 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No case studies found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find relevant case studies.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Reset Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}