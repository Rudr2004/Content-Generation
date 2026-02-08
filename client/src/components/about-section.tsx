import { Award } from "lucide-react";
import { HeroAnimatedButton } from "@/components/ui/hero-animated-button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { STATS } from "@/lib/constants";
import { HOMEPAGE_ABOUT } from "@/lib/homepage-content";

/**
 * About section - Bootsolo positioning and stats.
 * Uses CSS variables for theme compatibility.
 */
export function AboutSection() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || "Bootsolo";
  const about = HOMEPAGE_ABOUT;

  return (
    <section
      id="about"
      className="py-24"
      style={{ backgroundColor: "var(--form-input-bg, #f9fafb)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 border text-poppins"
            style={{
              background:
                "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))",
              borderColor: "var(--header-border, #e5e7eb)",
            }}
          >
            <Award
              className="mr-2 h-4 w-4"
              style={{
                color: "var(--homepage-hero-start, #3b82f6)",
              }}
            />
            <span
              style={{
                background:
                  "linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {about.badge}
            </span>
          </div>
          <h1
            className="text-5xl lg:text-6xl font-bold mb-8 heading-georgia"
            style={{ color: "var(--header-text, #111827)" }}
          >
            {about.title}
            <div>
              <span
                style={{
                  background:
                    "linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {about.titleHighlight}
              </span>
            </div>
          </h1>
          <p
            className="text-xl max-w-5xl mx-auto font-light leading-relaxed text-poppins"
            style={{ color: "var(--header-text, #4b5563)" }}
          >
            {about.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 sm:p-8 rounded-lg shadow-sm border"
              style={{
                backgroundColor: "var(--homepage-hero-bg, #ffffff)",
                borderColor: "var(--header-border, #e5e7eb)",
              }}
            >
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 heading-georgia"
                style={{
                  background:
                    "linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs sm:text-sm md:text-base font-medium text-poppins"
                style={{ color: "var(--header-text, #4b5563)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <HeroAnimatedButton href="/about">
            <span className="text-poppins">About Us</span>
          </HeroAnimatedButton>
        </div>
      </div>
    </section>
  );
}
