import mongoose, { Document, Schema } from 'mongoose';

export interface IRobotsTxtSetting extends Document {
  content: string;
  isActive: boolean;
  version: string;
  versionNotes?: string;
  contentHash: string;
  lastUpdated: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RobotsTxtSettingSchema = new Schema<IRobotsTxtSetting>(
  {
    content: {
      type: String,
      required: true,
      default: `User-agent: *
Allow: /

Sitemap: /sitemap.xml`
    },
    isActive: { type: Boolean, default: false },
    version: { type: String, required: true },
    versionNotes: { type: String },
    contentHash: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    createdBy: { type: String },
    updatedBy: { type: String },
    legacyId: { type: Number, index: true },
  },
  { timestamps: true }
);

export const RobotsTxtSettingModel = mongoose.models.RobotsTxtSetting || mongoose.model<IRobotsTxtSetting>('RobotsTxtSetting', RobotsTxtSettingSchema);
export default RobotsTxtSettingModel;

