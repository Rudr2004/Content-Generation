import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_FINAL_CTA } from "@/lib/homepage-content";

export function FinalCtaSection() {
  const { title, subtitle, primaryCta, secondaryCta } = HOMEPAGE_FINAL_CTA;

  return (
    <section
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--homepage-hero-start, #3b82f6) 0%, var(--homepage-hero-middle, #8b5cf6) 50%, var(--homepage-hero-end, #ec4899) 100%)",
        boxShadow: "0 -4px 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6 heading-modern tracking-tight"
          style={{ color: "white" }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl mb-12 leading-relaxed text-poppins"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center"
        >
          <a href={primaryCta.href}>
            <motion.button
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg bg-white text-gray-900 shadow-xl hover:shadow-2xl transition-all duration-200"
              style={{ fontFamily: "Poppins, sans-serif" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {primaryCta.text}
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </a>
          <a href={secondaryCta.href}>
            <motion.button
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
              style={{ fontFamily: "Poppins, sans-serif" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {secondaryCta.text}
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
