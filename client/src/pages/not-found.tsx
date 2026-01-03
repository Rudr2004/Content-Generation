import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="text-center max-w-2xl mx-4 px-6">
          {/* Construction Icon */}
          <div className="mb-8 flex justify-center">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-full shadow-lg">
              <Construction className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 heading-georgia">
            Under{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Construction
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed text-poppins">
            We're working hard to bring you something amazing.
            <br />
            Check back soon!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-poppins">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-semibold transition-all duration-300 text-poppins"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 heading-georgia">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4 text-poppins">
              If you believe this is an error, please contact our support team.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 text-poppins">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
