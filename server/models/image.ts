import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  originalFilename?: string;
  s3Key: string;
  s3Url: string;
  bucket: string;
  contentType: string;
  folder?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    filename: { type: String, required: true },
    originalFilename: { type: String },
    s3Key: { type: String, required: true, index: true },
    s3Url: { type: String, required: true },
    bucket: { type: String, required: true },
    contentType: { type: String, required: true },
    folder: { type: String, default: 'images' },
    status: { type: String, default: 'active' },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const ImageModel = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
export default ImageModel;

