import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { HOMEPAGE_NEWSLETTER } from "@/lib/homepage-content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const { title, subtitle, cta, microcopy } = HOMEPAGE_NEWSLETTER;
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/contact", {
        firstName: "Newsletter",
        lastName: "Subscriber",
        email,
        message: "Newsletter signup - Bootstrap Growth Playbook",
        pageSource: "Newsletter Signup",
        service: "Newsletter",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Check your inbox!",
        description: "We've sent you the Bootstrap Growth Playbook.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate();
  };

  return (
    <section id="newsletter" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 sm:p-12 rounded-3xl glass-card overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <span
            className="relative inline-flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-poppins border border-blue-200/60"
            style={{
              color: "var(--homepage-hero-start, #3b82f6)",
              backgroundColor: "rgba(59, 130, 246, 0.08)",
            }}
          >
            <Mail className="w-4 h-4 mr-2" />
            Newsletter
          </span>
          <h2
            className="relative text-3xl sm:text-4xl lg:text-5xl mb-4 heading-homepage-gradient tracking-tight"
          >
            {title}
          </h2>
          <p
            className="relative text-lg mb-10 text-poppins leading-relaxed"
            style={{ color: "var(--header-text, #64748b)" }}
          >
            {subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-14 px-6 rounded-2xl border-2 border-gray-200/80 bg-white/90 text-base focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
              <Button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="h-14 px-10 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
                  color: "white",
                }}
              >
                {subscribeMutation.isPending ? "Sending..." : cta}
              </Button>
            </div>
            <p className="relative text-sm text-poppins" style={{ color: "var(--header-text, #64748b)" }}>
              {microcopy}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
