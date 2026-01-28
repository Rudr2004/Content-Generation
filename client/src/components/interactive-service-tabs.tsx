import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Globe, Brain, Code, Settings, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "mobile",
    title: "Mobile App Development",
    icon: Smartphone,
    color: "bg-purple-500",
    description: "Native iOS and Android applications with React Native, Flutter, and Swift. Delivering exceptional user experiences across all mobile platforms.",
    features: [
      "Native iOS & Android",
      "React Native & Flutter",
      "App Store Optimization"
    ]
  },
  {
    id: "digital",
    title: "Digital Transformation",
    icon: Settings,
    color: "bg-blue-500",
    description: "Modernize your business processes with cloud migration, system integration, and digital strategy consulting for competitive advantage.",
    features: [
      "Cloud Migration",
      "System Integration",
      "Process Automation"
    ]
  },
  {
    id: "web3",
    title: "Web3 & Blockchain",
    icon: Globe,
    color: "bg-green-500",
    description: "Decentralized applications, smart contracts, NFT marketplaces, and blockchain solutions for the future of digital business.",
    features: [
      "Smart Contracts",
      "DeFi Applications",
      "NFT Platforms"
    ]
  },
  {
    id: "ai",
    title: "Enterprise AI Development",
    icon: Brain,
    color: "bg-pink-500",
    description: "Custom AI solutions, generative AI development, machine learning consulting, and AI automation services for enterprises.",
    features: [
      "Custom LLM Development",
      "AI Agent Development",
      "Enterprise AI Integration"
    ]
  },
  {
    id: "software",
    title: "Custom Software Development",
    icon: Code,
    color: "bg-orange-500",
    description: "Bespoke software development using modern technologies like React, Python, Node.js, and cloud-native architectures.",
    features: [
      "Full-Stack Development",
      "Enterprise Software Solutions",
      "API Development"
    ]
  },
  {
    id: "enterprise",
    title: "Enterprise Solutions",
    icon: Building,
    color: "bg-indigo-500",
    description: "Scalable enterprise applications, ERP systems, and business intelligence solutions for large organizations and corporations.",
    features: [
      "ERP Systems",
      "Business Intelligence",
      "Data Analytics"
    ]
  }
];

export function InteractiveServiceTabs() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 heading-georgia">
            Enterprise AI Development & Custom Software Solutions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
            Comprehensive AI development services and technology solutions to accelerate your digital transformation journey with cutting-edge AI automation and custom software development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8">
          {services.map((service) => {
            const Icon = service.icon;
            const isHovered = hoveredService === service.id;
            const isOtherHovered = hoveredService && hoveredService !== service.id;

            return (
              <motion.div
                key={service.id}
                className="relative bg-white rounded-2xl shadow-lg border border-gray-100 cursor-pointer overflow-hidden min-h-[220px]"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                layout
                animate={{
                  scale: isHovered ? 1.05 : isOtherHovered ? 0.95 : 1,
                  opacity: isOtherHovered ? 0.7 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3
                }}
                style={{
                  zIndex: isHovered ? 10 : 1
                }}
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}
                      animate={{
                        scale: isHovered ? 1.1 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 heading-georgia">
                        {service.title}
                      </h3>
                      <motion.p
                        className="text-gray-600 text-sm sm:text-base text-poppins"
                        animate={{
                          opacity: isHovered ? 0 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {service.description.split('.')[0]}...
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Expanded on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-700 mb-6 leading-relaxed text-poppins text-sm sm:text-base">
                        {service.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        {service.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <div className={`w-2 h-2 ${service.color} rounded-full`} />
                            <span className="text-gray-700 text-sm font-medium">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          className={`w-full ${service.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 group`}
                        >
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover overlay */}
                <motion.div
                  className={`absolute inset-0 ${service.color} opacity-0 rounded-2xl`}
                  animate={{
                    opacity: isHovered ? 0.05 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            className="text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
            }}
          >
            View All Services
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}