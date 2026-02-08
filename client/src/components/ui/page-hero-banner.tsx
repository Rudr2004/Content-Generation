import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { HERO_IMAGE_URL } from "@/lib/homepage-content";
import { Button } from "@/components/ui/button";

export interface PageHeroStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface PageHeroBannerProps {
  title: string;
  subtitle: string;
  stats?: PageHeroStat[];
  ctaText?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  children?: React.ReactNode;
}

/**
 * Reusable page hero with hero image background, Ken Burns animation, and glass stats.
 * Uses CMS-controlled colors via CSS variables.
 */
export function PageHeroBanner({
  title,
  subtitle,
  stats = [],
  ctaText,
  ctaHref,
  ctaOnClick,
  children,
}: PageHeroBannerProps) {
  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ backgroundColor: "var(--homepage-hero-bg, #0f172a)" }}
    >
      {/* Background image – Ken Burns animation, same as homepage hero */}
      <div
        className="absolute inset-0 animate-hero-ken-burns"
        style={{
          backgroundImage: `url(${HERO_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-black/25" />
      {/* Floating particles – Web3 style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/30 ${
              i % 3 === 0 ? "animate-particle-1" : i % 3 === 1 ? "animate-particle-2" : "animate-particle-3"
            }`}
            style={{
              left: `${10 + (i * 9) % 80}%`,
              top: `${15 + (i * 13) % 75}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="text-center mb-8 sm:mb-12 mt-10 sm:mt-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4 sm:px-0"
            style={{ color: "var(--homepage-hero-text, #ffffff)" }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
            style={{ color: "var(--homepage-hero-subtext, rgba(255, 255, 255, 0.9))" }}
          >
            {subtitle}
          </motion.p>
        </div>

        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-0"
          >
            {stats.map(({ icon: Icon, value, label }, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-white/90" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-sm sm:text-base text-white/80">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {children}

        {(ctaText && (ctaHref || ctaOnClick)) && (
          <div className="flex justify-center items-center mt-6 sm:mt-8 px-4 sm:px-0">
            {ctaHref ? (
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="page-hero-cta text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={ctaOnClick}
                className="page-hero-cta text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {ctaText}
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
