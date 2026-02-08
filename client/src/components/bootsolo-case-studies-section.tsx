import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, TrendingUp } from "lucide-react";
import { HOMEPAGE_CASE_STUDIES } from "@/lib/homepage-content";

interface CaseStudyItem {
  title: string;
  outcome: string;
}

export function BootsoloCaseStudiesSection() {
  const { title, trustBar, items: staticItems } = HOMEPAGE_CASE_STUDIES;

  const { data: cmsCaseStudies = [] } = useQuery({
    queryKey: ["/api/case-study-pages/published"],
    queryFn: async () => {
      const response = await fetch("/api/case-study-pages/published");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const items: CaseStudyItem[] =
    cmsCaseStudies.length > 0
      ? cmsCaseStudies.slice(0, 3).map((s: { title: string; metaDescription?: string; problemStatement?: string }) => ({
          title: s.title,
          outcome: s.metaDescription || (s.problemStatement?.replace(/<[^>]*>/g, "").slice(0, 150) + "...") || "Discover how we delivered results.",
        }))
      : staticItems;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-poppins border border-indigo-200/60"
            style={{
              color: "var(--homepage-hero-middle, #6366f1)",
              backgroundColor: "rgba(99, 102, 241, 0.08)",
            }}
          >
            Case Studies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6 heading-homepage-gradient tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-poppins max-w-2xl mx-auto"
            style={{ color: "var(--header-text, #64748b)" }}
          >
            {trustBar}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              className="group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className="h-full p-8 lg:p-10 rounded-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative border border-gray-200/80 bg-white/80 backdrop-blur-sm"
                style={{
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: "#6366f1" }} />
                </div>
                <h3
                  className="relative text-xl font-bold mb-4 heading-homepage-gradient"
                >
                  {item.title}
                </h3>
                <p
                  className="relative text-base leading-relaxed text-poppins"
                  style={{ color: "var(--header-text, #64748b)" }}
                >
                  {item.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/case-studies">
            <motion.button
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Case Studies
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
