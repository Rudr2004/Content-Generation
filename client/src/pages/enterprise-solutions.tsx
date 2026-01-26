import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/home-contact-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";
import { 
  Building, 
  Database, 
  Shield, 
  Users, 
  Zap, 
  Settings,
  ArrowRight,
  Network,
  BarChart3
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function EnterpriseSolutions() {
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
                🏢 Enterprise Solutions
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 heading-georgia leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Enterprise</span><br />
                Digital Solutions
              </h1>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp} 
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed text-poppins max-w-3xl mx-auto"
            >
              Transform your enterprise with scalable digital solutions designed for large-scale operations and complex business requirements.
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
                Why Choose {siteName} for Enterprise Solutions?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                We deliver enterprise-grade solutions with proven scalability, security, and reliability for mission-critical business operations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Enterprise Architecture</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Scalable architecture patterns designed for high-volume operations and complex business requirements.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Security & Compliance</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Advanced security protocols and compliance with industry standards including SOC 2, GDPR, and HIPAA.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Network className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">System Integration</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Seamless integration with existing enterprise systems, legacy applications, and third-party services.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">24/7 Enterprise Support</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Dedicated support teams with SLA guarantees for critical business operations and maintenance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive Enterprise Solutions */}
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
                Comprehensive Enterprise Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                Custom enterprise applications and digital transformation solutions that scale with your business growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      ERP Systems
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Custom enterprise resource planning systems integrating finance, HR, supply chain, and business operations.
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
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      CRM Platforms
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Advanced customer relationship management systems with sales automation and customer journey tracking.
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
                      Business Intelligence
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Data analytics and reporting platforms providing actionable insights for strategic decision-making.
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
                      Workflow Automation
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Process automation solutions to streamline operations and reduce manual workload across departments.
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
                      <Network className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Cloud Migration
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Seamless migration to cloud platforms with scalability, security, and cost optimization strategies.
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
                      Legacy Modernization
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Modernize legacy systems with updated technologies while maintaining business continuity and data integrity.
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