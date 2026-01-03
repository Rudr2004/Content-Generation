import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, DollarSign, Clock, CheckCircle } from "lucide-react";

interface DeveloperProfile {
  name: string;
  title: string;
  image: string;
  experience: string;
  hourlyRate: string;
  rating: number;
  skills: string[];
  description: string;
  badge?: 'Super Dev' | 'Top Hire';
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Sample developer profiles based on the reference site
const developerProfiles: DeveloperProfile[] = [
  {
    name: "Sagar P.",
    title: "Sr. LLM Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    experience: "7+ years",
    hourlyRate: "$45",
    rating: 4.8,
    badge: "Super Dev",
    skills: ["Python", "PyTorch", "Transformers", "NLP"],
    description: "7 years of experience developing and fine-tuning language models for healthcare and finance applications. His data collection and annotation expertise ensures high-quality inputs for accurate predictive modelling."
  },
  {
    name: "Anjali R.",
    title: "Sr. LLM Developer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face&auto=format",
    experience: "6+ years",
    hourlyRate: "$42",
    rating: 4.6,
    badge: "Top Hire",
    skills: ["TensorFlow", "BERT", "GPT", "Sentiment Analysis"],
    description: "6 years of experience specializing in applying NLP techniques to enhance customer experiences in the e-commerce and retail sectors. Proficient in unsupervised learning and data pre-processing."
  },
  {
    name: "Vikram S.",
    title: "Sr. LLM Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    experience: "8+ years",
    hourlyRate: "$48",
    rating: 4.9,
    badge: "Super Dev",
    skills: ["Hugging Face", "LangChain", "OpenAI API", "RAG"],
    description: "8 years of experience in sentiment analysis and topic modeling, particularly within the finance and legal industries. Uses advanced NLP libraries for precise and actionable insights from large text datasets."
  }
];

export function HireDeveloperProfiles() {
  const handleCTAClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Meet The Best Developers For Hire!
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Our expert developers excel in cutting-edge technologies and industry best practices 
            to ensure high-quality solutions and optimal performance for your business projects.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {developerProfiles.map((developer, index) => (
            <motion.div key={index} variants={fadeUp}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative">
                      <img
                        src={developer.image}
                        alt={developer.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {developer.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {developer.title}
                      </p>
                      {developer.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            developer.badge === 'Super Dev' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          ✨ {developer.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">
                          {developer.hourlyRate}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">per hour</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-lg font-bold text-gray-900 ml-1">
                          {developer.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">rating</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-lg font-bold text-gray-900 ml-1">
                          {developer.experience}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">experience</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {developer.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {developer.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={handleCTAClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2"
                  >
                    Hire Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}