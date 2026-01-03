"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Users } from "lucide-react";
import {
  getProfileImageByGender,
  getGenderFromName,
  getBackupProfileImage,
} from "@/lib/profile-images";

interface Testimonial {
  quote: string;
  client: string;
  role?: string;
  company?: string;
  rating?: number;
  image?: string;
  clientImage?: string;
  gender?: string;
}

interface HireDeveloperTestimonialsSliderProps {
  testimonials: Testimonial[];
  hirePageTitle?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

const generateRating = (index: number, multiplier: number) => {
  const base = 4.2 + ((index * multiplier) % 0.8);
  return Math.round(base * 10) / 10;
};

export function HireDeveloperTestimonialsSlider({
  testimonials,
  hirePageTitle,
}: HireDeveloperTestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, testimonials.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) =>
      newDirection === 1
        ? prevIndex === testimonials.length - 1
          ? 0
          : prevIndex + 1
        : prevIndex === 0
          ? testimonials.length - 1
          : prevIndex - 1
    );
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-10 sm:mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-6 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300">
              <Users className="w-5 h-5 mr-2" />
              Client's Feedback
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              Real results from businesses that transformed their operations
              with our cutting-edge AI solutions and achieved unprecedented
              growth.
            </p>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className="overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) paginate(1);
                  else if (swipe > swipeConfidenceThreshold) paginate(-1);
                }}
                className="p-6 sm:p-8 md:p-12"
              >
                {/* Card */}
                <Card className="h-full border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-300 rounded-xl sm:rounded-2xl min-h-[250px] sm:min-h-[300px] relative overflow-hidden">
                  <CardContent className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
                      {/* Left - Avatar + Info */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mr-3 sm:mr-4 flex-shrink-0 overflow-hidden bg-gray-100 ring-2 ring-gray-200">
                          <img
                            src={(() => {
                              const current = testimonials[currentIndex];
                              const name =
                                current.client?.split(",")[0]?.trim() || "User";
                              const gender = current.gender || getGenderFromName(name);
                              return (
                                current.clientImage ||
                                getProfileImageByGender(gender, name, hirePageTitle)
                              );
                            })()}
                            alt={
                              testimonials[currentIndex].client?.split(",")[0] || "Client"
                            }
                            className="w-full h-full object-cover"
                            loading="eager"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const current = testimonials[currentIndex];
                              const name = current.client?.split(",")[0]?.trim() || "User";
                              const gender = current.gender || getGenderFromName(name);
                              const backupImage = getBackupProfileImage(gender);

                              // Only change if not already using backup
                              if (target.src !== backupImage) {
                                console.warn(`Failed to load profile image for ${name}, using backup`);
                                target.src = backupImage;
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-1">
                            {testimonials[currentIndex].client?.split(",")[0] ||
                              "Client Name"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                            {testimonials[currentIndex].role || "Company Name"}
                          </p>
                        </div>
                      </div>

                      {/* Right - Rating */}
                      <div className="flex items-center sm:items-end flex-col sm:flex-col">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
                          {generateRating(currentIndex, 0.13)}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(generateRating(currentIndex, 0.13))
                                ? "fill-orange-400 text-orange-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>


                    {/* Quote */}
                    <blockquote className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed flex-1 mb-6 sm:mb-8">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          Quality
                        </p>
                        <p className="text-base sm:text-lg md:text-2xl font-bold text-gray-900">
                          {generateRating(currentIndex, 0.17)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          Schedule
                        </p>
                        <p className="text-base sm:text-lg md:text-2xl font-bold text-gray-900">
                          {generateRating(currentIndex, 0.21)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          Communication
                        </p>
                        <p className="text-base sm:text-lg md:text-2xl font-bold text-gray-900">
                          {generateRating(currentIndex, 0.11)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="
        absolute left-2 sm:left-4 
        top-1/2 -translate-y-1/2
        bg-white/80 backdrop-blur-sm border-gray-200 
        hover:bg-white hover:scale-110 
        transition-all duration-200 shadow-lg z-10
        h-8 w-8 sm:h-10 sm:w-10
      "
                onClick={() => paginate(-1)}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="
        absolute right-2 sm:right-4 
        top-1/2 -translate-y-1/2
        bg-white/80 backdrop-blur-sm border-gray-200 
        hover:bg-white hover:scale-110 
        transition-all duration-200 shadow-lg z-10
        h-8 w-8 sm:h-10 sm:w-10
      "
                onClick={() => paginate(1)}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}


          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HireDeveloperTestimonialsSlider;