import React, { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ContactSection } from "@/components/contact-section";
import { SEOAnalytics } from "@/components/seo-analytics";
import { ALL_SERVICES } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, Search, Users, Target, Award, ExternalLink, Loader2, Star } from "lucide-react";
import { GetInTouchSection } from "@/components/get-in-touch-section";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Service } from "@shared/schema";
import "@/styles/service-pages.css";

const categoryIcons: Record<string, string> = {
  "AI & Machine Learning": "🧠",
  "Web3 & Blockchain": "🔗",
  "Mobile Development": "📱",
  "Web Development": "🌐",
  "Enterprise Solutions": "🏢",
  "Cloud & DevOps": "☁️",
  "Automation & Testing": "🤖",
  "IoT & Security": "🔒",
  "Design & UX": "🎨"
};

const categoryColors: Record<string, string> = {
  "AI & Machine Learning": "from-blue-500 via-purple-500 to-pink-500",
  "Web3 & Blockchain": "from-green-500 via-blue-500 to-purple-500",
  "Mobile Development": "from-pink-500 via-red-500 to-orange-500",
  "Web Development": "from-blue-500 via-teal-500 to-green-500",
  "Enterprise Solutions": "from-purple-500 via-indigo-500 to-blue-500",
  "Cloud & DevOps": "from-cyan-500 via-blue-500 to-indigo-500",
  "Automation & Testing": "from-orange-500 via-red-500 to-pink-500",
  "IoT & Security": "from-red-500 via-pink-500 to-purple-500",
  "Design & UX": "from-purple-500 via-pink-500 to-red-500"
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Hero Section Component
function HeroSection() {
  return (
    <section className="service-hero">
      <div className="service-hero-content">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="service-hero-text"
        >
          <motion.h1 variants={fadeInUp} className="service-hero-title">
            Transform Your Business with Our{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Expert Services
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="service-hero-subtitle">
            Discover comprehensive solutions from our expert team and explore custom services tailored to your unique business needs
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button className="service-cta-button">
              <Target className="w-5 h-5 mr-2" />
              View All Services
            </Button>
            <Button variant="outline" className="service-outline-button">
              <Award className="w-5 h-5 mr-2" />
              Our Expertise
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section Component
function StatsSection({ totalServices, categories, adminServices }: { totalServices: number; categories: string[]; adminServices: number }) {
  const stats = [
    { label: "Core Services", value: totalServices.toString(), icon: Target },
    { label: "Service Categories", value: categories.length.toString(), icon: Award },
    { label: "Custom Solutions", value: adminServices.toString(), icon: Users }
  ];

  return (
    <section className="service-stats">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="service-stats-grid"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="service-stats-item">
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <div className="service-stats-value">{stat.value}</div>
              <div className="service-stats-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Services Loading Component
function ServicesLoading() {
  return (
    <div className="service-loading">
      <div className="service-loading-content">
        <Loader2 className="service-loading-spinner" />
        <p className="service-loading-text">Loading services...</p>
      </div>
    </div>
  );
}

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-categories");

  // Fetch admin-created services
  const { data: adminServices = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const groupedServices = ALL_SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof ALL_SERVICES>);

  // Get unique categories from admin services
  const adminCategories = Array.from(new Set(adminServices.map(service => service.category)));
  const allCategories = [...Object.keys(groupedServices), ...adminCategories];
  const uniqueCategories = Array.from(new Set(allCategories));

  // Filter admin services (check for both 'published' and 'active' status)
  const filteredAdminServices = adminServices.filter(service => {
    const matchesSearch = !searchTerm || 
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all-categories" || service.category === selectedCategory;
    return matchesSearch && matchesCategory && (service.status === 'published' || service.status === 'active');
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOAnalytics pageName="Services" />
      <Navigation />

      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection 
        totalServices={Object.keys(groupedServices).length} 
        categories={uniqueCategories} 
        adminServices={adminServices.length}
      />

      {/* Admin Services Section */}
      {filteredAdminServices.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
                Custom <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                Explore our specialized services designed to meet your unique business requirements
              </p>
            </motion.div>

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
                    placeholder="Search custom services..."
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
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Admin Services Grid */}
            {isLoading ? (
              <ServicesLoading />
            ) : (
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="service-grid"
              >
                {filteredAdminServices.map((service) => (
                  <motion.div key={service.id} variants={fadeInUp}>
                    <Card className="service-card group">
                      <CardContent className="service-card-content">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {service.category}
                          </span>
                        </div>
                        <h3 className="service-card-title">{service.title}</h3>
                        <p className="service-card-description">
                          {service.content ? service.content.substring(0, 150) + '...' : service.subCategory}
                        </p>
                        <div className="pt-4 border-t border-gray-100">
                          <Link href={`/services/${service.slug}`}>
                            <Button className="w-full service-cta-button group-hover:shadow-lg transition-all duration-300">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* No Admin Services Message */}
      {!isLoading && adminServices.length === 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 heading-georgia">Custom Services Coming Soon</h3>
              <p className="text-gray-600 mb-8 text-poppins">
                We're currently developing specialized custom services to meet your unique business needs. 
                Check back soon or explore our core services below.
              </p>
              <Button className="service-cta-button">
                <Award className="w-5 h-5 mr-2" />
                Explore Core Services
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Core Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Core <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Comprehensive technology solutions across 9 specialized categories to transform your business
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            {Object.entries(groupedServices).map(([category, services], categoryIndex) => {
              // Find admin services that match this category
              const matchingAdminServices = adminServices.filter(adminService => {
                // Map common category names to match admin services
                const categoryMap: { [key: string]: string[] } = {
                  "AI & Machine Learning": ["AI & Machine Learning", "Artificial Intelligence", "Machine Learning", "AI"],
                  "Web3 & Blockchain": ["Web3 & Blockchain", "Blockchain", "Web3", "Cryptocurrency"],
                  "Mobile Development": ["Mobile Development", "Mobile", "App Development"],
                  "Web Development": ["Web Development", "Web", "Frontend", "Backend", "Full Stack"],
                  "Enterprise Solutions": ["Enterprise Solutions", "Enterprise", "Business Solutions"],
                  "Cloud & DevOps": ["Cloud & DevOps", "Cloud", "DevOps", "Infrastructure"],
                  "Automation & Testing": ["Automation & Testing", "Testing", "QA", "Automation"],
                  "IoT & Security": ["IoT & Security", "IoT", "Security", "Cybersecurity"],
                  "Design & UX": ["Design & UX", "Design", "UX", "UI/UX", "User Experience"]
                };
                
                const allowedCategories = categoryMap[category] || [category];
                const isStatusValid = adminService.status === 'published' || adminService.status === 'active';
                return isStatusValid && allowedCategories.some(cat => 
                  adminService.category?.toLowerCase().includes(cat.toLowerCase()) ||
                  adminService.subCategory?.toLowerCase().includes(cat.toLowerCase())
                );
              });

              return (
                <motion.div key={category} variants={fadeInUp}>
                  <div className="mb-8">
                    <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${categoryColors[category]} text-white mb-6`}>
                      <span className="text-2xl mr-3">{categoryIcons[category]}</span>
                      <h3 className="text-xl font-bold">{category}</h3>
                      {matchingAdminServices.length > 0 && (
                        <span className="ml-3 px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded-full">
                          +{matchingAdminServices.length} Custom
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="service-grid">
                    {/* Core Services */}
                    {services.map((service, index) => (
                      <motion.div
                        key={service.title}
                        variants={fadeInUp}
                        custom={index}
                      >
                        <Card className="service-card group">
                          <CardContent className="service-card-content">
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[category]} rounded-lg flex items-center justify-center mb-4`}>
                                <span className="text-white text-xl">{categoryIcons[category]}</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                Core Service
                              </span>
                            </div>
                            <h4 className="service-card-title">{service.title}</h4>
                            <p className="service-card-description">{service.description}</p>
                            <div className="pt-4 border-t border-gray-100">
                              <Link href={`/services/${service.id}`}>
                                <Button className="w-full service-cta-button group-hover:shadow-lg transition-all duration-300">
                                  Learn More
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                    {/* Admin Services integrated into this category */}
                    {matchingAdminServices.map((adminService, index) => (
                      <motion.div
                        key={`admin-${adminService.id}`}
                        variants={fadeInUp}
                        custom={services.length + index}
                      >
                        <Card className="service-card group border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                          <CardContent className="service-card-content">
                            <div className="flex justify-between items-start mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[category]} rounded-lg flex items-center justify-center mb-4`}>
                                <Star className="text-white text-lg" />
                              </div>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                Custom Service
                              </span>
                            </div>
                            <h4 className="service-card-title">{adminService.title}</h4>
                            <p className="service-card-description">
                              {adminService.content ? 
                                adminService.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : 
                                adminService.subCategory
                              }
                            </p>
                            <div className="pt-4 border-t border-blue-200">
                              <Link href={`/services/${adminService.slug}`}>
                                <Button className="w-full service-cta-button group-hover:shadow-lg transition-all duration-300">
                                  Learn More
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <GetInTouchSection />
      <Footer />
    </div>
  );
}