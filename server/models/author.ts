import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    legacyId: { type: Number, index: true }, // Optional numeric id from Postgres
  },
  { timestamps: true }
);

export const AuthorModel = mongoose.models.Author || mongoose.model<IAuthor>('Author', AuthorSchema);
export default AuthorModel;
