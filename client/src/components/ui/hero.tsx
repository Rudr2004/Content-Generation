import { ArrowRight, Play, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AnimatedButton } from "@/components/ui/animated-button";
import { HeroAnimatedButton } from "@/components/ui/hero-animated-button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  if (hex.startsWith('rgba')) return hex;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '59, 130, 246';
}

// Helper function to get RGB from CSS variable
function getRgbFromCssVar(cssVar: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!value) return fallback;
  // If it's already rgba format, extract RGB values
  if (value.startsWith('rgba')) {
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? `${match[1]}, ${match[2]}, ${match[3]}` : fallback;
  }
  // If it's hex, convert it
  return hexToRgb(value);
}

export function Hero() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  return (
    <section 
      className="pt-24 pb-20 relative overflow-hidden"
      style={{ backgroundColor: 'var(--homepage-hero-bg, #ffffff)' }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, var(--homepage-hero-overlay-start, rgba(59, 130, 246, 0.3)), var(--homepage-hero-overlay-middle, rgba(255, 255, 255, 1)), var(--homepage-hero-overlay-end, rgba(34, 197, 94, 0.2)))`
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 border text-poppins"
            style={{
              background: `linear-gradient(to right, 
                rgba(${getRgbFromCssVar('--homepage-hero-start', '#3b82f6')}, 0.1), 
                rgba(${getRgbFromCssVar('--homepage-hero-middle', '#8b5cf6')}, 0.1), 
                rgba(${getRgbFromCssVar('--homepage-hero-end', '#ec4899')}, 0.1)
              )`,
              borderColor: 'var(--header-border, #e5e7eb)'
            }}
          >
            <Rocket 
              className="mr-2 h-4 w-4 bg-clip-text text-transparent" 
              style={{
                background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}
            />
            <span 
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}
            >
              Transformative Digital Solutions
            </span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-bold mb-8 leading-tight max-w-5xl mx-auto heading-georgia" style={{ color: 'var(--header-text, #111827)' }}>
            Build Your Future with{" "}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}
            >
              {siteName}
            </span>
          </h1>
          <p className="text-xl lg:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto font-light text-poppins" style={{ color: 'var(--header-text, #4b5563)' }}>
            {siteName} delivers transformative solutions in generative AI, Web3, mobile apps, custom software, and digital transformation, empowering startups and enterprises to lead their industries.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <HeroAnimatedButton href="/contact">
              <span className="text-poppins">Talk To An AI Specialist</span>
            </HeroAnimatedButton>
            <HeroAnimatedButton href="#demo">
              <span className="text-poppins">Watch Demo</span>
            </HeroAnimatedButton>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div 
                className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2 heading-georgia"
                style={{
                  background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                500+
              </div>
              <div className="text-sm font-medium text-poppins" style={{ color: 'var(--header-text, #4b5563)' }}>Projects Delivered</div>
            </div>
            <div className="text-center">
              <div 
                className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2 heading-georgia"
                style={{
                  background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                50M+
              </div>
              <div className="text-sm font-medium text-poppins" style={{ color: 'var(--header-text, #4b5563)' }}>App Downloads</div>
            </div>
            <div className="text-center">
              <div 
                className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2 heading-georgia"
                style={{
                  background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                200+
              </div>
              <div className="text-sm font-medium text-poppins" style={{ color: 'var(--header-text, #4b5563)' }}>Expert Developers</div>
            </div>
            <div className="text-center">
              <div 
                className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2 heading-georgia"
                style={{
                  background: 'linear-gradient(to right, var(--homepage-hero-start, #3b82f6), var(--homepage-hero-middle, #8b5cf6), var(--homepage-hero-end, #ec4899))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text'
                }}
              >
                98%
              </div>
              <div className="text-sm font-medium text-poppins" style={{ color: 'var(--header-text, #4b5563)' }}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
