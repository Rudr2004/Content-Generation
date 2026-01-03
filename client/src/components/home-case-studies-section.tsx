import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Building, Globe, Brain, Smartphone, ShoppingCart, Shield, Zap, Code, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CaseStudyCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CaseStudyPage {
  id: number;
  title: string;
  slug: string;
  category: string; // This is a text field with category name, not ID
  problemStatement?: string;
  businessOutcomes?: string;
  clientName?: string;
  clientIndustry?: string;
  metaDescription?: string;
  status: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('ai') || name.includes('machine learning') || name.includes('artificial intelligence')) {
    return Brain;
  }
  if (name.includes('web3') || name.includes('blockchain') || name.includes('defi') || name.includes('crypto')) {
    return Globe;
  }
  if (name.includes('mobile') || name.includes('app') || name.includes('ios') || name.includes('android')) {
    return Smartphone;
  }
  if (name.includes('enterprise') || name.includes('business') || name.includes('corporate')) {
    return Building;
  }
  if (name.includes('ecommerce') || name.includes('e-commerce') || name.includes('retail')) {
    return ShoppingCart;
  }
  if (name.includes('security') || name.includes('cybersecurity') || name.includes('fintech')) {
    return Shield;
  }
  if (name.includes('automation') || name.includes('integration')) {
    return Zap;
  }
  return Code; // Default icon
};

// Get category color scheme
const getCategoryColorScheme = (index: number) => {
  const schemes = [
    {
      bg: "from-blue-500 to-purple-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverBg: "hover:from-blue-600 hover:to-purple-700"
    },
    {
      bg: "from-green-500 to-teal-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      hoverBg: "hover:from-green-600 hover:to-teal-700"
    },
    {
      bg: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      hoverBg: "hover:from-purple-600 hover:to-pink-700"
    },
    {
      bg: "from-orange-500 to-red-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      hoverBg: "hover:from-orange-600 hover:to-red-700"
    },
    {
      bg: "from-indigo-500 to-blue-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      hoverBg: "hover:from-indigo-600 hover:to-blue-700"
    },
    {
      bg: "from-pink-500 to-rose-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      hoverBg: "hover:from-pink-600 hover:to-rose-700"
    }
  ];
  return schemes[index % schemes.length];
};

