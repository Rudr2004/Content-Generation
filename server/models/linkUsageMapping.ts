import mongoose, { Document, Schema } from 'mongoose';

export interface ILinkUsageMapping extends Document {
  linkId: string;
  contentType: string;
  contentId: string | number; // Support both MongoDB ObjectId strings and numeric IDs
  contentTitle?: string;
  fieldName?: string;
  contextBefore?: string;
  contextAfter?: string;
  position?: number;
  usageType: string;
  isActive: boolean;
  lastSynced?: Date;
  syncStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkUsageMappingSchema = new Schema<ILinkUsageMapping>(
  {
    linkId: { type: String, required: true, index: true },
    contentType: { type: String, required: true },
    contentId: { type: Schema.Types.Mixed, required: true }, // Support both string and number
    contentTitle: { type: String },
    fieldName: { type: String },
    contextBefore: { type: String },
    contextAfter: { type: String },
    position: { type: Number, default: 0 },
    usageType: { type: String, default: 'content' },
    isActive: { type: Boolean, default: true },
    lastSynced: { type: Date },
    syncStatus: { type: String, default: 'synced' },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

// Compound index for unique content link
LinkUsageMappingSchema.index({ linkId: 1, contentType: 1, contentId: 1, fieldName: 1, position: 1 }, { unique: true });

export const LinkUsageMappingModel = mongoose.models.LinkUsageMapping || mongoose.model<ILinkUsageMapping>('LinkUsageMapping', LinkUsageMappingSchema);
export default LinkUsageMappingModel;

