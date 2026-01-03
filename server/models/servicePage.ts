import mongoose, { Document, Schema } from 'mongoose';

export interface IServicePage extends Document {
  title: string;
  slug: string;
  subcategoryId?: Schema.Types.ObjectId;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  status: string;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServicePageSchema = new Schema<IServicePage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'ServiceSubcategory' },
    content: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    status: { type: String, default: 'active' },
    displayOrder: { type: Number },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ServicePageModel = mongoose.models.ServicePage || mongoose.model<IServicePage>('ServicePage', ServicePageSchema);
export default ServicePageModel;