import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceDetailPage extends Document {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  whyChooseUsTitle?: string;
  whyChooseUsDescription?: string;
  whyChooseUsCards?: string; // JSON
  servicesOverviewTitle?: string;
  servicesOverviewDescription?: string;
  servicesOverviewCards?: string; // JSON
  developmentProcessTitle?: string;
  developmentProcessDescription?: string;
  developmentProcessSteps?: string; // JSON
  industriesServedTitle?: string;
  industriesServedDescription?: string;
  industriesServedList?: string; // JSON
  businessBenefitsTitle?: string;
  businessBenefitsDescription?: string;
  businessBenefitsCards?: string; // JSON
  caseStudiesTitle?: string;
  caseStudiesDescription?: string;
  caseStudiesCards?: string; // JSON
  techStackTitle?: string;
  techStackDescription?: string;
  techStackCategories?: string; // JSON
  expertiseAreasTitle?: string;
  expertiseAreasDescription?: string;
  expertiseAreasList?: string; // JSON
  engagementModelsTitle?: string;
  engagementModelsDescription?: string;
  engagementModelsCards?: string; // JSON
  partnerLogosTitle?: string;
  partnerLogosDescription?: string;
  partnerLogos?: string; // JSON
  showWhyChooseUs?: boolean;
  showServicesOverview?: boolean;
  showDevelopmentProcess?: boolean;
  showIndustriesServed?: boolean;
  showBusinessBenefits?: boolean;
  showCaseStudies?: boolean;
  showTechStack?: boolean;
  showExpertiseAreas?: boolean;
  showEngagementModels?: boolean;
  showPartnerLogos?: boolean;
  published?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceDetailPageSchema = new Schema<IServiceDetailPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    heroTitle: { type: String },
    heroDescription: { type: String },
    heroImageUrl: { type: String },
    heroImageAlt: { type: String },
    heroCtaText: { type: String },
    heroCtaUrl: { type: String },
    whyChooseUsTitle: { type: String, default: 'Why Choose Us' },
    whyChooseUsDescription: { type: String },
    whyChooseUsCards: { type: String },
    servicesOverviewTitle: { type: String, default: 'Our Services' },
    servicesOverviewDescription: { type: String },
    servicesOverviewCards: { type: String },
    developmentProcessTitle: { type: String, default: 'Our Development Process' },
    developmentProcessDescription: { type: String },
    developmentProcessSteps: { type: String },
    industriesServedTitle: { type: String, default: 'Industries We Serve' },
    industriesServedDescription: { type: String },
    industriesServedList: { type: String },
    businessBenefitsTitle: { type: String, default: 'Business Benefits' },
    businessBenefitsDescription: { type: String },
    businessBenefitsCards: { type: String },
    caseStudiesTitle: { type: String, default: 'Case Studies' },
    caseStudiesDescription: { type: String },
    caseStudiesCards: { type: String },
    techStackTitle: { type: String, default: 'Technology Stack' },
    techStackDescription: { type: String },
    techStackCategories: { type: String },
    expertiseAreasTitle: { type: String, default: 'Our Expertise Areas' },
    expertiseAreasDescription: { type: String },
    expertiseAreasList: { type: String },
    engagementModelsTitle: { type: String, default: 'Engagement Models' },
    engagementModelsDescription: { type: String },
    engagementModelsCards: { type: String },
    partnerLogosTitle: { type: String, default: 'Trusted by Industry Leaders' },
    partnerLogosDescription: { type: String },
    partnerLogos: { type: String },
    showWhyChooseUs: { type: Boolean, default: true },
    showServicesOverview: { type: Boolean, default: true },
    showDevelopmentProcess: { type: Boolean, default: true },
    showIndustriesServed: { type: Boolean, default: true },
    showBusinessBenefits: { type: Boolean, default: true },
    showCaseStudies: { type: Boolean, default: true },
    showTechStack: { type: Boolean, default: true },
    showExpertiseAreas: { type: Boolean, default: true },
    showEngagementModels: { type: Boolean, default: true },
    showPartnerLogos: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ServiceDetailPageModel = mongoose.models.ServiceDetailPage || mongoose.model<IServiceDetailPage>('ServiceDetailPage', ServiceDetailPageSchema);
export default ServiceDetailPageModel;

