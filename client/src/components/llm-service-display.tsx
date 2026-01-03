import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface LLMServiceData {
  heroSection: {
    headline: string;
    subheading: string;
    ctaButton: string;
  };
  serviceOfferings: {
    title: string;
    subtitle: string;
    description: string;
    services: Array<{
      title: string;
      description: string;
    }>;
  };
  trustSignals: {
    title: string;
    subtitle: string;
    description: string;
    metrics: Array<{
      label: string;
      value: string;
    }>;
  };
  capabilities: {
    title: string;
    subtitle: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  technicalFoundation: {
    title: string;
    subtitle: string;
    description: string;
    technologies: Array<{
      title: string;
      description: string;
    }>;
  };
  technologyStack: {
    title: string;
    subtitle: string;
    description: string;
    categories: Array<{
      title: string;
      items: string[];
      description: string;
    }>;
  };
  methodology: {
    title: string;
    subtitle: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  clientTestimonials: {
    title: string;
    subtitle: string;
    description: string;
    testimonials: Array<{
      name: string;
      title: string;
      company: string;
      avatar: string;
      rating: number;
      overallRating: number;
      testimonial: string;
      metrics: {
        quality: number;
        schedule: number;
        communication: number;
      };
    }>;
  };
  faqs: {
    title: string;
    subtitle: string;
    description: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  finalCTA: {
    title: string;
    subtitle: string;
    description: string;
    ctaButton: string;
  };
}

interface LLMServiceDisplayProps {
  data: LLMServiceData;
}

export function LLMServiceDisplay({ data }: LLMServiceDisplayProps) {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Testimonials slider
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      let interval: NodeJS.Timeout;

      const startAutoPlay = () => {
        interval = setInterval(() => {
          emblaApi.scrollNext();
        }, 3000); // Faster scrolling - every 3 seconds
      };

      const stopAutoPlay = () => {
        if (interval) {
          clearInterval(interval);
        }
      };

      // Start auto-play immediately
      startAutoPlay();

      // Get the carousel container
      const carouselContainer = emblaApi.containerNode();

      // Add mouse enter/leave event listeners
      carouselContainer.addEventListener("mouseenter", stopAutoPlay);
      carouselContainer.addEventListener("mouseleave", startAutoPlay);

      return () => {
        stopAutoPlay();
        carouselContainer.removeEventListener("mouseenter", stopAutoPlay);
        carouselContainer.removeEventListener("mouseleave", startAutoPlay);
      };
    }
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-5">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {data.heroSection.headline}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
            {data.heroSection.subheading}
          </p>
          <Button
            onClick={scrollToContact}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            {data.heroSection.ctaButton}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.serviceOfferings?.title || 'Our Services'}
            </h2>
            {data.serviceOfferings?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                {data.serviceOfferings.subtitle}
              </h3>
            )}
            {data.serviceOfferings?.description && (
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {data.serviceOfferings.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.serviceOfferings?.services?.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    <CheckCircle className="w-6 h-6 text-green-500 inline-block mr-2" />
                    {service.name || service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.trustSignals?.title || 'Trusted Partners'}
            </h2>
            {data.trustSignals?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                {data.trustSignals.subtitle}
              </h3>
            )}
            {data.trustSignals?.description && (
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {data.trustSignals.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {data.trustSignals?.metrics?.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-4 shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm md:text-base font-medium opacity-90">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.capabilities?.title || 'Advanced Capabilities'}
            </h2>
            {data.capabilities?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                {data.capabilities.subtitle}
              </h3>
            )}
            {data.capabilities?.description && (
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {data.capabilities.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.capabilities?.items?.map((item, index) => {
              const icons = [Globe, Zap, Shield];
              const IconComponent = icons[index] || Star;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                >
                  <CardHeader className="pb-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Foundation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.technicalFoundation?.title || 'Technical Foundation'}
            </h2>
            {data.technicalFoundation?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                {data.technicalFoundation.subtitle}
              </h3>
            )}
            {data.technicalFoundation?.description && (
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {data.technicalFoundation.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.technicalFoundation?.technologies?.map((tech, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                  {tech.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {data.technologyStack?.title || 'Technology Stack'}
            </h2>
            {data.technologyStack?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-400 mb-6">
                {data.technologyStack.subtitle}
              </h3>
            )}
            {data.technologyStack?.description && (
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                {data.technologyStack.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.technologyStack?.categories?.map((category, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-blue-400">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {category.items.map((item, itemIndex) => (
                      <Badge
                        key={itemIndex}
                        variant="secondary"
                        className="bg-blue-900/50 text-blue-300 hover:bg-blue-900/70"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.methodology?.title || 'Our Methodology'}
            </h2>
            {data.methodology?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                {data.methodology.subtitle}
              </h3>
            )}
            {data.methodology?.description && (
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {data.methodology.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.methodology?.steps?.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 mt-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {data.clientTestimonials?.title || 'Client Testimonials'}
            </h2>
            {data.clientTestimonials?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-200 mb-6">
                {data.clientTestimonials.subtitle}
              </h3>
            )}
            {data.clientTestimonials?.description && (
              <p className="text-xl text-purple-100 max-w-4xl mx-auto">
                {data.clientTestimonials.description}
              </p>
            )}
          </div>

          {/* Auto-scrolling Testimonials */}
          <div className="relative">
            {/* Embla Carousel with continuous scroll */}
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {/* Duplicate testimonials for seamless loop */}
                {[
                  ...(data.clientTestimonials?.testimonials || []),
                  ...(data.clientTestimonials?.testimonials || []),
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_30%] pl-4"
                  >
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 h-full mx-2 shadow-2xl">
                      {/* Header with client info and rating */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/30"
                          />
                          <div>
                            <h4 className="font-bold text-white text-lg">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-blue-200">
                              {testimonial.title}
                            </p>
                            <p className="text-sm text-purple-200">
                              at {testimonial.company}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            {testimonial.overallRating}
                          </div>
                          <div className="flex text-yellow-300">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Testimonial content */}
                      <div className="relative mb-6">
                        <Quote className="absolute -top-3 -left-3 w-10 h-10 text-purple-300/50" />
                        <p className="text-white italic leading-relaxed pl-8 text-base">
                          "{testimonial.testimonial}"
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                        <div className="text-center">
                          <div className="text-xs text-purple-200 mb-2">
                            Quality
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {testimonial.metrics.quality}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-purple-200 mb-2">
                            Schedule & Timing
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {testimonial.metrics.schedule}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-purple-200 mb-2">
                            Communication
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {testimonial.metrics.communication}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-scroll indicator */}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.faqs?.title || 'Frequently Asked Questions'}
            </h2>
            {data.faqs?.subtitle && (
              <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
                {data.faqs.subtitle}
              </h3>
            )}
            {data.faqs?.description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {data.faqs.description}
              </p>
            )}
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {data.faqs?.questions?.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
    </div>
  );
}
