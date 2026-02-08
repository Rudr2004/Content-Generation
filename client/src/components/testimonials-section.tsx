import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { getProfileImageByGender, getGradientByGender } from "@/lib/profile-images";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
            style={{ color: "var(--header-text, #111827)" }}
          >
            What Our{" "}
            <span
              style={{
                background:
                  "linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Clients Say
            </span>
          </h2>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--header-text, #4b5563)" }}
          >
            Trusted by solopreneurs and lean tech founders worldwide
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Background Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
              
              <div className="relative z-10 p-6 md:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="text-center"
                  >
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6 md:mb-8">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <Quote className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 md:mb-12 leading-relaxed font-medium max-w-4xl mx-auto">
                      "{TESTIMONIALS[currentIndex].content}"
                    </blockquote>

                    {/* Client Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
                      {/* Profile Image */}
                      <div className="relative">
                        <img
                          src={getProfileImageByGender(TESTIMONIALS[currentIndex].gender, TESTIMONIALS[currentIndex].avatar)}
                          alt={TESTIMONIALS[currentIndex].name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-lg border-4 border-white"
                          onError={(e) => {
                            // Fallback to gradient avatar if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${getGradientByGender(TESTIMONIALS[currentIndex].gender)} rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg hidden`}>
                          {TESTIMONIALS[currentIndex].name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      
                      {/* Client Details */}
                      <div className="text-center sm:text-left">
                        <div className="font-bold text-xl md:text-2xl text-gray-900 mb-1">
                          {TESTIMONIALS[currentIndex].name}
                        </div>
                        <div className="text-gray-600 text-base md:text-lg">
                          {TESTIMONIALS[currentIndex].role}
                        </div>
                        <div className="text-blue-600 font-semibold text-base md:text-lg">
                          {TESTIMONIALS[currentIndex].company}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center items-center gap-2 mb-8 md:mb-12">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => {
                          const rating = TESTIMONIALS[currentIndex].rating;
                          const isFilled = i < Math.floor(rating);
                          const isPartial = i === Math.floor(rating) && rating % 1 !== 0;
                          
                          return (
                            <div key={i} className="relative">
                              <Star
                                className={`w-6 h-6 md:w-8 md:h-8 ${
                                  isFilled ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                              />
                              {isPartial && (
                                <Star
                                  className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 absolute top-0 left-0"
                                  fill="currentColor"
                                  style={{
                                    clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-2xl md:text-3xl font-bold text-gray-900 ml-2">
                        {TESTIMONIALS[currentIndex].rating.toFixed(1)}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls - Hidden on Mobile */}
                <div className="hidden md:flex items-center justify-center gap-4 md:gap-6">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:text-blue-600 transition-colors" />
                  </Button>

                  {/* Dots Navigation */}
                  <div className="flex items-center gap-2 md:gap-3 px-4">
                    {TESTIMONIALS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full ${
                          index === currentIndex
                            ? 'w-8 h-3 md:w-10 md:h-4 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                            : 'w-3 h-3 md:w-4 md:h-4 bg-gray-300 hover:bg-gray-400 hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:text-blue-600 transition-colors" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { number: "200+", label: "Happy Clients" },
            { number: "500+", label: "Projects Delivered" },
            { number: "4.8", label: "Average Rating" },
            { number: "98%", label: "Client Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}