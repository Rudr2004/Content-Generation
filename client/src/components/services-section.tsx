import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { SERVICES } from "@/lib/constants";
import { AnimatedButton } from "@/components/ui/animated-button";

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Amplifying Business Progress Through{" "}
            <span className="text-green-apple">
              Smart Solutions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Obtain robust software solutions, modernize systems, and leverage futuristic technologies for growth opportunities with the capabilities of a leading development company.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <Card key={service.id} className="bg-white border border-gray-100 hover:border-green-apple/30 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-apple/10 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:bg-green-apple/20 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-apple transition-colors duration-300">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-apple rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <AnimatedButton href="/contact" className="scale-75">
                  Learn More
                </AnimatedButton>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <AnimatedButton href="/services" variant="large">
            Explore Services
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
