import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ModernCaseStudyDisplay } from "@/components/modern-case-study-display";
import { Loader2 } from "lucide-react";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";

export default function IndividualCaseStudy() {
  const { slug } = useParams();

  const { data: caseStudy, isLoading, error } = useQuery({
    queryKey: [`/api/case-study-pages/slug/${slug}`],
    enabled: !!slug,
  }) as { data: any, isLoading: boolean, error: any };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
          <p className="text-gray-600">The case study you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen bg-white">
        <Navigation />
        <ModernCaseStudyDisplay caseStudy={caseStudy} />
        <Footer />
      </div>
    </>
  );
}