import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  status: string;
  authorId?: Types.ObjectId;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    tags: { type: [String], default: [] },
    imageUrl: { type: String },
    imageAlt: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    status: { type: String, default: 'draft' },
    authorId: { type: Schema.Types.ObjectId, ref: 'Author' },
    legacyId: { type: Number, index: true }, // Optional numeric id from Postgres
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

export const BlogPostModel = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export default BlogPostModel;
