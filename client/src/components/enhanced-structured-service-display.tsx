import React, { useState, useEffect } from 'react';
import { 
  Users, Code, Rocket, Settings, Search, FileText, Wrench, 
  TrendingUp, Clock, Shield, Heart, DollarSign, Zap, 
  CheckCircle, Star, Lightbulb, ShoppingCart, Factory, 
  BookOpen, Building, Target, Award, Globe, ArrowRight,
  ChevronDown, ChevronUp, Play, Quote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ReadingProgressBar } from './ui/reading-progress-bar';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Code, Rocket, Settings, Search, FileText, Wrench,
  TrendingUp, Clock, Shield, Heart, DollarSign, Zap,
  CheckCircle, Star, Lightbulb, ShoppingCart, Factory,
  BookOpen, Building, Target, Award, Globe, ArrowRight
};

interface ServiceComponent {
  name: string;
  description: string;
}

interface ProcessStep {
  step: string;
  description: string;
}

interface ServiceTestimonial {
  quote: string;
  client: string;
  clientImage: string;
}

interface ServiceFAQ {
  question: string;
  answer: string;
}

interface ServicePageContent {
  heroSection: {
    headline: string;
    subheading: string;
    ctaButton: string;
  };
  introOverview: {
    paragraphs: string[];
  };
  serviceOfferings: {
    title: string;
    components: ServiceComponent[];
  };
  technologyTools: {
    coreTechnologies: string[];
    platformsFrameworks: string[];
    integrationTools: string[];
    deploymentEnvironments: string[];
  };
  process: ProcessStep[];
  whyChooseUs: string[];
  trustSignals: {
    trustedBy: string[];
  };
  testimonials: ServiceTestimonial[];
  faqs: ServiceFAQ[];
  finalCTA: {
    headline: string;
    button: string;
  };
}

