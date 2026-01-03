import mongoose, { Document, Schema } from 'mongoose';

export interface IPageIndexingStatus extends Document {
  pageUrl: string;
  pageType: string;
  referenceId?: number;
  pageTitle: string;
  isIndexable: boolean;
  metaRobotsTag: string;
  noindexReason?: string;
  lastChecked?: Date;
  lastUpdated: Date;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageIndexingStatusSchema = new Schema<IPageIndexingStatus>(
  {
    pageUrl: { type: String, required: true, unique: true, index: true },
    pageType: { type: String, required: true },
    referenceId: { type: Number },
    pageTitle: { type: String, required: true },
    isIndexable: { type: Boolean, default: true },
    metaRobotsTag: { type: String, default: 'index, follow' },
    noindexReason: { type: String },
    lastChecked: { type: Date },
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: String },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const PageIndexingStatusModel = mongoose.models.PageIndexingStatus || mongoose.model<IPageIndexingStatus>('PageIndexingStatus', PageIndexingStatusSchema);
export default PageIndexingStatusModel;

