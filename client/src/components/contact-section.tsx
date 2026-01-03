import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, MapPin, Phone, Mail, Linkedin, Twitter, Github, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema } from "@shared/schema";
import { COMPANY_INFO, SERVICES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export function ContactSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(true); // Always visible now since it's on the page

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
      if (data.emailSent) {
        toast({
          title: "Message sent successfully!",
          description: "We've received your message and will get back to you within 24 hours.",
        });
      } else {
        toast({
          title: "Message received!",
          description: "We've received your message and will get back to you within 24 hours.",
        });
      }
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    // Combine first and last name for email templates
    const submissionData = {
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim()
    };
    contactMutation.mutate(submissionData);
  };

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 heading-georgia">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Let's discuss how our AI, Web3, and digital solutions can accelerate your growth.
              Get a free consultation with our experts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Our Locations */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 heading-georgia">
                  Our Locations
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2"></span>
                    <span className="text-gray-600 text-poppins">Los Angeles, USA</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span className="text-gray-600 text-poppins">New York, USA</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                    <span className="text-gray-600 text-poppins">Oshawa, Canada</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 heading-georgia">
                Start Your Project Today
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium text-poppins">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium text-poppins">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium text-poppins">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@company.com"
                              type="email"
                              {...field}
                              className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium text-poppins">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1 (555) 123-4567"
                              type="tel"
                              {...field}
                              className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-poppins">Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company"
                            {...field}
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-poppins">Service Interested In</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-12 focus:ring-1 focus:ring-purple-500">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-200">
                            {SERVICES.map((service) => (
                              <SelectItem 
                                key={service.title} 
                                value={service.title} 
                                className="hover:bg-gray-50 hover:ring-2 hover:ring-blue-200 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300 transition-all duration-200 cursor-pointer"
                              >
                                {service.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium text-poppins">Project Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project requirements..."
                            {...field}
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-purple-500 min-h-[120px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-poppins border-0"
                    style={{ color: "white" }}
                  >
                    {contactMutation.isPending ? "Sending..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
