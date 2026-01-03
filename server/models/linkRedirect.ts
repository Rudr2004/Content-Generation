import mongoose, { Document, Schema } from 'mongoose';

export interface ILinkRedirect extends Document {
  oldLinkId: string;
  newLinkId: string;
  redirectType: string;
  reason?: string;
  isActive: boolean;
  expiresAt?: Date;
  createdBy?: string;
  createdAt: Date;
}

const LinkRedirectSchema = new Schema<ILinkRedirect>(
  {
    oldLinkId: { type: String, required: true, index: true },
    newLinkId: { type: String, required: true, index: true },
    redirectType: { type: String, default: '301' },
    reason: { type: String },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdBy: { type: String },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate redirects
LinkRedirectSchema.index({ oldLinkId: 1, newLinkId: 1 }, { unique: true });

export const LinkRedirectModel = mongoose.models.LinkRedirect || mongoose.model<ILinkRedirect>('LinkRedirect', LinkRedirectSchema);
export default LinkRedirectModel;

