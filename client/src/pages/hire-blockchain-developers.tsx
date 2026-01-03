import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Code,
  Clock,
  Users,
  Trophy,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Award,
  PlayCircle,
  MessageSquare,
  Calendar,
  UserCheck,
  Link as LinkIcon
} from "lucide-react";
import { HomeContactSection } from "@/components/contact-form-light";

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

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Scroll to contact section function
const scrollToContact = () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export default function HireBlockchainDevelopers() {
  const heroStats = [
    { icon: Users, text: "3:1 Hire Ratio" },
    { icon: Clock, text: "Two weeks trial available" },
    { icon: Shield, text: "NDA-Backed Teams" },
    { icon: Globe, text: "Instant Timezone Match" },
    { icon: Trophy, text: "Fortune 500 Trusted" },
    { icon: Zap, text: "2x Faster Hiring" }
  ];

  const usps = [
    {
      icon: Clock,
      title: "10+ years of Experience",
      description: "Test our blockchain developers risk-free"
    },
    {
      icon: Users,
      title: "Reduce Cost by 50%",
      description: "Significant cost savings on blockchain projects"
    },
    {
      icon: Zap,
      title: "Faster Delivery",
      description: "Accelerated blockchain development timelines"
    },
    {
      icon: Globe,
      title: "Time-Zone Matching",
      description: "Perfect timezone alignment for global teams"
    },
    {
      icon: Award,
      title: "Certified Developers",
      description: "Pre-vetted blockchain experts with proven track records"
    }
  ];

  const services = [
    {
      title: "Smart Contract Development",
      description: "Build secure, efficient smart contracts on Ethereum, Binance Smart Chain, Polygon, and other leading blockchain platforms with comprehensive testing and audit support."
    },
    {
      title: "DeFi Protocol Development",
      description: "Create decentralized finance protocols including DEXs, lending platforms, yield farming, staking mechanisms, and liquidity pools with advanced tokenomics."
    },
    {
      title: "NFT Marketplace Development",
      description: "Develop full-featured NFT marketplaces with minting, trading, auction systems, royalty management, and cross-chain compatibility."
    },
    {
      title: "Blockchain Integration Services",
      description: "Seamlessly integrate blockchain functionality into existing applications with custom APIs, wallet connections, and transaction management systems."
    },
    {
      title: "Cryptocurrency & Token Development",
      description: "Create custom cryptocurrencies, utility tokens, governance tokens, and implement tokenomics with advanced features like burning, staking, and vesting."
    },
    {
      title: "Blockchain Security & Auditing",
      description: "Comprehensive security audits, vulnerability assessments, and penetration testing to ensure your blockchain applications are secure and compliant."
    }
  ];

  const engagementModels = [
    {
      icon: UserCheck,
      title: "Contract & C2H Model",
      description: "Quickly onboard blockchain experts for specific projects or pilot phases. Our contract and contract-to-hire models offer flexibility for short-term blockchain development needs without compromising on quality or security standards."
    },
    {
      icon: Users,
      title: "Permanent Models",
      description: "Build in-house blockchain capabilities with full-time developers. Ideal for long-term blockchain innovation, DeFi protocol development, and companies investing in Web3 transformation with dedicated blockchain teams."
    },
    {
      icon: Shield,
      title: "Dedicated Teams",
      description: "Deploy a dedicated blockchain development team focused solely on your Web3 project. Ensure continuity, security, and efficient collaboration for complex blockchain applications without the burden of hiring and managing internally."
    }
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "CTO at DeFi Innovations",
      image: "/api/placeholder/60/60",
      quote: "GreenAppleX blockchain developers delivered our DeFi protocol on time and within budget. Their expertise in smart contracts and security best practices is exceptional. The team understood complex tokenomics and implemented advanced features flawlessly.",
      hasVideo: true
    },
    {
      name: "Sarah Rodriguez",
      role: "Founder at NFT Studios",
      image: "/api/placeholder/60/60",
      quote: "Working with GreenAppleX was a game-changer for our NFT marketplace. They delivered a scalable platform with advanced features like lazy minting and cross-chain compatibility. The developers were highly skilled and communicative throughout the project.",
      hasVideo: false
    },
    {
      name: "David Thompson",
      role: "Head of Blockchain at FinTech Corp",
      image: "/api/placeholder/60/60",
      quote: "The blockchain developers from GreenAppleX helped us integrate cryptocurrency payments into our existing platform seamlessly. Their knowledge of regulatory compliance and security standards exceeded our expectations.",
      hasVideo: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Hire Blockchain{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Developers
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Deploy production-ready blockchain solutions with developers skilled in smart contracts, DeFi protocols, and Web3 infrastructure.
                  Trusted by global teams, we make it easy to hire blockchain developers who can accelerate your decentralized innovation across industries.
                </p>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 gap-4">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <stat.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{stat.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Hire Developer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* Recognition Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                  <Shield className="w-4 h-4 mr-2" />
                  BLOCKCHAIN SECURITY CERTIFIED 2024
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                  <Trophy className="w-4 h-4 mr-2" />
                  Top Web3 Development Company 2024
                </Badge>
              </div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Blockchain Developers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Code className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Smart Contract Experts</p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">100+</p>
                    <p className="text-xs text-gray-600">Smart Contracts</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">$50M+</p>
                    <p className="text-xs text-gray-600">TVL Secured</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <usp.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{usp.title}</h4>
                <p className="text-sm text-gray-600">{usp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hire Blockchain Developers with Deep Web3 Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Hire blockchain engineers trained in top protocols, smart contract frameworks, and scalable DeFi operations from GreenAppleX.
              Trusted by Web3-first teams building real-world, production-ready blockchain applications across industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-xl hover:bg-blue-50 transition-colors duration-300 border border-gray-100 shadow-sm hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-lg text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pick the Right Model to Hire Blockchain Developers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you need a full blockchain development team or flexible smart contract expertise, we've got a Web3 hiring model that fits your decentralized project needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagementModels.map((model, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                  <model.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-4">{model.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{model.description}</p>
                {/* <Button variant="outline" className="w-full border-gray-300 hover:border-blue-500 hover:text-blue-600">
                  Hire Developer
                </Button> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Hire the Best Blockchain Developers Today?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Share your Web3 project, and we'll match you with blockchain experts in 48 hours.
            </p>
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Hire Developer
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-8 border-t border-blue-400">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">150+</p>
                <p className="text-blue-100">Blockchain Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">8+</p>
                <p className="text-blue-100">Years in Web3</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-blue-100">Smart Contract Audits</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Web3 Leaders and CTOs across industries and continents
            </h2>
            <p className="text-lg text-gray-600">Success Stories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {testimonial.hasVideo && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CONTACT SECTION */}
      <section className="py-20 bg-white" id="contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <HomeContactSection />
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}