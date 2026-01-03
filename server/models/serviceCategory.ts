import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  status: string;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String },
    status: { type: String, default: 'active' },
    displayOrder: { type: Number },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ServiceCategoryModel = mongoose.models.ServiceCategory || mongoose.model<IServiceCategory>('ServiceCategory', ServiceCategorySchema);
export default ServiceCategoryModel;
