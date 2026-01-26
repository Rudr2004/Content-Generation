import { MapPin, Phone, Mail, Linkedin, Twitter } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { COMPANY_INFO } from "@/lib/constants";

export function GetInTouchSection() {
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || COMPANY_INFO.name;

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 heading-georgia">
          Get in Touch
        </h2>

        <div className="space-y-8">
          {/* Our Office Massachusetts */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1 heading-georgia">
                Our Office Massachusetts
              </h3>
              <p className="text-gray-600 text-poppins">
                732 Princeton Blvd apt 7<br />
                Lowell, MA 01851
              </p>
            </div>
          </div>

          {/* Call Us */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1 heading-georgia">
                Call Us
              </h3>
              <p className="text-gray-600 text-poppins">
                +1 (424) 404-9371
              </p>
            </div>
          </div>

          {/* Email Us */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1 heading-georgia">
                Email Us
              </h3>
              <p className="text-gray-600 text-poppins">

              </p>
            </div>
          </div>
        </div>

        {/* Follow Us */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/greenapplex"
              className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${siteName} LinkedIn Profile`}
              data-testid="link-linkedin"
            >
              <Linkedin className="w-6 h-6 text-gray-600" />
            </a>
            <a
              href="https://x.com/_greenapplex"
              className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${siteName} Twitter Profile`}
              data-testid="link-twitter"
            >
              <Twitter className="w-6 h-6 text-gray-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}