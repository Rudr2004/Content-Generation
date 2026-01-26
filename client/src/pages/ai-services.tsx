import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Lightbulb,
  Shield,
  Settings,
  TrendingUp,
  Users,
  Code,
  Database,
  Zap,
  Target,
  Palette,
  DollarSign,
  Building,
  Stethoscope,
  ShoppingCart,
  Factory,
  Scale,
  Plane,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Cloud,
  Cpu,
  MessageSquare,
  BarChart3,
  Workflow,
  FileText,
  Calendar,
  Award,
  Sparkles
} from "lucide-react";
import { GetInTouchSection } from "@/components/get-in-touch-section";
import { HomeContactSection } from "@/components/home-contact-section";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

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

// Hero Section
function HeroSection() {
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
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Custom AI Development Services
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 heading-georgia">
              Custom <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Generative AI</span> Development Services
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 mb-8 text-poppins leading-relaxed">
              AI solutions tailored to automate, innovate, and scale your business with cutting-edge generative AI technology.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-2" />
                Get a Quote
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Domain-Specific Model Tuning",
      description: "Custom AI models fine-tuned for your industry and specific use cases, delivering superior performance."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "GPT, Claude, Gemini, PaLM Expertise",
      description: "Expert implementation across all leading AI platforms with deep technical knowledge and best practices."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Full Lifecycle Management",
      description: "End-to-end service from design and development to integration, deployment, and ongoing maintenance."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "NDA + Security Compliance",
      description: "Enterprise-grade security, strict confidentiality agreements, and full compliance with industry standards."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Why Choose {siteName} for AI Development?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              We combine cutting-edge AI expertise with proven development practices to deliver solutions that transform your business.
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

// Services Overview Section
function ServicesOverviewSection() {
  const services = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Generative AI Consulting",
      description: "Strategic guidance on AI implementation, technology selection, and roadmap development for your business."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Data Analysis & Insights",
      description: "Advanced analytics and data processing to extract valuable insights and drive informed decisions."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Custom Model Development",
      description: "Bespoke AI models tailored to your specific requirements, trained on your data for optimal performance."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Agent & Chatbot Building",
      description: "Intelligent conversational AI systems that enhance customer experience and automate support."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Enterprise System Integration",
      description: "Seamless integration of AI solutions into your existing enterprise infrastructure and workflows."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Upgrade & Maintenance",
      description: "Ongoing support, model updates, and performance optimization to ensure peak AI performance."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Comprehensive AI Development Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              From consultation to deployment, we offer end-to-end AI solutions that drive real business value.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">{service.title}</h3>
                    <p className="text-gray-600 text-poppins mb-4">{service.description}</p>
                    <div className="flex items-center text-blue-600 group-hover:text-purple-600 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-semibold">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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

// Development Process Section
function DevelopmentProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Requirement Analysis",
      description: "Deep dive into your business needs, data sources, and success metrics to define the perfect AI solution."
    },
    {
      number: "02",
      title: "Strategy & Design",
      description: "Develop comprehensive AI strategy, architecture design, and technology selection tailored to your goals."
    },
    {
      number: "03",
      title: "Development & Training",
      description: "Build and train custom AI models using your data, incorporating best practices and cutting-edge techniques."
    },
    {
      number: "04",
      title: "Testing & Validation",
      description: "Rigorous testing, validation, and optimization to ensure your AI solution meets performance standards."
    },
    {
      number: "05",
      title: "Deployment & Launch",
      description: "Seamless deployment to production environments with proper monitoring and security measures."
    },
    {
      number: "06",
      title: "Integration & Support",
      description: "Full integration with your existing systems and ongoing support for continuous improvement."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Our Proven Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              A systematic approach to AI development that ensures successful project delivery and maximum ROI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 heading-georgia">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-poppins">{step.description}</p>
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

// Industries Served Section
function IndustriesServedSection() {
  const industries = [
    {
      icon: <Building className="w-10 h-10" />,
      title: "Finance & Banking",
      description: "AI-powered fraud detection, risk analysis, and automated trading systems."
    },
    {
      icon: <ShoppingCart className="w-10 h-10" />,
      title: "Retail & E-commerce",
      description: "Personalized recommendations, inventory optimization, and customer insights."
    },
    {
      icon: <Stethoscope className="w-10 h-10" />,
      title: "Healthcare",
      description: "Medical diagnosis assistance, drug discovery, and patient care optimization."
    },
    {
      icon: <Factory className="w-10 h-10" />,
      title: "Manufacturing",
      description: "Predictive maintenance, quality control, and supply chain optimization."
    },
    {
      icon: <Scale className="w-10 h-10" />,
      title: "Legal Services",
      description: "Document analysis, contract review, and legal research automation."
    },
    {
      icon: <Plane className="w-10 h-10" />,
      title: "Travel & Hospitality",
      description: "Dynamic pricing, customer service automation, and experience personalization."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Delivering specialized AI solutions across diverse industries with deep domain expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                        {industry.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">{industry.title}</h3>
                    <p className="text-gray-600 text-poppins">{industry.description}</p>
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
      icon: <Zap className="w-8 h-8" />,
      title: "Process Automation",
      description: "Automate repetitive tasks and streamline operations for increased efficiency."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Enhanced Productivity",
      description: "Boost team productivity with AI-powered tools and intelligent automation."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Creative Innovation",
      description: "Unlock new creative possibilities with generative AI for content and design."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Cost Optimization",
      description: "Reduce operational costs while improving quality and performance."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Transform Your Business with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Experience measurable business benefits through strategic AI implementation.
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

// Case Studies Section
function CaseStudiesSection() {
  const caseStudies = [
    {
      title: "60% Faster Wine Recommendation App",
      description: "AI-powered recommendation engine that improved customer satisfaction and increased sales conversion rates.",
      metrics: "60% faster processing, 40% higher engagement",
      category: "Retail AI"
    },
    {
      title: "AI Medical Assistant: 2x Faster Decisions",
      description: "Intelligent diagnostic support system that helps medical professionals make faster, more accurate decisions.",
      metrics: "2x faster decisions, 95% accuracy rate",
      category: "Healthcare AI"
    },
    {
      title: "LLM-Powered Safety Tool: 50% Less Search Time",
      description: "Advanced safety compliance system that automates regulatory checking and reduces manual effort.",
      metrics: "50% reduction in search time, 99% compliance",
      category: "Enterprise AI"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Real results from our AI implementations across different industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="mb-4">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {study.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">{study.title}</h3>
                    <p className="text-gray-600 text-poppins mb-4">{study.description}</p>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800">{study.metrics}</p>
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

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
              Start Your AI Project Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Ready to transform your business with AI? Get in touch with our experts for a free consultation.
            </p>
          </motion.div>

          {/* <div className="max-w-2xl mx-auto">
            <motion.div variants={fadeInUp}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Details
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your AI project requirements..."
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start Your AI Project
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div> */}
          <HomeContactSection />
        </AnimatedSection>
      </div>
    </section>
  );
}

// Main Component
export default function AIServices() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <WhyChooseUsSection />
      <ServicesOverviewSection />
      <DevelopmentProcessSection />
      <IndustriesServedSection />
      <BusinessBenefitsSection />
      <CaseStudiesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}