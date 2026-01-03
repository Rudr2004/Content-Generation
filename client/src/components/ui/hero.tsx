import { ArrowRight, Play, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AnimatedButton } from "@/components/ui/animated-button";
import { HeroAnimatedButton } from "@/components/ui/hero-animated-button";

export function Hero() {
  return (
    <section className="pt-24 pb-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-green-50/20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full text-sm font-semibold mb-8 border border-gray-200 text-poppins">
            <Rocket className="mr-2 h-4 w-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Transformative Digital Solutions</span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-bold mb-8 leading-tight text-gray-900 max-w-5xl mx-auto heading-georgia">
            Build Your Future with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              GreenAppleX
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto font-light text-poppins">
            GreenAppleX delivers transformative solutions in generative AI, Web3, mobile apps, custom software, and digital transformation, empowering startups and enterprises to lead their industries.
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
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 heading-georgia">500+</div>
              <div className="text-sm text-gray-600 font-medium text-poppins">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 heading-georgia">50M+</div>
              <div className="text-sm text-gray-600 font-medium text-poppins">App Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 heading-georgia">200+</div>
              <div className="text-sm text-gray-600 font-medium text-poppins">Expert Developers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 heading-georgia">98%</div>
              <div className="text-sm text-gray-600 font-medium text-poppins">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
