import mongoose, { Document, Schema } from 'mongoose';

export interface ISeoSetting extends Document {
  settingKey: string;
  settingValue?: string;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeoSettingSchema = new Schema<ISeoSetting>(
  {
    settingKey: { type: String, required: true, unique: true, index: true },
    settingValue: { type: String },
    description: { type: String },
    category: { type: String },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const SeoSettingModel = mongoose.models.SeoSetting || mongoose.model<ISeoSetting>('SeoSetting', SeoSettingSchema);
export default SeoSettingModel;
