import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceSubcategory extends Document {
  name: string;
  slug: string;
  categoryId?: Schema.Types.ObjectId;
  legacyCategoryId?: number;
  description?: string;
  status: string;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSubcategorySchema = new Schema<IServiceSubcategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },
    legacyCategoryId: { type: Number, index: true },
    description: { type: String },
    status: { type: String, default: 'active' },
    displayOrder: { type: Number },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ServiceSubcategoryModel = mongoose.models.ServiceSubcategory || mongoose.model<IServiceSubcategory>('ServiceSubcategory', ServiceSubcategorySchema);
export default ServiceSubcategoryModel;