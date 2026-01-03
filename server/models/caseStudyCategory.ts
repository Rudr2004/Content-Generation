import mongoose, { Document, Schema } from 'mongoose';

export interface ICaseStudyCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  status: string;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudyCategorySchema = new Schema<ICaseStudyCategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    status: { type: String, default: 'active' },
    displayOrder: { type: Number },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const CaseStudyCategoryModel = mongoose.models.CaseStudyCategory || mongoose.model<ICaseStudyCategory>('CaseStudyCategory', CaseStudyCategorySchema);
export default CaseStudyCategoryModel;

