import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceTestimonial extends Document {
  legacyId?: number;
  serviceId?: number; // legacy service id
  clientName: string;
  clientCompany: string;
  clientPosition: string;
  testimonialText: string;
  rating: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceTestimonialSchema = new Schema<IServiceTestimonial>(
  {
    legacyId: { type: Number, index: true },
    serviceId: { type: Number, index: true },
    clientName: { type: String, required: true },
    clientCompany: { type: String, required: true },
    clientPosition: { type: String, required: true },
    testimonialText: { type: String, required: true },
    rating: { type: Number, default: 5 },
    gender: { type: String, default: 'male' },
  },
  { timestamps: true }
);

export const ServiceTestimonialModel = mongoose.models.ServiceTestimonial || mongoose.model<IServiceTestimonial>('ServiceTestimonial', ServiceTestimonialSchema);
export default ServiceTestimonialModel;
