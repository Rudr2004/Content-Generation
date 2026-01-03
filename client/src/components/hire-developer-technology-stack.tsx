import { motion } from "framer-motion";
import { Code, Brain, Server, Shield, Database, Smartphone, Cloud } from "lucide-react";

interface TechnologyStack {
  frontend?: string[];
  backend?: string[];
  devops?: string[];
  machineLearning?: string[];
  database?: string[];
  mobile?: string[];
  informationSecurity?: string[];
}

interface HireDeveloperTechnologyStackProps {
  technologyStack: string | null;
  aiTechnologies: string | null;
  developerType: string;
}

const categoryIcons = {
  frontend: Code,
  backend: Server,
  devops: Cloud,
  machineLearning: Brain,
  database: Database,
  mobile: Smartphone,
  informationSecurity: Shield
};

const categoryColors = {
  frontend: "from-blue-500 to-cyan-500",
  backend: "from-green-500 to-emerald-500",
  devops: "from-purple-500 to-violet-500",
  machineLearning: "from-orange-500 to-red-500",
  database: "from-indigo-500 to-blue-500",
  mobile: "from-pink-500 to-rose-500",
  informationSecurity: "from-gray-600 to-gray-800"
};

export function HireDeveloperTechnologyStack({
  technologyStack,
  aiTechnologies,
  developerType
}: HireDeveloperTechnologyStackProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  // PRIORITY 1: Use aiTechnologies field if available (as requested)
  if (aiTechnologies && aiTechnologies.trim()) {
    const technologies = aiTechnologies.split(',').map(tech => tech.trim()).filter(Boolean);
    
    if (technologies.length > 0) {
      return (
        <motion.div {...fadeInUp} className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 overflow-hidden">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Technology Stack</h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto px-2">
              Core technologies used by our {developerType} developers
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-none overflow-hidden">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 rounded-lg text-xs sm:text-sm font-medium border border-gray-200 hover:from-blue-100 hover:to-purple-100 transition-colors break-words max-w-full flex-shrink-0"
                data-testid={`tech-tag-${index}`}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      );
    }
  }

  // PRIORITY 2: Fallback to structured technologyStack (JSON format) if aiTechnologies is empty
  if (technologyStack) {
    try {
      const techStack: TechnologyStack = JSON.parse(technologyStack);
      
      const categoryMapping = [
        { key: 'frontend', name: 'Frontend', technologies: techStack.frontend || [] },
        { key: 'backend', name: 'Backend', technologies: techStack.backend || [] },
        { key: 'devops', name: 'DevOps', technologies: techStack.devops || [] },
        { key: 'machineLearning', name: 'Machine Learning', technologies: techStack.machineLearning || [] },
        { key: 'database', name: 'Database', technologies: techStack.database || [] },
        { key: 'mobile', name: 'Mobile', technologies: techStack.mobile || [] },
        { key: 'informationSecurity', name: 'Information Security', technologies: techStack.informationSecurity || [] }
      ].filter(category => category.technologies.length > 0);

      if (categoryMapping.length > 0) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
            {categoryMapping.map((category, index) => {
              const IconComponent = categoryIcons[category.key as keyof typeof categoryIcons];
              
              return (
                <motion.div
                  key={category.key}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${categoryColors[category.key as keyof typeof categoryColors]} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 break-words">{category.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1 overflow-hidden">
                      {category.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors break-words flex-shrink-0 max-w-full"
                          data-testid={`tech-category-${category.key}-${techIndex}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        );
      }
    } catch (error) {
      // If structured format fails, fall through to simple format
    }
  }

  // No technology data available
  return (
    <div className="text-center py-8 text-gray-500">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-xl flex items-center justify-center">
        <Code className="h-8 w-8 text-gray-400" />
      </div>
      <p>Technology stack information will be displayed here once configured.</p>
    </div>
  );
}