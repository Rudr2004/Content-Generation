import { useState } from "react";
import { motion } from "framer-motion";
import UserServiceNavigation from "@/components/user-service-navigation";
import ServiceContentDisplay from "@/components/service-content-display";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, ExternalLink, Loader2, Building2, Target, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { Service } from "@shared/schema";

// Animation variants
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

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Professional Services Portfolio
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 heading-georgia">
              Our <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Services</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 mb-8 text-poppins leading-relaxed">
              Comprehensive digital solutions designed to accelerate your business growth and transformation.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection({ totalServices, categories }: { totalServices: number, categories: string[] }) {
  const stats = [
    {
      icon: <Building2 className="w-8 h-8" />,
      value: totalServices.toString(),
      label: "Professional Services"
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: categories.length.toString(),
      label: "Service Categories"
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "500+",
      label: "Successful Projects"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600">
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 heading-georgia">{stat.value}</div>
              <div className="text-gray-600 text-poppins">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {service.category}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {service.subCategory}
              </Badge>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-poppins group-hover:text-blue-600 transition-colors duration-300">
              {service.title}
            </h3>
            
            {service.excerpt && (
              <p className="text-gray-600 text-sm mb-4 text-poppins leading-relaxed line-clamp-3">
                {service.excerpt}
              </p>
            )}
          </div>

          {/* Keywords Preview */}
          {service.primaryKeyword && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-blue-500 text-white text-xs">
                  {service.primaryKeyword}
                </Badge>
                {service.secondaryKeywords && 
                  service.secondaryKeywords.split(',').slice(0, 2).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-300">
                      {keyword.trim()}
                    </Badge>
                  ))
                }
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <Link href={`/services/${service.slug}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Loading Component
function ServicesLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="h-64 animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ServicesListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showServiceContent, setShowServiceContent] = useState(false);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", searchTerm, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      const response = await fetch(`/api/services?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(services.map(service => service.category)));
  
  // Filter services on frontend as well
  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all-categories" || service.category === selectedCategory;
    return matchesSearch && matchesCategory && service.status === 'published';
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection totalServices={services.length} categories={categories} />
      
      {/* Enhanced Services Section with Navigation */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Show service content if a page is selected */}
          {showServiceContent && selectedPage && (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-12"
            >
              <ServiceContentDisplay
                page={selectedPage}
                service={selectedService}
                onBack={() => {
                  setShowServiceContent(false);
                  setSelectedPage(null);
                  setSelectedService(null);
                }}
                className="max-w-4xl mx-auto"
              />
            </motion.div>
          )}

          {/* Show navigation and services grid when not viewing content */}
          {!showServiceContent && (
            <>
              {/* Enhanced layout with service navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                {/* User Service Navigation */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                  >
                    <UserServiceNavigation
                      className="sticky top-6"
                      onPageClick={(page, service) => {
                        setSelectedPage(page);
                        setSelectedService(service);
                        setShowServiceContent(true);
                      }}
                      onCategoryClick={(category) => {
                        // Handle category click - could show category overview
                        console.log('Category clicked:', category);
                      }}
                      onSubcategoryClick={(subcategory) => {
                        // Handle subcategory click - could show subcategory overview
                        console.log('Subcategory clicked:', subcategory);
                      }}
                    />
                  </motion.div>
                </div>

                {/* Main Services Content */}
                <div className="lg:col-span-3">
                  <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-8"
                  >
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Our Services</h3>
                      <p className="text-gray-600 mb-6 text-sm">
                        Use the navigation on the left to explore our service categories, subcategories, and pages. Click on any item to explore our services. 
                        You can also search and filter services below.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}

          {/* Original search and filters - only show when not viewing content */}
          {!showServiceContent && (
            <>
              {/* Search and Filters */}
              <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 bg-white"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 h-12 border-gray-300 focus:border-blue-500 bg-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Services Grid */}
          {isLoading ? (
            <ServicesLoading />
          ) : filteredServices.length === 0 ? (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 heading-georgia">No Services Found</h3>
                <p className="text-gray-600 mb-8 text-poppins">
                  {services.length === 0 
                    ? "No services are currently available. Please check back later."
                    : "No services match your search criteria. Try adjusting your filters."
                  }
                </p>
                {(searchTerm || (selectedCategory && selectedCategory !== "all-categories")) && (
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all-categories");
                    }}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          )}

          {/* Results Count */}
          {!isLoading && filteredServices.length > 0 && (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mt-12"
            >
              <p className="text-gray-600 text-poppins">
                Showing {filteredServices.length} of {services.length} services
              </p>
            </motion.div>
          )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}