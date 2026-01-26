import { Link } from "wouter";
import { Apple, Twitter, Linkedin } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { motion } from "framer-motion";
import logoImg from "@assets/Logo A_1752582606982.jpg";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export function Footer() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
                <img src={logoImg} alt="Company Logo" className="object-contain w-full h-full" />
              </div>

              <div>
                <span className="text-2xl font-normal bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 heading-georgia">{settings?.siteName || COMPANY_INFO.name}</span>
                <p className="text-xs text-gray-500 font-medium">{COMPANY_INFO.tagline}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{COMPANY_INFO.description}</p>
            <div className="flex space-x-4">
              <a
                href={COMPANY_INFO.social.linkedin}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-apple hover:text-white transition-colors"
                aria-label={`Visit ${siteName} LinkedIn Company Page`}
                data-testid="link-footer-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={COMPANY_INFO.social.twitter}
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-apple hover:text-white transition-colors"
                aria-label={`Visit ${siteName} Twitter Profile`}
                data-testid="link-footer-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-lg">Services</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/services/expert-llm-development-services-for-us-enterprises" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">AI & Data Services</Link>
                </div>
              </li>
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/services/blockchain-development-services-in-the-usa" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">Blockchain & Web3</Link>
                </div>
              </li>
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/services/ai-automation-for-customer-support-in-the-usa" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">Web & Software Development</Link>
                </div>
              </li>
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/services/ai-for-e-commerce-automation-in-the-usa" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">E-commerce Solutions</Link>
                </div>
              </li>
              <li>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-600">
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/about" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">About Us</Link>
                </div>
              </li>
              <li>
              </li>
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <span className="relative block py-1 px-2 text-gray-600">Careers</span>
                </div>
              </li>
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/case-studies" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">Case Studies</Link>
                </div>
              </li>
              <li>
                <div className="relative overflow-hidden rounded-md">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 0.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                  <Link href="/blog" className="relative block py-1 px-2 hover:text-gray-900 transition-colors duration-300">Blog</Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-gray-900 text-lg">Contact</h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-apple mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-apple mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm">{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-apple mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 {settings?.siteName || COMPANY_INFO.name} - {COMPANY_INFO.tagline}. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <div className="relative overflow-hidden rounded-md">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 0.1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
              <Link to="/privacy-policy" className="relative text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300 py-1 px-2 block">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
