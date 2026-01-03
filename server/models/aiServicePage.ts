import mongoose, { Document, Schema } from 'mongoose';

export interface IAiServicePage extends Document {
  title: string;
  slug: string;
  content?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const AiServicePageSchema = new Schema<IAiServicePage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String },
    status: { type: String, default: 'draft' },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const AiServicePageModel = mongoose.models.AiServicePage || mongoose.model<IAiServicePage>('AiServicePage', AiServicePageSchema);
export default AiServicePageModel;

