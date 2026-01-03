import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

export function InternalLinks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 heading-georgia">
            Explore Our AI Development Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-poppins">
            Discover comprehensive AI development services and enterprise solutions tailored for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            // href="/genai-service"
            className="group block p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 heading-georgia">AI Development Services</h3>
              <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-poppins">
              Comprehensive AI development services including enterprise AI solutions, generative AI development, and machine learning consulting.
            </p>
            {/* <span className="text-blue-600 font-medium text-sm text-poppins">Learn More →</span> */}
          </div>

          <div
            // href="/about"
            className="group block p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 heading-georgia">About GreenAppleX</h3>
              <ArrowRight className="w-5 h-5 text-green-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-poppins">
              Learn about our AI development expertise, 200+ expert developers, and 500+ successfully delivered projects.
            </p>
            {/* <span className="text-green-600 font-medium text-sm text-poppins">About Us →</span> */}
          </div>

          <div
            // href="/contact"
            className="group block p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 heading-georgia">Start Your AI Project</h3>
              <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-poppins">
              Ready to transform your business with AI? Get a free consultation and custom AI solution proposal.
            </p>
            {/* <span className="text-purple-600 font-medium text-sm text-poppins">Contact Us →</span> */}
          </div>
        </div>
      </div>
    </section>
  );
}