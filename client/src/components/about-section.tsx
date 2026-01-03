import { Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { STATS } from "@/lib/constants";
import { HeroAnimatedButton } from "@/components/ui/hero-animated-button";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full text-sm font-semibold mb-8 border border-gray-200 text-poppins">
            <Award className="mr-2 h-4 w-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Technology Solutions Company</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 heading-georgia">
            Leading AI Development &
            <div>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Enterprise Software Solutions Company</span>
            </div>
          </h1>
          <p className="text-xl text-gray-600 max-w-5xl mx-auto font-light leading-relaxed text-poppins">
            Founded in 2021, <strong>GreenAppleX</strong> is a leading AI development, enterprise software development, and digital transformation company helping global businesses achieve AI-powered growth. As a true technological companion, GreenAppleX empowers startups to enterprise-level businesses with custom AI solutions, generative AI development, and innovative software solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-3 heading-georgia">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium text-poppins">
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
