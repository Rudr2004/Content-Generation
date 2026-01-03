import mongoose, { Document, Schema } from 'mongoose';

export interface ICaseStudyPage extends Document {
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  clientName?: string;
  clientIndustry?: string;
  clientLocation?: string;
  projectDuration?: string;
  problemStatement?: string;
  objectives?: string; // JSON
  challenges?: string; // JSON
  solutionStrategy?: string;
  featuresCapabilities?: string; // JSON
  userExperienceDesign?: string;
  technologiesUsed?: string; // JSON
  implementationProcess?: string; // JSON
  quantitativeMetrics?: string; // JSON
  qualitativeBenefits?: string; // JSON
  businessOutcomes?: string;
  clientTestimonial?: string;
  futureScopeEnhancements?: string;
  conclusion?: string;
  referenceContent?: string;
  category?: string;
  tags?: string;
  status: string;
  featured?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudyPageSchema = new Schema<ICaseStudyPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    canonicalUrl: { type: String },
    clientName: { type: String },
    clientIndustry: { type: String },
    clientLocation: { type: String },
    projectDuration: { type: String },
    problemStatement: { type: String },
    objectives: { type: String },
    challenges: { type: String },
    solutionStrategy: { type: String },
    featuresCapabilities: { type: String },
    userExperienceDesign: { type: String },
    technologiesUsed: { type: String },
    implementationProcess: { type: String },
    quantitativeMetrics: { type: String },
    qualitativeBenefits: { type: String },
    businessOutcomes: { type: String },
    clientTestimonial: { type: String },
    futureScopeEnhancements: { type: String },
    conclusion: { type: String },
    referenceContent: { type: String },
    category: { type: String },
    tags: { type: String },
    status: { type: String, default: 'draft' },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const CaseStudyPageModel = mongoose.models.CaseStudyPage || mongoose.model<ICaseStudyPage>('CaseStudyPage', CaseStudyPageSchema);
export default CaseStudyPageModel;

