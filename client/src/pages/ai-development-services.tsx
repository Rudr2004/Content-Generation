import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Link } from "wouter";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";
import { HomeContactSection } from "@/components/home-contact-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MessageSquare,
  BarChart3,
  Globe,
  Zap,
  Settings,
  Lock,
  ArrowRight,
  Brain,
  Database,
  Bot
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function AIDevelopmentServices() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

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
                🤖 Custom AI Development Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 heading-georgia leading-tight">
                Custom <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Generative AI</span><br />
                Development Services
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed text-poppins max-w-3xl mx-auto"
            >
              AI solutions tailored to automate, innovate, and scale your business with cutting-edge generative AI technology.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full"
              >
                📞 Connect with Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose {siteName} Section */}
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
                Why Choose {siteName} for AI Development?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                We combine cutting-edge AI expertise with proven development practices to deliver solutions that transform your business.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Domain-Specific Model Tuning</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Custom AI models fine-tuned for your industry and specific use cases, delivering superior performance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">GPT, Claude, Gemini, PaLM Expertise</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Expert implementation across all leading AI platforms with deep technical knowledge and best practices.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Full Lifecycle Management</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      End-to-end service from design and development to integration, deployment, and ongoing maintenance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">NDA + Security Compliance</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Enterprise-grade security, strict confidentiality agreements, and full compliance with industry standards.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive AI Development Services */}
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
                Comprehensive AI Development Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                From consultation to deployment, we offer end-to-end AI solutions that drive real business value.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Generative AI Consulting
                    </h3>

                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Strategic guidance on AI implementation, technology selection, and roadmap development for your business.
                    </p>

                    <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Data Analysis & Insights
                    </h3>

                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Advanced analytics and data processing to extract valuable insights and drive informed decisions.
                    </p>

                    <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Custom Model Development
                    </h3>

                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Bespoke AI models tailored to your specific requirements, trained on your data for optimal performance.
                    </p>

                    <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      AI Agent & Chatbot Building
                    </h3>

                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Intelligent conversational AI systems that enhance customer experience and automate support.
                    </p>

                    <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Enterprise System Integration
                    </h3>

                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Seamless integration of AI solutions into your existing enterprise infrastructure and workflows.
                    </p>

                    <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Upgrade & Maintenance
                    </h3>

                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Ongoing support, model updates, and performance optimization to ensure peak AI performance.
                    </p>

                    <div className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <div id="contact">
        <HomeContactSection />
      </div>

      <Footer />
    </div>
  );
}