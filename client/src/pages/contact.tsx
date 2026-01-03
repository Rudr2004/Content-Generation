import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { HomeContactSection } from "@/components/contact-form-light";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <HomeContactSection />
      </div>
      <Footer />
    </div>
  );
}
