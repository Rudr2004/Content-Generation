import { SEOHead } from "@/components/seo-head";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { SEO_PAGES } from "@/lib/seo";
import { getOrganizationStructuredData } from "@/lib/structured-data";
import { TrustedPartners } from "@/components/trusted-partners";
import { TestimonialsSection } from "@/components/testimonials-section";
import {
  Building,
  Target,
  Eye,
  BookOpen,
  Cog,
  Heart,
  Globe,
  Star,
  Shield,
  Phone,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Lightbulb,
  Cpu,
  Code,
  Database,
  Cloud,
  Smartphone,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import {
  SiGooglecloud,
  SiAmazon,
  SiEthereum
} from "react-icons/si";
import { HomeContactSection } from "@/components/home-contact-section";
import communicatorAwardsImg from "@assets/communicator.png";
import fastCompanyImg from "@assets/fastcompany.png";
import incBestWorkplacesImg from "@assets/incbestworkplaces.png";
import Ces2023Img from "@assets/CES2023.png"
import webbyImg from "@assets/webby.png"
import ictImg from "@assets/ICT.png"
import aegisImg from "@assets/Aegisgrahambell.png"
import microsoftImg from "@assets/microsoft.png"
import agencyProgramImg from "@assets/agencyProgram.png"
import awsImg from "@assets/aws.png"
import hyperledImg from "@assets/Hyperledger.png"
import azureImg from "@assets/azure.png"
import etherieumImg from "@assets/etherium.png"
import chatgptImg from "@assets/chatgpt.png"

const awards = [
  { img: communicatorAwardsImg, title: "Communicator Awards" },
  { img: fastCompanyImg, title: "Fast Company" },
  { img: incBestWorkplacesImg, title: "Inc Best Workplaces" },
  { img: Ces2023Img, title: "CES Innovation Award" },
  { img: webbyImg, title: "Webby Awards" },
  { img: ictImg, title: "Best ICT Company" },
  { img: aegisImg, title: "Aegis Graham Bell Award" }
];
const partners = [
  { img: microsoftImg, title: "Microsoft" },
  { img: agencyProgramImg, title: "Agency Program" },
  { img: awsImg, title: "AWS" },
  { img: hyperledImg, title: "HyperLead" },
  { img: azureImg, title: "Azure" },
  { img: etherieumImg, title: "Ethereum" },
  { img: chatgptImg, title: "Chat Gpt" }
];

export default function About() {
  const seoData = SEO_PAGES['/about'] || {
    title: "About GreenAppleX - Leading AI Development & Enterprise Software Solutions Company",
    description: "Leading AI development & enterprise software solutions company with 250+ developers. Trusted by Fortune 500 companies worldwide for generative AI, Web3, and digital transformation services.",
    keywords: [
      "AI development company",
      "enterprise software solutions",
      "generative AI development",
      "Web3 development services",
      "digital transformation consulting",
      "custom software development",
      "blockchain development firm",
      "machine learning consulting"
    ],
    canonicalUrl: "https://www.greenapplex.com/about",
    ogTitle: "About GreenAppleX - Leading AI Development & Enterprise Software Solutions Company",
    ogDescription: "Leading AI development & enterprise software solutions company with 250+ developers. Trusted by Fortune 500 companies worldwide for cutting-edge technology solutions."
  };
  const structuredData = getOrganizationStructuredData();

  const industries = [
    { name: "Healthcare & Medical", icon: "🏥", description: "Innovative solutions for patient care and medical data management" },
    { name: "Financial Services", icon: "🏦", description: "Secure fintech applications and blockchain solutions" },
    { name: "E-commerce & Retail", icon: "🛒", description: "Scalable platforms and personalized shopping experiences" },
    { name: "Education Technology", icon: "🎓", description: "Learning management systems and educational tools" },
    { name: "Manufacturing & IoT", icon: "🏭", description: "Smart factory solutions and industrial automation" },
    { name: "Real Estate & PropTech", icon: "🏢", description: "Property management and smart building technologies" },
    { name: "Media & Entertainment", icon: "🎬", description: "Content management and streaming platforms" },
    { name: "Transportation & Logistics", icon: "🚚", description: "Supply chain optimization and fleet management" }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We stay ahead of technology trends and continuously explore cutting-edge solutions to deliver exceptional value to our clients.",
      icon: <Lightbulb className="w-8 h-8" />
    },
    {
      title: "Client Success",
      description: "Your success is our priority. We work as an extension of your team to achieve your business objectives and exceed expectations.",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Quality Excellence",
      description: "We maintain the highest standards in code quality, security, and performance through rigorous testing and best practices.",
      icon: <Award className="w-8 h-8" />
    },
    {
      title: "Transparency",
      description: "Open communication, honest feedback, and transparent processes build trust and ensure project success.",
      icon: <Eye className="w-8 h-8" />
    },
    {
      title: "Continuous Learning",
      description: "We invest in our team's growth and stay updated with emerging technologies to provide innovative solutions.",
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: "Collaborative Partnership",
      description: "We believe in building long-term partnerships through collaboration, mutual respect, and shared success.",
      icon: <Users className="w-8 h-8" />
    }
  ];

  const services = [
    {
      title: "Generative AI Development",
      description: "Custom AI models, chatbots, and intelligent automation solutions",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: "Web3 & Blockchain",
      description: "Smart contracts, DeFi platforms, and decentralized applications",
      icon: <Code className="w-8 h-8" />
    },
    {
      title: "Custom Software Development",
      description: "Scalable web and mobile applications tailored to your needs",
      icon: <Database className="w-8 h-8" />
    },
    {
      title: "Cloud Solutions",
      description: "Cloud migration, DevOps, and infrastructure optimization",
      icon: <Cloud className="w-8 h-8" />
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications",
      icon: <Smartphone className="w-8 h-8" />
    },
    {
      title: "Cybersecurity Solutions",
      description: "Comprehensive security audits and protection systems",
      icon: <Lock className="w-8 h-8" />
    }
  ];

  const commitments = [
    {
      title: "24/7 Support",
      description: "Round-the-clock technical support and maintenance services"
    },
    {
      title: "Agile Methodology",
      description: "Flexible, iterative development process with regular updates"
    },
    {
      title: "Data Security",
      description: "Enterprise-grade security measures and compliance standards"
    },
    {
      title: "Scalable Solutions",
      description: "Future-ready architectures that grow with your business"
    },
    {
      title: "Expert Team",
      description: "250+ certified developers and technology specialists"
    },
    {
      title: "Proven Track Record",
      description: "150+ successful projects delivered across multiple industries"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        ogTitle={seoData.ogTitle}
        ogDescription={seoData.ogDescription}
        ogImage="https://www.greenapplex.com/attached_assets/Logo A_1752582606982.jpg"
        structuredData={structuredData}
      />
      <Navigation />

      {/* 1. Company Overview Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 heading-georgia">
              Leading AI Development &
              <div>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Enterprise Software Solutions Company</span>
              </div>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              GreenAppleX is a premier technology company specializing in cutting-edge AI development,
              Web3 solutions, and enterprise software development. With over 250 skilled developers
              and a track record of 150+ successful projects, we transform businesses through innovative
              digital solutions that drive growth and efficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Founded in 2021</h3>
                    <p className="text-gray-600">3+ years of innovation and excellence</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">250+ Expert Developers</h3>
                    <p className="text-gray-600">Full-stack developers, AI specialists, and blockchain experts</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">150+ Projects Delivered</h3>
                    <p className="text-gray-600">Across Fortune 500 companies and innovative startups</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-white">
                <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600  px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-poppins">
                  Start Your Project
                </Button>
              </div>
            </motion.div>

            {/* Right side - Tech Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
                <div className="relative z-10 flex items-center justify-center h-80">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="text-4xl">🚀</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-blue-300 font-semibold">Generative AI</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-green-300 font-semibold">Web3</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-purple-300 font-semibold">Enterprise</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-pink-300 font-semibold">Mobile</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 text-blue-300 text-xs">Innovation</div>
                <div className="absolute top-4 right-4 text-green-300 text-xs">Excellence</div>
                <div className="absolute bottom-4 left-4 text-purple-300 text-xs">Technology</div>
                <div className="absolute bottom-4 right-4 text-pink-300 text-xs">Future</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <TrustedPartners />

      {/* Awards & Recognition Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 text-sm font-semibold mb-6 border border-yellow-200">
              <Award className="w-5 h-5 mr-2" />
              Awards & Recognition
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Industry
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Recognition</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              Our commitment to excellence and innovation has been recognized by leading industry organizations worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 max-w-6xl mx-auto py-12">
            {awards.map((award, idx) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="w-28 h-28 mx-auto bg-white rounded-3xl shadow-xl hover:shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-gray-100">
                  <img
                    src={award.img}
                    alt={award.title}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="text-center text-sm mt-4 font-medium text-gray-600 group-hover:text-black transition-colors duration-300">
                  {award.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Certifications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
              <Shield className="w-5 h-5 mr-2" />
              Partner Certifications
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Certified
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Technology Partners</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              Our partnerships with leading technology companies ensure we deliver cutting-edge solutions using the latest platforms and frameworks.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 max-w-6xl mx-auto py-12">
            {partners.map((award, idx) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="w-28 h-28 mx-auto bg-white rounded-3xl shadow-xl hover:shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-gray-100">
                  <img
                    src={award.img}
                    alt={award.title}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="text-center text-sm mt-4 font-medium text-gray-600 group-hover:text-black transition-colors duration-300">
                  {award.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
              <Target className="w-5 h-5 mr-2" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Transforming Businesses Through
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Innovation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              Our mission is to empower businesses worldwide with cutting-edge AI and Web3 technologies
              that drive digital transformation, enhance operational efficiency, and create sustainable
              competitive advantages in the rapidly evolving technological landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Our Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 text-sm font-semibold mb-6 border border-purple-100">
              <Eye className="w-5 h-5 mr-2" />
              Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Leading the Future of
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Technology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              To be the global leader in AI-driven enterprise solutions, pioneering breakthrough
              technologies that reshape industries and create a more intelligent, connected,
              and sustainable digital future for businesses and communities worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-blue-50 text-green-600 text-sm font-semibold mb-6 border border-green-100">
              <BookOpen className="w-5 h-5 mr-2" />
              Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              A Journey of
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Innovation</span>
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-8 text-poppins">
              From our humble beginnings, we've grown into a global technology
              powerhouse, expanding our expertise from traditional web development to pioneering
              AI, blockchain, and Web3 solutions. Our journey has been marked by continuous learning,
              strategic partnerships, and an unwavering commitment to excellence.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed text-poppins">
              Today, we're proud to serve Fortune 500 companies, innovative startups, and government
              agencies worldwide, delivering solutions that not only meet current needs but anticipate
              future challenges. Our story continues to evolve as we push the boundaries of what's
              possible in the digital realm.
            </p>
          </div>
        </div>
      </section>

      {/* 5. What We Do / Our Services Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
              <Cog className="w-5 h-5 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Comprehensive
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Technology Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              We offer end-to-end technology services that transform businesses and drive innovation
              across industries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="mb-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 heading-georgia">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-poppins">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Values / Culture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 text-sm font-semibold mb-6 border border-pink-100">
              <Heart className="w-5 h-5 mr-2" />
              Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Values That
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> Drive Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              Our core values shape everything we do, from how we interact with clients to how
              we approach complex technical challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 heading-georgia">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-poppins">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Industries We Serve Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-blue-50 text-green-600 text-sm font-semibold mb-6 border border-green-100">
              <Globe className="w-5 h-5 mr-2" />
              Industries We Serve
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Transforming
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Every Industry</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              Our expertise spans across diverse industries, delivering tailored solutions that
              address unique sector-specific challenges and opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group text-center border border-gray-100"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {industry.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 heading-georgia">
                  {industry.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed text-poppins">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Client Testimonials Section */}
      <TestimonialsSection />

      {/* 9. Our Commitments / Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
              <Shield className="w-5 h-5 mr-2" />
              Our Commitments
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 heading-georgia">
              Why Choose
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> GreenAppleX</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-poppins">
              Our commitments to excellence, innovation, and client success set us apart in the
              competitive technology landscape.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commitments.map((commitment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 heading-georgia">
                    {commitment.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-poppins">
                    {commitment.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div>
        <HomeContactSection />
      </div>

      <Footer />
    </div>
  );
}