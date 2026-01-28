// storage.ts
import { connectMongo } from "./mongo";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "./models/user";
import { BlogPostModel } from "./models/blogPost";
import { HirePageModel } from "./models/hirePage";
import { HirePageTestimonialModel } from "./models/hirePageTestimonial";
import { CaseStudyPageModel } from "./models/caseStudyPage";
import { CaseStudyCategoryModel } from "./models/caseStudyCategory";
import { ServiceCategoryModel } from "./models/serviceCategory";
import { ServiceSubcategoryModel } from "./models/serviceSubcategory";
import { ServiceModel } from "./models/service";
import { ServicePageModel } from "./models/servicePage";
import { ServiceTestimonialModel } from "./models/serviceTestimonial";
import { ServiceDetailPageModel } from "./models/serviceDetailPage";
import { IndustryPageModel } from "./models/industryPage";
import { AuthorModel } from "./models/author";
import { PageIndexingStatusModel } from "./models/pageIndexingStatus";
import { AiServicePageModel } from "./models/aiServicePage";
import { ContactSubmissionModel } from "./models/contactSubmission";
import { SeoSettingModel } from "./models/seoSetting";
import { SeoKeywordModel } from "./models/seoKeyword";
import { SeoAnalyticsModel } from "./models/seoAnalytics";
import { SeoPageDataModel } from "./models/seoPageData";
import { CentralLinkRegistryModel } from "./models/centralLinkRegistry";
import { LinkUsageMappingModel } from "./models/linkUsageMapping";
import { LinkRedirectModel } from "./models/linkRedirect";
import { LinkValidationModel } from "./models/linkValidation";
import { RobotsTxtSettingModel } from "./models/robotsTxtSetting";
import { TechnologyModel } from "./models/technology";
import { SiteSettingModel } from "./models/siteSetting";

