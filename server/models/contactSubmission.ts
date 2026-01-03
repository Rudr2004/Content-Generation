import mongoose, { Document, Schema } from 'mongoose';

export interface IContactSubmission extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  pageSource?: string;
  createdAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    company: { type: String },
    service: { type: String },
    message: { type: String, required: true },
    pageSource: { type: String, default: 'Contact' },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ContactSubmissionModel = mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
export default ContactSubmissionModel;

