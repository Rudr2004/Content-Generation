import { motion } from "framer-motion";
import { Zap, Target, Shield } from "lucide-react";
import { HOMEPAGE_VALUE_PROPOSITION } from "@/lib/homepage-content";

const ICON_MAP = { Zap, Target, Shield };

export function ValuePropositionSection() {
  const { title, pillars } = HOMEPAGE_VALUE_PROPOSITION;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-orb-1" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-orb-2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
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
            Why Bootsolo
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = ICON_MAP[pillar.icon as keyof typeof ICON_MAP] ?? Zap;
            return (
              <motion.div
                key={pillar.title}
                className="group relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="h-full p-8 lg:p-10 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 glass-card overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div
                    className="relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
                      boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className="relative text-xl lg:text-2xl font-bold mb-4 heading-homepage"
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="relative text-base leading-relaxed text-poppins"
                    style={{ color: "var(--header-text, #64748b)" }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
