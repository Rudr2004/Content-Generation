import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/home-contact-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Building,
  Code,
  Target,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Award,
  Star,
  ArrowRight,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  Lightbulb,
  Layers
} from "lucide-react";

interface CaseStudyPage {
  id: number;
  title: string;
  slug: string;
  category?: string;
  introTitle?: string;
  introDescription?: string;
  projectName?: string;
  clientLocation?: string;
  projectIndustry?: string;
  projectSummary?: string;
  projectDuration?: string;
  teamSize?: string;
  technologyStack?: string[];
  challengesTitle?: string;
  challengesDescription?: string;
  solutionsTitle?: string;
  solutionsDescription?: string;
  outcomesTitle?: string;
  outcomesDescription?: string;
  testimonials?: Array<{
    quote: string;
    author: string;
    position: string;
    company: string;
    rating: number;
  }>;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function DynamicCaseStudyPage() {
  const [, params] = useRoute('/case-studies/:slug');
  const [caseStudyPage, setCaseStudyPage] = useState<CaseStudyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug) {
      fetchCaseStudyPage(params.slug);
    }
  }, [params?.slug]);

  const fetchCaseStudyPage = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/case-study-pages/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error('Case study not found');
      }
      
      const data = await response.json();
      setCaseStudyPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case study');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading case study...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !caseStudyPage) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
            <p className="text-gray-600 mb-8">The case study you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/case-studies">← Back to Case Studies</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse technology stack
  let techStack: string[] = [];
  if (caseStudyPage.technologyStack) {
    try {
      techStack = typeof caseStudyPage.technologyStack === 'string' 
        ? JSON.parse(caseStudyPage.technologyStack)
        : caseStudyPage.technologyStack;
    } catch (e) {
      console.error('Error parsing technology stack:', e);
    }
  }

  // Parse testimonials
  let testimonials: any[] = [];
  if (caseStudyPage.testimonials) {
    try {
      testimonials = typeof caseStudyPage.testimonials === 'string' 
        ? JSON.parse(caseStudyPage.testimonials)
        : caseStudyPage.testimonials;
    } catch (e) {
      console.error('Error parsing testimonials:', e);
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium bg-white/50 backdrop-blur-sm border-blue-200">
                📊 {caseStudyPage.category || 'Case Study'}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 heading-georgia leading-tight">
                {caseStudyPage.introTitle || caseStudyPage.title}
              </h1>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp} 
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed text-poppins max-w-3xl mx-auto"
            >
              {caseStudyPage.introDescription || caseStudyPage.projectSummary || "Discover how we delivered exceptional results through innovative solutions and cutting-edge technology."}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                📞 Connect with Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
                Project Overview
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                {caseStudyPage.projectSummary || "A comprehensive look at the project scope, challenges, and innovative solutions delivered."}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Project Name</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      {caseStudyPage.projectName || caseStudyPage.title}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Client Location</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      {caseStudyPage.clientLocation || "Global"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Industry</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      {caseStudyPage.projectIndustry || caseStudyPage.category || "Technology"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Team Size</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      {caseStudyPage.teamSize || "5-10 Experts"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
      {techStack.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
                  Technology Stack
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                  The cutting-edge technologies and tools that powered this successful project.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {techStack.slice(0, 6).map((tech, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                      <CardContent className="p-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                          <Code className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                          {tech}
                        </h3>
                        
                        <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                          <span className="text-sm font-medium">Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Challenges, Solutions & Outcomes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
                Project Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                From challenges to solutions, discover how we achieved exceptional results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Challenges */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-6">
                      <Target className="w-6 h-6 text-red-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      {caseStudyPage.challengesTitle || "Challenges"}
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      {caseStudyPage.challengesDescription || "Complex technical challenges required innovative approaches and strategic problem-solving to overcome."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Solutions */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-lg mb-6">
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      {caseStudyPage.solutionsTitle || "Solutions"}
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      {caseStudyPage.solutionsDescription || "Innovative solutions implemented with cutting-edge technology and best practices to address all requirements."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Outcomes */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-6">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      {caseStudyPage.outcomesTitle || "Outcomes"}
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      {caseStudyPage.outcomesDescription || "Exceptional results achieved with measurable improvements in performance, efficiency, and user satisfaction."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 heading-georgia">
                  Client Testimonials
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                  What our clients say about their experience working with us
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="h-full p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.author}</div>
                          <div className="text-sm text-gray-600">{testimonial.position}</div>
                          {testimonial.company && (
                            <div className="text-sm text-gray-500">{testimonial.company}</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <div id="contact">
        <HomeContactSection />
      </div>
      
      <Footer />
    </div>
  );
}