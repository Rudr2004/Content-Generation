import mongoose, { Document, Schema } from 'mongoose';

export interface ISeoAnalytics extends Document {
  pageUrl: string;
  pageTitle?: string;
  pageType?: string;
  referenceId?: number;
  organicTraffic?: number;
  avgPosition?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  backlinks?: number;
  dateRecorded?: Date;
  createdAt: Date;
}

const SeoAnalyticsSchema = new Schema<ISeoAnalytics>(
  {
    pageUrl: { type: String, required: true, index: true },
    pageTitle: { type: String },
    pageType: { type: String },
    referenceId: { type: Number },
    organicTraffic: { type: Number, default: 0 },
    avgPosition: { type: Number },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    backlinks: { type: Number, default: 0 },
    dateRecorded: { type: Date, default: Date.now },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const SeoAnalyticsModel = mongoose.models.SeoAnalytics || mongoose.model<ISeoAnalytics>('SeoAnalytics', SeoAnalyticsSchema);
export default SeoAnalyticsModel;
