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
  Globe, 
  Code, 
  Database, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  Layers,
  Settings,
  Smartphone
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function WebDevelopmentServices() {
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
                🌐 Web Development Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 heading-georgia leading-tight">
                Custom <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Web Development</span><br />
                Services
              </h1>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp} 
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed text-poppins max-w-3xl mx-auto"
            >
              Build scalable web applications and digital platforms that drive business growth with modern technologies and frameworks.
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
                Why Choose {siteName} for Web Development?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                We create exceptional web experiences with cutting-edge technologies, delivering scalable solutions that perform flawlessly across all devices.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Code className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Modern Tech Stack</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      React, Angular, Vue.js, Node.js, Python, and cloud-native architectures for scalable solutions.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Smartphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Responsive Design</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Mobile-first approach ensuring perfect functionality across desktop, tablet, and mobile devices.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Performance Optimization</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Lightning-fast loading speeds, SEO optimization, and efficient resource management for superior performance.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Security & Scalability</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Enterprise-grade security measures and scalable architecture to handle growing business demands.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive Web Development Services */}
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
                Comprehensive Web Development Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                From frontend interfaces to backend systems, we deliver complete web solutions that power modern businesses.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Frontend Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Interactive user interfaces built with React, Angular, Vue.js, and modern CSS frameworks for engaging experiences.
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
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Backend Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Robust server-side solutions with Node.js, Python, PHP, and cloud services for scalable application architecture.
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
                      <Layers className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Full-Stack Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      End-to-end web application development combining frontend and backend expertise for complete solutions.
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
                      API Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      RESTful APIs and GraphQL services for seamless data integration and third-party system connectivity.
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
                      E-Commerce Solutions
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Custom e-commerce platforms with payment integration, inventory management, and user-friendly shopping experiences.
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
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Web Maintenance
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Ongoing support, security updates, performance monitoring, and feature enhancements for existing websites.
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