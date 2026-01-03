import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

interface HireDeveloperGuidelineModalProps {
  trigger?: React.ReactNode;
}

export function HireDeveloperGuidelineModal({ trigger }: HireDeveloperGuidelineModalProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <BookOpen className="w-4 h-4" />
      View Content Guidelines
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Hire Developer Content Generation Guidelines
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Overview */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Enhanced CMS Template: Complete 10-Section Structure</h3>
                  <p className="text-blue-800 text-sm">
                    Structured guideline for CMS to ensure all future "Hire [X] Developer" pages maintain consistency in formatting, flow, and professionalism. Only the content (skills, industries, technologies, testimonials, etc.) should change depending on the type of developer being featured.
                  </p>
                  <div className="mt-3 p-2 bg-white/60 rounded text-xs text-blue-700">
                    <strong>Key Features:</strong> Consistent branding, SEO optimization, variable content blocks, automatic badge updates
                  </div>
                </div>
              </div>
            </div>

            {/* 10-Section Structure */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Complete 10-Section CMS Template Structure
              </h3>
              
              {/* Section 1: Hero */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-600 text-white">1</Badge>
                  <h4 className="font-medium text-blue-900">Hero Section</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Clear Headline:</strong> "Hire [Skill/Technology] Developers"</li>
                    <li><strong>Subheadline:</strong> Describe value proposition, trust markers, and industry reach</li>
                    <li><strong>Key Stats & Trust Badges:</strong> Hire ratio, trial policy, NDA, timezone, Fortune 500 clients, hiring speed</li>
                    <li><strong>Latest Certifications:</strong> "Certified 2024", "Top Company 2024"</li>
                    <li><strong>Call-to-Action (CTA):</strong> Prominent "Hire Developer" button</li>
                    <li><strong>At-a-glance Info:</strong> Number of projects, years of experience, contracts delivered, total value secured</li>
                  </ul>
                </div>
              </div>

              {/* Section 2: Value Propositions */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-green-600 text-white">2</Badge>
                  <h4 className="font-medium text-green-900">Value Propositions & Risk-Free Offer</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Highlight risk-free trial, cost reduction, faster delivery, timezone alignment, certified experts</li>
                    <li>Bulleted format for clarity</li>
                  </ul>
                </div>
              </div>

              {/* Section 3: Deep Expertise */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-purple-600 text-white">3</Badge>
                  <h4 className="font-medium text-purple-900">Deep Expertise Section</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Headline:</strong> "Hire [Skill/Technology] Developers with Deep Expertise"</li>
                    <li><strong>Intro Paragraph:</strong> Focus on relevant protocols, languages, or frameworks</li>
                    <li><strong>Capability List:</strong> Development specifics (smart contracts, app backends, protocol integrations)</li>
                    <li><strong>Additional Areas:</strong> Security, auditing, scalability, compliance, etc.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Service Details */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-orange-600 text-white">4</Badge>
                  <h4 className="font-medium text-orange-900">Service/Expertise Details</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Sectioned blocks describing core specialties relevant to the technology or role:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>"[Technology/Skill] Development"</li>
                    <li>"[Technology/Skill] Protocol Development"</li>
                    <li>"Integration Services"</li>
                    <li>"Security & Auditing"</li>
                    <li>"Custom [Technologies/Features]" (e.g., tokenomics, performance tuning)</li>
                  </ul>
                  <p className="text-xs bg-gray-50 p-2 rounded mt-2"><strong>Format:</strong> Concise heading + 1–3 bullet points of what's included</p>
                </div>
              </div>

              {/* Section 5: Hiring Models */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-indigo-600 text-white">5</Badge>
                  <h4 className="font-medium text-indigo-900">Hiring Models & Flexibility</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Headline:</strong> "Pick the Right Model to Hire [Skill/Technology] Developers"</p>
                  <p><strong>Options Table or Bullets:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Contract/Contract-to-Hire</strong></li>
                    <li><strong>Permanent (Full-time) Model</strong></li>
                    <li><strong>Dedicated Teams</strong></li>
                  </ul>
                  <p className="text-xs bg-gray-50 p-2 rounded mt-2">Each should have a 1–2 sentence description emphasizing flexibility, focus, or continuity</p>
                </div>
              </div>

              {/* Section 6: Ready to Hire */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-teal-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-teal-600 text-white">6</Badge>
                  <h4 className="font-medium text-teal-900">"Ready to Hire?" Section</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>CTA:</strong> Prompt to share project details for a quick match</li>
                    <li><strong>Fast Match Guarantee:</strong> e.g., "Match in 48 hours"</li>
                  </ul>
                </div>
              </div>

              {/* Section 7: Company Stats */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-pink-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-pink-600 text-white">7</Badge>
                  <h4 className="font-medium text-pink-900">Company Stats & Credentials</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Number of projects, cumulative years in technology, audits conducted, industry trust</li>
                  </ul>
                </div>
              </div>

              {/* Section 8: Testimonials */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-yellow-600 text-white">8</Badge>
                  <h4 className="font-medium text-yellow-900">Testimonials/Success Stories</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>2–3 client testimonials featuring:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name, role, company</li>
                    <li>Specific positive outcomes (on-time delivery, platform stability, quality of developer communication, unique tech solved)</li>
                    <li>Use a blockquote or highlighted style</li>
                  </ul>
                </div>
              </div>

              {/* Section 9: Final Engagement */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-cyan-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-cyan-600 text-white">9</Badge>
                  <h4 className="font-medium text-cyan-900">Final Engagement Section</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Encouraging Statement:</strong> "Ready to Transform Your Business?" or similar</li>
                    <li><strong>Secondary CTA:</strong> Free consultation, discovery call, or project review</li>
                  </ul>
                </div>
              </div>

              {/* Section 10: Contact Details */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-red-50/50 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-red-600 text-white">10</Badge>
                  <h4 className="font-medium text-red-900">Contact & Office Details</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Office locations, full addresses, and contact numbers</li>
                    <li>Email for business queries</li>
                    <li>Social icons for LinkedIn, X (Twitter), etc.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                Additional Notes
              </h3>
              
              {/* Consistent Branding */}
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">Branding</Badge>
                  Consistent Branding
                </h4>
                <p className="text-sm text-gray-700">
                  Use same branding, colors, and call-to-action styling on all pages.
                </p>
              </div>

              {/* SEO Optimization */}
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50/30 to-teal-50/30 rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">SEO</Badge>
                  SEO Optimization
                </h4>
                <p className="text-sm text-gray-700">
                  Page H1, meta title, and descriptions should all use the targeted technology/role.
                </p>
              </div>

              {/* Variable Content Blocks */}
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50/30 to-pink-50/30 rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">CMS</Badge>
                  Variable Content Blocks
                </h4>
                <p className="text-sm text-gray-700">
                  Plan CMS to allow content blocks to be swapped dynamically for each hire category without changing base structure.
                </p>
              </div>

              {/* Automatic Badge Updates */}
              <div className="mb-4 p-3 bg-gradient-to-r from-orange-50/30 to-red-50/30 rounded-lg border">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">Updates</Badge>
                  Automatic Badge & Stat Updates
                </h4>
                <p className="text-sm text-gray-700">
                  Pull stats and badges from a central source to keep all hire pages current.
                </p>
              </div>
            </div>

            {/* AI Generation Process */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">AI Content Generation Standards</h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-100 text-green-800">Target</Badge>
                  <div className="text-sm">
                    <strong>Market Focus:</strong> USA & Canada markets with enterprise-grade solutions emphasis
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-100 text-green-800">Content</Badge>
                  <div className="text-sm">
                    <strong>Requirements:</strong> Technology-specific capabilities, business transformation outcomes, professional consultative tone
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-100 text-green-800">SEO</Badge>
                  <div className="text-sm">
                    <strong>Keywords:</strong> Primary "Hire [Technology] Developers", secondary technology-specific terms, location targeting
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Standards */}
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Quality Standards</h3>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li>• All content must be professional and enterprise-grade</li>
                    <li>• Technology-specific expertise for each developer type</li>
                    <li>• Business value and ROI focus throughout</li>
                    <li>• USA & Canada market targeting</li>
                    <li>• Consistent structure matching LLM Developer page</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 text-center">
                This structure ensures all hire developer pages maintain consistency while allowing for technology-specific customization in content, services, and testimonials.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default HireDeveloperGuidelineModal;