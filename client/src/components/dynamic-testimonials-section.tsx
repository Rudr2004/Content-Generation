import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, User, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileImageByGender, getGradientByGender, getGenderFromName, getBackupProfileImage } from "@/lib/profile-images";

interface Testimonial {
  id: number;
  serviceId: number;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  testimonialText: string;
  rating: number;
  createdAt: string;
  gender?: string;
}

interface DynamicTestimonialsSectionProps {
  serviceId?: number;
  serviceCategory?: string;
  fallbackTestimonials?: Testimonial[];
  isHirePage?: boolean;
  hirePageTitle?: string;
}

// Fallback testimonials if no dynamic data available
const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    serviceId: 0,
    clientName: "Sarah Johnson",
    clientPosition: "CEO",
    clientCompany: "TechStart Inc.",
    testimonialText: "Working with GreenAppleX transformed our business operations completely. Their expertise in digital solutions helped us increase efficiency by 300% and reduce operational costs significantly.",
    rating: 5,
    createdAt: new Date().toISOString(),
    gender: "female"
  },
  {
    id: 2,
    serviceId: 0,
    clientName: "Michael Chen",
    clientPosition: "CTO",
    clientCompany: "InnovateCorp",
    testimonialText: "The team's technical expertise and attention to detail exceeded our expectations. They delivered a robust solution that scaled perfectly with our growing business needs.",
    rating: 5,
    createdAt: new Date().toISOString(),
    gender: "male"
  },
  {
    id: 3,
    serviceId: 0,
    clientName: "Emily Rodriguez",
    clientPosition: "Director of Operations",
    clientCompany: "GrowthDynamics",
    testimonialText: "Professional, reliable, and results-driven. GreenAppleX helped us achieve a 40% increase in ROI within the first quarter of implementation.",
    rating: 5,
    createdAt: new Date().toISOString(),
    gender: "female"
  },
  {
    id: 4,
    serviceId: 0,
    clientName: "David Thompson",
    clientPosition: "Founder",
    clientCompany: "StartupNext",
    testimonialText: "Exceptional service delivery and innovative solutions. The team helped us launch our platform 2 months ahead of schedule with outstanding quality.",
    rating: 5,
    createdAt: new Date().toISOString(),
    gender: "male"
  },
  {
    id: 5,
    serviceId: 0,
    clientName: "Jennifer Martinez",
    clientPosition: "VP of Technology",
    clientCompany: "FutureTech Solutions",
    testimonialText: "The AI integration expertise was phenomenal. Our business processes are now 50% more efficient thanks to their innovative approach.",
    rating: 5,
    createdAt: new Date().toISOString(),
    gender: "female"
  }
];

export function DynamicTestimonialsSection({
  serviceId,
  serviceCategory,
  fallbackTestimonials = DEFAULT_TESTIMONIALS,
  isHirePage = false,
  hirePageTitle
}: DynamicTestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch testimonials for this specific service or hire page
  const { data: serviceTestimonials = [], isLoading } = useQuery({
    queryKey: [isHirePage ? '/api/hire-developer-pages' : '/api/services', serviceId, 'testimonials'],
    queryFn: async () => {
      if (!serviceId) return [];
      const endpoint = isHirePage
        ? `/api/hire-developer-pages/${serviceId}/testimonials`
        : `/api/services/${serviceId}/testimonials`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          console.log(`Failed to fetch testimonials from ${endpoint}:`, response.status);
          return [];
        }
        const data = await response.json();
        return data.testimonials || [];
      } catch (error) {
        console.error(`Error fetching testimonials from ${endpoint}:`, error);
        return [];
      }
    },
    enabled: !!serviceId
  });

  // Use service-specific testimonials if available, otherwise fallback
  const testimonials = serviceTestimonials.length > 0 ? serviceTestimonials : fallbackTestimonials;
  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  // Navigation functions
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (testimonials.length === 0) {
    return null; // Don't render if no testimonials
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how our solutions have transformed businesses and delivered exceptional results for our clients.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12">
                    {/* Avatar & Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-6 sm:mb-8">
                      <div className="flex items-center space-x-4 sm:space-x-6">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white shadow-md">
                          <AvatarImage 
                            src={(() => {
                              const gender = currentTestimonial.gender || getGenderFromName(currentTestimonial.clientName);
                              return getProfileImageByGender(gender, currentTestimonial.clientName, hirePageTitle);
                            })()} 
                            alt={currentTestimonial.clientName}
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const gender = currentTestimonial.gender || getGenderFromName(currentTestimonial.clientName);
                              const backupImage = getBackupProfileImage(gender);
                              
                              // Only change if not already using backup
                              if (target.src !== backupImage) {
                                console.warn(`Failed to load profile image for ${currentTestimonial.clientName}, using backup`);
                                target.src = backupImage;
                              }
                            }}
                          />
                          <AvatarFallback className={`bg-gradient-to-br ${getGradientByGender(currentTestimonial.gender || getGenderFromName(currentTestimonial.clientName))} text-white text-xl font-semibold`}>
                            {currentTestimonial.clientName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{currentTestimonial.clientName}</h4>
                          <p className="text-base sm:text-lg font-medium text-gray-700">
                            {currentTestimonial.clientPosition} at {currentTestimonial.clientCompany}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="text-center sm:text-right">
                        <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                          {currentTestimonial.rating || 5}.0
                        </div>
                        <div className="flex items-center justify-center sm:justify-end gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 sm:w-6 sm:h-6 ${i < (currentTestimonial.rating || 5)
                                ? 'text-orange-400 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed mb-6">
                      "{currentTestimonial.testimonialText}"
                    </blockquote>

                    {/* Quality Metrics */}
                    <div className="border-t border-red-200 pt-4 sm:pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                        {["Quality", "Schedule & Timing", "Communication"].map((metric, idx) => (
                          <div key={idx}>
                            <div className="text-sm font-medium text-gray-600 mb-1 sm:mb-2">{metric}</div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{currentTestimonial.rating || 5}.0</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 md:gap-6 mt-8">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                data-testid="button-prev-testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </Button>

              {/* Dots Navigation */}
              <div className="flex gap-2">
                {testimonials.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-blue-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    data-testid={`dot-testimonial-${index}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                data-testid="button-next-testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </Button>

              {/* Auto-play Control */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAutoPlay}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group ml-4"
                data-testid="button-toggle-autoplay"
              >
                {isAutoPlaying ? (
                  <Pause className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                ) : (
                  <Play className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}