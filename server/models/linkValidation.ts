import mongoose, { Document, Schema } from 'mongoose';

export interface ILinkValidation extends Document {
  linkId: string;
  validationDate: Date;
  status: string;
  httpStatusCode?: number;
  responseTime?: number;
  errorMessage?: string;
  redirectChain?: string; // JSON
  finalUrl?: string;
  validatedBy: string;
  validationMethod: string;
  createdAt: Date;
}

const LinkValidationSchema = new Schema<ILinkValidation>(
  {
    linkId: { type: String, required: true, index: true },
    validationDate: { type: Date, default: Date.now },
    status: { type: String, required: true },
    httpStatusCode: { type: Number },
    responseTime: { type: Number },
    errorMessage: { type: String },
    redirectChain: { type: String },
    finalUrl: { type: String },
    validatedBy: { type: String, default: 'system' },
    validationMethod: { type: String, required: true, default: 'http' },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const LinkValidationModel = mongoose.models.LinkValidation || mongoose.model<ILinkValidation>('LinkValidation', LinkValidationSchema);
export default LinkValidationModel;

