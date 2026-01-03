import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { getProfileImageByGender, getGradientByGender, getGenderFromName } from "@/lib/profile-images";

interface Testimonial {
  quote: string;
  client: string;
  role?: string;
  company?: string;
  rating?: number;
  image?: string;
  gender?: string;
}

interface HirePageTestimonial {
  id: number;
  hirePageId: number;
  clientName: string;
  clientCompany: string;
  clientPosition: string;
  testimonialText: string;
  rating: number;
  gender: string;
  createdAt: string;
}

interface HireDeveloperTestimonialsProps {
  hirePageId?: number;
  developerType?: string;
  testimonials?: Testimonial[];
  hirePageTitle?: string;
}

// Generate random ratings between 4.2 and 4.9
const generateRating = (clientName: string) => {
  // Generate consistent rating based on client name to avoid changing on re-renders
  const nameHash = clientName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 4.2 + (nameHash % 8) * 0.1; // Creates ratings from 4.2 to 4.9
  return Math.round(rating * 10) / 10;
};

// Professional client images for testimonials
const clientImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format",
];

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

export function HireDeveloperTestimonials({ hirePageId, developerType, testimonials: propTestimonials, hirePageTitle }: HireDeveloperTestimonialsProps) {
  // Fetch testimonials from API if hirePageId is provided
  const { data: apiTestimonials = [], isLoading } = useQuery({
    queryKey: [`/api/hire-developer-pages/${hirePageId}/testimonials/public`],
    queryFn: async () => {
      if (!hirePageId) return [];
      try {
        const response = await fetch(`/api/hire-developer-pages/${hirePageId}/testimonials/public`);
        if (!response.ok) return [];
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },
    enabled: !!hirePageId
  });

  // Map API testimonials to component format
  const mappedTestimonials: Testimonial[] = apiTestimonials.map((item: HirePageTestimonial) => ({
    quote: item.testimonialText,
    client: item.clientName,
    role: item.clientPosition,
    company: item.clientCompany,
    rating: item.rating,
    gender: item.gender
  }));

  const testimonials = mappedTestimonials.length > 0 ? mappedTestimonials : (propTestimonials || []);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-60 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover why leading companies choose our developers for their most critical projects
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {testimonials.map((testimonial, index) => {
            // Determine gender for proper profile image matching
            const clientGender = testimonial.gender || getGenderFromName(testimonial.client);
            const rating = testimonial.rating || generateRating(testimonial.client);
            const profileImage = getProfileImageByGender(clientGender, testimonial.client, hirePageTitle);
            
            return (
              <motion.div key={index} variants={fadeUp}>
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Quote className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-base text-gray-700 mb-6 leading-relaxed text-center font-medium">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Client Profile Section */}
                    <div className="flex flex-col items-center mb-4">
                      <Avatar className="w-16 h-16 border-3 border-white shadow-lg mb-3">
                        <AvatarImage 
                          src={profileImage} 
                          alt={testimonial.client}
                          className="object-cover"
                        />
                        <AvatarFallback className={`bg-gradient-to-br ${getGradientByGender(clientGender)} text-white text-lg font-semibold`}>
                          {testimonial.client.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900 mb-1">
                          {testimonial.client}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {testimonial.role || 'CTO'} • {testimonial.company || 'Tech Company'}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm font-bold text-gray-900 ml-2">
                        {rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}