// ===================== TypeScript Interfaces =====================
export interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: "draft" | "published" | "scheduled";
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HirePage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  developerType?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroCtaText?: string;
  heroCtaUrl?: string;
  trustBadges?: string[];
  whyHireTitle?: string;
  whyHireDescription?: string;
  whyHirePoints?: string[];
  metricsTitle?: string;
  projectsDelivered?: string;
  yearsExperience?: string;
  revenueSecured?: string;
  industryRecognition?: string;
  clientLogos?: string[];
  servicesTitle?: string;
  servicesDescription?: string;
  servicesOffered?: any[];
  hiringModelsTitle?: string;
  hiringModelsDescription?: string;
  hiringModels?: any[];
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  testimonials?: any[];
  faqTitle?: string;
  faqs?: any[];
  finalCtaTitle?: string;
  finalCtaDescription?: string;
  finalCtaText?: string;
  finalCtaUrl?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  targetLocations?: string[];
  coreSkills?: string[];
  technologyStack?: any;
  aiTechnologies?: string[] | string; // Can be array or JSON string
  referenceContent?: string;
  caseStudyCategories?: string[];
  selectedCaseStudies?: string[];
  status?: string;
  featured?: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HirePageTestimonial {
  id: string;
  hirePageId: string;
  clientName: string;
  content: string;
  developerRole: string;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudyPage {
  id: string;
  title: string;
  slug?: string;
  content?: string; // Combined content from various fields
  problemStatement?: string;
  solutionStrategy?: string;
  conclusion?: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudyCategory {
  id: string;
  name: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorSettings {
  general?: {
    header?: {
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    };
    footer?: {
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    };
    navbar?: {
      backgroundColor?: string;
      textColor?: string;
      activeColor?: string;
      hoverColor?: string;
    };
  };
  buttons?: {
    primary?: {
      backgroundColor?: string;
      textColor?: string;
      hoverColor?: string;
    };
    secondary?: {
      backgroundColor?: string;
      textColor?: string;
      hoverColor?: string;
    };
  };
  pages?: {
    [pageName: string]: {
      [componentName: string]: {
        [property: string]: string;
      };
    };
  };
}

export interface SiteSettings {
  id: string;
  siteName: string;
  theme: string;
  primaryColor?: string;
  logoUrl?: string;
  targetRegions?: string;
  industryFocus?: string;
  colorSettings?: ColorSettings;
  updatedAt: Date;
}

export const storage = {
  // ===================== Users =====================
  createUser: async (user: Partial<User>) => {
    await connectMongo();
    const hashedPassword = await bcrypt.hash(user.passwordHash || "", 10);
    const userId = crypto.randomUUID();
    const doc = await UserModel.create({
      _id: userId,
      email: user.email,
      passwordHash: hashedPassword,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as unknown as User;
  },

  getUserByEmail: async (email: string) => {
    await connectMongo();
    const doc = await UserModel.findOne({ email }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as User;
  },

  getUserById: async (id: string) => {
    await connectMongo();
    const doc = await UserModel.findById(id).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as User;
  },

  getAllUsers: async () => {
    await connectMongo();
    const docs = await UserModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as User[];
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    await connectMongo();
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean().exec();
    if (!doc) throw new Error("User not found");
    return { ...doc, id: (doc as any)._id.toString() } as unknown as User;
  },

  deleteUser: async (id: string) => {
    await connectMongo();
    await UserModel.deleteOne({ _id: id }).exec();
  },

  changePassword: async (id: string, currentPassword: string, newPassword: string) => {
    await connectMongo();
    const doc = await UserModel.findById(id).exec();
    if (!doc) return false;
    const isValid = await bcrypt.compare(currentPassword, doc.passwordHash);
    if (!isValid) return false;
    doc.passwordHash = await bcrypt.hash(newPassword, 10);
    await doc.save();
    return true;
  },

  // ===================== Blogs =====================
  searchBlogPosts: async (query: string) => {
    await connectMongo();
    const regex = new RegExp(query, "i");
    const docs = await BlogPostModel.find({
      $or: [
        { title: regex },
        { content: regex },
        { excerpt: regex },
        { tags: regex },
      ],
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as BlogPost[];
  },

  getScheduledPosts: async () => {
    await connectMongo();
    const docs = await BlogPostModel.find({ status: "scheduled" })
      .sort({ scheduledAt: 1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as BlogPost[];
  },

  getBlogPosts: async () => {
    await connectMongo();
    const docs = await BlogPostModel.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as BlogPost[];
  },

  getBlogStats: async () => {
    await connectMongo();
    const [total, published, draft, scheduled] = await Promise.all([
      BlogPostModel.countDocuments(),
      BlogPostModel.countDocuments({ status: "published" }),
      BlogPostModel.countDocuments({ status: "draft" }),
      BlogPostModel.countDocuments({ status: "scheduled" }),
    ]);
    const topTagsAgg = await BlogPostModel.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    return {
      total,
      published,
      draft,
      scheduled,
      topTags: topTagsAgg.map(t => ({ tag: t._id, count: t.count })),
    };
  },

  // ===================== Hire Pages =====================
  getAllHirePages: async () => {
    await connectMongo();
    const docs = await HirePageModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as HirePage[];
  },

  getPublishedHirePages: async () => {
    await connectMongo();
    const docs = await HirePageModel.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as HirePage[];
  },

  createHirePage: async (data: Partial<HirePage>) => {
    await connectMongo();
    const doc = await HirePageModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as unknown as HirePage;
  },

  getHirePageTestimonials: async (hirePageId: string | number) => {
    await connectMongo();
    // Handle both string (MongoDB ObjectId) and numeric (legacy) IDs
    let query: any;
    if (typeof hirePageId === 'number') {
      query = { hirePageId };
    } else {
      // For string IDs, we need to find the hire page first to get its legacyId
      const hirePage = await HirePageModel.findById(hirePageId).lean().exec();
      if (hirePage && (hirePage as any).legacyId) {
        query = { hirePageId: (hirePage as any).legacyId };
      } else {
        // If no legacyId, try direct match (in case hirePageId field stores ObjectId as string)
        query = { $or: [{ hirePageId }, { hirePageId: hirePageId.toString() }] };
      }
    }
    const docs = await HirePageTestimonialModel.find(query).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as HirePageTestimonial[];
  },

  getAllHirePageTestimonials: async () => {
    await connectMongo();
    const docs = await HirePageTestimonialModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as HirePageTestimonial[];
  },

  generateHirePageTestimonials: async (hirePageId: string, developerType: string, developerRole: string) => {
    await connectMongo();
    const dummyTestimonials = Array.from({ length: 3 }, (_, i) => ({
      hirePageId,
      clientName: `Client ${i + 1}`,
      content: `Amazing ${developerType} developer experience!`,
      developerRole,
      gender: "male",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const docs = await HirePageTestimonialModel.insertMany(dummyTestimonials);
    return docs.map((d: any) => ({ ...d.toObject(), id: d._id.toString() })) as unknown as HirePageTestimonial[];
  },

  regenerateAllHirePageTestimonials: async () => {
    await connectMongo();
    const hirePages = await HirePageModel.find({ developerType: { $exists: true, $ne: null } }).lean().exec();
    let regeneratedCount = 0;

    for (const page of hirePages) {
      try {
        const pageId = (page as any)._id.toString();
        const developerType = page.developerType || 'Developer';

        // Delete existing testimonials for this page
        await HirePageTestimonialModel.deleteMany({
          $or: [
            { hirePageId: pageId },
            { hirePageId: (page as any).legacyId }
          ]
        });

        // Regenerate testimonials (inline implementation to avoid circular reference)
        const dummyTestimonials = Array.from({ length: 3 }, (_, i) => ({
          hirePageId: pageId,
          clientName: `Client ${i + 1}`,
          content: `Amazing ${developerType} developer experience!`,
          developerRole: developerType,
          gender: "male",
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await HirePageTestimonialModel.insertMany(dummyTestimonials);
        regeneratedCount++;
      } catch (error) {
        console.error(`Error regenerating testimonials for hire page ${(page as any)._id}:`, error);
        // Continue with other pages even if one fails
      }
    }

    return { regeneratedCount, totalPages: hirePages.length };
  },

  updateHirePageTestimonialGender: async (testimonialId: string | number, gender: string) => {
    await connectMongo();
    const doc = await HirePageTestimonialModel.findByIdAndUpdate(
      testimonialId,
      { gender, updatedAt: new Date() },
      { new: true }
    ).lean().exec();
    if (!doc) throw new Error("Testimonial not found");
    return { ...doc, id: (doc as any)._id.toString() } as unknown as HirePageTestimonial;
  },

  getHirePage: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await HirePageModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await HirePageModel.findById(id).lean().exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as HirePage;
  },

  getHirePageBySlug: async (slug: string) => {
    await connectMongo();
    const doc = await HirePageModel.findOne({ slug }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as HirePage;
  },

  updateHirePage: async (id: string | number, updates: Partial<HirePage>) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await HirePageModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await HirePageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Hire page not found");
    return { ...doc, id: (doc as any)._id.toString() } as unknown as HirePage;
  },

  deleteHirePage: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await HirePageModel.deleteOne({ legacyId: id }).exec();
    } else {
      await HirePageModel.deleteOne({ _id: id }).exec();
    }
  },

  createHirePageTestimonial: async (data: any) => {
    await connectMongo();
    const doc = await HirePageTestimonialModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  deleteHirePageTestimonials: async (hirePageId: string | number) => {
    await connectMongo();
    await HirePageTestimonialModel.deleteMany({ hirePageId }).exec();
  },

  searchHirePages: async (query: string) => {
    await connectMongo();
    const regex = new RegExp(query, "i");
    const docs = await HirePageModel.find({
      $or: [
        { title: regex },
        { developerType: regex },
        { content: regex },
      ],
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as HirePage[];
  },

  // ===================== Service Pages =====================
  getAllServicePages: async () => {
    await connectMongo();
    const docs = await ServicePageModel.find()
      .populate('subcategoryId')
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getServicePagesBySubcategory: async (subcategoryId: string | number) => {
    await connectMongo();
    let query: any;
    if (typeof subcategoryId === 'number') {
      const subcategory = await ServiceSubcategoryModel.findOne({ legacyId: subcategoryId }).lean().exec();
      if (!subcategory) return [];
      query = { subcategoryId: (subcategory as any)._id };
    } else {
      query = { subcategoryId };
    }
    const docs = await ServicePageModel.find(query)
      .populate('subcategoryId')
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getServicePage: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServicePageModel.findOne({ legacyId: id })
        .populate('subcategoryId')
        .lean()
        .exec();
    } else {
      doc = await ServicePageModel.findById(id)
        .populate('subcategoryId')
        .lean()
        .exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  createServicePage: async (data: any) => {
    await connectMongo();
    // Handle subcategoryId - if it's a number, find the subcategory first
    if (data.subcategoryId && typeof data.subcategoryId === 'number') {
      const subcategory = await ServiceSubcategoryModel.findOne({ legacyId: data.subcategoryId }).lean().exec();
      if (subcategory) {
        data.subcategoryId = (subcategory as any)._id;
      }
    }
    const doc = await ServicePageModel.create(data);
    const populated = await ServicePageModel.findById((doc as any)._id).populate('subcategoryId').lean().exec();
    return { ...populated, id: (populated as any)?._id?.toString() || '' } as any;
  },

  updateServicePage: async (id: string | number, updates: any) => {
    await connectMongo();
    // Handle subcategoryId update - if it's a number, find the subcategory first
    if (updates.subcategoryId && typeof updates.subcategoryId === 'number') {
      const subcategory = await ServiceSubcategoryModel.findOne({ legacyId: updates.subcategoryId }).lean().exec();
      if (subcategory) {
        updates.subcategoryId = (subcategory as any)._id;
      }
    }
    let doc;
    if (typeof id === 'number') {
      doc = await ServicePageModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('subcategoryId').lean().exec();
    } else {
      doc = await ServicePageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('subcategoryId').lean().exec();
    }
    if (!doc) throw new Error("Service page not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteServicePage: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await ServicePageModel.deleteOne({ legacyId: id }).exec();
    } else {
      await ServicePageModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Blog Posts =====================
  createBlogPost: async (data: any) => {
    await connectMongo();
    const doc = await BlogPostModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as unknown as BlogPost;
  },

  getBlogPost: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await BlogPostModel.findOne({ legacyId: id })
        .populate('authorId')
        .lean()
        .exec();
    } else {
      doc = await BlogPostModel.findById(id)
        .populate('authorId')
        .lean()
        .exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as BlogPost;
  },

  getBlogPostBySlug: async (slug: string) => {
    await connectMongo();
    const doc = await BlogPostModel.findOne({ slug })
      .populate('authorId')
      .lean()
      .exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as BlogPost;
  },

  updateBlogPost: async (id: string | number, updates: Partial<BlogPost>) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await BlogPostModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('authorId').lean().exec();
    } else {
      doc = await BlogPostModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('authorId').lean().exec();
    }
    if (!doc) throw new Error("Blog post not found");
    return { ...doc, id: (doc as any)._id.toString() } as unknown as BlogPost;
  },

  deleteBlogPost: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await BlogPostModel.deleteOne({ legacyId: id }).exec();
    } else {
      await BlogPostModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Case Studies =====================
  getPublishedCaseStudyPages: async () => {
    await connectMongo();
    const docs = await CaseStudyPageModel.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as CaseStudyPage[];
  },

  getPublishedCaseStudyCategories: async () => {
    await connectMongo();
    const docs = await CaseStudyCategoryModel.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as CaseStudyCategory[];
  },

  getAllCaseStudyCategories: async () => {
    await connectMongo();
    const docs = await CaseStudyCategoryModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as CaseStudyCategory[];
  },

  getAllCaseStudyPages: async () => {
    await connectMongo();
    const docs = await CaseStudyPageModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as CaseStudyPage[];
  },

  getCaseStudyPage: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await CaseStudyPageModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await CaseStudyPageModel.findById(id).lean().exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as CaseStudyPage;
  },

  getCaseStudyPageBySlug: async (slug: string) => {
    await connectMongo();
    const doc = await CaseStudyPageModel.findOne({ slug }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as CaseStudyPage;
  },

  getCaseStudyPagesByCategory: async (categoryName: string) => {
    await connectMongo();
    const docs = await CaseStudyPageModel.find({ category: categoryName })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as CaseStudyPage[];
  },

  searchCaseStudyPages: async (query: string) => {
    await connectMongo();
    const regex = new RegExp(query, 'i');
    const docs = await CaseStudyPageModel.find({
      $or: [
        { title: regex },
        { slug: regex },
        { clientName: regex },
        { clientIndustry: regex },
        { metaTitle: regex },
        { metaDescription: regex },
      ],
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as unknown as CaseStudyPage[];
  },

  createCaseStudyPage: async (data: any) => {
    await connectMongo();
    const doc = await CaseStudyPageModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as unknown as CaseStudyPage;
  },

  updateCaseStudyPage: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await CaseStudyPageModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await CaseStudyPageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Case study page not found");
    return { ...doc, id: (doc as any)._id.toString() } as unknown as CaseStudyPage;
  },

  deleteCaseStudyPage: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await CaseStudyPageModel.deleteOne({ legacyId: id }).exec();
    } else {
      await CaseStudyPageModel.deleteOne({ _id: id }).exec();
    }
  },

  createCaseStudyCategory: async (data: any) => {
    await connectMongo();
    const doc = await CaseStudyCategoryModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as unknown as CaseStudyCategory;
  },

  updateCaseStudyCategory: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await CaseStudyCategoryModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await CaseStudyCategoryModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Case study category not found");
    return { ...doc, id: (doc as any)._id.toString() } as unknown as CaseStudyCategory;
  },

  deleteCaseStudyCategory: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await CaseStudyCategoryModel.deleteOne({ legacyId: id }).exec();
    } else {
      await CaseStudyCategoryModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Authors =====================
  getAllAuthors: async () => {
    await connectMongo();
    const docs = await AuthorModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getAuthor: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await AuthorModel.findOne({ legacyId: id }).lean().exec();
    } else {
      // Try as numeric string first
      if (!isNaN(Number(id))) {
        doc = await AuthorModel.findOne({ legacyId: Number(id) }).lean().exec();
      }
      if (!doc) {
        doc = await AuthorModel.findById(id).lean().exec();
      }
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  createAuthor: async (data: any) => {
    await connectMongo();
    const doc = await AuthorModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateAuthor: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await AuthorModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      // Try as numeric string first
      if (!isNaN(Number(id))) {
        doc = await AuthorModel.findOneAndUpdate(
          { legacyId: Number(id) },
          { ...updates, updatedAt: new Date() },
          { new: true }
        ).lean().exec();
      }
      if (!doc) {
        doc = await AuthorModel.findByIdAndUpdate(
          id,
          { ...updates, updatedAt: new Date() },
          { new: true }
        ).lean().exec();
      }
    }
    if (!doc) throw new Error("Author not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteAuthor: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await AuthorModel.deleteOne({ legacyId: id }).exec();
    } else {
      // Try as numeric string first
      if (!isNaN(Number(id))) {
        await AuthorModel.deleteOne({ legacyId: Number(id) }).exec();
      } else {
        await AuthorModel.deleteOne({ _id: id }).exec();
      }
    }
  },

  // ===================== Industry Pages =====================
  getAllIndustryPages: async () => {
    await connectMongo();
    const docs = await IndustryPageModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getIndustryPage: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await IndustryPageModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await IndustryPageModel.findById(id).lean().exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getIndustryPageBySlug: async (slug: string) => {
    await connectMongo();
    const doc = await IndustryPageModel.findOne({ slug }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getPublishedIndustryPages: async () => {
    await connectMongo();
    const docs = await IndustryPageModel.find({ published: true })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  searchIndustryPages: async (query: string) => {
    await connectMongo();
    const regex = new RegExp(query, 'i');
    const docs = await IndustryPageModel.find({
      $or: [
        { title: regex },
        { slug: regex },
        { metaTitle: regex },
        { metaDescription: regex },
      ],
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createIndustryPage: async (data: any) => {
    await connectMongo();
    const doc = await IndustryPageModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateIndustryPage: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await IndustryPageModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await IndustryPageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Industry page not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteIndustryPage: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await IndustryPageModel.deleteOne({ legacyId: id }).exec();
    } else {
      await IndustryPageModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Page Indexing Status =====================
  getPageIndexingStatus: async (url: string) => {
    await connectMongo();
    const doc = await PageIndexingStatusModel.findOne({ pageUrl: url })
      .sort({ lastUpdated: -1 })
      .lean()
      .exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getPageIndexingStatusByType: async (pageType: string) => {
    await connectMongo();
    const docs = await PageIndexingStatusModel.find({ pageType })
      .sort({ lastUpdated: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  // ===================== Service Categories =====================
  getAllServiceCategories: async () => {
    await connectMongo();
    const docs = await ServiceCategoryModel.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()
      .exec();

    // Enrich each category with subcategory count
    const enrichedCategories = await Promise.all(docs.map(async (category: any) => {
      const categoryId = (category as any).legacyId || (category as any)._id.toString();

      // Count subcategories for this category
      const subcategoryCount = await ServiceSubcategoryModel.countDocuments({
        $or: [
          { categoryId: (category as any)._id },
          { legacyCategoryId: (category as any).legacyId }
        ]
      }).exec();

      return {
        ...category,
        id: (category as any).legacyId || (category as any)._id.toString(), // Prefer legacyId for compatibility
        subcategoryCount,
      };
    }));

    return enrichedCategories as any[];
  },

  getServiceCategory: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceCategoryModel.findOne({ legacyId: id }).lean().exec();
    } else {
      // Try as ObjectId first, then as legacyId if it's a numeric string
      if (!isNaN(Number(id))) {
        doc = await ServiceCategoryModel.findOne({ legacyId: Number(id) }).lean().exec();
      }
      if (!doc) {
        doc = await ServiceCategoryModel.findById(id).lean().exec();
      }
    }
    if (!doc) return undefined;

    // Count subcategories
    const subcategoryCount = await ServiceSubcategoryModel.countDocuments({
      $or: [
        { categoryId: (doc as any)._id },
        { legacyCategoryId: (doc as any).legacyId }
      ]
    }).exec();

    return {
      ...doc,
      id: (doc as any).legacyId || (doc as any)._id.toString(),
      subcategoryCount
    } as any;
  },

  createServiceCategory: async (data: any) => {
    await connectMongo();
    const doc = await ServiceCategoryModel.create(data);
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateServiceCategory: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceCategoryModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await ServiceCategoryModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Service category not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteServiceCategory: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await ServiceCategoryModel.deleteOne({ legacyId: id }).exec();
    } else {
      await ServiceCategoryModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Service Subcategories =====================
  getAllServiceSubcategories: async () => {
    await connectMongo();
    const docs = await ServiceSubcategoryModel.find()
      .populate('categoryId')
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()
      .exec();

    // Enrich with proper IDs and category info
    const enriched = docs.map((subcat: any) => {
      const category = subcat.categoryId;
      return {
        ...subcat,
        id: (subcat as any).legacyId || (subcat as any)._id.toString(), // Prefer legacyId
        categoryId: category
          ? ((category as any).legacyId || (category as any)._id.toString())
          : ((subcat as any).legacyCategoryId || null),
        category: category ? {
          id: (category as any).legacyId || (category as any)._id.toString(),
          name: (category as any).name,
          slug: (category as any).slug,
        } : null,
      };
    });

    return enriched as any[];
  },

  getServiceSubcategoriesByCategory: async (categoryId: string | number) => {
    await connectMongo();
    let category: any = null;

    // Find the category first
    if (typeof categoryId === 'number') {
      category = await ServiceCategoryModel.findOne({ legacyId: categoryId }).lean().exec();
    } else {
      // Try as numeric string first (legacyId), then as ObjectId
      if (!isNaN(Number(categoryId))) {
        category = await ServiceCategoryModel.findOne({ legacyId: Number(categoryId) }).lean().exec();
      }
      if (!category) {
        category = await ServiceCategoryModel.findById(categoryId).lean().exec();
      }
    }

    if (!category) return [];

    // Find subcategories using both categoryId (ObjectId) and legacyCategoryId
    const docs = await ServiceSubcategoryModel.find({
      $or: [
        { categoryId: (category as any)._id },
        { legacyCategoryId: (category as any).legacyId }
      ]
    })
      .populate('categoryId')
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()
      .exec();

    // Enrich with proper IDs
    const enriched = docs.map((subcat: any) => {
      const cat = subcat.categoryId || category;
      return {
        ...subcat,
        id: (subcat as any).legacyId || (subcat as any)._id.toString(), // Prefer legacyId
        categoryId: cat
          ? ((cat as any).legacyId || (cat as any)._id.toString())
          : ((subcat as any).legacyCategoryId || null),
        category: cat ? {
          id: (cat as any).legacyId || (cat as any)._id.toString(),
          name: (cat as any).name,
          slug: (cat as any).slug,
        } : null,
      };
    });

    return enriched as any[];
  },

  getServiceSubcategory: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceSubcategoryModel.findOne({ legacyId: id })
        .populate('categoryId')
        .lean()
        .exec();
    } else {
      // Try as numeric string first
      if (!isNaN(Number(id))) {
        doc = await ServiceSubcategoryModel.findOne({ legacyId: Number(id) })
          .populate('categoryId')
          .lean()
          .exec();
      }
      if (!doc) {
        doc = await ServiceSubcategoryModel.findById(id)
          .populate('categoryId')
          .lean()
          .exec();
      }
    }
    if (!doc) return undefined;

    const category = (doc as any).categoryId;
    return {
      ...doc,
      id: (doc as any).legacyId || (doc as any)._id.toString(), // Prefer legacyId
      categoryId: category
        ? ((category as any).legacyId || (category as any)._id.toString())
        : ((doc as any).legacyCategoryId || null),
      category: category ? {
        id: (category as any).legacyId || (category as any)._id.toString(),
        name: (category as any).name,
        slug: (category as any).slug,
      } : null,
    } as any;
  },

  createServiceSubcategory: async (data: any) => {
    await connectMongo();
    // Handle categoryId - if it's a number, find the category first
    if (data.categoryId && typeof data.categoryId === 'number') {
      const legacyCategoryId = data.categoryId;
      const category = await ServiceCategoryModel.findOne({ legacyId: legacyCategoryId }).lean().exec();
      if (category) {
        data.categoryId = (category as any)._id;
        data.legacyCategoryId = legacyCategoryId;
      }
    }
    const doc = await ServiceSubcategoryModel.create(data);
    const populated = await ServiceSubcategoryModel.findById((doc as any)._id).populate('categoryId').lean().exec();
    return { ...populated, id: (populated as any)?._id?.toString() || '' } as any;
  },

  updateServiceSubcategory: async (id: string | number, updates: any) => {
    await connectMongo();
    // Handle categoryId update - if it's a number, find the category first
    if (updates.categoryId && typeof updates.categoryId === 'number') {
      const legacyCategoryId = updates.categoryId;
      const category = await ServiceCategoryModel.findOne({ legacyId: legacyCategoryId }).lean().exec();
      if (category) {
        updates.categoryId = (category as any)._id;
        updates.legacyCategoryId = legacyCategoryId;
      }
    }
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceSubcategoryModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('categoryId').lean().exec();
    } else {
      doc = await ServiceSubcategoryModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).populate('categoryId').lean().exec();
    }
    if (!doc) throw new Error("Service subcategory not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteServiceSubcategory: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await ServiceSubcategoryModel.deleteOne({ legacyId: id }).exec();
    } else {
      await ServiceSubcategoryModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Services =====================
  getAllServices: async () => {
    await connectMongo();
    const docs = await ServiceModel.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Enrich services with category/subcategory information
    const enrichedServices = await Promise.all(docs.map(async (service: any) => {
      const enriched = { ...service, id: (service as any)._id.toString() };

      // If service has a subCategory string, try to find the subcategory and its category
      if ((service as any).subCategory) {
        const subcategory = await ServiceSubcategoryModel.findOne({
          $or: [
            { name: (service as any).subCategory },
            { slug: ((service as any).subCategory as string)?.toLowerCase().replace(/\s+/g, '-') }
          ]
        }).populate('categoryId').lean().exec();

        if (subcategory) {
          enriched.subCategoryData = {
            id: (subcategory as any)._id.toString(),
            name: (subcategory as any).name,
            slug: (subcategory as any).slug,
            legacyId: (subcategory as any).legacyId,
            legacyCategoryId: (subcategory as any).legacyCategoryId,
            category: (subcategory as any).categoryId ? {
              id: ((subcategory as any).categoryId as any)?._id?.toString() || '',
              name: ((subcategory as any).categoryId as any)?.name || '',
              slug: ((subcategory as any).categoryId as any)?.slug || '',
              legacyId: ((subcategory as any).categoryId as any)?.legacyId,
            } : null
          };
        }
      }

      // If service has a category string, try to find the category
      if ((service as any).category) {
        const category = await ServiceCategoryModel.findOne({
          $or: [
            { name: (service as any).category },
            { slug: ((service as any).category as string)?.toLowerCase().replace(/\s+/g, '-') }
          ]
        }).lean().exec();

        if (category) {
          enriched.categoryData = {
            id: (category as any)._id.toString(),
            name: (category as any).name,
            slug: (category as any).slug,
            legacyId: (category as any).legacyId,
          };
        }
      }

      return enriched;
    }));

    return enrichedServices as any[];
  },

  searchServices: async (searchTerm: string) => {
    await connectMongo();
    const searchRegex = new RegExp(searchTerm, 'i');

    // Search in title, description, and other text fields
    const docs = await ServiceModel.find({
      status: 'active',
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex },
        { category: searchRegex },
        { subCategory: searchRegex }
      ]
    }).sort({ createdAt: -1 }).lean().exec();

    // Enrich services with category/subcategory data (same as getAllServices)
    const enrichedServices = await Promise.all(docs.map(async (service: any) => {
      const enriched = { ...service, id: (service as any)._id.toString() };

      if ((service as any).subCategory) {
        const subcategory = await ServiceSubcategoryModel.findOne({
          $or: [
            { name: (service as any).subCategory },
            { slug: ((service as any).subCategory as string)?.toLowerCase().replace(/\s+/g, '-') }
          ]
        }).populate('categoryId').lean().exec();

        if (subcategory) {
          enriched.subCategoryData = {
            id: (subcategory as any)._id.toString(),
            name: (subcategory as any).name,
            slug: (subcategory as any).slug,
            legacyId: (subcategory as any).legacyId,
            legacyCategoryId: (subcategory as any).legacyCategoryId,
            category: (subcategory as any).categoryId ? {
              id: ((subcategory as any).categoryId as any)?._id?.toString() || '',
              name: ((subcategory as any).categoryId as any)?.name || '',
              slug: ((subcategory as any).categoryId as any)?.slug || '',
              legacyId: ((subcategory as any).categoryId as any)?.legacyId,
            } : null
          };
        }
      }

      if ((service as any).category) {
        const category = await ServiceCategoryModel.findOne({
          $or: [
            { name: (service as any).category },
            { slug: ((service as any).category as string)?.toLowerCase().replace(/\s+/g, '-') }
          ]
        }).lean().exec();

        if (category) {
          enriched.categoryData = {
            id: (category as any)._id.toString(),
            name: (category as any).name,
            slug: (category as any).slug,
            legacyId: (category as any).legacyId,
          };
        }
      }

      return enriched;
    }));

    return enrichedServices as any[];
  },

  getService: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await ServiceModel.findById(id).lean().exec();
    }
    if (!doc) return undefined;

    // Enrich with category/subcategory data
    const enriched: any = { ...doc, id: (doc as any)._id.toString() };

    if ((doc as any).subCategory) {
      const subcategory = await ServiceSubcategoryModel.findOne({
        $or: [
          { name: (doc as any).subCategory },
          { slug: ((doc as any).subCategory as string)?.toLowerCase().replace(/\s+/g, '-') }
        ]
      }).populate('categoryId').lean().exec();

      if (subcategory) {
        enriched.subCategoryData = {
          id: (subcategory as any)._id.toString(),
          name: (subcategory as any).name,
          slug: (subcategory as any).slug,
          legacyId: (subcategory as any).legacyId,
          legacyCategoryId: (subcategory as any).legacyCategoryId,
          category: (subcategory as any).categoryId ? {
            id: ((subcategory as any).categoryId as any)?._id?.toString() || '',
            name: ((subcategory as any).categoryId as any)?.name || '',
            slug: ((subcategory as any).categoryId as any)?.slug || '',
            legacyId: ((subcategory as any).categoryId as any)?.legacyId,
          } : null
        };
      }
    }

    if ((doc as any).category) {
      const category = await ServiceCategoryModel.findOne({
        $or: [
          { name: (doc as any).category },
          { slug: ((doc as any).category as string)?.toLowerCase().replace(/\s+/g, '-') }
        ]
      }).lean().exec();

      if (category) {
        enriched.categoryData = {
          id: (category as any)._id.toString(),
          name: (category as any).name,
          slug: (category as any).slug,
          legacyId: (category as any).legacyId,
        };
      }
    }

    return enriched as any;
  },

  getServiceBySlug: async (slug: string) => {
    await connectMongo();
    const doc = await ServiceModel.findOne({ slug }).lean().exec();
    if (!doc) return undefined;

    // Enrich with category/subcategory data (same as getService)
    const enriched: any = { ...doc, id: (doc as any)._id.toString() };

    if ((doc as any).subCategory) {
      const subcategory = await ServiceSubcategoryModel.findOne({
        $or: [
          { name: (doc as any).subCategory },
          { slug: ((doc as any).subCategory as string)?.toLowerCase().replace(/\s+/g, '-') }
        ]
      }).populate('categoryId').lean().exec();

      if (subcategory) {
        enriched.subCategoryData = {
          id: (subcategory as any)._id.toString(),
          name: (subcategory as any).name,
          slug: (subcategory as any).slug,
          legacyId: (subcategory as any).legacyId,
          legacyCategoryId: (subcategory as any).legacyCategoryId,
          category: (subcategory as any).categoryId ? {
            id: ((subcategory as any).categoryId as any)?._id?.toString() || '',
            name: ((subcategory as any).categoryId as any)?.name || '',
            slug: ((subcategory as any).categoryId as any)?.slug || '',
            legacyId: ((subcategory as any).categoryId as any)?.legacyId,
          } : null
        };
      }
    }

    if ((doc as any).category) {
      const category = await ServiceCategoryModel.findOne({
        $or: [
          { name: (doc as any).category },
          { slug: ((doc as any).category as string)?.toLowerCase().replace(/\s+/g, '-') }
        ]
      }).lean().exec();

      if (category) {
        enriched.categoryData = {
          id: (category as any)._id.toString(),
          name: (category as any).name,
          slug: (category as any).slug,
          legacyId: (category as any).legacyId,
        };
      }
    }

    return enriched as any;
  },

  getServicesByCategory: async (categoryName: string) => {
    await connectMongo();

    // First, find the category by name or slug
    const category = await ServiceCategoryModel.findOne({
      $or: [
        { name: categoryName },
        { slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
        { legacyId: isNaN(Number(categoryName)) ? null : Number(categoryName) }
      ]
    }).lean().exec();

    if (!category) return [];

    // Find all subcategories with this category's legacyId
    const subcategories = await ServiceSubcategoryModel.find({
      $or: [
        { categoryId: (category as any)._id },
        { legacyCategoryId: (category as any).legacyId }
      ]
    }).lean().exec();

    const subcategoryNames = subcategories.map(s => s.name);
    const subcategorySlugs = subcategories.map(s => s.slug);

    // Find services that match the category or any of its subcategories
    const docs = await ServiceModel.find({
      status: 'active',
      $or: [
        { category: (category as any).name },
        { category: (category as any).slug },
        { subCategory: { $in: subcategoryNames } },
        { subCategory: { $in: subcategorySlugs } }
      ]
    }).sort({ createdAt: -1 }).lean().exec();

    // Enrich services with category/subcategory data
    const enrichedServices = await Promise.all(docs.map(async (service: any) => {
      const enriched = { ...service, id: (service as any)._id.toString() };

      if ((service as any).subCategory) {
        const subcategory = await ServiceSubcategoryModel.findOne({
          $or: [
            { name: (service as any).subCategory },
            { slug: ((service as any).subCategory as string)?.toLowerCase().replace(/\s+/g, '-') }
          ]
        }).populate('categoryId').lean().exec();

        if (subcategory) {
          enriched.subCategoryData = {
            id: (subcategory as any)._id.toString(),
            name: (subcategory as any).name,
            slug: (subcategory as any).slug,
            legacyId: (subcategory as any).legacyId,
            legacyCategoryId: (subcategory as any).legacyCategoryId,
            category: (subcategory as any).categoryId ? {
              id: ((subcategory as any).categoryId as any)?._id?.toString() || '',
              name: ((subcategory as any).categoryId as any)?.name || '',
              slug: ((subcategory as any).categoryId as any)?.slug || '',
              legacyId: ((subcategory as any).categoryId as any)?.legacyId,
            } : null
          };
        }
      }

      enriched.categoryData = {
        id: (category as any)._id.toString(),
        name: (category as any).name,
        slug: (category as any).slug,
        legacyId: (category as any).legacyId,
      };

      return enriched;
    }));

    return enrichedServices as any[];
  },

  createService: async (data: any) => {
    await connectMongo();
    const doc = await ServiceModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateService: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await ServiceModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Service not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteService: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await ServiceModel.deleteOne({ legacyId: id }).exec();
    } else {
      await ServiceModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Service Testimonials =====================
  getServiceTestimonials: async (serviceId: string | number) => {
    await connectMongo();
    let query: any;
    if (typeof serviceId === 'number') {
      query = { serviceId };
    } else {
      // For string IDs, find the service first to get its legacyId
      const service = await ServiceModel.findById(serviceId).lean().exec();
      if (service && (service as any).legacyId) {
        query = { serviceId: (service as any).legacyId };
      } else {
        query = { $or: [{ serviceId }, { serviceId: serviceId.toString() }] };
      }
    }
    const docs = await ServiceTestimonialModel.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createServiceTestimonial: async (data: any) => {
    await connectMongo();
    const doc = await ServiceTestimonialModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  deleteServiceTestimonials: async (serviceId: string | number) => {
    await connectMongo();
    let query: any;
    if (typeof serviceId === 'number') {
      query = { serviceId };
    } else {
      const service = await ServiceModel.findById(serviceId).lean().exec();
      if (service && (service as any).legacyId) {
        query = { serviceId: (service as any).legacyId };
      } else {
        query = { $or: [{ serviceId }, { serviceId: serviceId.toString() }] };
      }
    }
    await ServiceTestimonialModel.deleteMany(query).exec();
  },

  generateServiceTestimonials: async (serviceId: string | number, category: string, subCategory: string) => {
    await connectMongo();
    // Convert serviceId to number if it's a string (for legacy compatibility)
    const numericServiceId = typeof serviceId === 'string'
      ? parseInt(serviceId.replace(/[^0-9]/g, '')) || 0
      : serviceId;

    const dummyTestimonials = Array.from({ length: 3 }, (_, i) => ({
      serviceId: numericServiceId,
      clientName: `Client ${i + 1}`,
      clientCompany: `Company ${i + 1}`,
      clientPosition: `CEO`,
      testimonialText: `Excellent ${category} ${subCategory} service experience!`,
      rating: 5,
      gender: 'male',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const docs = await ServiceTestimonialModel.insertMany(dummyTestimonials);
    return docs.map((d: any) => ({ ...d.toObject(), id: d._id.toString() })) as any[];
  },

  // ===================== Service Detail Pages =====================
  getServiceDetailPagesByService: async (serviceId: string | number) => {
    await connectMongo();
    // Service detail pages might be linked by service title or slug
    // This depends on how they're stored - checking if there's a serviceId field
    // For now, we'll need to check the model structure
    const service = await ServiceModel.findOne(
      typeof serviceId === 'number' ? { legacyId: serviceId } : { _id: serviceId }
    ).lean().exec();

    if (!service) return [];

    // Find detail pages that match the service title or slug
    const docs = await ServiceDetailPageModel.find({
      $or: [
        { title: (service as any).title },
        { slug: (service as any).slug }
      ]
    }).sort({ createdAt: -1 }).lean().exec();

    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createServiceDetailPage: async (data: any) => {
    await connectMongo();
    const doc = await ServiceDetailPageModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateServiceDetailPage: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await ServiceDetailPageModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await ServiceDetailPageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Service detail page not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteServiceDetailPage: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await ServiceDetailPageModel.deleteOne({ legacyId: id }).exec();
    } else {
      await ServiceDetailPageModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Blog Posts - Scheduled Publishing =====================
  publishScheduledPosts: async () => {
    await connectMongo();
    const now = new Date();
    const scheduledPosts = await BlogPostModel.find({
      status: 'scheduled',
      scheduledAt: { $lte: now }
    }).lean().exec();

    if (scheduledPosts.length === 0) {
      return;
    }

    const updatePromises = scheduledPosts.map(post =>
      BlogPostModel.findByIdAndUpdate(
        post._id,
        {
          status: 'published',
          publishedAt: post.scheduledAt || now,
          updatedAt: now
        },
        { new: true }
      ).exec()
    );

    await Promise.all(updatePromises);
    console.log(`Published ${scheduledPosts.length} scheduled blog post(s)`);
  },

  // ===================== Hire Page Testimonials - Gender Assignment =====================
  fixGenderAssignments: async () => {
    await connectMongo();

    // Gender detection utility
    const getGenderFromName = (fullName: string): string => {
      const femaleNames = [
        'Emily', 'Sarah', 'Jennifer', 'Sophia', 'Michelle', 'Lisa', 'Jessica',
        'Amanda', 'Nicole', 'Stephanie', 'Ava', 'Sandra', 'Rachel', 'Ashley',
        'Megan', 'Samantha', 'Hannah', 'Victoria', 'Elizabeth', 'Rebecca',
        'Lauren', 'Katherine', 'Anna', 'Maria', 'Grace', 'Natalie', 'Emma',
        'Olivia', 'Isabella', 'Chloe', 'Madison', 'Abigail', 'Taylor', 'Brianna',
        'Morgan', 'Jordan', 'Alex', 'Casey', 'Riley', 'Cameron', 'Quinn',
        'Laura', 'Amy', 'Angela', 'Christine', 'Diane', 'Helen', 'Janet',
        'Patricia', 'Catherine', 'Samantha', 'Diana', 'Melissa', 'Kimberly',
        'Priya', 'Priyanka', 'Sneha', 'Pooja', 'Anita', 'Sunita', 'Rita',
        'Kavita', 'Sita', 'Geeta', 'Meera', 'Neha', 'Riya', 'Sonia',
        'Asha', 'Rekha', 'Shweta', 'Shruti', 'Preeti', 'Swati', 'Nisha',
        'Deepika', 'Kiran', 'Vani', 'Lata', 'Uma', 'Chitra', 'Sarika',
        'Renu', 'Shanti', 'Gayatri', 'Lalita', 'Seema', 'Alka', 'Sushma',
        'Madhavi', 'Rajani', 'Smita', 'Vinita', 'Namita', 'Vandana', 'Mira',
        'Fatima', 'Aisha', 'Nadia', 'Yasmin', 'Salma', 'Amina', 'Zara',
        'Alicia', 'Elena', 'Lucia', 'Carmen', 'Rosa', 'Isabel', 'Teresa',
        'Ling', 'Wei', 'Li', 'Mei', 'Xin', 'Lei', 'Yan', 'Min', 'Jun',
        'Yuki', 'Akiko', 'Mariko', 'Keiko', 'Sachiko', 'Naoko', 'Hiroko'
      ];

      const firstName = fullName.split(' ')[0]?.trim();
      if (!firstName) return 'male'; // Default to male if no name

      const normalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      return femaleNames.includes(normalizedName) ? 'female' : 'male';
    };

    try {
      const allTestimonials = await HirePageTestimonialModel.find().lean().exec();
      let fixCount = 0;

      for (const testimonial of allTestimonials) {
        const correctGender = getGenderFromName(testimonial.clientName || '');
        if (testimonial.gender !== correctGender) {
          await HirePageTestimonialModel.findByIdAndUpdate(
            testimonial._id,
            { gender: correctGender, updatedAt: new Date() },
            { new: true }
          ).exec();
          fixCount++;
        }
      }

      if (fixCount > 0) {
        console.log(`Fixed ${fixCount} gender assignment(s) for hire page testimonials`);
      }
    } catch (error) {
      console.error('Error fixing gender assignments:', error);
      throw error;
    }
  },

  // ===================== AI Service Pages =====================
  getAllAiServicePages: async () => {
    await connectMongo();
    const docs = await AiServicePageModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getAiServicePage: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await AiServicePageModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await AiServicePageModel.findById(id).lean().exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as any;
  },

  getAiServicePageBySlug: async (slug: string) => {
    await connectMongo();
    const doc = await AiServicePageModel.findOne({ slug }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as unknown as any;
  },

  searchAiServicePages: async (query: string) => {
    await connectMongo();
    const regex = new RegExp(query, "i");
    const docs = await AiServicePageModel.find({
      $or: [
        { title: regex },
        { content: regex },
      ],
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getPublishedAiServicePages: async () => {
    await connectMongo();
    const docs = await AiServicePageModel.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createAiServicePage: async (data: any) => {
    await connectMongo();
    const doc = await AiServicePageModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateAiServicePage: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await AiServicePageModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await AiServicePageModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("AI service page not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteAiServicePage: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await AiServicePageModel.deleteOne({ legacyId: id }).exec();
    } else {
      await AiServicePageModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Contact Submissions =====================
  createContactSubmission: async (data: any) => {
    await connectMongo();
    const doc = await ContactSubmissionModel.create({
      ...data,
      createdAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  getContactSubmissions: async () => {
    await connectMongo();
    const docs = await ContactSubmissionModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  // ===================== SEO Methods =====================
  getAllSeoSettings: async () => {
    await connectMongo();
    const docs = await SeoSettingModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getSeoSettingByKey: async (key: string) => {
    await connectMongo();
    const doc = await SeoSettingModel.findOne({ settingKey: key }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  createSeoSetting: async (data: any) => {
    await connectMongo();
    const doc = await SeoSettingModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateSeoSetting: async (id: number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await SeoSettingModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await SeoSettingModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("SEO setting not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteSeoSetting: async (id: number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await SeoSettingModel.deleteOne({ legacyId: id }).exec();
    } else {
      await SeoSettingModel.deleteOne({ _id: id }).exec();
    }
  },

  getAllSeoKeywords: async () => {
    await connectMongo();
    const docs = await SeoKeywordModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getSeoKeywordsByCategory: async (category: string) => {
    await connectMongo();
    const docs = await SeoKeywordModel.find({ category }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createSeoKeyword: async (data: any) => {
    await connectMongo();
    const doc = await SeoKeywordModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateSeoKeyword: async (id: number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await SeoKeywordModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await SeoKeywordModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("SEO keyword not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  updateKeywordRankings: async (id: number, rankings: any) => {
    await connectMongo();
    const updates: any = { updatedAt: new Date() };
    if (rankings.currentRanking !== undefined) updates.currentRanking = rankings.currentRanking;
    if (rankings.targetRanking !== undefined) updates.targetRanking = rankings.targetRanking;
    if (rankings.lastChecked !== undefined) updates.lastChecked = rankings.lastChecked;

    let doc;
    if (typeof id === 'number') {
      doc = await SeoKeywordModel.findOneAndUpdate(
        { legacyId: id },
        updates,
        { new: true }
      ).lean().exec();
    } else {
      doc = await SeoKeywordModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("SEO keyword not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteSeoKeyword: async (id: number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await SeoKeywordModel.deleteOne({ legacyId: id }).exec();
    } else {
      await SeoKeywordModel.deleteOne({ _id: id }).exec();
    }
  },

  getSeoAnalyticsByPage: async (page: string) => {
    await connectMongo();
    const docs = await SeoAnalyticsModel.find({ pageUrl: page })
      .sort({ dateRecorded: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getSeoAnalyticsByPageType: async (pageType: string) => {
    await connectMongo();
    const docs = await SeoAnalyticsModel.find({ pageType })
      .sort({ dateRecorded: -1 })
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getLatestSeoAnalytics: async (limit: number) => {
    await connectMongo();
    const docs = await SeoAnalyticsModel.find()
      .sort({ dateRecorded: -1 })
      .limit(limit || 10)
      .lean()
      .exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createSeoAnalytics: async (data: any) => {
    await connectMongo();
    const doc = await SeoAnalyticsModel.create({
      ...data,
      createdAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateSeoAnalytics: async (id: number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await SeoAnalyticsModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await SeoAnalyticsModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("SEO analytics not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getAllPagesForSeo: async () => {
    await connectMongo();
    // Aggregate pages from different sources
    const [blogPosts, services, hirePages, caseStudies, industryPages] = await Promise.all([
      BlogPostModel.find().lean().exec().catch(() => []),
      ServiceModel.find().lean().exec().catch(() => []),
      HirePageModel.find().lean().exec().catch(() => []),
      CaseStudyPageModel.find().lean().exec().catch(() => []),
      IndustryPageModel.find().lean().exec().catch(() => []),
    ]);

    return [
      ...blogPosts.map((p: any) => ({ pageType: 'blog', referenceId: p._id?.toString() || p.legacyId || p.id, title: p.title })),
      ...services.map((s: any) => ({ pageType: 'service', referenceId: s._id?.toString() || s.legacyId || s.id, title: s.name || s.title })),
      ...hirePages.map((h: any) => ({ pageType: 'hire', referenceId: h._id?.toString() || h.legacyId || h.id, title: h.title })),
      ...caseStudies.map((c: any) => ({ pageType: 'case-study', referenceId: c._id?.toString() || c.legacyId || c.id, title: c.title })),
      ...industryPages.map((i: any) => ({ pageType: 'industry', referenceId: i._id?.toString() || i.legacyId || i.id, title: i.title })),
    ] as any[];
  },

  getSeoPageData: async (pageType: string, referenceId: number) => {
    await connectMongo();
    const doc = await SeoPageDataModel.findOne({ pageType, referenceId }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  createSeoPageData: async (data: any) => {
    await connectMongo();
    const doc = await SeoPageDataModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateSeoPageData: async (id: number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await SeoPageDataModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await SeoPageDataModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("SEO page data not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteSeoPageData: async (id: number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await SeoPageDataModel.deleteOne({ legacyId: id }).exec();
    } else {
      await SeoPageDataModel.deleteOne({ _id: id }).exec();
    }
  },

  getSeoOverview: async () => {
    await connectMongo();
    // Aggregate SEO statistics from various sources
    const [blogPosts, services, hirePages, caseStudies, industryPages, seoPageData, seoKeywords, seoAnalytics] = await Promise.all([
      BlogPostModel.find().lean().exec().catch(() => []),
      ServiceModel.find().lean().exec().catch(() => []),
      HirePageModel.find().lean().exec().catch(() => []),
      CaseStudyPageModel.find().lean().exec().catch(() => []),
      IndustryPageModel.find().lean().exec().catch(() => []),
      SeoPageDataModel.find().lean().exec().catch(() => []),
      SeoKeywordModel.find().lean().exec().catch(() => []),
      SeoAnalyticsModel.find().lean().exec().catch(() => []),
    ]);

    const totalPages = blogPosts.length + services.length + hirePages.length + caseStudies.length + industryPages.length;
    const pagesWithSeo = seoPageData.length;
    const totalKeywords = seoKeywords.length;

    // Calculate average SEO score
    const seoScores = seoPageData.map((p: any) => p.seoScore || 0).filter((s: number) => s > 0);
    const averageSeoScore = seoScores.length > 0
      ? seoScores.reduce((a: number, b: number) => a + b, 0) / seoScores.length
      : 0;

    // Count indexed pages (pages with indexing status)
    const indexedPages = await PageIndexingStatusModel.countDocuments({ indexed: true }).exec().catch(() => 0);

    return {
      totalPages,
      blogPosts: blogPosts.length,
      services: services.length,
      hirePages: hirePages.length,
      caseStudies: caseStudies.length,
      industryPages: industryPages.length,
      pagesWithSeo,
      averageSeoScore: Math.round(averageSeoScore * 100) / 100,
      totalKeywords,
      indexedPages,
      totalAnalytics: seoAnalytics.length,
    } as any;
  },

  getSitemapData: async () => {
    await connectMongo();
    // Return sitemap data structure
    const [blogPosts, services, hirePages, caseStudies, industryPages] = await Promise.all([
      BlogPostModel.find().lean().exec().catch(() => []),
      ServiceModel.find().lean().exec().catch(() => []),
      HirePageModel.find().lean().exec().catch(() => []),
      CaseStudyPageModel.find().lean().exec().catch(() => []),
      IndustryPageModel.find().lean().exec().catch(() => []),
    ]);

    return {
      blogPosts: blogPosts.map((p: any) => ({ url: `/blog/${p.slug || p._id}`, lastmod: p.updatedAt || p.createdAt })),
      services: services.map((s: any) => ({ url: `/services/${s.slug || s._id}`, lastmod: s.updatedAt || s.createdAt })),
      hirePages: hirePages.map((h: any) => ({ url: `/hire/${h.slug || h._id}`, lastmod: h.updatedAt || h.createdAt })),
      caseStudies: caseStudies.map((c: any) => ({ url: `/case-studies/${c.slug || c._id}`, lastmod: c.updatedAt || c.createdAt })),
      industryPages: industryPages.map((i: any) => ({ url: `/industries/${i.slug || i._id}`, lastmod: i.updatedAt || i.createdAt })),
    } as any;
  },

  // ===================== Central Links =====================
  getAllCentralLinks: async () => {
    await connectMongo();
    const docs = await CentralLinkRegistryModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  searchCentralLinks: async (query: string) => {
    await connectMongo();
    const regex = new RegExp(query, 'i');
    const docs = await CentralLinkRegistryModel.find({
      $or: [
        { linkId: regex },
        { targetUrl: regex },
        { displayText: regex },
        { title: regex },
        { description: regex },
      ],
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getCentralLinksByCategory: async (category: string) => {
    await connectMongo();
    const docs = await CentralLinkRegistryModel.find({ category }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getCentralLink: async (linkId: string) => {
    await connectMongo();
    const doc = await CentralLinkRegistryModel.findOne({ linkId }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getCentralLinksByTargetUrl: async (targetUrl: string) => {
    await connectMongo();
    const docs = await CentralLinkRegistryModel.find({ targetUrl }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createCentralLink: async (data: any) => {
    await connectMongo();
    const doc = await CentralLinkRegistryModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateCentralLink: async (linkId: string, updates: any) => {
    await connectMongo();
    const doc = await CentralLinkRegistryModel.findOneAndUpdate(
      { linkId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean().exec();
    if (!doc) throw new Error("Central link not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteCentralLink: async (linkId: string) => {
    await connectMongo();
    await CentralLinkRegistryModel.deleteOne({ linkId }).exec();
  },

  // ===================== Link Usages =====================
  getAllLinkUsages: async () => {
    await connectMongo();
    const docs = await LinkUsageMappingModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getLinkUsagesByLink: async (linkId: string) => {
    await connectMongo();
    const docs = await LinkUsageMappingModel.find({ linkId }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getLinkUsagesByContent: async (contentType: string, contentId: string | number) => {
    await connectMongo();
    // Convert MongoDB ObjectId string to numeric hash for querying if needed
    let queryContentId: string | number = contentId;
    if (typeof contentId === 'string' && /^[0-9a-fA-F]{24}$/.test(contentId)) {
      // For MongoDB ObjectId strings, convert to numeric hash for legacy compatibility
      queryContentId = parseInt(contentId.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0;
    }
    // Query with both the converted ID and the original to handle both cases
    const docs = await LinkUsageMappingModel.find({
      contentType,
      $or: [
        { contentId: queryContentId },
        { contentId: contentId } // Also try original in case it's stored as string
      ]
    }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createLinkUsage: async (data: any) => {
    await connectMongo();
    // Convert MongoDB ObjectId string to numeric hash for storage if needed
    let storageContentId: string | number = data.contentId;
    if (typeof data.contentId === 'string' && /^[0-9a-fA-F]{24}$/.test(data.contentId)) {
      // For MongoDB ObjectId strings, convert to numeric hash for legacy compatibility
      storageContentId = parseInt(data.contentId.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0;
    }
    const doc = await LinkUsageMappingModel.create({
      ...data,
      contentId: storageContentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateLinkUsage: async (id: string | number, updates: any) => {
    await connectMongo();
    // Convert MongoDB ObjectId string to numeric hash if needed
    if (updates.contentId && typeof updates.contentId === 'string' && /^[0-9a-fA-F]{24}$/.test(updates.contentId)) {
      updates.contentId = parseInt(updates.contentId.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0;
    }
    let doc;
    if (typeof id === 'number') {
      doc = await LinkUsageMappingModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await LinkUsageMappingModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Link usage not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  // ===================== Link Redirects =====================
  getAllLinkRedirects: async () => {
    await connectMongo();
    const docs = await LinkRedirectModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getActiveLinkRedirects: async () => {
    await connectMongo();
    const docs = await LinkRedirectModel.find({ isActive: true }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createLinkRedirect: async (data: any) => {
    await connectMongo();
    const doc = await LinkRedirectModel.create({
      ...data,
      createdAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateLinkRedirect: async (id: number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await LinkRedirectModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates },
        { new: true }
      ).lean().exec();
    } else {
      doc = await LinkRedirectModel.findByIdAndUpdate(
        id,
        { ...updates },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Link redirect not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteLinkRedirect: async (id: number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await LinkRedirectModel.deleteOne({ legacyId: id }).exec();
    } else {
      await LinkRedirectModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Link Validation =====================
  validateAllLinks: async () => {
    await connectMongo();
    // Placeholder - implement actual validation logic
    return [] as any[];
  },

  validateLink: async (linkId: string) => {
    await connectMongo();
    // Placeholder - implement actual validation logic
    return { linkId, status: 'valid' } as any;
  },

  getBrokenLinks: async () => {
    await connectMongo();
    const docs = await CentralLinkRegistryModel.find({ validationStatus: 'broken' }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getLinkValidationHistory: async (linkId: string) => {
    await connectMongo();
    const docs = await LinkValidationModel.find({ linkId }).sort({ validationDate: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  // ===================== Link Sync =====================
  syncAllLinksInCMS: async () => {
    await connectMongo();
    // Placeholder - implement actual sync logic
    return { synced: 0 } as any;
  },

  syncLinksInContent: async (contentType: string, contentId: number) => {
    await connectMongo();
    // Placeholder - implement actual sync logic
    return { synced: 0 } as any;
  },

  findAndReplaceLinkInContent: async (oldTargetUrl: string, newTargetUrl: string, contentType?: string, contentId?: number) => {
    await connectMongo();
    // Find all link usages with the old target URL
    const centralLink = await CentralLinkRegistryModel.findOne({ targetUrl: oldTargetUrl }).lean().exec();
    if (!centralLink) {
      return 0;
    }

    let replaced = 0;

    // Update the central link registry
    await CentralLinkRegistryModel.updateOne(
      { _id: (centralLink as any)._id },
      { targetUrl: newTargetUrl, updatedAt: new Date() }
    ).exec();

    // Find all usages of this link
    const query: any = { linkId: (centralLink as any).linkId };
    if (contentType) query.contentType = contentType;
    if (contentId !== undefined) query.contentId = contentId;

    const usages = await LinkUsageMappingModel.find(query).lean().exec();

    // Update content in each usage (this is a simplified version - actual implementation would need to update the content fields)
    replaced = usages.length;

    return replaced;
  },

  // ===================== Link Analytics =====================
  getLinkAnalytics: async (linkId: string) => {
    await connectMongo();
    const link = await CentralLinkRegistryModel.findOne({ linkId }).lean().exec();
    const usages = await LinkUsageMappingModel.find({ linkId }).lean().exec();
    return {
      linkId,
      clickCount: (link as any)?.clickCount || 0,
      usageCount: usages.length,
      lastAccessed: (link as any)?.lastAccessed,
    } as any;
  },

  getLinkUsageReport: async () => {
    await connectMongo();
    const links = await CentralLinkRegistryModel.find().lean().exec();
    const usages = await LinkUsageMappingModel.find().lean().exec();
    return {
      totalLinks: links.length,
      totalUsages: usages.length,
      links: links.map((l: any) => ({
        linkId: l.linkId,
        targetUrl: l.targetUrl,
        usageCount: usages.filter((u: any) => u.linkId === l.linkId).length,
      })),
    } as any;
  },

  discoverLinksInExistingContent: async () => {
    await connectMongo();
    // Placeholder - implement actual discovery logic
    return { discovered: 0 } as any;
  },

  resolveLinkRedirect: async (linkId: string) => {
    await connectMongo();
    const redirect = await LinkRedirectModel.findOne({ oldLinkId: linkId, isActive: true }).lean().exec();
    if (redirect) {
      return (redirect as any).newLinkId;
    }
    return linkId;
  },

  // ===================== Robots.txt =====================
  getActiveRobotsTxtSettings: async () => {
    await connectMongo();
    const doc = await RobotsTxtSettingModel.findOne({ isActive: true }).sort({ lastUpdated: -1 }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getRobotsTxtSettings: async () => {
    await connectMongo();
    const doc = await RobotsTxtSettingModel.findOne({ isActive: true }).sort({ lastUpdated: -1 }).lean().exec();
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getAllRobotsTxtVersions: async () => {
    await connectMongo();
    const docs = await RobotsTxtSettingModel.find().sort({ lastUpdated: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createRobotsTxtSettings: async (data: any) => {
    await connectMongo();
    const doc = await RobotsTxtSettingModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  activateRobotsTxtVersion: async (id: number) => {
    await connectMongo();
    // Deactivate all other versions
    await RobotsTxtSettingModel.updateMany({}, { isActive: false }).exec();

    // Activate the specified version
    let doc;
    if (typeof id === 'number') {
      doc = await RobotsTxtSettingModel.findOneAndUpdate(
        { legacyId: id },
        { isActive: true, lastUpdated: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await RobotsTxtSettingModel.findByIdAndUpdate(
        id,
        { isActive: true, lastUpdated: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Robots.txt setting not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteRobotsTxtVersion: async (id: number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await RobotsTxtSettingModel.deleteOne({ legacyId: id }).exec();
    } else {
      await RobotsTxtSettingModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Page Indexing Status =====================
  getAllPageIndexingStatuses: async () => {
    await connectMongo();
    const docs = await PageIndexingStatusModel.find().sort({ lastUpdated: -1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createPageIndexingStatus: async (data: any) => {
    await connectMongo();
    const doc = await PageIndexingStatusModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updatePageIndexingStatus: async (id: number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await PageIndexingStatusModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, lastUpdated: new Date(), updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await PageIndexingStatusModel.findByIdAndUpdate(
        id,
        { ...updates, lastUpdated: new Date(), updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Page indexing status not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  togglePageIndexingStatus: async (id: number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await PageIndexingStatusModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await PageIndexingStatusModel.findById(id).lean().exec();
    }
    if (!doc) throw new Error("Page indexing status not found");

    const newIsIndexable = !(doc as any).isIndexable;
    const updates = {
      isIndexable: newIsIndexable,
      metaRobotsTag: newIsIndexable ? 'index, follow' : 'noindex, nofollow',
      lastUpdated: new Date(),
      updatedAt: new Date(),
    };

    if (typeof id === 'number') {
      doc = await PageIndexingStatusModel.findOneAndUpdate(
        { legacyId: id },
        updates,
        { new: true }
      ).lean().exec();
    } else {
      doc = await PageIndexingStatusModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).lean().exec();
    }
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deletePageIndexingStatus: async (id: number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await PageIndexingStatusModel.deleteOne({ legacyId: id }).exec();
    } else {
      await PageIndexingStatusModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Technologies =====================
  getAllTechnologies: async () => {
    await connectMongo();
    const docs = await TechnologyModel.find().sort({ displayOrder: 1, name: 1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  getTechnology: async (id: string | number) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await TechnologyModel.findOne({ legacyId: id }).lean().exec();
    } else {
      doc = await TechnologyModel.findById(id).lean().exec();
    }
    if (!doc) return undefined;
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  getTechnologiesByCategory: async (category: string) => {
    await connectMongo();
    const docs = await TechnologyModel.find({ category }).sort({ displayOrder: 1, name: 1 }).lean().exec();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() })) as any[];
  },

  createTechnology: async (data: any) => {
    await connectMongo();
    const doc = await TechnologyModel.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...doc.toObject(), id: (doc as any)._id.toString() } as any;
  },

  updateTechnology: async (id: string | number, updates: any) => {
    await connectMongo();
    let doc;
    if (typeof id === 'number') {
      doc = await TechnologyModel.findOneAndUpdate(
        { legacyId: id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    } else {
      doc = await TechnologyModel.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean().exec();
    }
    if (!doc) throw new Error("Technology not found");
    return { ...doc, id: (doc as any)._id.toString() } as any;
  },

  deleteTechnology: async (id: string | number) => {
    await connectMongo();
    if (typeof id === 'number') {
      await TechnologyModel.deleteOne({ legacyId: id }).exec();
    } else {
      await TechnologyModel.deleteOne({ _id: id }).exec();
    }
  },

  // ===================== Site Settings =====================
  getSiteSettings: async () => {
    await connectMongo();
    // Use findOne to get the single configuration document. 
    // If it doesn't exist, create default.
    let doc = await SiteSettingModel.findOne().lean().exec();
    if (!doc) {
      doc = await SiteSettingModel.create({
        siteName: "GreenAppleX",
        theme: "light",
      });
      doc = doc.toObject();
    }
    return { ...doc, id: (doc as any)._id.toString() } as unknown as SiteSettings;
  },

  updateSiteSettings: async (updates: Partial<SiteSettings>) => {
    await connectMongo();
    // Maintain a single document approach
    let doc = await SiteSettingModel.findOneAndUpdate(
      {}, // matches any document (we assume only one exists)
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true } // upsert: true creates it if not found
    ).lean().exec();

    return { ...doc, id: (doc as any)._id.toString() } as unknown as SiteSettings;
  },
};
