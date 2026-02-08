import { motion } from "framer-motion";
import { HeroAnimatedButton } from "@/components/ui/hero-animated-button";
import { HOMEPAGE_HERO, HERO_IMAGE_URL } from "@/lib/homepage-content";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/**
 * Hero section with full-bleed background image.
 * Uses CSS variables for theme compatibility.
 */
export function Hero() {
  const hero = HOMEPAGE_HERO;

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--homepage-hero-bg, #0f172a)" }}
    >
      {/* Background image – Ken Burns animation (slow zoom/pan), no color overlay */}
      <div
        className="absolute inset-0 animate-hero-ken-burns"
        style={{
          backgroundImage: `url(${HERO_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Web3-style floating particles – subtle white dots, no color blocking */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/40 ${
              i % 3 === 0 ? "animate-particle-1" : i % 3 === 1 ? "animate-particle-2" : "animate-particle-3"
            }`}
            style={{
              left: `${15 + (i * 7) % 70}%`,
              top: `${10 + (i * 11) % 80}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      {/* Subtle grid – very faint, animated pulse */}
      <div
        className="absolute inset-0 opacity-[0.02] sm:opacity-[0.03] animate-grid-pulse pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 text-center">
        {/* Frosted content area – ensures text readability, image stays visible */}
        <div className="relative inline-block rounded-3xl px-6 py-8 sm:px-10 sm:py-12 backdrop-blur-xl bg-black/10 sm:bg-black/15 border border-white/10">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative"
          >
            <motion.h1
              className="relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 lg:mb-8 leading-[1.1] max-w-5xl mx-auto font-bold tracking-tight text-poppins"
              style={{ color: "var(--homepage-hero-text, #ffffff)" }}
            >
              {hero.headline}
            </motion.h1>
          </motion.div>
          <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg sm:text-xl lg:text-2xl mb-10 lg:mb-12 leading-relaxed max-w-3xl mx-auto font-normal text-poppins"
          style={{ color: "var(--homepage-hero-subtext, rgba(255, 255, 255, 0.92))" }}
        >
            {hero.subheadline}
          </motion.p>
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mt-8"
          >
            <HeroAnimatedButton
              href={hero.primaryCta.href}
              variant="hero-image"
            >
              <span className="text-poppins font-semibold">{hero.primaryCta.text}</span>
            </HeroAnimatedButton>
            <HeroAnimatedButton
              href={hero.secondaryCta.href}
              variant="hero-image-outline"
            >
              <span className="text-poppins font-medium">{hero.secondaryCta.text}</span>
            </HeroAnimatedButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs font-medium tracking-widest uppercase text-white/60 text-poppins">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
