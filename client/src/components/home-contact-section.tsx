import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertContactSubmissionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SERVICES } from "@/lib/constants";
import { GetInTouchSection } from "./get-in-touch-section";

export function HomeContactSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
      pageSource: "Home Page",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent successfully!",
        description: "We've received your message and will get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
    },
    onError: () => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const submissionData = {
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim(),
    };
    contactMutation.mutate(submissionData);
  };

  return (
    <section id="contact-section" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 heading-georgia leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-poppins leading-relaxed px-4 sm:px-0">
            Let's discuss how our AI, Web3, and digital solutions can accelerate your growth.
            Get a free consultation with our experts.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Left Column - Contact Info & Locations */}
          <div className="order-2 xl:order-1 space-y-8 sm:space-y-10">
            {/* Get in Touch Section */}
            <div>
              <GetInTouchSection />
            </div>

            {/* Our Locations */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 heading-georgia">Our Locations</h3>
              <div className="space-y-6">
                {/* Massachusetts */}
                <div className="flex gap-3 sm:gap-4 items-start">
                  <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                  <div className="text-poppins text-gray-600 space-y-1 text-sm sm:text-base">
                    <div className="font-semibold text-gray-800">Massachusetts</div>
                    <div>732 Princeton Blvd apt 7</div>
                    <div>Lowell, MA 01851</div>
                    <div>(617) 946-6898</div>
                  </div>
                </div>

                {/* Delaware */}
                <div className="flex gap-3 sm:gap-4 items-start">
                  <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <div className="text-poppins text-gray-600 space-y-1 text-sm sm:text-base">
                    <div className="font-semibold text-gray-800">Delaware</div>
                    <div>16192 Coastal Hwy</div>
                    <div>Lewes, DE 19958</div>
                    <div>(630) 446-0410</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="order-1 xl:order-2">
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl mx-auto xl:max-w-none">
              <div className="text-center xl:text-left mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 heading-georgia">
                  Start Your Project Today
                </h3>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  {/* Name Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                            First Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="h-11 sm:h-12 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                              style={{
                                '::placeholder': { color: 'var(--form-input-text, #6b7280)' }
                              } as any}
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                            Last Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="h-11 sm:h-12 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              {...field}
                              className="h-11 sm:h-12 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              {...field}
                              className="h-11 sm:h-12 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Company Field */}
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company"
                            {...field}
                            className="h-11 sm:h-12 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Service Dropdown */}
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                          Service Interested In
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 sm:h-12 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-200 rounded-md shadow-lg">
                            {SERVICES.map((service) => (
                              <SelectItem
                                key={service.title}
                                value={service.title}
                                className="hover:bg-gray-50 hover:ring-2 hover:ring-blue-200 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300 transition-all duration-200 cursor-pointer px-3 py-2 text-sm sm:text-base"
                              >
                                {service.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm sm:text-base font-medium text-poppins block text-left">
                          Project Details *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project requirements..."
                            {...field}
                            className="min-h-[110px] sm:min-h-[130px] resize-none w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base leading-relaxed p-3"
                            style={{
                              backgroundColor: 'var(--form-input-bg, #ffffff)',
                              borderColor: 'var(--form-input-border, #d1d5db)',
                              color: 'var(--form-input-text, #1a1a1a)'
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.filter = 'brightness(0.9)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'none';
                      }}
                    >
                      {contactMutation.isPending ? "Sending..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