interface Service {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface EnhancedStructuredServiceDisplayProps {
  service: Service;
  onContactClick: () => void;
}

const IconComponent: React.FC<{ iconName?: string; className?: string }> = ({ iconName, className = "h-6 w-6" }) => {
  if (!iconName || !iconMap[iconName]) {
    return <Target className={className} />;
  }
  const Icon = iconMap[iconName];
  return <Icon className={className} />;
};

const parseEnhancedContent = (content: string): ServicePageContent | null => {
  try {
    // Try to parse the content as JSON first
    if (content.trim().startsWith('{')) {
      return JSON.parse(content);
    }
    
    // If not JSON, create a basic structured format from plain content
    return {
      heroSection: {
        headline: `Transform Your Business with ${content.split('.')[0] || 'Our Professional Services'}`,
        subheading: "Helping businesses achieve digital transformation through cutting-edge solutions",
        ctaButton: "Get Started Today"
      },
      introOverview: {
        paragraphs: [
          content.substring(0, 300) + "...",
          "Our expert team delivers comprehensive solutions tailored to your unique business needs, ensuring measurable results and long-term success."
        ]
      },
      serviceOfferings: {
        title: "Our End-to-End Service Solutions",
        components: [
          { name: "Strategic Consulting", description: "Expert guidance and strategic planning" },
          { name: "Custom Development", description: "Tailored solutions built to your specifications" },
          { name: "Implementation", description: "Seamless deployment and integration" },
          { name: "Ongoing Support", description: "Continuous maintenance and optimization" }
        ]
      },
      technologyTools: {
        coreTechnologies: ["React", "Node.js", "TypeScript", "Python"],
        platformsFrameworks: ["Next.js", "Express", "FastAPI", "TailwindCSS"],
        integrationTools: ["REST APIs", "GraphQL", "Webhooks", "Third-party SDKs"],
        deploymentEnvironments: ["AWS", "Azure", "Docker", "Kubernetes"]
      },
      process: [
        { step: "Discovery & Strategy", description: "Understanding your business goals and requirements" },
        { step: "Planning & Estimation", description: "Creating detailed project roadmaps and timelines" },
        { step: "Design & Development", description: "Building scalable solutions with best practices" },
        { step: "Testing & Optimization", description: "Ensuring quality and performance standards" },
        { step: "Deployment & Support", description: "Launching and maintaining your solution" }
      ],
      whyChooseUs: [
        "10+ years of industry experience and expertise",
        "Proven track record with 200+ successful projects",
        "24/7 dedicated support and maintenance",
        "Cutting-edge technology and best practices"
      ],
      trustSignals: {
        trustedBy: ["Fortune 500 Companies", "Healthcare Organizations", "Financial Institutions", "E-commerce Leaders", "Technology Startups", "Government Agencies"]
      },
      testimonials: [
        {
          quote: "Their expertise and dedication transformed our business operations completely. We've seen remarkable improvements in efficiency and customer satisfaction.",
          client: "Sarah Johnson, CTO at TechCorp Solutions",
          clientImage: "https://images.unsplash.com/photo-1494790108755-2616b612b607?w=150&h=150&fit=crop&crop=face"
        },
        {
          quote: "The team delivered beyond our expectations. The solution they built has become integral to our daily operations and growth strategy.",
          client: "Michael Chen, VP of Operations at InnovateLab",
          clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
      ],
      faqs: [
        {
          question: "What is the typical timeline for project completion?",
          answer: "Project timelines vary based on complexity and scope. Most projects are completed within 8-16 weeks, with smaller projects taking 4-6 weeks and larger enterprise solutions taking 3-6 months."
        },
        {
          question: "Do you provide ongoing support after deployment?",
          answer: "Yes, we offer comprehensive post-deployment support including 24/7 monitoring, regular updates, performance optimization, and technical assistance to ensure your solution continues to perform optimally."
        },
        {
          question: "Can you work with our existing technology stack?",
          answer: "Absolutely. We specialize in integrating with existing systems and can work with a wide variety of technologies. We'll assess your current infrastructure and recommend the best approach for seamless integration."
        },
        {
          question: "What makes your approach different from other providers?",
          answer: "Our approach combines deep technical expertise with a strong focus on business outcomes. We prioritize clear communication, agile methodologies, and long-term partnerships rather than just project delivery."
        }
      ],
      finalCTA: {
        headline: "Ready to Transform Your Business?",
        button: "Start Your Project Today"
      }
    };
  } catch (error) {
    console.error('Error parsing enhanced service content:', error);
    return null;
  }
};

export const EnhancedStructuredServiceDisplay: React.FC<EnhancedStructuredServiceDisplayProps> = ({ 
  service, 
  onContactClick 
}) => {
  const [readingProgress, setReadingProgress] = useState(0);

  // Reading progress indicator
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const structuredContent = parseEnhancedContent(service.content || '');
  
  if (!structuredContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
          <div className="prose max-w-none">
            <p>{service.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse opacity-30"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000 opacity-30"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000 opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {structuredContent.heroSection.headline}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              {structuredContent.heroSection.subheading}
            </p>
            <Button 
              onClick={onContactClick}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {structuredContent.heroSection.ctaButton} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction & Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {structuredContent.introOverview.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-600 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.serviceOfferings.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {structuredContent.serviceOfferings.components.map((component, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <CardTitle className="text-xl text-gray-900">{component.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {component.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Tools */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Technology Stack & Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We leverage cutting-edge technologies to deliver robust, scalable solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(structuredContent.technologyTools).map(([category, technologies]) => (
              <Card key={category} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                    {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {technologies.map((tech, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process & Methodology */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Proven Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A systematic approach that ensures successful project delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {structuredContent.process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">{index + 1}</span>
                  </div>
                  {index < structuredContent.process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.step}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose Our Services?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {structuredContent.whyChooseUs.map((point, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-lg text-blue-100">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg font-medium">Trusted by Industry Leaders</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {structuredContent.trustSignals.trustedBy.map((client, index) => (
              <div key={index} className="text-gray-400 font-semibold text-sm bg-gray-50 px-4 py-2 rounded-lg">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {structuredContent.testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-blue-500 mb-4" />
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.clientImage} 
                      alt={testimonial.client}
                      className="w-12 h-12 rounded-full mr-4"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.client)}&background=3b82f6&color=fff`;
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.client}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {structuredContent.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left py-6 hover:no-underline">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {structuredContent.finalCTA.headline}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how we can help you achieve your business goals with our expert solutions.
          </p>
          <Button 
            onClick={onContactClick}
            size="lg"
            variant="secondary"
            className="px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
          >
            {structuredContent.finalCTA.button} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      </div>
    </>
  );
};