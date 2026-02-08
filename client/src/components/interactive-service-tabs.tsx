import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  MessageSquare,
  Send,
  FileText,
  Coins,
  Zap,
  Code2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { HOMEPAGE_SERVICES } from "@/lib/homepage-content";
import { COMPANY_INFO } from "@/lib/constants";
import { getServiceDescription } from "@/lib/service-content-utils";

const SERVICE_ICONS = [
  TrendingUp,
  MessageSquare,
  Send,
  FileText,
  Coins,
  Zap,
  Code2,
];

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

export function InteractiveServiceTabs() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const { data: apiServices = [], isLoading } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const services: ServiceItem[] =
    COMPANY_INFO.name === "Bootsolo"
      ? HOMEPAGE_SERVICES.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          href: "/services",
        }))
      : apiServices
          .filter((s: { status: string }) => s.status === "published" || s.status === "active")
          .slice(0, 8)
          .map((s: { id: number; title: string; content?: string; slug: string; subCategory?: string }) => ({
            id: String(s.id),
            title: s.title,
            description: getServiceDescription(s.content, s.subCategory || s.title),
            href: `/services/${s.slug}`,
          }));

  const displayServices =
    services.length > 0 ? services : HOMEPAGE_SERVICES.map((s) => ({ ...s, href: "/services" }));

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 animate-orb-3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-poppins border border-blue-200/60"
            style={{
              color: "var(--homepage-hero-start, #3b82f6)",
              backgroundColor: "rgba(59, 130, 246, 0.08)",
            }}
          >
            Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-4 heading-homepage-gradient tracking-tight"
          >
            One engine, multiple growth levers
          </motion.h2>
        </div>

        {isLoading && displayServices.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {displayServices.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
              const isHovered = hoveredService === service.id;

              return (
                <Link key={service.id} href={service.href}>
                  <motion.div
                    className="group relative h-full cursor-pointer"
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <div
                      className="h-full p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border overflow-hidden relative"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(12px)",
                        borderColor: isHovered ? "rgba(59, 130, 246, 0.4)" : "rgba(226, 232, 240, 0.8)",
                        boxShadow: isHovered
                          ? "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                          : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                      <div
                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.35)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3
                        className="relative text-lg font-bold mb-2 heading-homepage group-hover:opacity-90 transition-opacity"
                      >
                        {service.title}
                      </h3>
                      <p
                        className="relative text-sm leading-relaxed text-poppins line-clamp-2"
                        style={{ color: "var(--header-text, #64748b)" }}
                      >
                        {service.description}
                      </p>
                      <span className="relative mt-4 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/services">
            <motion.button
              className="px-10 py-4 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] text-white"
              style={{
                background: "linear-gradient(135deg, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6), var(--gradient-end, #ec4899))",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Services
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
