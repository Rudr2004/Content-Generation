import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Zap, Users, Settings, Target, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { parseMarkdownToHtml } from '@/lib/markdown-utils';

interface ProcessStep {
  step: string;
  description: string;
  icon?: string;
}

interface HireDeveloperProcessSectionProps {
  processTitle?: string;
  processDescription?: string;
  processSteps?: ProcessStep[] | string;
  className?: string;
}

export function HireDeveloperProcessSection({
  processTitle = "Our Hiring Process",
  processDescription = "We follow a streamlined process to connect you with the best developers for your project needs.",
  processSteps,
  className = ""
}: HireDeveloperProcessSectionProps) {
  console.log('HireDeveloperProcessSection rendering:', { processTitle, processSteps });
  
  // Parse process steps if they're stored as JSON string
  let steps: ProcessStep[] = [];
  
  if (processSteps) {
    if (typeof processSteps === 'string') {
      try {
        steps = JSON.parse(processSteps);
        console.log('Parsed steps from string:', steps);
      } catch (error) {
        // Fallback: treat as plain text and create default steps
        console.warn('Failed to parse process steps JSON:', error);
        steps = defaultProcessSteps;
      }
    } else if (Array.isArray(processSteps)) {
      steps = processSteps;
      console.log('Using provided steps array:', steps);
    }
  }

  // Default process steps if none provided
  if (steps.length === 0) {
    console.log('Using default process steps');
    steps = defaultProcessSteps;
  }

  // Icon mapping for process steps
  const iconMap: { [key: string]: any } = {
    'CheckCircle': CheckCircle,
    'Target': Target,
    'Users': Users,
    'Settings': Settings,
    'Zap': Zap,
    'Clock': Clock,
    'Shield': Shield,
    'ArrowRight': ArrowRight
  };

  const getIconComponent = (iconName?: string) => {
    if (iconName && iconMap[iconName]) {
      return iconMap[iconName];
    }
    return CheckCircle; // Default icon
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          className="text-center mb-16"
        >
          <h2 
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            data-testid="process-title"
          >
            {processTitle}
          </h2>
          <div 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHtml(processDescription || '')
            }}
            data-testid="process-description"
          />
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => {
            const IconComponent = getIconComponent(step.icon);
            
            return (
              <motion.div
                key={index}
                variants={stepVariants}
                className="group"
                data-testid={`process-step-${index}`}
              >
                <Card className="h-full bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-200 hover:border-blue-200 group-hover:border-purple-200">
                  <CardContent className="p-6 lg:p-8 h-full flex flex-col">
                    {/* Step Number and Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-5 w-5 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 
                        className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors duration-300 leading-tight break-words hyphens-auto"
                        data-testid={`process-step-title-${index}`}
                      >
                        {step.step}
                      </h3>
                      <div 
                        className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed flex-1 break-words hyphens-auto [overflow-wrap:anywhere]"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdownToHtml(step.description || '')
                        }}
                        data-testid={`process-step-description-${index}`}
                      />
                    </div>

                    {/* Decorative Elements */}
                    <div className="mt-6 pt-4 border-t border-gray-100 group-hover:border-blue-200 transition-colors duration-300">
                      <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                        <span>Step {index + 1}</span>
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={titleVariants}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Our streamlined process ensures you get the right developers for your project quickly and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="process-cta-button"
                onClick={() => {
                  const contactElement = document.getElementById('contact');
                  if (contactElement) {
                    contactElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Start Your Project
              </button>
              <button 
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                data-testid="process-learn-more-button"
                onClick={() => {
                  const contactElement = document.getElementById('contact');
                  if (contactElement) {
                    contactElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Default process steps for fallback
const defaultProcessSteps: ProcessStep[] = [
  {
    step: "Discovery & Consultation",
    description: "We start by understanding your project requirements, technical needs, and business objectives through detailed consultation.",
    icon: "Target"
  },
  {
    step: "Developer Matching",
    description: "Our expert team carefully selects and matches developers with the specific skills and experience needed for your project.",
    icon: "Users"
  },
  {
    step: "Technical Assessment",
    description: "Selected developers undergo rigorous technical evaluations to ensure they meet our high standards and your specific requirements.",
    icon: "Settings"
  },
  {
    step: "Team Integration",
    description: "We facilitate smooth onboarding and integration of developers into your existing team and workflows.",
    icon: "Zap"
  },
  {
    step: "Project Kickoff",
    description: "With clear communication channels established, your dedicated development team begins working on your project immediately.",
    icon: "CheckCircle"
  },
  {
    step: "Ongoing Support",
    description: "We provide continuous support, regular check-ins, and ensure project milestones are met throughout the development process.",
    icon: "Shield"
  }
];