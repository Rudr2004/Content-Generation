import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Apple, Menu, ChevronDown, ChevronRight, ArrowRight, Code, Smartphone, Globe, Brain, Settings, Building, Building2, Cloud, Shield, Cog, X, ChevronLeft, Sparkles, MessageSquare, Users } from "lucide-react";
import { COMPANY_INFO, ALL_SERVICES, SERVICES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { HomeContactSection } from "@/components/contact-form-light";
import logoImg from "@assets/Logo A_1752582606982.jpg";
import { Linkedin, Twitter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertContactSubmissionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetInTouchSection } from "../get-in-touch-section";
import DynamicServicesMenu from "@/components/dynamic-services-menu";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  status: string;
}

interface ServiceSubcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  status: string;
}

interface ServicePage {
  id: number;
  title: string;
  slug: string;
  subcategoryId: number;
  status: string;
}

interface Service {
  id: number;
  title: string;
  slug: string;
  pageName: string;
  category: string;
  subCategory: string;
  status: string;
}

interface IndustryPage {
  id: number;
  title: string;
  slug: string;
  status: string;
  metaDescription?: string;
}

const staticNavItems = [
  {
    href: "/services",
    label: "Services",
    hasDropdown: true,
    dropdown: {
      sections: [
        {
          title: "AI & Machine Learning",
          items: [
            {
              label: "AI Development Services",
              href: "/services/ai-development",
              icon: Brain,
              description: "Complete AI development solutions with GPT, Claude, and custom models"
            },
            ...ALL_SERVICES.filter(s => s.category === "AI & Machine Learning").map(service => ({
              label: service.title,
              href: service.href,
              icon: Brain,
              description: service.description
            }))
          ]
        },
        {
          title: "Web3 & Blockchain",
          items: [
            {
              label: "Web3 & Blockchain Services",
              href: "/services/web3-blockchain",
              icon: Globe,
              description: "Smart contracts, DApps, DeFi, and blockchain integration solutions"
            },
            ...ALL_SERVICES.filter(s => s.category === "Web3 & Blockchain").map(service => ({
              label: service.title,
              href: service.href,
              icon: Globe,
              description: service.description
            }))
          ]
        },
        {
          title: "Mobile Development",
          items: [
            {
              label: "Mobile App Development",
              href: "/services/mobile-app-development",
              icon: Smartphone,
              description: "Native iOS, Android, and cross-platform mobile applications"
            },
            ...ALL_SERVICES.filter(s => s.category === "Mobile Development").map(service => ({
              label: service.title,
              href: service.href,
              icon: Smartphone,
              description: service.description
            }))
          ]
        },
        {
          title: "Web Development",
          items: [
            {
              label: "Web Development Services",
              href: "/services/web-development",
              icon: Code,
              description: "Custom web applications, APIs, and full-stack development"
            },
            ...ALL_SERVICES.filter(s => s.category === "Web Development").map(service => ({
              label: service.title,
              href: service.href,
              icon: Code,
              description: service.description
            }))
          ]
        },
        {
          title: "Enterprise Solutions",
          items: [
            {
              label: "Enterprise Solutions",
              href: "/services/enterprise-solutions",
              icon: Building,
              description: "ERP systems, CRM platforms, and enterprise-grade applications"
            },
            ...ALL_SERVICES.filter(s => s.category === "Enterprise Solutions").map(service => ({
              label: service.title,
              href: service.href,
              icon: Building,
              description: service.description
            }))
          ]
        },
        {
          title: "Cloud & DevOps",
          items: ALL_SERVICES.filter(s => s.category === "Cloud & DevOps").map(service => ({
            label: service.title,
            href: service.href,
            icon: Cloud,
            description: service.description
          }))
        },
        {
          title: "Automation & Testing",
          items: ALL_SERVICES.filter(s => s.category === "Automation & Testing").map(service => ({
            label: service.title,
            href: service.href,
            icon: Cog,
            description: service.description
          }))
        },
        {
          title: "IoT & Security",
          items: ALL_SERVICES.filter(s => s.category === "IoT & Security").map(service => ({
            label: service.title,
            href: service.href,
            icon: Shield,
            description: service.description
          }))
        },
        {
          title: "Design & UX",
          items: ALL_SERVICES.filter(s => s.category === "Design & UX").map(service => ({
            label: service.title,
            href: service.href,
            icon: Settings,
            description: service.description
          }))
        },
        {
          title: "Custom Services",
          items: [
            { label: "Browse All Services", href: "/services", icon: ArrowRight, description: "Explore our complete service portfolio" },
            { label: "Service Categories", href: "/services", icon: Building, description: "Browse services by category" }
          ]
        }
      ]
    }
  },
  {
    href: "/industry",
    label: "Industry",
    hasDropdown: true,
    dropdown: {
      sections: [
        {
          title: "Industries We Serve",
          items: [
            {
              label: "Health",
              href: "/industry/health",
              icon: Building2,
              description: "Healthcare technology solutions and digital health platforms"
            }
          ]
        }
      ]
    }
  },
  {
    href: "/blog",
    label: "Blog",
    hasDropdown: true,
    dropdown: {
      sections: [
        {
          title: "Blog Categories",
          items: [
            { label: "Web3", href: "/blog?category=Web3", icon: Globe, description: "Web3 and blockchain insights" },
            { label: "AI and Machine Learning", href: "/blog?category=AI and Machine Learning", icon: Brain, description: "AI and ML development insights" },
            { label: "Mobile Development", href: "/blog?category=Mobile Development", icon: Smartphone, description: "Mobile app development insights" },
            { label: "Software Engineering", href: "/blog?category=Software Engineering", icon: Code, description: "Software engineering best practices" },
            { label: "Digital Transformation", href: "/blog?category=Digital Transformation", icon: Building, description: "Digital transformation strategies" }
          ]
        }
      ]
    }
  },
  {
    href: "/case-studies",
    label: "Case Studies",
    hasDropdown: false
  }
];

