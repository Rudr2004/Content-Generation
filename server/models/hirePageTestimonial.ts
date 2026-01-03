import mongoose, { Document, Schema } from 'mongoose';

export interface IHirePageTestimonial extends Document {
  legacyId?: number;
  hirePageId?: number; // legacy hire page id
  clientName: string;
  clientCompany: string;
  clientPosition: string;
  testimonialText: string;
  rating: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

const HirePageTestimonialSchema = new Schema<IHirePageTestimonial>(
  {
    legacyId: { type: Number, index: true },
    hirePageId: { type: Number, index: true },
    clientName: { type: String, required: true },
    clientCompany: { type: String, required: true },
    clientPosition: { type: String, required: true },
    testimonialText: { type: String, required: true },
    rating: { type: Number, default: 5 },
    gender: { type: String, default: 'male' },
  },
  { timestamps: true }
);

export const HirePageTestimonialModel = mongoose.models.HirePageTestimonial || mongoose.model<IHirePageTestimonial>('HirePageTestimonial', HirePageTestimonialSchema);
export default HirePageTestimonialModel;
