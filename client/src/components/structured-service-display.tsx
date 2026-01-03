import React from 'react';
import { 
  Users, Code, Rocket, Settings, Search, FileText, Wrench, 
  TrendingUp, Clock, Shield, Heart, DollarSign, Zap, 
  CheckCircle, Star, Lightbulb, ShoppingCart, Factory, 
  BookOpen, Building, Target, Award, Globe, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Code, Rocket, Settings, Search, FileText, Wrench,
  TrendingUp, Clock, Shield, Heart, DollarSign, Zap,
  CheckCircle, Star, Lightbulb, ShoppingCart, Factory,
  BookOpen, Building, Target, Award, Globe, ArrowRight
};

interface ServiceBenefit {
  title: string;
  description: string;
  icon?: string;
}

interface ServiceOffering {
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

interface ServiceProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

interface ServiceTechnologyStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  cloud?: string[];
  ai_ml?: string[];
  mobile?: string[];
}

interface ServiceCaseStudy {
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: string;
}

interface ServiceDifferentiator {
  title: string;
  description: string;
  icon?: string;
  stats?: string;
}

interface ServiceIndustry {
  name: string;
  description: string;
  icon?: string;
  examples?: string[];
}

interface ServicePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  overviewTitle: string;
  overviewDescription: string;
  keyBenefits: ServiceBenefit[];
  offeringsTitle: string;
  offerings: ServiceOffering[];
  processTitle: string;
  processDescription: string;
  processSteps: ServiceProcessStep[];
  techTitle: string;
  techDescription: string;
  technologies: ServiceTechnologyStack;
  caseStudiesTitle: string;
  caseStudies: ServiceCaseStudy[];
  differentiatorsTitle: string;
  differentiators: ServiceDifferentiator[];
  industriesTitle: string;
  industriesDescription: string;
  industries: ServiceIndustry[];
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

