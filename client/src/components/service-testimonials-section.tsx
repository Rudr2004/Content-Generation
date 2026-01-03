import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileImageByGender, getGradientByGender, getGenderFromName } from "@/lib/profile-images";

interface ServiceTestimonial {
  id: number;
  serviceId: number;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  testimonialText: string;
  rating: number;
  gender?: string;
  createdAt: string;
}

interface ServiceTestimonialsSectionProps {
  serviceId?: number;
  testimonials?: ServiceTestimonial[];
  className?: string;
}

// Enhanced fallback testimonials for service pages
const SERVICE_TESTIMONIALS_FALLBACK: ServiceTestimonial[] = [
  {
    id: 1,
    serviceId: 0,
    clientName: "Emily Carter",
    clientPosition: "CTO",
    clientCompany: "TechInnovate Solutions",
    testimonialText: "The AI development team delivered exceptional results, transforming our customer engagement with intelligent automation that exceeded our expectations.",
    rating: 5,
    gender: "female",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    serviceId: 0,
    clientName: "Michael Thompson",
    clientPosition: "Founder",
    clientCompany: "StartupNext Inc.",
    testimonialText: "Outstanding technical expertise and seamless project execution. The blockchain solution revolutionized our business operations with enhanced security and transparency.",
    rating: 5,
    gender: "male",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    serviceId: 0,
    clientName: "Sophia Kim",
    clientPosition: "VP of Engineering", 
    clientCompany: "NextGen Dynamics",
    testimonialText: "Professional service delivery and innovative approach. The web development team created a scalable platform that perfectly matched our business requirements.",
    rating: 5,
    gender: "female",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    serviceId: 0,
    clientName: "James Wilson",
    clientPosition: "Product Manager",
    clientCompany: "InnovateX Technologies",
    testimonialText: "Exceptional mobile app development with cutting-edge features. The team delivered ahead of schedule with remarkable attention to detail and user experience.",
    rating: 5,
    gender: "male",
    createdAt: new Date().toISOString()
  }
];

export function ServiceTestimonialsSection({ 
  serviceId, 
  testimonials, 
  className = ""
}: ServiceTestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch service-specific testimonials
  const { data: apiTestimonials = [], isLoading } = useQuery({
    queryKey: ['/api/services', serviceId, 'testimonials'],
    queryFn: async () => {
      if (!serviceId) return [];
      try {
        const response = await fetch(`/api/services/${serviceId}/testimonials`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.log('Failed to fetch service testimonials:', error);
        return [];
      }
    },
    enabled: !!serviceId
  });

  // Use provided testimonials, API testimonials, or fallback
  const displayTestimonials = testimonials || apiTestimonials.length > 0 
    ? apiTestimonials 
    : SERVICE_TESTIMONIALS_FALLBACK;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || displayTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayTestimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? displayTestimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  if (displayTestimonials.length === 0) {
    return null;
  }

  const currentTestimonial = displayTestimonials[currentIndex];

  return (
    <section className={`py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Client Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our solutions have transformed businesses and delivered exceptional results
            </p>
          </motion.div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -300, scale: 0.9 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <CardContent className="p-8 md:p-12">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-gray-700 text-lg md:text-xl text-center leading-relaxed mb-8 font-medium">
                      "{currentTestimonial.testimonialText}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg mb-4">
                        <AvatarImage 
                          src={getProfileImageByGender(
                            currentTestimonial.gender || getGenderFromName(currentTestimonial.clientName),
                            currentTestimonial.clientName
                          )} 
                          alt={currentTestimonial.clientName}
                          className="object-cover"
                        />
                        <AvatarFallback className={`bg-gradient-to-br ${getGradientByGender(
                          currentTestimonial.gender || getGenderFromName(currentTestimonial.clientName)
                        )} text-white text-lg font-semibold`}>
                          {currentTestimonial.clientName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                          {currentTestimonial.clientName}
                        </h4>
                        <p className="text-gray-600 font-medium mb-1">
                          {currentTestimonial.clientPosition}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          {currentTestimonial.clientCompany}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < (currentTestimonial.rating || 5)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-3 text-lg font-semibold text-gray-900">
                        {currentTestimonial.rating || 5}.0
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          {displayTestimonials.length > 1 && (
            <div className="flex items-center justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="rounded-full bg-white/80 backdrop-blur-sm border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                data-testid="testimonial-previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-blue-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    data-testid={`testimonial-dot-${index}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="rounded-full bg-white/80 backdrop-blur-sm border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                data-testid="testimonial-next"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}