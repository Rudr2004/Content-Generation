import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Database, Cpu, Code, Zap, Shield } from "lucide-react";

interface ProcessItem {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: any;
  color: string;
  bgImage: string;
}

const processes: ProcessItem[] = [
  {
    id: "step1",
    title: "Streamlined Project Initiation",
    description: "We begin with comprehensive discovery and strategic planning to ensure your project starts on the right foundation.",
    details: "Our project initiation phase includes detailed requirements gathering, stakeholder analysis, technology assessment, and project roadmap creation. We establish clear objectives, define success metrics, and create a solid foundation that ensures your project's success from day one.",
    icon: Code,
    color: "from-blue-500 to-blue-600",
    bgImage: "bg-gradient-to-br from-blue-100 to-blue-200"
  },
  {
    id: "step2",
    title: "Prototyping and Model Development",
    description: "Rapid prototyping and MVP development to validate concepts and gather early feedback before full development.",
    details: "We create functional prototypes and minimum viable products (MVPs) to test core concepts early in the development cycle. This approach allows us to validate ideas, gather user feedback, identify potential issues, and make necessary adjustments before investing in full-scale development.",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    bgImage: "bg-gradient-to-br from-purple-100 to-purple-200"
  },
  {
    id: "step3",
    title: "Rigorous Quality Testing",
    description: "Comprehensive testing protocols ensure your application meets the highest standards of quality and performance.",
    details: "Our testing methodology includes automated unit testing, integration testing, performance testing, security audits, and user acceptance testing. We ensure your application is robust, secure, and performs optimally under various conditions before deployment.",
    icon: Shield,
    color: "from-green-500 to-green-600",
    bgImage: "bg-gradient-to-br from-green-100 to-green-200"
  },
  {
    id: "step4",
    title: "Seamless Deployment and Integration",
    description: "Professional deployment with CI/CD pipelines and seamless integration with your existing systems.",
    details: "We implement professional deployment strategies using continuous integration and continuous deployment (CI/CD) pipelines. Our team ensures smooth integration with your existing infrastructure, minimal downtime, and comprehensive deployment monitoring.",
    icon: Cpu,
    color: "from-orange-500 to-orange-600",
    bgImage: "bg-gradient-to-br from-orange-100 to-orange-200"
  },
  {
    id: "step5",
    title: "Proactive Continuous Monitoring",
    description: "24/7 monitoring and proactive maintenance to ensure optimal performance and immediate issue resolution.",
    details: "Our monitoring solutions provide real-time visibility into your application's performance, user behavior, and system health. We proactively identify and resolve issues before they impact users, ensuring maximum uptime and optimal user experience.",
    icon: Database,
    color: "from-red-500 to-red-600",
    bgImage: "bg-gradient-to-br from-red-100 to-red-200"
  },
  {
    id: "step6",
    title: "Data Driven Performance Optimization",
    description: "Continuous optimization based on real user data and analytics to maximize ROI and user satisfaction.",
    details: "We leverage comprehensive analytics and user data to continuously optimize your application's performance, user experience, and business metrics. Our data-driven approach ensures ongoing improvements that directly impact your ROI and customer satisfaction.",
    icon: Brain,
    color: "from-indigo-500 to-indigo-600",
    bgImage: "bg-gradient-to-br from-indigo-100 to-indigo-200"
  }
];

export function ProcessSection() {
  const [hoveredProcess, setHoveredProcess] = useState<ProcessItem | null>(processes[0]);

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 heading-georgia"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            AI Development Process Without{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Delays and Resource Drain
            </span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-poppins"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Streamline your AI development workflow with our comprehensive enterprise AI solutions and custom software development methodology
          </motion.p>
        </div>

        {/* Mobile-First Layout */}
        <div className="space-y-6 lg:hidden">
          {/* Mobile Process Cards */}
          {processes.map((process, index) => {
            const Icon = process.icon;
            return (
              <motion.div
                key={process.id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setHoveredProcess(process)}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-r ${process.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{process.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{process.description}</p>
                  </div>
                </div>
                
                {/* Expanded details for mobile */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-4">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">What We Offer</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{process.details}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Two Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Section - Process List */}
          <div className="space-y-4">
            {processes.map((process, index) => {
              const Icon = process.icon;
              const isHovered = hoveredProcess?.id === process.id;

              return (
                <motion.div
                  key={process.id}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isHovered
                      ? 'border-purple-500 bg-white shadow-lg'
                      : 'border-gray-200 bg-white/80 hover:border-gray-300'
                    }`}
                  onMouseEnter={() => setHoveredProcess(process)}
                  onClick={() => setHoveredProcess(process)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Gradient Border Effect */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${process.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 heading-georgia">{process.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed text-poppins">{process.description}</p>
                    </div>
                    {isHovered && (
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Section - Details Display */}
          <div className="sticky top-24">
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 min-h-[500px]"
              layout
              transition={{ duration: 0.5 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>

              {hoveredProcess && (
                <motion.div
                  key={hoveredProcess.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 h-full flex flex-col justify-center"
                >
                  {/* Icon and Title */}
                  <div className="mb-8">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${hoveredProcess.color} flex items-center justify-center mb-6`}>
                      <hoveredProcess.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">{hoveredProcess.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{hoveredProcess.description}</p>
                  </div>

                  {/* Detailed Description */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h4 className="text-xl font-semibold text-white mb-4">What We Offer</h4>
                    <p className="text-gray-200 leading-relaxed">{hoveredProcess.details}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}