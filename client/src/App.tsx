import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { updateSEOMetadata, SEO_PERFORMANCE } from "@/lib/seo";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import Insights from "@/pages/insights";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import HireBlockchainDevelopers from "@/pages/hire-blockchain-developers";
import HireLLMDevelopers from "@/pages/hire-llm-developers";
import DynamicHireDeveloperPage from "@/pages/dynamic-hire-developer-page";
import ServiceHireDeveloperPage from "@/pages/ServiceHireDeveloperPage";
import AdminPanel from "@/pages/admin-panel";
import LoginPage from "@/pages/login";
import ForgotPasswordPage from "@/pages/forgot-password";
import ProfilePage from "@/pages/profile";
import { PrivacyPolicy } from "@/pages/privacy-policy";
import ServicePage from "@/pages/service-page";
import ServicesListing from "@/pages/services-listing";
import DynamicServicePage from "@/pages/ServicePage";
import AIDevelopmentServices from "@/pages/ai-development-services";
import Web3BlockchainServices from "@/pages/web3-blockchain-services";
import MobileAppDevelopment from "@/pages/mobile-app-development";
import WebDevelopmentServices from "@/pages/web-development-services";
import EnterpriseSolutions from "@/pages/enterprise-solutions";
import CaseStudies from "@/pages/modern-case-studies";
import IndividualCaseStudy from "@/pages/individual-case-study";
import IndustryPage from "@/pages/industry-page";
import { SEODashboard } from "@/components/seo-dashboard";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/protected-route";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { AIChatbot } from "@/components/ai-chatbot";
import { SeoMetaProvider } from "@/components/seo/seo-meta-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";


function SEOOptimizedRoute({ path, component: Component, seoKey }: { path?: string; component: any; seoKey?: string }) {
  const [location] = useLocation();

  useEffect(() => {
    if (seoKey && (path === location || (!path && location === "/"))) {
      // Update SEO metadata when route changes
      updateSEOMetadata(seoKey);

      // Optimize images and headings after component loads
      setTimeout(() => {
        SEO_PERFORMANCE.optimizeImages();
        SEO_PERFORMANCE.optimizeHeadings();
      }, 100);
    }
  }, [location, seoKey, path]);

  // Wrap component with SeoMetaProvider for runtime page indexing integration
  return (
    <SeoMetaProvider pageUrl={location}>
      <Component />
    </SeoMetaProvider>
  );
}

function Router() {
  // Enable automatic scroll to top on route changes
  useScrollRestoration();

  return (
    <Switch>
      <Route path="/">
        <SEOOptimizedRoute component={Home} seoKey="home" />
      </Route>
      {/* /service route removed as requested */}
      <Route path="/about">
        <SEOOptimizedRoute component={About} seoKey="about" />
      </Route>
      <Route path="/case-studies">
        <SEOOptimizedRoute component={CaseStudies} seoKey="case-studies" />
      </Route>
      <Route path="/case-studies/:slug">
        <SEOOptimizedRoute component={IndividualCaseStudy} seoKey="case-study-detail" />
      </Route>
      <Route path="/industry/:slug">
        <SEOOptimizedRoute component={IndustryPage} seoKey="industry-pages" />
      </Route>
      {/* <Route path="/insights">
        <SEOOptimizedRoute component={Insights} seoKey="insights" />
      </Route> */}
      <Route path="/contact">
        <SEOOptimizedRoute component={Contact} seoKey="contact" />
      </Route>
      <Route path="/blog">
        <SEOOptimizedRoute component={Blog} seoKey="blog" />
      </Route>
      <Route path="/blog/:slug">
        <SEOOptimizedRoute component={Blog} seoKey="blog" />
      </Route>
      <Route path="/hire-llm-developers">
        <SEOOptimizedRoute component={HireLLMDevelopers} seoKey="hire-developers" />
      </Route>
      <Route path="/hire-developers/:slug">
        <SEOOptimizedRoute component={ServiceHireDeveloperPage} seoKey="hire-developers" />
      </Route>
      {/* Generic catch-all for top-level hire developer pages with full slugs */}
      <Route path="/hire-:slug*">
        <SEOOptimizedRoute component={DynamicHireDeveloperPage} seoKey="hire-developers" />
      </Route>
      <Route path="/privacy-policy">
        <SEOOptimizedRoute component={PrivacyPolicy} seoKey="privacy-policy" />
      </Route>
      <Route path="/services/all">
        <SEOOptimizedRoute component={() => {
          // Redirect /services/all to /services
          window.location.href = '/services';
          return null;
        }} />
      </Route>

      {/* Individual Service Category Pages */}
      <Route path="/services/ai-development">
        <SEOOptimizedRoute component={AIDevelopmentServices} seoKey="services" />
      </Route>

      <Route path="/services/web3-blockchain">
        <SEOOptimizedRoute component={Web3BlockchainServices} seoKey="services" />
      </Route>

      <Route path="/services/mobile-app-development">
        <SEOOptimizedRoute component={MobileAppDevelopment} seoKey="services" />
      </Route>

      <Route path="/services/web-development">
        <SEOOptimizedRoute component={WebDevelopmentServices} seoKey="services" />
      </Route>

      <Route path="/services/enterprise-solutions">
        <SEOOptimizedRoute component={EnterpriseSolutions} seoKey="services" />
      </Route>

      <Route path="/services/:slug">
        <SEOOptimizedRoute component={DynamicServicePage} seoKey="services" />
      </Route>
      <Route path="/login">
        <SEOOptimizedRoute component={LoginPage} />
      </Route>
      <Route path="/forgot-password">
        <SEOOptimizedRoute component={ForgotPasswordPage} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <SEOOptimizedRoute component={ProfilePage} />
        </ProtectedRoute>
      </Route>
      <Route path="/cms">
        <ProtectedRoute>
          <SEOOptimizedRoute component={AdminPanel} seoKey="cms" />
        </ProtectedRoute>
      </Route>
      <Route path="/seo-dashboard">
        <ProtectedRoute allowedRoles={['super_admin', 'content_admin']}>
          <SEODashboard />
        </ProtectedRoute>
      </Route>

      {/* Catch-all route for any undefined paths */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SiteSettingsProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <ScrollToTop />
              <AIChatbot />
            </TooltipProvider>
          </AuthProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
