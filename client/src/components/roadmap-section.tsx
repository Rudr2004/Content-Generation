import { useState } from "react";
import { ChevronRight, Code, TestTube, Rocket, Shield, Monitor, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  details: string[];
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: 1,
    title: "Step 1",
    subtitle: "Streamlined Project Initiation",
    description: "We begin with comprehensive discovery and strategic planning to ensure your project starts on the right foundation.",
    icon: Code,
    color: "from-blue-500 to-blue-600",
    details: [
      "Requirements gathering and analysis",
      "Technical feasibility assessment", 
      "Project scope definition",
      "Technology stack selection",
      "Timeline and milestone planning"
    ]
  },
  {
    id: 2,
    title: "Step 2", 
    subtitle: "Prototyping and Model Development",
    description: "Rapid prototyping and MVP development to validate concepts and gather early feedback before full development.",
    icon: TestTube,
    color: "from-purple-500 to-purple-600",
    details: [
      "Interactive wireframes and mockups",
      "Technical architecture design",
      "Database schema planning",
      "API endpoint specifications",
      "User experience validation"
    ]
  },
  {
    id: 3,
    title: "Step 3",
    subtitle: "Rigorous Quality Testing", 
    description: "Comprehensive testing protocols ensure your application meets the highest standards of quality and performance.",
    icon: Shield,
    color: "from-green-500 to-green-600",
    details: [
      "Automated unit and integration testing",
      "Performance and load testing",
      "Security vulnerability assessment",
      "Cross-platform compatibility testing",
      "User acceptance testing (UAT)"
    ]
  },
  {
    id: 4,
    title: "Step 4",
    subtitle: "Seamless Deployment and Integration",
    description: "Professional deployment with CI/CD pipelines and seamless integration with your existing systems.",
    icon: Rocket,
    color: "from-orange-500 to-orange-600", 
    details: [
      "CI/CD pipeline setup",
      "Cloud infrastructure provisioning",
      "Database migration and setup",
      "Third-party API integrations",
      "Production environment configuration"
    ]
  },
  {
    id: 5,
    title: "Step 5",
    subtitle: "Proactive Continuous Monitoring",
    description: "24/7 monitoring and proactive maintenance to ensure optimal performance and immediate issue resolution.",
    icon: Monitor,
    color: "from-red-500 to-red-600",
    details: [
      "Real-time application monitoring",
      "Automated error tracking and alerts",
      "Performance metrics dashboard",
      "Security monitoring and threat detection",
      "Proactive maintenance and updates"
    ]
  },
  {
    id: 6,
    title: "Step 6",
    subtitle: "Data Driven Performance Optimization",
    description: "Continuous optimization based on real user data and analytics to maximize ROI and user satisfaction.",
    icon: BarChart3,
    color: "from-indigo-500 to-indigo-600",
    details: [
      "Analytics implementation and tracking",
      "A/B testing for feature optimization",
      "Performance bottleneck identification",
      "User behavior analysis",
      "Continuous improvement recommendations"
    ]
  }
];

export function RoadmapSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-green-50/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Proven{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Development Roadmap
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our proven 6-step methodology ensures smooth project execution from concept to deployment, 
            minimizing risks and maximizing efficiency.
          </p>
        </div>

        {/* Desktop Roadmap */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"></div>
            
            <div className="flex justify-between items-center relative z-10">
              {roadmapSteps.map((step, index) => {
                const isActive = activeStep === step.id;
                const isHovered = hoveredStep === step.id;
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={step.id}
                    className="flex flex-col items-center relative cursor-pointer"
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                    onClick={() => setActiveStep(isActive ? null : step.id)}
                    whileHover={{ y: -8 }}
                    animate={{ 
                      y: isActive ? -12 : 0,
                      scale: isActive ? 1.05 : isHovered ? 1.02 : 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                  >
                    {/* Step Card */}
                    <motion.div
                      className={`relative bg-white rounded-2xl shadow-lg border-2 p-6 w-48 text-center
                        ${isActive ? 'border-green-apple shadow-2xl' : 'border-gray-200 hover:border-gray-300'}
                        ${isActive ? 'bg-gradient-to-br from-green-50 to-white' : ''}
                      `}
                      animate={{
                        boxShadow: isActive ? 
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : 
                          "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      {/* Icon */}
                      <motion.div
                        className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center
                          bg-gradient-to-r ${step.color} text-white shadow-lg
                        `}
                        animate={{ 
                          rotate: isActive ? 360 : 0,
                          scale: isActive ? 1.1 : 1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8" />
                      </motion.div>

                      {/* Step Info */}
                      <div className="text-sm font-semibold text-gray-500 mb-1">{step.title}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {step.subtitle}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>

                    {/* Arrow (except for last step) */}
                    {index < roadmapSteps.length - 1 && (
                      <motion.div
                        className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20"
                        animate={{ x: isActive ? 4 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ChevronRight 
                          className={`w-6 h-6 transition-colors duration-300 ${
                            isActive ? 'text-green-apple' : 'text-gray-400'
                          }`} 
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {activeStep && (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-8">
                  {(() => {
                    const step = roadmapSteps.find(s => s.id === activeStep);
                    if (!step) return null;
                    const Icon = step.icon;
                    
                    return (
                      <div className="flex items-start gap-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center
                          bg-gradient-to-r ${step.color} text-white shadow-lg flex-shrink-0`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {step.subtitle}
                          </h3>
                          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                            {step.description}
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            {step.details.map((detail, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="w-2 h-2 bg-green-apple rounded-full flex-shrink-0"></div>
                                <span className="text-gray-700 font-medium">{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Roadmap */}
        <div className="lg:hidden space-y-6">
          {roadmapSteps.map((step) => {
            const isActive = activeStep === step.id;
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden"
                animate={{ 
                  borderColor: isActive ? '#22c55e' : '#e5e7eb',
                  boxShadow: isActive ? 
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : 
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <motion.div
                  className="p-6 cursor-pointer"
                  onClick={() => setActiveStep(isActive ? null : step.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center
                        bg-gradient-to-r ${step.color} text-white shadow-lg flex-shrink-0`}
                      animate={{ 
                        rotate: isActive ? 360 : 0,
                        scale: isActive ? 1.1 : 1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-500 mb-1">{step.title}</div>
                      <h3 className="text-lg font-bold text-gray-900">{step.subtitle}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6">
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="space-y-3">
                          {step.details.map((detail, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="w-2 h-2 bg-green-apple rounded-full flex-shrink-0"></div>
                              <span className="text-gray-700 font-medium text-sm">{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}