import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface Technology {
  id: number;
  name: string;
  category: string;
  iconType: string;
  iconData?: string;
  iconColor?: string;
  description?: string;
  status: string;
  displayOrder: number;
}

interface ServiceTechnologyStackProps {
  category?: string;
  subCategory?: string;
  serviceTitle?: string;
  content?: string;
}

// Service category to technology category mapping
const serviceToTechnologyMapping: Record<string, string[]> = {
  "AI & Machine Learning": ["AI/ML", "Backend", "Database", "Cloud"],
  "Web3 & Blockchain": ["Blockchain", "Frontend", "Backend", "Database"],
  "Mobile Development": ["Mobile", "Backend", "Database", "Cloud"],
  "Web Development": ["Frontend", "Backend", "Database", "Cloud"],
  "Enterprise Solutions": ["Backend", "Database", "DevOps", "Frontend"],
  "Cloud & DevOps": ["DevOps", "Database", "Backend", "Cloud"],
  "IoT & Security": ["DevOps", "Security", "Backend", "Database"],
  "Design & UX": ["Frontend", "Mobile"],
  "Automation & Testing": ["Testing", "DevOps", "Backend"]
};

export function DynamicServiceTechnologyStack({ 
  category = "", 
  subCategory = "", 
  serviceTitle = "",
  content = ""
}: ServiceTechnologyStackProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch all technologies from the database
  const { data: allTechnologies = [], isLoading } = useQuery({
    queryKey: ['/api/technologies'],
    queryFn: () => fetch('/api/technologies').then(res => res.json())
  });

  useEffect(() => {
    // Determine which technology categories to show based on service category
    const categoryKey = category || "Web Development";
    const techCategories = serviceToTechnologyMapping[categoryKey] || ["Frontend", "Backend", "Database"];
    setSelectedCategories(techCategories);
  }, [category, subCategory]);

  // Filter technologies based on selected categories and active status
  const filteredTechnologies = allTechnologies
    .filter((tech: Technology) => 
      tech.status === 'active' && 
      selectedCategories.includes(tech.category)
    )
    .sort((a: Technology, b: Technology) => {
      // First sort by category priority (based on selected categories order)
      const aCategoryIndex = selectedCategories.indexOf(a.category);
      const bCategoryIndex = selectedCategories.indexOf(b.category);
      if (aCategoryIndex !== bCategoryIndex) {
        return aCategoryIndex - bCategoryIndex;
      }
      // Then by display order
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      // Finally by name
      return a.name.localeCompare(b.name);
    });

  // Group technologies by category
  const groupedTechnologies = filteredTechnologies.reduce((acc: Record<string, Technology[]>, tech: Technology) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading technologies...</p>
        </div>
      </div>
    );
  }

  if (filteredTechnologies.length === 0) {
    return (
      <div className="w-full py-8">
        <h3 className="text-2xl font-bold text-center mb-4">Technologies We Use</h3>
        <p className="text-center text-gray-600">No technologies configured for this service category.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Technologies We Use
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We leverage cutting-edge technologies and industry-leading tools to deliver 
            exceptional {category?.toLowerCase() || 'development'} solutions that meet your business needs.
          </p>
        </motion.div>

        <Tabs defaultValue={selectedCategories[0]} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8" style={{ gridTemplateColumns: `repeat(${Math.min(selectedCategories.length, 4)}, 1fr)` }}>
            {selectedCategories.slice(0, 4).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-sm" data-testid={`tab-${cat.toLowerCase()}`}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {selectedCategories.map((categoryName) => {
            const techs = groupedTechnologies[categoryName] || [];
            if (techs.length === 0) return null;

            return (
              <TabsContent key={categoryName} value={categoryName}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8"
                >
                  {techs.map((tech: Technology, index: number) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      data-testid={`tech-item-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4 flex flex-col items-center text-center h-full">
                          <div className="mb-3 flex-shrink-0">
                            {tech.iconData ? (
                              <div 
                                className="text-2xl w-12 h-12 flex items-center justify-center rounded-lg shadow-sm"
                                style={{ color: tech.iconColor || '#000000' }}
                                data-testid={`tech-icon-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              >
                                {tech.iconData}
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                {tech.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-1 flex-grow flex items-center">
                            {tech.name}
                          </h4>
                          {tech.description && (
                            <p className="text-xs text-gray-500 line-clamp-2" title={tech.description}>
                              {tech.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="text-center">
                  <Badge variant="outline" className="px-4 py-2">
                    {techs.length} {categoryName} {techs.length === 1 ? 'Technology' : 'Technologies'}
                  </Badge>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h4 className="text-xl font-bold mb-2">Ready to Get Started?</h4>
            <p className="mb-4 opacity-90">
              Let's discuss how we can leverage these technologies for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                data-testid="button-contact-us"
              >
                Contact Us
              </a>
              <a 
                href="/portfolio" 
                className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                data-testid="button-view-portfolio"
              >
                View Portfolio
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DynamicServiceTechnologyStack;