import mongoose, { Document, Schema } from 'mongoose';

export interface IIndustryPage extends Document {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string; // JSON
  heroHeadline?: string;
  heroSubheading?: string;
  heroBackgroundImage?: string;
  heroBackgroundImageAlt?: string;
  heroBackgroundImageS3Key?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  overviewTitle?: string;
  overviewContent?: string; // JSON
  industryStatistics?: string; // JSON
  industriesDetailTitle?: string;
  industries?: string; // JSON
  technologyStackTitle?: string;
  keyTechnologies?: string; // JSON
  platforms?: string; // JSON
  tools?: string; // JSON
  engagementProcessTitle?: string;
  engagementSteps?: string; // JSON
  uniqueValuePropositionsTitle?: string;
  uniqueValuePropositionsPoints?: string; // JSON
  testimonialsTitle?: string;
  testimonialsEntries?: string; // JSON
  faqsTitle?: string;
  faqsItems?: string; // JSON
  ctaHeadline?: string;
  ctaSubtext?: string;
  ctaPrimaryButtonText?: string;
  ctaPrimaryButtonLink?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonLink?: string;
  showOverview?: boolean;
  showIndustriesDetail?: boolean;
  showTechnologyStack?: boolean;
  showEngagementProcess?: boolean;
  showUniqueValuePropositions?: boolean;
  showTestimonials?: boolean;
  showFaqs?: boolean;
  showCta?: boolean;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  referenceContent?: string;
  content?: string;
  generatedContent?: string;
  featured?: boolean;
  status: string;
  published?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IndustryPageSchema = new Schema<IIndustryPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    heroHeadline: { type: String },
    heroSubheading: { type: String },
    heroBackgroundImage: { type: String },
    heroBackgroundImageAlt: { type: String },
    heroBackgroundImageS3Key: { type: String },
    heroCtaText: { type: String },
    heroCtaLink: { type: String },
    overviewTitle: { type: String, default: 'Industry Overview' },
    overviewContent: { type: String },
    industryStatistics: { type: String },
    industriesDetailTitle: { type: String, default: 'Our Industry Solutions' },
    industries: { type: String },
    technologyStackTitle: { type: String, default: 'Technologies We Use' },
    keyTechnologies: { type: String },
    platforms: { type: String },
    tools: { type: String },
    engagementProcessTitle: { type: String, default: 'How We Work' },
    engagementSteps: { type: String },
    uniqueValuePropositionsTitle: { type: String },
    uniqueValuePropositionsPoints: { type: String },
    testimonialsTitle: { type: String, default: 'What Our Clients Say' },
    testimonialsEntries: { type: String },
    faqsTitle: { type: String, default: 'Frequently Asked Questions' },
    faqsItems: { type: String },
    ctaHeadline: { type: String },
    ctaSubtext: { type: String },
    ctaPrimaryButtonText: { type: String },
    ctaPrimaryButtonLink: { type: String },
    ctaSecondaryButtonText: { type: String },
    ctaSecondaryButtonLink: { type: String },
    showOverview: { type: Boolean, default: true },
    showIndustriesDetail: { type: Boolean, default: true },
    showTechnologyStack: { type: Boolean, default: true },
    showEngagementProcess: { type: Boolean, default: true },
    showUniqueValuePropositions: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true },
    showFaqs: { type: Boolean, default: true },
    showCta: { type: Boolean, default: true },
    primaryKeyword: { type: String },
    secondaryKeywords: { type: String },
    referenceContent: { type: String },
    content: { type: String },
    generatedContent: { type: String },
    featured: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
    published: { type: Boolean, default: false },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const IndustryPageModel = mongoose.models.IndustryPage || mongoose.model<IIndustryPage>('IndustryPage', IndustryPageSchema);
export default IndustryPageModel;

