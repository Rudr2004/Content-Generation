import mongoose, { Document, Schema } from 'mongoose';

export interface ISeoKeyword extends Document {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  category?: string;
  targetRanking?: number;
  currentRanking?: number;
  lastChecked?: Date;
  status?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeoKeywordSchema = new Schema<ISeoKeyword>(
  {
    keyword: { type: String, required: true, index: true },
    searchVolume: { type: Number },
    difficulty: { type: Number },
    category: { type: String },
    targetRanking: { type: Number, default: 1 },
    currentRanking: { type: Number },
    lastChecked: { type: Date },
    status: { type: String, default: 'active' },
    notes: { type: String },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const SeoKeywordModel = mongoose.models.SeoKeyword || mongoose.model<ISeoKeyword>('SeoKeyword', SeoKeywordSchema);
export default SeoKeywordModel;
