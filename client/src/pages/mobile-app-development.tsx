import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/home-contact-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Tablet, 
  Code, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  Layers,
  Settings
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function MobileAppDevelopment() {
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
                📱 Mobile App Development Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 heading-georgia leading-tight">
                Professional <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mobile App</span><br />
                Development Services
              </h1>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp} 
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed text-poppins max-w-3xl mx-auto"
            >
              Create powerful iOS and Android applications that engage users and drive business growth with cutting-edge mobile technology.
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

      {/* Why Choose GreenAppleX Section */}
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
                Why Choose GreenAppleX for Mobile Development?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                We create exceptional mobile experiences with native and cross-platform expertise, delivering apps that users love and businesses rely on.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Code className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Native & Cross-Platform</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Expertise in Swift, Kotlin, React Native, and Flutter for optimal performance across all devices.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">User-Centric Design</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Intuitive UI/UX design following platform guidelines for maximum user engagement and retention.
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
                      Fast loading times, smooth animations, and efficient resource usage for superior app performance.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Enterprise Security</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Advanced security measures, data encryption, and compliance with industry standards and regulations.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive Mobile Development Services */}
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
                Comprehensive Mobile Development Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                From concept to deployment, we deliver mobile solutions that transform ideas into powerful business tools.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Native iOS Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      High-performance iOS apps built with Swift and SwiftUI, optimized for iPhone and iPad experiences.
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
                      <Tablet className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Native Android Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Custom Android applications using Kotlin and Jetpack Compose for seamless device compatibility.
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
                      Cross-Platform Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      React Native and Flutter solutions for efficient multi-platform deployment with shared codebase.
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
                      UI/UX Design
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      User-centered design approach with wireframing, prototyping, and intuitive interface development.
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
                      API Integration
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Seamless integration with third-party APIs, cloud services, and enterprise systems for enhanced functionality.
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
                      App Store Optimization
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Complete app store submission, optimization, and ongoing support for maximum visibility and downloads.
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