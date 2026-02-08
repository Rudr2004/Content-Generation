import React, { useState, useMemo } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowRight,
  Star,
  TrendingUp,
  Building2,
  Loader2,
  Zap,
  Target,
  MessageSquare,
  Send,
  FileText,
  Coins,
  Code2,
  Users,
  LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { COMPANY_INFO, ALL_SERVICES } from "@/lib/constants";
import { HOMEPAGE_SERVICES } from "@/lib/homepage-content";
import { getServiceDescription, isJsonLike } from "@/lib/service-content-utils";
import type { Service } from "@shared/schema";

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

const SERVICE_ICONS: LucideIcon[] = [TrendingUp, MessageSquare, Send, FileText, Coins, Zap, Code2, Target, Users];

interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  type: "service" | "hire" | "static";
}

export default function ModernServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const isBootsolo = COMPANY_INFO.name === "Bootsolo";

  const { data: apiServices = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/service-categories"],
  });

  const { data: subcategories = [] } = useQuery<ServiceSubcategory[]>({
    queryKey: ["/api/service-subcategories"],
  });

  const { data: pages = [] } = useQuery<ServicePage[]>({
    queryKey: ["/api/service-pages"],
  });

  const services = useMemo((): ServiceCardItem[] => {
    if (isBootsolo && apiServices.length === 0) {
      return HOMEPAGE_SERVICES.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: "Growth Services",
        href: `/contact?interest=${encodeURIComponent(s.id)}`,
        type: "service" as const,
      }));
    }

    const items: ServiceCardItem[] = [];

    apiServices
      .filter((s) => s.status === "published" || s.status === "active")
      .forEach((s) => {
        if (s.slug) {
          const svc = s as { excerpt?: string; metaDescription?: string };
          const excerpt = svc.excerpt?.trim();
          const meta = svc.metaDescription?.trim();
          const desc = (excerpt && excerpt.length > 20 && !isJsonLike(excerpt))
            ? excerpt.slice(0, 140) + (excerpt.length > 140 ? "..." : "")
            : (meta && meta.length > 20 && !isJsonLike(meta))
              ? meta.slice(0, 140) + (meta.length > 140 ? "..." : "")
              : getServiceDescription(s.content, s.subCategory || s.category || s.title);
          items.push({
            id: `svc-${s.id}`,
            title: s.title,
            description: desc,
            category: s.category || "Services",
            href: `/services/${s.slug}`,
            type: "service",
          });
        }
      });

    pages
      .filter((p) => p.status === "active")
      .forEach((p) => {
        const service = apiServices.find(
          (s) =>
            (s.subCategory === p.title || s.pageName === p.title || s.slug === p.slug) &&
            (s.status === "published" || s.status === "active")
        );
        if (service?.slug && !items.some((i) => i.href === `/services/${service.slug}`)) {
          items.push({
            id: `page-${p.id}`,
            title: p.title,
            description: getServiceDescription(service.content, p.title),
            category: subcategories.find((sub) => sub.id === p.subcategoryId)?.name || categories.find((c) => subcategories.some((sub) => sub.categoryId === c.id && sub.id === p.subcategoryId))?.name || "Services",
            href: `/services/${service.slug}`,
            type: "service",
          });
        }
      });

    if (items.length === 0) {
      ALL_SERVICES.forEach((s) => {
        items.push({
          id: s.id,
          title: s.title,
          description: s.description,
          category: s.category,
          href: s.href,
          type: "static",
        });
      });
    }

    return items;
  }, [isBootsolo, apiServices, pages, subcategories, categories]);

  const filteredServices = useMemo(
    () =>
      services.filter((s) => {
        const matchesSearch =
          !searchTerm ||
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          !selectedCategory || selectedCategory === "all" || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [services, searchTerm, selectedCategory]
  );

  const categoriesList = useMemo(
    () => Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
    [services]
  );

  if (servicesLoading && !isBootsolo) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--homepage-section-bg, #f8fafc)" }}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--homepage-section-bg, #f8fafc)" }}>
      <Navigation />

      <PageHeroBanner
        title="Our Services"
        subtitle={
          isBootsolo
            ? "Lean growth systems, thought leadership, and outbound automation built for solopreneurs and lean tech founders."
            : "Discover comprehensive solutions from our expert team—services and hire options tailored to your needs."
        }
        stats={[
          { icon: Star, value: `${services.length}+`, label: "Services" },
          { icon: TrendingUp, value: "95%", label: "Client Satisfaction" },
          { icon: Building2, value: `${categoriesList.length}+`, label: "Categories" },
        ]}
        ctaText="Get Started"
        ctaHref="/contact"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="backdrop-blur-sm rounded-2xl shadow-xl border p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12" style={{ backgroundColor: "var(--service-card-bg, rgba(255,255,255,0.8))", borderColor: "var(--service-gradient-start, rgba(59,130,246,0.2))" }}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-xl"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
                <SelectTrigger className="w-full h-10 sm:h-12 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesList.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="group"
                >
                  <Link href={service.href}>
                    <div className="h-full p-6 sm:p-8 rounded-2xl backdrop-blur-sm border shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200/50 transition-all duration-300 cursor-pointer overflow-hidden relative" style={{ backgroundColor: "var(--service-card-bg, rgba(255,255,255,0.9))", borderColor: "var(--service-gradient-start, rgba(59,130,246,0.2))" }}>
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--service-gradient-start) 5%, transparent), color-mix(in srgb, var(--service-gradient-end) 5%, transparent))" }} />
                      <div
                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: "linear-gradient(135deg, var(--service-gradient-start, #3b82f6), var(--service-gradient-middle, #8b5cf6), var(--service-gradient-end, #ec4899))",
                          boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
                        {service.category}
                      </span>
                      <h3 className="text-xl font-bold mt-2 mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No services match your search.</p>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}>
              Clear filters
            </Button>
          </div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}
