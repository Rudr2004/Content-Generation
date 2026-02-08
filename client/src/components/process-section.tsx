import { motion } from "framer-motion";
import { Search, FileCheck, Rocket } from "lucide-react";
import { HOMEPAGE_HOW_IT_WORKS } from "@/lib/homepage-content";

const STEP_ICONS = [Search, FileCheck, Rocket];

export function ProcessSection() {
  const { title, steps } = HOMEPAGE_HOW_IT_WORKS;

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Gradient mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, var(--homepage-section-bg, #ffffff) 0%, rgba(255,255,255,0.98) 50%, rgba(239, 246, 255, 0.5) 100%)",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-400/8 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-400/6 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-poppins"
            style={{
              color: "var(--gradient-start, #3b82f6)",
              backgroundColor: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
            }}
          >
            How It Works
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

        <div className="relative">
          {/* Horizontal Process Line - prominent, runs through center of step circles */}
          <div className="hidden md:block absolute top-[40px] left-0 right-0 h-1.5 md:h-2 rounded-full overflow-hidden z-10">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, 
                  var(--gradient-start, #3b82f6) 0%, 
                  var(--gradient-middle, #8b5cf6) 50%, 
                  var(--gradient-end, #ec4899) 100%)`,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)",
              }}
            />
            <div className="absolute inset-0 rounded-full process-line-shimmer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <motion.div
                  key={step.id}
                  className="relative flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  viewport={{ once: true }}
                >
                  {/* Step number circle - sits ON the horizontal line */}
                  <div className="relative z-20 mb-6">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-xl border-4 border-white"
                      style={{
                        background: `linear-gradient(135deg, 
                          var(--gradient-start, #3b82f6), 
                          var(--gradient-middle, #8b5cf6), 
                          var(--gradient-end, #ec4899))`,
                        boxShadow: "0 12px 32px -8px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.3)",
                      }}
                    >
                      {index + 1}
                    </div>
                    {/* Subtle glow ring on hover */}
                    <div
                      className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-md"
                      style={{
                        background: `linear-gradient(135deg, var(--gradient-start, #3b82f6), var(--gradient-end, #ec4899))`,
                      }}
                    />
                  </div>

                  <motion.div
                    className="w-full p-8 lg:p-10 rounded-2xl glass-card transition-all duration-300 hover:-translate-y-2 overflow-hidden relative"
                    whileHover={{
                      boxShadow: "0 24px 48px -12px rgba(59, 130, 246, 0.18), 0 0 0 1px rgba(59, 130, 246, 0.1)",
                    }}
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/15 to-purple-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-80 transition-opacity duration-500" />
                    <div
                      className="relative w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6"
                      style={{
                        background: "rgba(59, 130, 246, 0.12)",
                        border: "1px solid rgba(59, 130, 246, 0.22)",
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: "var(--gradient-start, #3b82f6)" }} />
                    </div>
                    <h3 className="relative text-lg sm:text-xl font-bold mb-4 heading-homepage-gradient">
                      {step.title}
                    </h3>
                    <p
                      className="relative text-base leading-relaxed text-poppins"
                      style={{ color: "var(--header-text, #64748b)" }}
                    >
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Mobile: vertical connector between steps */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex flex-col items-center my-6">
                      <div
                        className="w-0.5 h-8 rounded-full"
                        style={{
                          background: `linear-gradient(180deg, var(--gradient-start, #3b82f6), var(--gradient-middle, #8b5cf6))`,
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