interface StructuredServiceDisplayProps {
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

const parseStructuredContent = (content: string): ServicePageContent | null => {
  try {
    // Try to parse the content as JSON first
    if (content.trim().startsWith('{')) {
      return JSON.parse(content);
    }
    
    // If not JSON, try to extract structured data from markdown content
    const sections = content.split('\n\n');
    
    // Create a basic structured format from plain content
    return {
      heroTitle: sections[0]?.replace(/^#+ /, '') || "Our Professional Services",
      heroSubtitle: "Expert solutions that drive results",
      heroDescription: sections[1] || content.substring(0, 300) + "...",
      overviewTitle: "Service Overview",
      overviewDescription: content,
      keyBenefits: [
        { title: "Expert Delivery", description: "Professional service delivery with proven results", icon: "CheckCircle" },
        { title: "24/7 Support", description: "Round-the-clock support for your business needs", icon: "Clock" },
        { title: "Scalable Solutions", description: "Solutions that grow with your business", icon: "TrendingUp" }
      ],
      offeringsTitle: "Our Service Offerings",
      offerings: [
        { title: "Consulting", description: "Strategic guidance and planning", icon: "Lightbulb" },
        { title: "Development", description: "Custom solution development", icon: "Code" },
        { title: "Implementation", description: "Seamless project implementation", icon: "Rocket" },
        { title: "Support", description: "Ongoing maintenance and support", icon: "Settings" }
      ],
      processTitle: "Our Process",
      processDescription: "We follow a systematic approach to ensure success",
      processSteps: [
        { stepNumber: 1, title: "Discovery", description: "Understanding your requirements", icon: "Search" },
        { stepNumber: 2, title: "Planning", description: "Strategic planning and design", icon: "FileText" },
        { stepNumber: 3, title: "Implementation", description: "Professional implementation", icon: "Code" },
        { stepNumber: 4, title: "Launch", description: "Successful project launch", icon: "Rocket" }
      ],
      techTitle: "Technology Stack",
      techDescription: "Modern technologies for optimal performance",
      technologies: {
        frontend: ["React", "Next.js", "TypeScript"],
        backend: ["Node.js", "Python", "Express"],
        database: ["PostgreSQL", "MongoDB"],
        cloud: ["AWS", "Docker", "Kubernetes"]
      },
      caseStudiesTitle: "Success Stories",
      caseStudies: [
        {
          clientName: "Enterprise Client",
          industry: "Technology",
          challenge: "Complex business challenges",
          solution: "Comprehensive solution implementation",
          results: ["Improved efficiency", "Cost reduction", "Enhanced performance"],
          testimonial: "Excellent service delivery and results"
        }
      ],
      differentiatorsTitle: "Why Choose Us?",
      differentiators: [
        { title: "Expert Team", description: "Experienced professionals", icon: "Users", stats: "10+ Years" },
        { title: "Proven Results", description: "Track record of success", icon: "TrendingUp", stats: "200+ Projects" },
        { title: "24/7 Support", description: "Always available", icon: "Clock", stats: "24/7 Available" }
      ],
      industriesTitle: "Industries We Serve",
      industriesDescription: "We serve clients across various industries",
      industries: [
        { name: "Technology", description: "Tech companies and startups", icon: "Code" },
        { name: "Healthcare", description: "Medical and health services", icon: "Heart" },
        { name: "Finance", description: "Financial services", icon: "DollarSign" }
      ]
    };
  } catch (error) {
    console.error('Error parsing service content:', error);
    return null;
  }
};

export const StructuredServiceDisplay: React.FC<StructuredServiceDisplayProps> = ({ 
  service, 
  onContactClick 
}) => {
  const structuredContent = parseStructuredContent(service.content || '');
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Section 1: Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              {structuredContent.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100">
              {structuredContent.heroSubtitle}
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
              {structuredContent.heroDescription}
            </p>
            <Button 
              onClick={onContactClick}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section 2: Overview & Key Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.overviewTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {structuredContent.overviewDescription}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {structuredContent.keyBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <IconComponent iconName={benefit.icon} className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Core Offerings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.offeringsTitle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {structuredContent.offerings.map((offering, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent iconName={offering.icon} className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">{offering.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    {offering.description}
                  </CardDescription>
                </CardHeader>
                {offering.features && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {offering.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Process & Methodology */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.processTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {structuredContent.processDescription}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {structuredContent.processSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">{step.stepNumber}</span>
                  </div>
                  <IconComponent iconName={step.icon} className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Technology Stack */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.techTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {structuredContent.techDescription}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(structuredContent.technologies).map(([category, techs]) => (
              <Card key={category} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{category.replace('_', ' & ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {techs?.map((tech, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
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

      {/* Section 6: Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.caseStudiesTitle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {structuredContent.caseStudies.map((study, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{study.clientName}</CardTitle>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border w-fit">
                    {study.industry}
                  </span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                    <p className="text-gray-600 text-sm">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Results:</h4>
                    <ul className="space-y-1">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {study.testimonial && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-700 italic text-sm">"{study.testimonial}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Why Choose Us (Differentiators) */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {structuredContent.differentiatorsTitle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {structuredContent.differentiators.map((diff, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors duration-300">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <IconComponent iconName={diff.icon} className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{diff.title}</h3>
                  {diff.stats && (
                    <div className="text-2xl font-bold text-blue-200 mb-2">{diff.stats}</div>
                  )}
                  <p className="text-gray-200 text-sm">{diff.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Industries We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {structuredContent.industriesTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {structuredContent.industriesDescription}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structuredContent.industries.map((industry, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <IconComponent iconName={industry.icon} className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{industry.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
                {industry.examples && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {industry.examples.map((example, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {example}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how our {service.title.toLowerCase()} can drive your success.
          </p>
          <Button 
            onClick={onContactClick}
            size="lg"
            variant="secondary"
            className="px-8 py-3 text-lg font-semibold"
          >
            Get Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};