import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  pageName?: string;
  category?: string;
  subCategory?: string;
  caseStudyCategory?: string;
  caseStudyCategories?: string[];
  selectedCaseStudies?: string[];
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  icon?: string;
  features?: string[];
  technologies?: string[];
  techStackDomains?: string[];
  aiTechnologies?: string[];
  referenceUrl?: string;
  referenceContent?: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  status: string;
  startingPrice?: string;
  featured?: boolean;
  legacyId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    pageName: { type: String },
    category: { type: String },
    subCategory: { type: String },
    caseStudyCategory: { type: String },
    caseStudyCategories: { type: [String], default: [] },
    selectedCaseStudies: { type: [String], default: [] },
    content: { type: String },
    excerpt: { type: String },
    imageUrl: { type: String },
    imageAlt: { type: String },
    icon: { type: String },
    features: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    techStackDomains: { type: [String], default: [] },
    aiTechnologies: { type: [String], default: [] },
    referenceUrl: { type: String },
    referenceContent: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    primaryKeyword: { type: String },
    secondaryKeywords: { type: String },
    keywords: { type: String },
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    status: { type: String, default: 'active' },
    startingPrice: { type: String },
    featured: { type: Boolean, default: false },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default ServiceModel;