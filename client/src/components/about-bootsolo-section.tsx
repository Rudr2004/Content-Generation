import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { HOMEPAGE_ABOUT } from "@/lib/homepage-content";

export function AboutBootsoloSection() {
  const { title, copy, linkText, linkHref } = HOMEPAGE_ABOUT;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-poppins border border-purple-200/60"
          style={{
            color: "var(--homepage-hero-middle, #8b5cf6)",
            backgroundColor: "rgba(139, 92, 246, 0.08)",
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          About
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl mb-6 heading-homepage-gradient tracking-tight"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg lg:text-xl mb-10 text-poppins leading-relaxed"
          style={{ color: "var(--header-text, #64748b)" }}
        >
          {copy}
        </motion.p>
        <Link href={linkHref}>
          <motion.span
            className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-200 cursor-pointer gap-2 border-2 border-blue-200/60 hover:border-blue-400/80 hover:bg-blue-50/50"
            style={{ color: "var(--homepage-hero-start, #3b82f6)" }}
            whileHover={{ x: 4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {linkText}
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </Link>
      </div>
    </section>
  );
}
