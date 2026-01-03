import mongoose, { Document, Schema } from 'mongoose';

export interface ISeoPageData extends Document {
  pageType: string;
  referenceId: number;
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaMarkup?: string;
  seoScore?: number;
  lastOptimized?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SeoPageDataSchema = new Schema<ISeoPageData>(
  {
    pageType: { type: String, required: true, index: true },
    referenceId: { type: Number, required: true, index: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    primaryKeyword: { type: String },
    secondaryKeywords: { type: String },
    focusKeywords: { type: [String], default: [] },
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    twitterImage: { type: String },
    schemaMarkup: { type: String },
    seoScore: { type: Number, default: 0 },
    lastOptimized: { type: Date },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const SeoPageDataModel = mongoose.models.SeoPageData || mongoose.model<ISeoPageData>('SeoPageData', SeoPageDataSchema);
export default SeoPageDataModel;
