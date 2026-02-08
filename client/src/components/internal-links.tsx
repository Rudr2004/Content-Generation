import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_INTERNAL_LINKS } from "@/lib/homepage-content";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

/**
 * Internal links section - explore Bootsolo.
 * Uses CSS variables for theme compatibility.
 */
export function InternalLinks() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;
  const { title, subtitle, links } = HOMEPAGE_INTERNAL_LINKS;

  return (
    <section
      className="py-16"
      style={{ backgroundColor: "var(--homepage-hero-bg, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4 heading-georgia"
            style={{ color: "var(--header-text, #111827)" }}
          >
            {title.replace("Bootsolo", siteName)}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto text-poppins"
            style={{ color: "var(--header-text, #4b5563)" }}
          >
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`group block p-6 bg-gradient-to-r ${link.gradient} rounded-xl border hover:shadow-lg transition-all duration-300`}
              style={{ borderColor: "var(--header-border, #e5e7eb)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-semibold heading-georgia"
                  style={{ color: "var(--header-text, #111827)" }}
                >
                  {link.title.replace("Bootsolo", siteName)}
                </h3>
                <ArrowRight
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--homepage-hero-start, #3b82f6)" }}
                />
              </div>
              <p
                className="text-sm mb-4 text-poppins"
                style={{ color: "var(--header-text, #4b5563)" }}
              >
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
