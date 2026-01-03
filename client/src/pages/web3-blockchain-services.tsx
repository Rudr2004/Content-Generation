import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/home-contact-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Shield, 
  Coins, 
  Network, 
  Code, 
  Database, 
  Lock,
  ArrowRight,
  Blocks,
  Zap
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Web3BlockchainServices() {
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
                🔗 Web3 & Blockchain Development Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 heading-georgia leading-tight">
                Enterprise <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Web3 & Blockchain</span><br />
                Development Services
              </h1>
            </motion.div>
            
            <motion.p 
              variants={fadeInUp} 
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed text-poppins max-w-3xl mx-auto"
            >
              Build decentralized applications and blockchain solutions that drive innovation and transform your business operations.
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
                Why Choose GreenAppleX for Web3 Development?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                We deliver secure, scalable blockchain solutions with deep expertise in decentralized technologies and smart contract development.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Code className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Smart Contract Expertise</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Advanced Solidity development with gas optimization and security audit protocols for enterprise-grade contracts.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Multi-Chain Architecture</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Cross-chain compatibility across Ethereum, Polygon, Binance Smart Chain, and emerging Layer 2 solutions.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">Security-First Approach</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Comprehensive security audits, penetration testing, and adherence to industry best practices for DeFi protocols.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">End-to-End DApp Development</h3>
                    <p className="text-gray-600 text-poppins text-sm leading-relaxed">
                      Complete decentralized application development from concept to deployment with ongoing maintenance support.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive Web3 Development Services */}
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
                Comprehensive Web3 Development Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
                From smart contracts to full-scale DApps, we build blockchain solutions that drive innovation and business growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-6">
                      <Code className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      Smart Contract Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Custom smart contracts built with Solidity, including DeFi protocols, NFT marketplaces, and governance systems.
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
                      <Coins className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      DeFi Protocol Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Build decentralized finance applications including lending platforms, DEXs, yield farming, and liquidity pools.
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
                      <Blocks className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
                      NFT Marketplace Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Custom NFT platforms with minting, trading, royalties, and advanced marketplace features for digital assets.
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
                      Blockchain Integration
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Seamless integration of blockchain functionality into existing systems and enterprise applications.
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
                      DAO Development
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Decentralized autonomous organizations with governance tokens, voting mechanisms, and treasury management.
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
                      Security Auditing
                    </h3>
                    
                    <p className="text-gray-600 text-poppins mb-6 leading-relaxed text-sm">
                      Comprehensive smart contract audits, vulnerability assessments, and security optimization services.
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