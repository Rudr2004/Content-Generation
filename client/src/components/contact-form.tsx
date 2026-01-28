import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema } from "@shared/schema";
import { SERVICES } from "@/lib/constants";
import { LoaderCircle } from "lucide-react";
import { GetInTouchSection } from "./get-in-touch-section";

export function ContactForm() {
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
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
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
    contactMutation.mutate(data);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Right Column: Form (Shown first in mobile, second in desktop) */}
      <div className="order-1 lg:order-2 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 heading-georgia">Start Your Project Today</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-poppins">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        className="h-10 sm:h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-poppins">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        className="h-10 sm:h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-poppins">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        {...field}
                        className="h-10 sm:h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium text-poppins">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        className="h-10 sm:h-12 bg-gray-50 border-gray-200 placeholder-gray-500 text-gray-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-poppins">Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Company"
                      {...field}
                      className="h-10 sm:h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Service Select */}
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-poppins">Service Interested In</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-12 bg-gray-50 border-gray-200 text-gray-900">
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

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-poppins">Project Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your project requirements..."
                      {...field}
                      className="min-h-[100px] sm:min-h-[120px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              className="w-full text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
              }}
            >
              {contactMutation.isPending ? "Sending..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Left Column: Get in Touch + Locations (Shown after form in mobile) */}
      <div className="order-2 lg:order-1 space-y-10">
        {/* Get in Touch */}
        <div className="order-2 lg:order-1">
          <GetInTouchSection />
        </div>

        {/* Our Locations */}
        <div className="order-3 lg:order-2 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 heading-georgia">Our Locations</h3>
          <div className="space-y-6">


            {/* Massachusetts */}
            <div className="flex gap-4 items-start">
              <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full flex-shrink-0"></span>
              <div className="text-poppins text-gray-600 space-y-1">
                <div className="font-semibold text-gray-800">Massachusetts</div>
                <div>732 Princeton Blvd apt 7</div>
                <div>Lowell, MA 01851</div>
                <div>(617) 946-6898</div>
              </div>
            </div>

            {/* Delaware */}
            <div className="flex gap-4 items-start">
              <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              <div className="text-poppins text-gray-600 space-y-1">
                <div className="font-semibold text-gray-800">Delaware</div>
                <div>16192 Coastal Hwy</div>
                <div>Lewes, DE 19958</div>
                <div>(630) 446-0410</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}