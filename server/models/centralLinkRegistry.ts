import mongoose, { Document, Schema } from 'mongoose';

export interface ICentralLinkRegistry extends Document {
  linkId: string;
  targetUrl: string;
  originalUrl?: string;
  displayText: string;
  linkType: string;
  category?: string;
  title?: string;
  description?: string;
  status: string;
  isTracked: boolean;
  priority: number;
  clickCount: number;
  lastAccessed?: Date;
  lastValidated?: Date;
  validationStatus: string;
  version: number;
  previousVersionId?: number;
  tags?: string[];
  metadata?: string; // JSON
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CentralLinkRegistrySchema = new Schema<ICentralLinkRegistry>(
  {
    linkId: { type: String, required: true, unique: true, index: true },
    targetUrl: { type: String, required: true, index: true },
    originalUrl: { type: String },
    displayText: { type: String, required: true },
    linkType: { type: String, required: true, default: 'internal' },
    category: { type: String },
    title: { type: String },
    description: { type: String },
    status: { type: String, required: true, default: 'active' },
    isTracked: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    lastAccessed: { type: Date },
    lastValidated: { type: Date },
    validationStatus: { type: String, default: 'pending' },
    version: { type: Number, default: 1 },
    previousVersionId: { type: Number },
    tags: { type: [String], default: [] },
    metadata: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

// Compound index for unique link target + display text
CentralLinkRegistrySchema.index({ targetUrl: 1, displayText: 1 }, { unique: true });

export const CentralLinkRegistryModel = mongoose.models.CentralLinkRegistry || mongoose.model<ICentralLinkRegistry>('CentralLinkRegistry', CentralLinkRegistrySchema);
export default CentralLinkRegistryModel;