// Modal Contact Form Component
function ModalContactForm() {
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
      pageSource: "Let's Connect Modal",
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
    <>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 heading-georgia">
        Start Your Project Today
      </h3>

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
                  <FormLabel className="font-medium text-poppins">First Name *</FormLabel>
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
                  <FormLabel className="font-medium text-poppins">Last Name *</FormLabel>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-poppins">Email Address *</FormLabel>
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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-poppins">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      className="h-10 sm:h-12"
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
                <FormLabel className="font-medium text-poppins">Service Interested In</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10 sm:h-12">
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
                <FormLabel className="font-medium text-poppins">Project Details *</FormLabel>
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
            className="w-full font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))',
              color: 'var(--btn-primary-text, #ffffff)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, var(--gradient-start, #2563eb), var(--gradient-middle, #9333ea), var(--gradient-end, #db2777))';
              e.currentTarget.style.filter = 'brightness(0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))';
            }}
          >
            {contactMutation.isPending ? "Sending..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}

export function Navigation() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load service data from API
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['/api/service-categories']
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ['/api/service-subcategories']
  });

  const { data: pages = [] } = useQuery<ServicePage[]>({
    queryKey: ['/api/service-pages']
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  // Query for hire developer pages
  const { data: hireDeveloperPages = [] } = useQuery({
    queryKey: ["/api/hire-developer-pages"],
    queryFn: async () => {
      const response = await fetch("/api/hire-developer-pages");
      if (!response.ok) throw new Error("Failed to fetch hire developer pages");
      return response.json();
    }
  });

  // Query for industry pages
  const { data: industryPages = [] } = useQuery<IndustryPage[]>({
    queryKey: ["/api/industry-pages"],
    queryFn: async () => {
      const response = await fetch("/api/industry-pages");
      if (!response.ok) throw new Error("Failed to fetch industry pages");
      return response.json();
    }
  });

  // State for managing accordion expansion
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<number>>(new Set());

  // Create dynamic navigation items with hierarchical data
  const getNavItems = () => {
    const dynamicServicesItem = {
      href: "/services",
      label: "Services",
      hasDropdown: true,
      dropdown: {
        sections: categories.map(category => ({
          title: category.name,
          items: subcategories
            .filter(sub => sub.categoryId === category.id)
            .map(subcategory => ({
              label: subcategory.name,
              href: `/services/${category.slug}/${subcategory.slug}`,
              icon: Brain,
              description: `${subcategory.name} services`,
              hasSubmenu: true,
              submenu: pages
                .filter(page => page.subcategoryId === subcategory.id)
                .map(page => ({
                  label: page.title,
                  href: `/services/${category.slug}/${subcategory.slug}/${page.slug}`,
                  description: `${page.title} services`
                }))
            }))
        }))
      }
    };

    // Dynamic hire developer items from the database
    const hireDevelopersItem = {
      label: "Hire Developers",
      hasDropdown: true,
      dropdown: {
        sections: [
          {
            title: "",
            items: hireDeveloperPages
              .filter((page: any) => page.status === 'published')
              .map((page: any) => ({
                label: page.title,
                href: `/hire-developers/${page.slug}`
              }))
          }
        ]
      }
    };

    // Dynamic industry items from the database
    const industryItem = {
      href: "/industry",
      label: "Industry",
      hasDropdown: true,
      dropdown: {
        sections: [
          {
            title: "Industries We Serve",
            items: industryPages
              .filter((page: IndustryPage) => page.status === 'published')
              .map((page: IndustryPage) => ({
                label: page.title,
                href: `/industry/${page.slug}`,
                icon: Building2,
                description: page.metaDescription || `${page.title} solutions and services`
              }))
          }
        ]
      }
    };

    return [
      dynamicServicesItem,
      hireDevelopersItem,
      industryItem,
      ...staticNavItems.slice(2) || [] // Skip Services and Industry from static items
    ];
  };

  const navItems = getNavItems();

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to check if a slug is valid (no HTML content)
  const isValidSlug = (slug: string) => {
    if (!slug || typeof slug !== 'string') return false;
    // Check for HTML tags or invalid characters
    const hasHTML = /<[^>]*>/.test(slug);
    const hasInvalidChars = /[<>]/.test(slug);
    return !hasHTML && !hasInvalidChars && slug.trim().length > 0;
  };

  // Helper function to get services and pages for a subcategory
  const getItemsForSubcategory = (subcategoryId: number) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory) return [];
    return [
      ...pages.filter(page => page.subcategoryId === subcategoryId && page.status === 'active' && isValidSlug(page.slug)).map(page => ({
        label: page.title,
        href: `/service-pages/${page.slug}`,
        type: 'page' as const
      })),
      ...services.filter(service =>
        (service.subCategory === subcategory.name || service.subCategory === subcategory.slug) &&
        service.status === 'active' &&
        service.pageName &&
        isValidSlug(service.slug)
      ).map(service => ({
        label: service.pageName || service.title,
        href: `/services/${service.slug}`,
        type: 'service' as const
      }))
    ];
  };

  // Toggle functions for accordion
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  return (
    <motion.nav
      className={`border-b fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
      style={{
        backgroundColor: 'var(--navbar-bg, #ffffff)',
        borderColor: 'var(--navbar-border, #f3f4f6)',
        color: 'var(--navbar-text, #4b5563)'
      }}
      animate={{
        height: isScrolled ? 60 : 80,
        backgroundColor: isScrolled ? 'var(--navbar-bg, rgba(255, 255, 255, 0.98))' : 'var(--navbar-bg, rgba(255, 255, 255, 1))'
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <motion.div
          className="flex justify-between items-center"
          animate={{ height: isScrolled ? 60 : 80 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
            <motion.div
              className="flex items-center justify-center"
              animate={{
                width: isScrolled ? 32 : 40,
                height: isScrolled ? 32 : 40
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.img
                src={logoImg}
                alt={`${siteName} Logo - AI Development & Enterprise Software Solutions Company`}
                className="w-full h-full object-contain"
                loading="eager"
                style={{ maxWidth: '100%', height: 'auto' }}
                animate={{
                  width: isScrolled ? 32 : 40,
                  height: isScrolled ? 32 : 40
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center w-full h-full">
                        <div 
                          class="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                          style={{
                            background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))',
                            color: 'var(--btn-primary-text, #ffffff)'
                          }}
                        >
                          GA
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </motion.div>
            <motion.div
              className="hidden sm:block"
              animate={{
                opacity: isScrolled ? 0 : 1,
                x: isScrolled ? -20 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <span 
                className="text-lg sm:text-xl lg:text-2xl font-normal bg-clip-text text-transparent transition-all duration-300 heading-georgia"
                style={{
                  background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                {siteName}
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
            {navItems.map((item, index) => {
              // Special handling for Services menu - use dynamic component
              if (item.label === "Services") {
                return (
                  <div
                    key="services-menu"
                    className="relative group"
                    onMouseEnter={() => {
                      if (dropdownTimeout.current) {
                        clearTimeout(dropdownTimeout.current);
                      }
                      setActiveDropdown("Services");
                    }}
                    onMouseLeave={() => {
                      dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
                    }}
                  >
                    <DynamicServicesMenu
                      className="relative"
                      onMenuClose={() => setActiveDropdown(null)}
                      isOpen={activeDropdown === "Services"}
                    />
                  </div>
                );
              }

              // Regular navigation items
              return (
                <div
                  key={item.href || item.label}
                  className="relative group"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      if (dropdownTimeout.current) {
                        clearTimeout(dropdownTimeout.current);
                      }
                      setActiveDropdown(item.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasDropdown) {
                      dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
                    }
                  }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 transition-colors font-medium text-base lg:text-lg text-poppins ${location === item.href ? "bg-clip-text text-transparent" : ""}`}
                      style={{
                        color: location === item.href ? 'transparent' : 'var(--navbar-text, #374151)',
                        background: location === item.href 
                          ? 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
                          : 'transparent',
                        WebkitBackgroundClip: location === item.href ? 'text' : 'initial',
                        backgroundClip: location === item.href ? 'text' : 'initial'
                      }}
                      onMouseEnter={(e) => {
                        if (location !== item.href) {
                          e.currentTarget.style.background = 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))';
                          e.currentTarget.style.WebkitBackgroundClip = 'text';
                          e.currentTarget.style.backgroundClip = 'text';
                          e.currentTarget.style.color = 'transparent';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (location !== item.href) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--navbar-text, #374151)';
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""
                          }`} />
                      )}
                    </Link>
                  ) : (
                    <div
                      className="flex items-center space-x-1 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-colors font-medium text-base lg:text-lg text-poppins cursor-default"
                    >
                      <span>{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""
                          }`} />
                      )}
                    </div>
                  )}

                  {/* Dropdown with bridge area */}
                  {item.hasDropdown && activeDropdown === item.label && (
                    <>
                      {/* Invisible bridge to prevent dropdown from closing */}
                      <div className="absolute top-full left-0 w-[900px] xl:w-[1200px] h-2 z-40" style={{ transform: "translateX(-25%)" }} />

                      <div
                        className={`absolute top-full left-0 mt-2 rounded-lg shadow-lg border z-50 hover:cursor-pointer ${item.label === "Hire Developers"
                          ? "w-[250px] -translate-x-1/2"
                          : "w-[900px] xl:w-[1200px]"
                          }`}
                        style={{
                          backgroundColor: 'var(--navbar-bg, #ffffff)',
                          borderColor: 'var(--navbar-border, #e5e7eb)',
                          boxShadow: item.label === "Hire Developers" ? "0 4px 20px -2px rgba(0, 0, 0, 0.1)" : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                          transform: item.label === "Hire Developers" ? "translateX(-50%)" : "translateX(-25%)"
                        }}
                        onMouseEnter={() => {
                          if (dropdownTimeout.current) {
                            clearTimeout(dropdownTimeout.current);
                          }
                          setActiveDropdown(item.label);
                        }}
                        onMouseLeave={() => {
                          dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
                        }}
                      >
                        <div className={item.label === "Hire Developers" ? "p-2" : "p-8"}>
                          {item.label === "Hire Developers" ? (
                            // Clickable vertical list for Hire Developers with custom scrollbar
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 space-y-0 hover:cursor-pointer">
                              {item.dropdown?.sections[0]?.items.map((subItem: any, subIndex: number) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  className="group block px-3 py-2.5 text-sm border-b last:border-b-0 relative overflow-hidden transition-all duration-300"
                                  style={{
                                    color: 'var(--navbar-text, #374151)',
                                    borderColor: 'var(--navbar-border, #f3f4f6)'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))';
                                    e.currentTarget.style.color = 'var(--navbar-active, #2563eb)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--navbar-text, #374151)';
                                  }}
                                >
                                  <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                                    style={{
                                      background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
                                    }}
                                  ></div>
                                  <div className="relative flex items-center justify-between">
                                    <span className="font-medium group-hover:font-semibold transition-all duration-200">
                                      {subItem.label}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            // Complex layout for other dropdowns
                            <div
                              className="grid grid-cols-1 gap-6"
                              style={{
                                gridTemplateColumns:
                                  item.dropdown?.sections?.length === 2
                                    ? '1fr 1fr'
                                    : item.dropdown?.sections?.length === 3
                                      ? '1fr 1fr 1fr'
                                      : (item.dropdown?.sections?.length ?? 0) > 3
                                        ? 'repeat(3, 1fr)'
                                        : '1fr'
                              }}
                            >
                              {item.dropdown?.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    {section.title}
                                  </h3>
                                  <div className="space-y-2">
                                    {section.items.map((subItem: any, subIndex: number) => {
                                      const Icon = (subItem as any).icon;
                                      return (
                                        <Link
                                          key={subIndex}
                                          href={subItem.href}
                                          className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 hover:border hover:border-blue-200 transition-all duration-200 group border border-transparent"
                                          onClick={() => setActiveDropdown(null)}
                                        >
                                          <div className="flex items-start space-x-3">
                                            {Icon && (
                                              <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                              <div className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors leading-tight">
                                                {subItem.label}
                                              </div>
                                              {(subItem as any).description && (
                                                <div className="text-xs text-gray-500 mt-1 leading-tight">
                                                  {(subItem as any).description}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Right Side Action Buttons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                onClick={handleContactClick}
                className="bg-transparent hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 px-3 lg:px-8 py-2 lg:py-3 font-normal rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm lg:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <span className="hidden lg:inline">Let's Connect</span>
                <span className="lg:hidden">Connect</span>
              </Button>
            </div>
          </div>

          {/* Mobile and Tablet Navigation */}
          <div className="xl:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 ml-2">
                  <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] lg:w-[400px] overflow-y-auto">
                <div className="flex flex-col space-y-3 mt-6 px-2">
                  {navItems.map((item) => (
                    <div key={item.href} className="space-y-2">
                      {!item.hasDropdown ? (
                        <Link
                          href={item.href}
                          className={`block text-lg sm:text-xl transition-colors font-medium text-poppins px-2 py-1 rounded-lg ${location === item.href ? "bg-clip-text text-transparent" : ""}`}
                          style={{
                            color: location === item.href ? 'transparent' : 'var(--navbar-text, #374151)',
                            background: location === item.href 
                              ? 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
                              : 'transparent',
                            WebkitBackgroundClip: location === item.href ? 'text' : 'initial',
                            backgroundClip: location === item.href ? 'text' : 'initial'
                          }}
                          onMouseEnter={(e) => {
                            if (location !== item.href) {
                              e.currentTarget.style.background = 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))';
                              e.currentTarget.style.WebkitBackgroundClip = 'text';
                              e.currentTarget.style.backgroundClip = 'text';
                              e.currentTarget.style.color = 'transparent';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (location !== item.href) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'var(--navbar-text, #374151)';
                            }
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <div>
                          <button
                            onClick={() => setMobileActiveDropdown(mobileActiveDropdown === item.label ? null : item.label)}
                            className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-lg sm:text-xl font-medium transition-all duration-300 text-poppins ${location === item.href ? "bg-clip-text text-transparent" : ""}`}
                            style={{
                              color: location === item.href ? 'transparent' : (mobileActiveDropdown === item.label ? 'var(--navbar-active, #2563eb)' : 'var(--navbar-text, #374151)'),
                              background: location === item.href 
                                ? 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
                                : (mobileActiveDropdown === item.label ? 'var(--navbar-hover, #eff6ff)' : 'transparent'),
                              WebkitBackgroundClip: location === item.href ? 'text' : 'initial',
                              backgroundClip: location === item.href ? 'text' : 'initial'
                            }}
                            onMouseEnter={(e) => {
                              if (location !== item.href && mobileActiveDropdown !== item.label) {
                                e.currentTarget.style.background = 'var(--navbar-hover, #eff6ff)';
                                e.currentTarget.style.color = 'var(--navbar-active, #2563eb)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (location !== item.href && mobileActiveDropdown !== item.label) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--navbar-text, #374151)';
                              }
                            }}
                          >
                            <span className="transition-colors duration-300">{item.label}</span>
                            <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${mobileActiveDropdown === item.label ? "rotate-180 text-blue-500" : ""}`} />
                          </button>

                          {/* Mobile Dropdown Content */}
                          <AnimatePresence>
                            {mobileActiveDropdown === item.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-2 sm:ml-4 mt-2 space-y-1 border-l-2 border-blue-100"
                              >
                                {item.label === "Services" ? (
                                  // Three-layer structure for Services
                                  <div className="space-y-2">
                                    {categories
                                      .filter(cat => cat.status === 'active')
                                      .map((category) => {
                                        const isCatOpen = expandedCategories.has(category.id);
                                        return (
                                          <div key={category.id} className="border-b border-gray-200 pb-2">
                                            <button
                                              onClick={() => toggleCategory(category.id)}
                                              className="w-full flex justify-between items-center px-2 py-1 text-sm sm:text-base font-medium text-gray-700 hover:bg-blue-50 rounded"
                                            >
                                              <span>{category.name}</span>
                                              <ChevronDown className={`w-4 h-4 transition-transform ${isCatOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            <AnimatePresence>
                                              {isCatOpen && (
                                                <motion.div
                                                  initial={{ opacity: 0, height: 0 }}
                                                  animate={{ opacity: 1, height: "auto" }}
                                                  exit={{ opacity: 0, height: 0 }}
                                                  transition={{ duration: 0.2 }}
                                                  className="ml-4 mt-2 space-y-1"
                                                >
                                                  {subcategories
                                                    .filter(sub => sub.categoryId === category.id && sub.status === 'active')
                                                    .map((subcategory) => {
                                                      const isSubOpen = expandedSubcategories.has(subcategory.id);
                                                      return (
                                                        <div key={subcategory.id} className="border-b border-gray-200 pb-1">
                                                          <button
                                                            onClick={() => toggleSubcategory(subcategory.id)}
                                                            className="w-full flex justify-between items-center px-2 py-1 text-sm sm:text-base font-medium text-gray-700 hover:bg-blue-50 rounded"
                                                          >
                                                            <span>{subcategory.name}</span>
                                                            <ChevronDown className={`w-4 h-4 transition-transform ${isSubOpen ? "rotate-180" : ""}`} />
                                                          </button>
                                                          <AnimatePresence>
                                                            {isSubOpen && (
                                                              <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="ml-4 mt-2 space-y-1"
                                                              >
                                                                {getItemsForSubcategory(subcategory.id).map((item, index) => (
                                                                  <Link
                                                                    key={`${item.href}-${index}`}
                                                                    href={item.href}
                                                                    className="block text-sm sm:text-base text-gray-700 hover:bg-blue-50 px-2 py-1 rounded"
                                                                    onClick={() => {
                                                                      setMobileMenuOpen(false); // Close the menu on click
                                                                      setMobileActiveDropdown(null); // Reset dropdown state
                                                                    }}
                                                                  >
                                                                    {item.label}
                                                                  </Link>
                                                                ))}
                                                              </motion.div>
                                                            )}
                                                          </AnimatePresence>
                                                        </div>
                                                      );
                                                    })}
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        );
                                      })}
                                  </div>
                                ) : item.label === "Hire Developers" ? (
                                  // Simple list for Hire Developers with enhanced mobile styling and scrollbar
                                  <div className="pl-2 sm:pl-4 space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 hover:cursor-pointer">
                                    {item.dropdown?.sections[0]?.items.map((subItem: any, subIndex: number) => (
                                      <Link
                                        key={subIndex}
                                        href={subItem.href}
                                        className="group block text-sm sm:text-base text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 px-3 py-2 rounded-lg border border-transparent hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
                                        onClick={() => {
                                          setMobileMenuOpen(false);
                                          setMobileActiveDropdown(null);
                                        }}
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-between">
                                          <span className="font-medium group-hover:font-semibold transition-all duration-200">
                                            {subItem.label}
                                          </span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  // Default dropdown for other items (Blog, Case Studies)
                                  item.dropdown?.sections.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="pl-2 sm:pl-4">
                                      <h4 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-3 first:mt-0 text-poppins">
                                        {section.title}
                                      </h4>
                                      <div className="space-y-1">
                                        {section.items.map((subItem: any, subIndex: number) => {
                                          const Icon = (subItem as any).icon;
                                          return (
                                            <Link
                                              key={subIndex}
                                              href={subItem.href}
                                              className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                                              onClick={() => {
                                                setMobileMenuOpen(false); // Close the menu on click
                                                setMobileActiveDropdown(null); // Reset dropdown state
                                              }}
                                            >
                                              {Icon && (
                                                <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                              )}
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs sm:text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors truncate text-poppins">
                                                  {subItem.label}
                                                </div>
                                                {(subItem as any).description && (
                                                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2 text-poppins leading-tight">
                                                    {(subItem as any).description}
                                                  </div>
                                                )}
                                              </div>
                                            </Link>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-8 space-y-3 px-2">
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setContactModalOpen(true);
                      }}
                      className="w-full text-white py-2.5 sm:py-3 font-normal rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base" 
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        background: 'linear-gradient(to right, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(0.9)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'none';
                      }}
                    >
                      Let's Connect
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-6xl lg:max-w-7xl p-0 border-0 bg-black/20 backdrop-blur-sm">
              <motion.div
                initial={{ y: -100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -100, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200, duration: 0.4 }}
                className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto border border-white/20"
              >
                {/* Header */}
                <div className="text-center py-6 px-4 sm:px-6 lg:px-10">
                  <motion.h2
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight heading-georgia"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    Ready to Transform Your{" "}
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Digital Future?
                    </span>
                  </motion.h2>
                  <motion.p
                    className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed text-poppins"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    Let's discuss your project and explore how {siteName} can help you achieve your technology goals.
                  </motion.p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-10 pb-10">
                  {/* Right - Form */}
                  <div className="order-1 lg:order-2">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
                      <ModalContactForm />
                    </div>
                  </div>

                  {/* Left - Info */}
                  <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                    {/* Get in Touch */}
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 w-full">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 heading-georgia">Get in Touch</h3>
                      <div className="space-y-6">
                        {/* Office */}
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">Our Office - Massachusetts</div>
                            <p className="text-gray-600 text-sm text-poppins">
                              732 Princeton Blvd apt 7<br />
                              Lowell, MA 01851
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">Call Us</div>
                            <p className="text-gray-600 text-sm text-poppins">(617) 946-6898</p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">Email Us</div>
                            <p className="text-gray-600 text-sm text-poppins">sales@greenapplex.com</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 heading-georgia">Our Locations</h3>
                      <div className="space-y-6">
                        {[
                          {
                            city: "Massachusetts",
                            address: ["732 Princeton Blvd apt 7", "Lowell, MA 01851"],
                            phone: "(617) 946-6898",
                            dotColor: "bg-pink-500",
                          },
                          {
                            city: "Delaware",
                            address: ["16192 Coastal Hwy", "Lewes, DE 19958"],
                            phone: "(630) 446-0410",
                            dotColor: "bg-blue-500",
                          },
                        ].map(({ city, address, phone, dotColor }, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <span className={`w-2 h-2 mt-2 ${dotColor} rounded-full flex-shrink-0`} />
                            <div className="text-poppins text-gray-600 space-y-1">
                              <div className="font-semibold text-gray-800">{city}</div>
                              {address.map((line, j) => (
                                <div key={j}>{line}</div>
                              ))}
                              <div>{phone}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}