import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnology extends Document {
  name: string;
  category: string;
  iconType: string;
  iconData?: string;
  iconColor?: string;
  description?: string;
  status: string;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TechnologySchema = new Schema<ITechnology>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    iconType: { type: String, required: true, default: 'text' },
    iconData: { type: String },
    iconColor: { type: String },
    description: { type: String },
    status: { type: String, default: 'active' },
    displayOrder: { type: Number, default: 0 },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const TechnologyModel = mongoose.models.Technology || mongoose.model<ITechnology>('Technology', TechnologySchema);
export default TechnologyModel;

