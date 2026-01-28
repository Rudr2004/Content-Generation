import { useState, useEffect } from "react";
import { useParams, useRoute } from "wouter";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowRight, CheckCircle, Star, Contact, Sparkles, Building, Users, Award, Clock, Target, Shield, Zap, TrendingUp, DollarSign, Globe } from "lucide-react";
import { HomeContactSection } from "@/components/home-contact-section";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import { parseMarkdownToHtml } from "@/lib/markdown-utils";

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
function HeroSection({ service }: { service: Service }) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center overflow-hidden">
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
                {service.category} → {service.subCategory}
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp} 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 heading-georgia"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHtml(service.title || '')
              }}
            />

            <motion.p 
              variants={fadeInUp} 
              className="text-xl md:text-2xl text-gray-600 mb-8 text-poppins leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHtml(service.excerpt || service.metaDescription || "Professional solutions tailored to accelerate your business growth and digital transformation.")
              }}
            />

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
                onClick={() => {
                  const contactSection = document.getElementById('contact-section');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Contact className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const features = [
    {
      icon: <Building className="w-8 h-8" />,
      title: "Industry Expertise",
      description: "Deep domain knowledge and proven track record across various industries and business challenges."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Certified professionals with extensive experience in cutting-edge technologies and methodologies."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "Rigorous testing, quality assurance, and best practices ensure superior results every time."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "On-Time Delivery",
      description: "Transparent project management with regular updates and commitment to meeting deadlines."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 heading-georgia">
            Why Choose Our Services?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
            We combine industry expertise with innovative approaches to deliver exceptional solutions that drive measurable results.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-poppins">{feature.title}</h3>
                  <p className="text-gray-600 text-poppins leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Animated Section Component
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerChildren}
    >
      {children}
    </motion.div>
  );
}

// Service Details Section (card layout matching reference image)
function ServiceDetailsSection({ content }: { content: string }) {
  // Parse HTML content to extract sections and create service cards
  const parseContentToServices = (htmlContent: string) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const sections = [];
    const h2Elements = tempDiv.querySelectorAll('h2');

    // Icons for different service types (blue colored)
    const serviceIcons = [
      <Globe className="w-6 h-6" />,
      <Zap className="w-6 h-6" />,
      <Shield className="w-6 h-6" />,
      <Users className="w-6 h-6" />,
      <Target className="w-6 h-6" />,
      <Award className="w-6 h-6" />
    ];

    h2Elements.forEach((h2, index) => {
      const title = h2.textContent || '';
      let paragraphs = [];
      let features: string[] = [];
      let nextElement = h2.nextElementSibling;

      // Collect content until next h2 or end
      while (nextElement && nextElement.tagName !== 'H2') {
        if (nextElement.tagName === 'P') {
          const text = nextElement.textContent || '';
          if (text.trim()) {
            paragraphs.push(text.trim());
          }
        } else if (nextElement.tagName === 'UL') {
          const listItems = nextElement.querySelectorAll('li');
          listItems.forEach(li => {
            if (li.textContent && li.textContent.trim()) {
              features.push(li.textContent.trim());
            }
          });
        }
        nextElement = nextElement.nextElementSibling;
      }

      // Use the first paragraph as description
      const description = paragraphs.length > 0 ? paragraphs.join(' ') : '';

      sections.push({
        title,
        description,
        icon: serviceIcons[index % serviceIcons.length],
        features: features.slice(0, 5) // Show up to 5 features
      });
    });

    // If no h2 sections found, parse the entire content
    if (sections.length === 0) {
      // Extract paragraphs and lists from entire content
      const allParagraphs = tempDiv.querySelectorAll('p');
      const allLists = tempDiv.querySelectorAll('ul li');

      const description = Array.from(allParagraphs)
        .map(p => p.textContent)
        .filter(text => text && text.trim())
        .join(' ');

      const features = Array.from(allLists)
        .map(li => li.textContent)
        .filter(text => text && text.trim())
        .slice(0, 5);

      sections.push({
        title: 'Service Overview',
        description: description || 'Professional service tailored to your business needs.',
        icon: <Target className="w-6 h-6" />,
        features
      });
    }

    return sections;
  };

  const services = parseContentToServices(content);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Comprehensive Service Offerings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              From consultation to deployment, we offer end-to-end solutions that drive real business value.
            </p>
          </motion.div>
          {/* Grid for services */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-lg flex flex-col">
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <div className="text-blue-600">{service.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm flex-1">
                      {service.description}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Key Features Section
function KeyFeaturesSection() {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Engineering",
      description: "Meticulously crafted solutions designed to meet your exact specifications and requirements."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security protocols and compliance with industry standards for complete data protection."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High Performance",
      description: "Optimized for speed and efficiency to deliver exceptional performance under any load."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Rigorous testing and quality control processes ensure reliability and excellence in every delivery."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Why Choose This Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Experience the benefits of working with industry experts who prioritize quality and results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">{feature.title}</h3>
                    <p className="text-gray-600 text-poppins">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Business Benefits Section
function BusinessBenefitsSection() {
  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increased Efficiency",
      description: "Streamline operations and boost productivity with optimized solutions."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Cost Reduction",
      description: "Reduce operational costs while maintaining high quality standards."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Enhanced User Experience",
      description: "Deliver exceptional experiences that delight your customers."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Scalable Growth",
      description: "Future-proof solutions that grow with your business needs."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Business Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Transform your business with measurable results and competitive advantages.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">{benefit.title}</h3>
                    <p className="text-gray-600 text-poppins">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}



// Development Process Section  
function DevelopmentProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Requirement Analysis",
      description: "Deep dive into your business needs and objectives to define the perfect solution strategy."
    },
    {
      number: "02",
      title: "Strategy & Design",
      description: "Develop comprehensive project architecture and design tailored to your specific requirements."
    },
    {
      number: "03",
      title: "Development & Implementation",
      description: "Expert development using cutting-edge technologies and industry best practices."
    },
    {
      number: "04",
      title: "Testing & Quality Assurance",
      description: "Rigorous testing protocols ensure reliability, performance, and security standards."
    },
    {
      number: "05",
      title: "Deployment & Integration",
      description: "Seamless deployment with comprehensive integration into your existing systems."
    },
    {
      number: "06",
      title: "Support & Maintenance",
      description: "Ongoing support and optimization to ensure continued success and performance."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              A proven methodology that ensures successful project delivery from concept to completion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 relative">
                    <div className="absolute top-4 right-4">
                      <span className="text-6xl font-bold text-gray-100 group-hover:text-purple-100 transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">{step.title}</h3>
                      <p className="text-gray-600 text-poppins">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// SEO Keywords Section
function SEOKeywordsSection({ service }: { service: Service }) {
  const keywords = service.secondaryKeywords ?
    service.secondaryKeywords.split(',').map(k => k.trim()).filter(k => k) :
    [];

  if (keywords.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Service Keywords
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Key areas of expertise and specialization for this service.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
            {service.primaryKeyword && (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-medium hover:shadow-lg transition-shadow duration-300"
              >
                <Star className="w-4 h-4 mr-2" />
                {service.primaryKeyword}
              </Badge>
            )}
            {keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2 text-sm font-medium transition-colors duration-300"
              >
                {keyword}
              </Badge>
            ))}
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// Loading Component
function ServicePageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading service details...</p>
        </div>
      </div>
    </div>
  );
}

// Service Not Found Component
function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Link href="/services">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <ArrowRight className="w-4 h-4 mr-2" />
              Browse All Services
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ServicePage() {
  const [match, params] = useRoute<{ slug: string }>("/services/:slug");
  const slug = params?.slug;
  const readingProgress = useScrollProgress();

  // Reading progress is now handled by the optimized useScrollProgress hook

  const { data: serviceResponse, isLoading, error } = useQuery<{ success: boolean; service: Service; type?: string }>({
    queryKey: ["/api/services/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/services/slug/${slug}`);
      if (!response.ok) {
        throw new Error("Service not found");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const service = serviceResponse?.service;

  if (isLoading) {
    return <ServicePageLoading />;
  }

  if (error || !service) {
    return <ServiceNotFound />;
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50" style={{ backgroundColor: 'var(--form-input-border, #e5e7eb)' }}>
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${readingProgress}%`,
            background: 'linear-gradient(to right, var(--service-gradient-start, #3b82f6), var(--service-gradient-middle, #8b5cf6), var(--service-gradient-end, #ec4899))'
          }}
        />
      </div>

      <div className="min-h-screen">
        <Navigation />

      {/* Hero Section */}
      <HeroSection service={service} />

      {/* Key Features Section */}
      <KeyFeaturesSection />

      {/* Business Benefits Section */}
      <BusinessBenefitsSection />

      {/* Service Details Section */}
      {service.content && <ServiceDetailsSection content={service.content} />}

      {/* Development Process Section */}
      <DevelopmentProcessSection />

      {/* Contact Section */}
      <div id="contact">
        <HomeContactSection />
      </div>

      <Footer />
      </div>
    </>
  );
}