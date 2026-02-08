import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, ArrowRight } from "lucide-react";
import { HOMEPAGE_RESOURCES } from "@/lib/homepage-content";

export function ResourcesSection() {
  const { title, items } = HOMEPAGE_RESOURCES;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2" />

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
            Resources
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-4 heading-homepage-gradient tracking-tight"
          >
            {title}
          </motion.h2>
        </div>

        <ul className="max-w-3xl mx-auto space-y-4 mb-16">
          {items.map((item, index) => (
            <motion.li
              key={index}
              className="group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              <div
                className="flex items-center gap-5 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 glass-card"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12))",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <BookOpen className="w-6 h-6" style={{ color: "var(--homepage-hero-start, #3b82f6)" }} />
                </div>
                <span
                  className="text-poppins font-medium flex-1"
                  style={{ color: "var(--header-text, #334155)" }}
                >
                  {item}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/blog">
            <motion.button
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View all resources
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
