import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, TrendingUp, Award, Target, Clock, Users, Building } from "lucide-react";
import { Link } from "wouter";

interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
  status: string;
  publishedDate?: string;
  publishedAt?: string;
  industry?: string;
  projectType?: string;
  clientName?: string;
  duration?: string;
  teamSize?: string;
  metrics?: Array<{
    label: string;
    value: string;
    improvement?: string;
  }>;
}

interface ServiceCaseStudiesProps {
  categoryName: string;
  className?: string;
}

export function ServiceCaseStudies({ categoryName, className = "" }: ServiceCaseStudiesProps) {
  const [caseStudies, setCaseStudies] = React.useState<CaseStudy[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCaseStudies() {
      if (!categoryName) return;

      try {
        const response = await fetch(
          `/api/case-study-pages/category/${encodeURIComponent(categoryName)}`
        );

        if (response.ok) {
          const data = await response.json();
          setCaseStudies(data.slice(0, 3)); // Show only 3 case studies
        }
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudies();
  }, [categoryName]);

  if (loading) {
    return (
      <section className={`py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-128 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (caseStudies.length === 0) {
    return null; // Don't render section if no case studies
  }

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-8 shadow-lg">
            <Users className="w-5 h-5 mr-2" />
            Success Stories
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Success Stories
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how we've helped businesses achieve remarkable success with our proven expertise.
          </p>
        </div>

        {/* Case Studies Grid with modern layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {caseStudies.map((caseStudy, index) => (
            <div key={caseStudy.id}>
              <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-2xl hover:-translate-y-2 transform">
                {/* Clean Header Section */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  {caseStudy.imageUrl ? (
                    <img
                      src={caseStudy.imageUrl}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700">{categoryName}</h3>
                      <p className="text-sm text-slate-500 mt-1">Case Study</p>
                    </div>
                  )}

                  {/* Clean Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-slate-700 border-0 rounded-lg px-3 py-1 text-xs font-medium shadow-sm">
                      {caseStudy.category || categoryName}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Clean Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {caseStudy.title}
                  </h3>

                  {/* Clean Excerpt */}
                  {caseStudy.excerpt && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {caseStudy.excerpt}
                    </p>
                  )}

                  {/* Client Info - Simple and Clean */}
                  {caseStudy.clientName && (
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{caseStudy.clientName}</span>
                    </div>
                  )}

                  {/* Clean Metrics */}
                  {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {caseStudy.metrics.slice(0, 2).map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-center p-3 bg-slate-50 rounded-lg border">
                          <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                          <div className="text-xs text-slate-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Clean Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseStudy.industry && (
                      <Badge variant="outline" className="text-xs text-slate-600 border-slate-200">
                        {caseStudy.industry}
                      </Badge>
                    )}
                    {caseStudy.projectType && (
                      <Badge variant="outline" className="text-xs text-slate-600 border-slate-200">
                        {caseStudy.projectType}
                      </Badge>
                    )}
                  </div>

                  {/* Clean CTA Button */}
                  <Link href={`/case-studies/${caseStudy.slug}`}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group/btn">
                      Read Full Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="/case-studies">
            <Button
              variant="outline"
              size="lg"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 group rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl"
              data-testid="button-view-all-case-studies"
            >
              View All Case Studies
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}