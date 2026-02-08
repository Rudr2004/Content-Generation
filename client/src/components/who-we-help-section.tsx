import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { HOMEPAGE_WHO_WE_HELP } from "@/lib/homepage-content";
export function WhoWeHelpSection() {
  const { title, subtitle, audiences } = HOMEPAGE_WHO_WE_HELP;

  return (
    <section
      id="who-we-help"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Gradient mesh + animated orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-orb-2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-orb-3" />

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
            Who We Serve
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
            className="text-lg sm:text-xl max-w-3xl mx-auto text-poppins leading-relaxed"
            style={{ color: "var(--header-text, #64748b)" }}
          >
            {subtitle}
          </motion.p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {audiences.map((item, index) => (
            <motion.li
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div
                className="flex items-start gap-5 p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 glass-card"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <CheckCircle2
                    className="w-6 h-6"
                    style={{ color: "var(--homepage-hero-start, #3b82f6)" }}
                  />
                </div>
                <span
                  className="text-base sm:text-lg text-poppins font-medium pt-1 leading-relaxed"
                  style={{ color: "var(--header-text, #334155)" }}
                >
                  {item}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
