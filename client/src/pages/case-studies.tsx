import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Calendar, Building2, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  category?: string;
  problemStatement?: string;
  status: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
}

const categories = [
  'All Categories',
  'AI & Machine Learning',
  'Web3 & Blockchain', 
  'Mobile Development',
  'Web Development',
  'E-commerce',
  'Enterprise Solutions',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Digital Transformation'
];

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const { data: caseStudies = [], isLoading, error } = useQuery({
    queryKey: ['/api/case-study-pages/published'],
  });

  // Filter case studies based on search and category
  const filteredCaseStudies = caseStudies.filter((caseStudy: CaseStudy) => {
    const matchesSearch = caseStudy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (caseStudy.problemStatement && caseStudy.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || caseStudy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const extractSummary = (content: string) => {
    if (!content) return 'Explore this comprehensive case study showcasing innovative solutions and measurable results.';
    
    // Try to extract the problem statement or first meaningful content
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('Problem Statement:')) {
        const summary = line.split('Problem Statement:')[1]?.trim();
        if (summary && summary.length > 50) {
          return summary.substring(0, 150) + '...';
        }
      }
    }
    
    // Fallback to first substantial line
    const firstLine = lines.find(line => line.trim().length > 50);
    return firstLine ? firstLine.substring(0, 150) + '...' : 'Explore this comprehensive case study showcasing innovative solutions and measurable results.';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Case Studies
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover how we've transformed businesses across industries with innovative technology solutions, 
              delivering measurable results and driving digital transformation.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Case Studies Grid */}
        {filteredCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((caseStudy: CaseStudy, index: number) => (
              <motion.div
                key={caseStudy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      {caseStudy.category && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {caseStudy.category}
                        </Badge>
                      )}
                      {caseStudy.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {caseStudy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {extractSummary(caseStudy.problemStatement || '')}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {caseStudy.publishedAt 
                          ? new Date(caseStudy.publishedAt).toLocaleDateString()
                          : new Date(caseStudy.createdAt || '').toLocaleDateString()
                        }
                      </div>
                      
                      <Link href={`/case-studies/${caseStudy.slug}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Case Studies Found
            </h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'All Categories' 
                ? 'Try adjusting your search criteria or category filter.'
                : 'We\'re working on adding more case studies. Check back soon!'
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        {filteredCaseStudies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Let's discuss how we can help you achieve similar results with a customized solution for your business.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}