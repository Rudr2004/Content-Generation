import mongoose, { Document, Schema } from 'mongoose';

export interface IHirePage extends Document {
  legacyId?: number;
  title: string;
  slug: string;
  developerType?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  trustBadges?: string[];
  whyHireTitle?: string;
  whyHireDescription?: string;
  whyHirePoints?: string[];
  metricsTitle?: string;
  projectsDelivered?: string;
  yearsExperience?: string;
  revenueSecured?: string;
  industryRecognition?: string;
  clientLogos?: string[];
  servicesTitle?: string;
  servicesDescription?: string;
  servicesOffered?: any[];
  hiringModelsTitle?: string;
  hiringModelsDescription?: string;
  hiringModels?: any[];
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  testimonials?: any[];
  faqTitle?: string;
  faqs?: any[];
  finalCtaTitle?: string;
  finalCtaDescription?: string;
  finalCtaText?: string;
  finalCtaUrl?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  targetLocations?: string[];
  coreSkills?: string[];
  technologyStack?: any;
  aiTechnologies?: string[];
  referenceContent?: string;
  content?: any;
  caseStudyCategories?: string[];
  selectedCaseStudies?: string[];
  status?: string;
  featured?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HirePageSchema = new Schema<IHirePage>(
  {
    legacyId: { type: Number, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    developerType: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    canonicalUrl: { type: String },
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    heroDescription: { type: String },
    heroImageUrl: { type: String },
    heroImageAlt: { type: String },
    heroCtaText: { type: String },
    heroCtaUrl: { type: String },
    trustBadges: { type: [String], default: [] },
    whyHireTitle: { type: String },
    whyHireDescription: { type: String },
    whyHirePoints: { type: [String], default: [] },
    metricsTitle: { type: String },
    projectsDelivered: { type: String },
    yearsExperience: { type: String },
    revenueSecured: { type: String },
    industryRecognition: { type: String },
    clientLogos: { type: [String], default: [] },
    servicesTitle: { type: String },
    servicesDescription: { type: String },
    servicesOffered: { type: [Schema.Types.Mixed], default: [] },
    hiringModelsTitle: { type: String },
    hiringModelsDescription: { type: String },
    hiringModels: { type: [Schema.Types.Mixed], default: [] },
    testimonialsTitle: { type: String },
    testimonialsDescription: { type: String },
    testimonials: { type: [Schema.Types.Mixed], default: [] },
    faqTitle: { type: String },
    faqs: { type: [Schema.Types.Mixed], default: [] },
    finalCtaTitle: { type: String },
    finalCtaDescription: { type: String },
    finalCtaText: { type: String },
    finalCtaUrl: { type: String },
    primaryKeyword: { type: String },
    secondaryKeywords: { type: String },
    targetLocations: { type: [String], default: [] },
    coreSkills: { type: [String], default: [] },
    technologyStack: { type: Schema.Types.Mixed },
    aiTechnologies: { type: [String], default: [] },
    referenceContent: { type: String },
    content: { type: Schema.Types.Mixed },
    caseStudyCategories: { type: [String], default: [] },
    selectedCaseStudies: { type: [String], default: [] },
    status: { type: String, default: 'draft' },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const HirePageModel = mongoose.models.HirePage || mongoose.model<IHirePage>('HirePage', HirePageSchema);
export default HirePageModel;