export function HomeCaseStudiesSection() {
  // ...existing code...
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch case study categories
  const { data: categoriesRaw = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/case-study-categories"],
    queryFn: () => fetch("/api/case-study-categories").then(res => res.json()),
  });

  // Fetch published case study pages
  const { data: caseStudiesRaw = [], isLoading: caseStudiesLoading } = useQuery({
    queryKey: ["/api/case-study-pages/published"],
    queryFn: () => fetch("/api/case-study-pages/published").then(res => res.json()),
  });

  // Normalize API responses to arrays (some endpoints return { data: [...] } or similar)
  const categoriesArray: CaseStudyCategory[] = Array.isArray(categoriesRaw)
    ? categoriesRaw
    : (categoriesRaw && Array.isArray((categoriesRaw as any).data) ? (categoriesRaw as any).data : []);

  const caseStudiesArray: CaseStudyPage[] = Array.isArray(caseStudiesRaw)
    ? caseStudiesRaw
    : (caseStudiesRaw && Array.isArray((caseStudiesRaw as any).data) ? (caseStudiesRaw as any).data : []);

  // Filter active categories with published case studies
  const activeCategories = categoriesArray.filter((cat: CaseStudyCategory) =>
    cat.status === 'active' &&
    caseStudiesArray.some((cs: CaseStudyPage) => cs.category === cat.name)
  );

  // Group case studies by category
  const caseStudiesByCategory = activeCategories.reduce((acc: any, category: CaseStudyCategory) => {
    acc[category.id] = caseStudiesArray.filter((cs: CaseStudyPage) => cs.category === category.name).slice(0, 3); // Limit to 3 per category
    return acc;
  }, {});
  // ...existing code...

  // Set first category as active by default
  useEffect(() => {
    if (activeCategories.length > 0 && activeCategory === null) {
      setActiveCategory(activeCategories[0].id);
    }
  }, [activeCategories, activeCategory]);

  // Navigation functions for mobile carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeCategories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeCategories.length) % activeCategories.length);
  };

  if (categoriesLoading || caseStudiesLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-8 shadow-lg">
              <Building className="w-5 h-5 mr-2 animate-pulse" />
              Loading Success Stories...
            </div>
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded-lg w-128 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white shadow-lg rounded-2xl animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activeCategories.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-8 shadow-lg">
            <Building className="mr-2 h-4 w-4" />
            Success Stories
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 heading-georgia">
            Transforming Businesses Across Industries
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-poppins">
            Explore our portfolio of successful AI and technology implementations that have delivered measurable results for our clients
          </p>
        </motion.div>

        {/* Desktop: Category Tabs + Case Studies */}
        <div className="hidden md:block">
          {/* Category Navigation */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {activeCategories.map((category: CaseStudyCategory, index: number) => {
              const Icon = getCategoryIcon(category.name);
              const colorScheme = getCategoryColorScheme(index);
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    group flex items-center px-4 py-3 lg:px-6 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-300 
                    ${isActive
                      ? `bg-gradient-to-r ${colorScheme.bg} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg mr-3 transition-all duration-300 
                    ${isActive ? 'bg-white/20' : `${colorScheme.iconBg} group-hover:bg-opacity-80`}
                  `}>
                    <Icon className={`
                      w-4 h-4 lg:w-5 lg:h-5 transition-colors duration-300
                      ${isActive ? 'text-white' : colorScheme.iconColor}
                    `} />
                  </div>
                  <span className="truncate">{category.name}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Case Studies Display */}
          <AnimatePresence mode="wait">
            {activeCategory && caseStudiesByCategory[activeCategory] && (
              <motion.div
                key={activeCategory}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {caseStudiesByCategory[activeCategory].map((caseStudy: CaseStudyPage, index: number) => {
                  const colorScheme = getCategoryColorScheme(index);

                  return (
                    <Card
                      key={caseStudy.id}
                      className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-2xl overflow-hidden hover:-translate-y-2 transform"
                    >
                      {/* Clean Header Section */}
                      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Building className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 text-center px-4">{caseStudy.category || 'Success Story'}</h3>
                          {caseStudy.clientIndustry && (
                            <p className="text-sm text-slate-500 mt-1">{caseStudy.clientIndustry}</p>
                          )}
                        </div>

                        {/* Clean Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white text-slate-700 border-0 rounded-lg px-3 py-1 text-xs font-medium shadow-sm">
                            {caseStudy.category || 'Case Study'}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Clean Title */}
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {caseStudy.title}
                        </h3>

                        {/* Clean Description */}
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {caseStudy.metaDescription || caseStudy.businessOutcomes || "Discover how we delivered exceptional results for our client through innovative technology solutions."}
                        </p>

                        {/* Client Info - Simple and Clean */}
                        {caseStudy.clientName && (
                          <div className="flex items-center text-sm text-slate-500 mb-4">
                            <Building className="w-4 h-4 mr-2" />
                            <span>{caseStudy.clientName}</span>
                          </div>
                        )}

                        {/* Clean CTA Button */}
                        <Link href={`/case-studies/${caseStudy.slug}`}>
                          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group/btn">
                            Read Case Study
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: Grid View */}
        <div className="md:hidden">
          <div className="relative">
            {/* Mobile Category Filter - Grid Layout */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {activeCategories.map((category: CaseStudyCategory, index: number) => {
                  const colorScheme = getCategoryColorScheme(index);
                  const isActive = currentSlide === index;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setCurrentSlide(index)}
                      className={`
                        px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap
                        ${isActive
                          ? `bg-gradient-to-r ${colorScheme.bg} text-white shadow-lg`
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md'
                        }
                      `}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Case Studies */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeCategories[currentSlide] && caseStudiesByCategory[activeCategories[currentSlide].id] &&
                  caseStudiesByCategory[activeCategories[currentSlide].id].map((caseStudy: CaseStudyPage, index: number) => {
                    const colorScheme = getCategoryColorScheme(currentSlide);

                    return (
                      <Card
                        key={caseStudy.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300"
                      >
                        {/* Clean Mobile Header */}
                        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-700 text-center px-4">{caseStudy.category || 'Success Story'}</h3>
                            {caseStudy.clientIndustry && (
                              <p className="text-xs text-slate-500 mt-1">{caseStudy.clientIndustry}</p>
                            )}
                          </div>

                          {/* Clean Category Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white text-slate-700 border-0 rounded-lg px-2 py-1 text-xs font-medium shadow-sm">
                              {caseStudy.category || 'Case Study'}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Mobile Title */}
                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                            {caseStudy.title}
                          </h3>

                          {/* Mobile Description */}
                          <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                            {caseStudy.metaDescription || caseStudy.businessOutcomes || "Discover how we delivered exceptional results for our client."}
                          </p>

                          {/* Mobile Client Info */}
                          {caseStudy.clientName && (
                            <div className="flex items-center text-sm text-slate-500 mb-3">
                              <Building className="w-3 h-3 mr-1" />
                              <span className="text-xs">{caseStudy.clientName}</span>
                            </div>
                          )}

                          {/* Mobile CTA Button */}
                          <Link href={`/case-studies/${caseStudy.slug}`}>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg font-medium text-xs hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group/btn">
                              Read Case Study
                              <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })
                }
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* View All Case Studies CTA */}
        <motion.div
          className="text-center mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/case-studies">
            <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-full px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              View All Case Studies
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}