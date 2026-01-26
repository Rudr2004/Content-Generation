import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema({
    siteName: { type: String, default: "GreenAppleX", required: true },
    theme: { type: String, default: "light", required: true },
    primaryColor: { type: String, default: "blue" },
    logoUrl: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const SiteSettingModel = mongoose.model("SiteSetting", siteSettingSchema);
