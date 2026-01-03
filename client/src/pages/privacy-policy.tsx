import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Shield, Lock, Server, Building2, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 heading-georgia">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-poppins">
              Privacy and confidentiality are our topmost priority. We sign the strict non-disclosure agreement with our clients and employees.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 heading-georgia">Our Commitment</h2>
                </div>
                <div className="prose prose-gray max-w-none text-poppins">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To avoid any issues regarding security of data and project's implementation, we offer robust and scalable agreements with clients. We believe that "Disciplined work gives the extension to the relationship". We are always ready to sign Non-Disclosure Agreements (NDA) to enhance the work quality and neglect security issues regarding any form of project materials.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At GreenAppleX, confidentiality of your project and security of your data is of utmost importance. We have competent measures in place that ensure the security of your data in our development center.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Not only your data security is a critical element for maintaining the long-term relationship with you, your data is what your business is based on and by taking care of your business, we take care of our business too.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Measures */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Lock className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 heading-georgia">Security Measures</h2>
                </div>
                <p className="text-gray-700 mb-6 text-poppins">
                  Here are a few points that highlight the data security measures we take:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Technology Security */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Server className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900 heading-georgia">Technology</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700 text-poppins">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        All workstations and servers are protected by both hardware and software firewalls which are automatically updated.
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Daily scanning of all workstations and servers.
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        All communication or data interchange from workstations are controlled and properly logged to ensure the highest level of protection for client's data and intellectual property.
                      </li>
                    </ul>
                  </div>

                  {/* Office Security */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Building2 className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900 heading-georgia">Office</h3>
                    </div>
                    <ul className="space-y-3 text-gray-700 text-poppins">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Fire alarms and carbon monoxide alarms are set up across the office premises.
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        24 X 7 CCTV cameras for safety and security of workplace.
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Secure access to any communication medium for employees and guest.
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Electronic card and biometric security system to get access to any place in office premises.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scalability */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Server className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 heading-georgia">Scalability</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 heading-georgia">Technology</h3>
                    <ul className="space-y-3 text-gray-700 text-poppins">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        We use data centers with cloud computing infrastructure in USA to ensure that any amount of data is backed up.
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        We continuously revisit our software portfolio and newly available softwares in market to check possibility of any productivity increase through their implementation.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NDAs */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Client NDA */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <FileText className="h-8 w-8 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 heading-georgia">Client NDA</h2>
                  </div>
                  <p className="text-gray-700 text-poppins leading-relaxed">
                    We require an NDA (Non-Disclosure Agreement) with our clients to ensure a confidential development environment within each project. We openly discuss at length issues regarding security and other areas of concern. This discussion discloses the amount of data needed to be collected, which person(s) will be authorized to access information, and the possible risks involved.
                  </p>
                </CardContent>
              </Card>

              {/* Employee NDA */}
              <Card className="bg-white shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Users className="h-8 w-8 text-red-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 heading-georgia">NDA with Employees</h2>
                  </div>
                  <p className="text-gray-700 text-poppins leading-relaxed">
                    We also sign a Non Disclosure Agreement (NDA) with each of our employees at hire. We clearly state that failing to uphold the agreement is ground for legal action and termination. We regularly update employees about the importance of data protection and provide updated practices to ensure company standards are not compromised.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 heading-georgia">Questions?</h2>
                  <p className="text-gray-700 mb-6 text-poppins">
                    If you have any questions about this privacy policy or GreenAppleX treatment of your personal information,
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-blue-600">
                    <Link to="/contact" className="hover:text-blue-800 transition-colors">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}