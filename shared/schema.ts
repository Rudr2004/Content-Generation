import { pgTable, text, serial, timestamp, boolean, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service"),
  message: text("message").notNull(),
  pageSource: text("page_source").default("Contact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().optional(), // For email templates
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  phone: z.string().optional().refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
    message: "Please enter a valid phone number"
  }),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
  pageSource: z.string().default("Contact"),
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Authors Schema
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAuthorSchema = createInsertSchema(authors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// Service Categories Schema
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: text("status").default("active").notNull(), // active, inactive
  displayOrder: serial("display_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
  slug: true, // Auto-generated from name
  createdAt: true,
  updatedAt: true,
});

export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

// Service Subcategories Schema
export const serviceSubcategories = pgTable("service_subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  description: text("description"),
  status: text("status").default("active").notNull(), // active, inactive
  displayOrder: serial("display_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceSubcategorySchema = createInsertSchema(serviceSubcategories).omit({
  id: true,
  slug: true, // Auto-generated from name
  createdAt: true,
  updatedAt: true,
});

export type InsertServiceSubcategory = z.infer<typeof insertServiceSubcategorySchema>;
export type ServiceSubcategory = typeof serviceSubcategories.$inferSelect;

// Service Pages Schema (for the third level - pages under subcategories)
export const servicePages = pgTable("service_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  subcategoryId: integer("subcategory_id").references(() => serviceSubcategories.id),
  content: text("content"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  status: text("status").default("active").notNull(), // active, inactive
  displayOrder: serial("display_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServicePageSchema = createInsertSchema(servicePages).omit({
  id: true,
  slug: true, // Auto-generated from title
  createdAt: true,
  updatedAt: true,
});

export type InsertServicePage = z.infer<typeof insertServicePageSchema>;
export type ServicePage = typeof servicePages.$inferSelect;

// Blog Posts Schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  tags: text("tags").array(),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  status: text("status").default("draft").notNull(), // draft, published, scheduled
  authorId: integer("author_id").references(() => authors.id),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  scheduledAt: z.union([z.string(), z.date()]).optional(),
  authorId: z.number().optional(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// User Management Schema - Updated to match existing structure
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("content_admin"), // super_admin, user_admin, content_admin
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"), // existing field
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Temporarily commented out to resolve db:push issue
// export const passwordResetTokens = pgTable("password_reset_tokens", {
//   id: serial("id").primaryKey(),
//   userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
//   token: text("token").notNull().unique(),
//   expiresAt: timestamp("expires_at").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// });

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["super_admin", "user_admin", "content_admin", "user"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
// Temporarily commented out as passwordResetTokens table is disabled
// export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// Services Schema - Enhanced with testimonials and tech stack domains
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  pageName: text("page_name"), // For user-side navigation display
  category: text("category"),
  subCategory: text("sub_category"),
  caseStudyCategory: text("case_study_category"), // Case study category to show on service page
  caseStudyCategories: text("case_study_categories"), // JSON array of selected case study categories
  selectedCaseStudies: text("selected_case_studies"), // JSON array of selected case study IDs
  content: text("content"),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  icon: text("icon"),
  features: text("features").array(),
  technologies: text("technologies").array(),
  techStackDomains: text("tech_stack_domains").array(), // New: Selected technology domains
  aiTechnologies: text("ai_technologies").array(), // AI-generated technologies
  
  // AI Content Generation Fields
  referenceUrl: text("reference_url"), // URL for AI to analyze and scrape content
  referenceContent: text("reference_content"), // Manual content input for AI analysis
  
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  primaryKeyword: text("primary_keyword"),
  secondaryKeywords: text("secondary_keywords"),
  keywords: text("keywords"),
  canonicalUrl: text("canonical_url"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  status: text("status").default("active").notNull(),
  startingPrice: text("starting_price"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Service Testimonials Schema - AI-generated testimonials for each service
export const serviceTestimonials = pgTable("service_testimonials", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id, { onDelete: "cascade" }).notNull(),
  clientName: text("client_name").notNull(),
  clientCompany: text("client_company").notNull(),
  clientPosition: text("client_position").notNull(),
  testimonialText: text("testimonial_text").notNull(),
  rating: integer("rating").default(5).notNull(),
  gender: text("gender").default("male").notNull(), // male, female
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Service Testimonials Schema Types
export const insertServiceTestimonialSchema = createInsertSchema(serviceTestimonials).omit({
  id: true,
  createdAt: true,
});

export type InsertServiceTestimonial = z.infer<typeof insertServiceTestimonialSchema>;
export type ServiceTestimonial = typeof serviceTestimonials.$inferSelect;

// Hire Page Testimonials Schema
export const hirePageTestimonials = pgTable("hire_page_testimonials", {
  id: serial("id").primaryKey(),
  hirePageId: integer("hire_page_id").references(() => hirePages.id, { onDelete: "cascade" }).notNull(),
  clientName: text("client_name").notNull(),
  clientCompany: text("client_company").notNull(),
  clientPosition: text("client_position").notNull(),
  testimonialText: text("testimonial_text").notNull(),
  rating: integer("rating").default(5).notNull(),
  gender: text("gender").default("male").notNull(), // male, female
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHirePageTestimonialSchema = createInsertSchema(hirePageTestimonials).omit({
  id: true,
  createdAt: true,
});

export type InsertHirePageTestimonial = z.infer<typeof insertHirePageTestimonialSchema>;
export type HirePageTestimonial = typeof hirePageTestimonials.$inferSelect;

// SEO Management Schema
export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  category: text("category"), // global, technical, social, analytics
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoKeywords = pgTable("seo_keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"), // 1-100 scale
  category: text("category"),
  targetRanking: integer("target_ranking").default(1),
  currentRanking: integer("current_ranking"),
  lastChecked: timestamp("last_checked"),
  status: text("status").default("active").notNull(), // active, inactive, tracking
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoAnalytics = pgTable("seo_analytics", {
  id: serial("id").primaryKey(),
  pageUrl: text("page_url").notNull(),
  pageTitle: text("page_title"),
  pageType: text("page_type"), // blog, service, hire, case-study, static
  referenceId: integer("reference_id"), // ID of the content in respective table
  organicTraffic: integer("organic_traffic").default(0),
  avgPosition: integer("avg_position"),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  ctr: integer("ctr").default(0), // Click-through rate in percentage
  backlinks: integer("backlinks").default(0),
  dateRecorded: timestamp("date_recorded").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const seoPageData = pgTable("seo_page_data", {
  id: serial("id").primaryKey(),
  pageType: text("page_type").notNull(), // blog, service, hire, case-study, static
  referenceId: integer("reference_id").notNull(), // ID from respective table
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  primaryKeyword: text("primary_keyword"),
  secondaryKeywords: text("secondary_keywords"),
  focusKeywords: text("focus_keywords"), // JSON array of focus keywords
  canonicalUrl: text("canonical_url"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  schemaMarkup: text("schema_markup"), // JSON-LD structured data
  seoScore: integer("seo_score").default(0), // 0-100 score
  lastOptimized: timestamp("last_optimized"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Insert schemas for SEO tables
export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeoKeywordsSchema = createInsertSchema(seoKeywords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeoAnalyticsSchema = createInsertSchema(seoAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertSeoPageDataSchema = createInsertSchema(seoPageData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});


// Types for SEO management
export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;

export type SeoKeywords = typeof seoKeywords.$inferSelect;
export type InsertSeoKeywords = z.infer<typeof insertSeoKeywordsSchema>;

export type SeoAnalytics = typeof seoAnalytics.$inferSelect;
export type InsertSeoAnalytics = z.infer<typeof insertSeoAnalyticsSchema>;

export type SeoPageData = typeof seoPageData.$inferSelect;
export type InsertSeoPageData = z.infer<typeof insertSeoPageDataSchema>;


// Robots.txt Management Schema with Version History
export const robotsTxtSettings = pgTable("robots_txt_settings", {
  id: serial("id").primaryKey(),
  content: text("content").notNull().default(`User-agent: *
Allow: /

Sitemap: /sitemap.xml`),
  isActive: boolean("is_active").default(false).notNull(), // Only one version can be active
  version: text("version").notNull(), // Auto-generated version label like "v1.0", "v1.1", etc
  versionNotes: text("version_notes"), // Optional notes about this version
  contentHash: text("content_hash").notNull(), // SHA-256 hash for change detection
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRobotsTxtSettingsSchema = createInsertSchema(robotsTxtSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdated: true,
  version: true, // Auto-generated
  contentHash: true, // Auto-generated
}).extend({
  versionNotes: z.string().optional(),
});

export type RobotsTxtSettings = typeof robotsTxtSettings.$inferSelect;
export type InsertRobotsTxtSettings = z.infer<typeof insertRobotsTxtSettingsSchema>;

// Page Indexing Status Management Schema
export const pageIndexingStatus = pgTable("page_indexing_status", {
  id: serial("id").primaryKey(),
  pageUrl: text("page_url").notNull().unique(),
  pageType: text("page_type").notNull(), // blog, service, hire, case-study, static, industry
  referenceId: integer("reference_id"), // ID from respective table
  pageTitle: text("page_title").notNull(),
  isIndexable: boolean("is_indexable").default(true).notNull(),
  metaRobotsTag: text("meta_robots_tag").default("index, follow").notNull(),
  noindexReason: text("noindex_reason"), // Optional reason for non-indexing
  lastChecked: timestamp("last_checked"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPageIndexingStatusSchema = createInsertSchema(pageIndexingStatus).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdated: true,
});

export type PageIndexingStatus = typeof pageIndexingStatus.$inferSelect;
export type InsertPageIndexingStatus = z.infer<typeof insertPageIndexingStatusSchema>;

// Centralized Link Management System - Comprehensive Link Registry
export const centralLinkRegistry = pgTable("central_link_registry", {
  id: serial("id").primaryKey(),
  linkId: text("link_id").notNull().unique(), // Unique identifier for the link (UUID format)
  targetUrl: text("target_url").notNull(), // The actual URL this link points to
  originalUrl: text("original_url"), // Original URL if this is a redirect
  displayText: text("display_text").notNull(), // Default display text for the link
  linkType: text("link_type").notNull().default("internal"), // internal, external, redirect
  category: text("category"), // Category for organization (services, blog, hire, case-study)
  title: text("title"), // SEO title for the link
  description: text("description"), // Description/meta description
  status: text("status").notNull().default("active"), // active, inactive, redirect, broken
  isTracked: boolean("is_tracked").default(true).notNull(), // Whether to track this link
  priority: integer("priority").default(0).notNull(), // Priority for conflict resolution
  
  // Analytics and tracking
  clickCount: integer("click_count").default(0).notNull(),
  lastAccessed: timestamp("last_accessed"),
  lastValidated: timestamp("last_validated"),
  validationStatus: text("validation_status").default("pending").notNull(), // valid, invalid, pending, error
  
  // Versioning and history
  version: integer("version").default(1).notNull(),
  previousVersionId: integer("previous_version_id"), // For version history
  
  // Metadata
  tags: text("tags").array(), // Tags for categorization and filtering
  metadata: text("metadata"), // JSON metadata for additional properties
  
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint for target URL + display text combination
  uniqueLinkTarget: unique("unique_link_target").on(table.targetUrl, table.displayText),
}));

// Link Usage Mapping - Track which content uses which links
export const linkUsageMapping = pgTable("link_usage_mapping", {
  id: serial("id").primaryKey(),
  linkId: text("link_id").references(() => centralLinkRegistry.linkId, { onDelete: "cascade" }).notNull(),
  contentType: text("content_type").notNull(), // blog, service, hire, case-study, service-detail
  contentId: integer("content_id").notNull(), // Reference ID from respective table
  contentTitle: text("content_title"), // Title of the content for reference
  fieldName: text("field_name"), // Which field contains the link (content, description, etc.)
  contextBefore: text("context_before"), // Text before the link for context
  contextAfter: text("context_after"), // Text after the link for context
  position: integer("position").default(0), // Position of link in content (if multiple)
  
  // Usage tracking
  usageType: text("usage_type").default("content").notNull(), // content, navigation, footer, header
  isActive: boolean("is_active").default(true).notNull(),
  lastSynced: timestamp("last_synced"),
  syncStatus: text("sync_status").default("synced").notNull(), // synced, pending, failed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Unique constraint to prevent duplicate mappings
  uniqueContentLink: unique("unique_content_link").on(
    table.linkId, 
    table.contentType, 
    table.contentId, 
    table.fieldName,
    table.position
  ),
}));

// Link Redirects - Handle URL changes and maintain redirect chains
export const linkRedirects = pgTable("link_redirects", {
  id: serial("id").primaryKey(),
  oldLinkId: text("old_link_id").references(() => centralLinkRegistry.linkId).notNull(),
  newLinkId: text("new_link_id").references(() => centralLinkRegistry.linkId).notNull(),
  redirectType: text("redirect_type").default("301").notNull(), // 301, 302, 307, 308
  reason: text("reason"), // Reason for redirect (url-change, consolidation, etc.)
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"), // Optional expiry for temporary redirects
  
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Prevent circular redirects and duplicates
  uniqueRedirect: unique("unique_redirect").on(table.oldLinkId, table.newLinkId),
}));

// Link Validation - Track link health and validation results
export const linkValidation = pgTable("link_validation", {
  id: serial("id").primaryKey(),
  linkId: text("link_id").references(() => centralLinkRegistry.linkId, { onDelete: "cascade" }).notNull(),
  validationDate: timestamp("validation_date").defaultNow().notNull(),
  status: text("status").notNull(), // valid, invalid, timeout, error, redirect
  httpStatusCode: integer("http_status_code"),
  responseTime: integer("response_time"), // Response time in milliseconds
  errorMessage: text("error_message"),
  redirectChain: text("redirect_chain"), // JSON array of redirect URLs
  finalUrl: text("final_url"), // Final URL after following redirects
  
  // Validation metadata
  validatedBy: text("validated_by").default("system"), // system, user, manual
  validationMethod: text("validation_method").default("http").notNull(), // http, ping, manual
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas and types for the new tables
export const insertCentralLinkRegistrySchema = createInsertSchema(centralLinkRegistry).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  clickCount: true,
  version: true,
  lastAccessed: true,
  lastValidated: true,
}).extend({
  linkId: z.string().uuid().optional(), // Auto-generated if not provided
  targetUrl: z.string().url("Please enter a valid URL"),
  displayText: z.string().min(1, "Display text is required"),
  linkType: z.enum(["internal", "external", "redirect"]),
  status: z.enum(["active", "inactive", "redirect", "broken"]),
  validationStatus: z.enum(["valid", "invalid", "pending", "error"]),
  priority: z.number().int().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.string().optional(), // JSON string
});

export const insertLinkUsageMappingSchema = createInsertSchema(linkUsageMapping).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSynced: true,
}).extend({
  contentType: z.enum(["blog", "service", "hire", "case-study", "service-detail", "industry"]),
  usageType: z.enum(["content", "navigation", "footer", "header"]),
  syncStatus: z.enum(["synced", "pending", "failed"]),
});

export const insertLinkRedirectsSchema = createInsertSchema(linkRedirects).omit({
  id: true,
  createdAt: true,
}).extend({
  redirectType: z.enum(["301", "302", "307", "308"]),
  reason: z.string().optional(),
});

export const insertLinkValidationSchema = createInsertSchema(linkValidation).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(["valid", "invalid", "timeout", "error", "redirect"]),
  validatedBy: z.enum(["system", "user", "manual"]),
  validationMethod: z.enum(["http", "ping", "manual"]),
});

// Export types
export type CentralLinkRegistry = typeof centralLinkRegistry.$inferSelect;
export type InsertCentralLinkRegistry = z.infer<typeof insertCentralLinkRegistrySchema>;

export type LinkUsageMapping = typeof linkUsageMapping.$inferSelect;
export type InsertLinkUsageMapping = z.infer<typeof insertLinkUsageMappingSchema>;

export type LinkRedirects = typeof linkRedirects.$inferSelect;
export type InsertLinkRedirects = z.infer<typeof insertLinkRedirectsSchema>;

export type LinkValidation = typeof linkValidation.$inferSelect;
export type InsertLinkValidation = z.infer<typeof insertLinkValidationSchema>;

// Service Detail Pages Schema - Comprehensive CMS Structure
export const serviceDetailPages = pgTable("service_detail_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  
  // Hero Section
  heroTitle: text("hero_title"),
  heroDescription: text("hero_description"),
  heroImageUrl: text("hero_image_url"),
  heroImageAlt: text("hero_image_alt"),
  heroCtaText: text("hero_cta_text"),
  heroCtaUrl: text("hero_cta_url"),
  
  // Why Choose Us Section
  whyChooseUsTitle: text("why_choose_us_title").default("Why Choose Us"),
  whyChooseUsDescription: text("why_choose_us_description"),
  whyChooseUsCards: text("why_choose_us_cards"), // JSON array of {title, description, icon}
  
  // Services Overview Section
  servicesOverviewTitle: text("services_overview_title").default("Our Services"),
  servicesOverviewDescription: text("services_overview_description"),
  servicesOverviewCards: text("services_overview_cards"), // JSON array of service cards
  
  // Development Process Section
  developmentProcessTitle: text("development_process_title").default("Our Development Process"),
  developmentProcessDescription: text("development_process_description"),
  developmentProcessSteps: text("development_process_steps"), // JSON array of process steps
  
  // Industries Served Section
  industriesServedTitle: text("industries_served_title").default("Industries We Serve"),
  industriesServedDescription: text("industries_served_description"),
  industriesServedList: text("industries_served_list"), // JSON array of industries
  
  // Business Benefits Section
  businessBenefitsTitle: text("business_benefits_title").default("Business Benefits"),
  businessBenefitsDescription: text("business_benefits_description"),
  businessBenefitsCards: text("business_benefits_cards"), // JSON array of benefit cards
  
  // Case Studies Section
  caseStudiesTitle: text("case_studies_title").default("Case Studies"),
  caseStudiesDescription: text("case_studies_description"),
  caseStudiesCards: text("case_studies_cards"), // JSON array of case study cards
  
  // Tech Stack Section
  techStackTitle: text("tech_stack_title").default("Technology Stack"),
  techStackDescription: text("tech_stack_description"),
  techStackCategories: text("tech_stack_categories"), // JSON object with categories and technologies
  
  // Expertise Areas Section
  expertiseAreasTitle: text("expertise_areas_title").default("Our Expertise Areas"),
  expertiseAreasDescription: text("expertise_areas_description"),
  expertiseAreasList: text("expertise_areas_list"), // JSON array of expertise areas
  
  // Engagement Models Section
  engagementModelsTitle: text("engagement_models_title").default("Engagement Models"),
  engagementModelsDescription: text("engagement_models_description"),
  engagementModelsCards: text("engagement_models_cards"), // JSON array of engagement model cards
  
  // Partner Logos Section
  partnerLogosTitle: text("partner_logos_title").default("Trusted by Industry Leaders"),
  partnerLogosDescription: text("partner_logos_description"),
  partnerLogos: text("partner_logos"), // JSON array of {name, logoUrl, altText}
  
  // Section Visibility Controls
  showWhyChooseUs: boolean("show_why_choose_us").default(true),
  showServicesOverview: boolean("show_services_overview").default(true),
  showDevelopmentProcess: boolean("show_development_process").default(true),
  showIndustriesServed: boolean("show_industries_served").default(true),
  showBusinessBenefits: boolean("show_business_benefits").default(true),
  showCaseStudies: boolean("show_case_studies").default(true),
  showTechStack: boolean("show_tech_stack").default(true),
  showExpertiseAreas: boolean("show_expertise_areas").default(true),
  showEngagementModels: boolean("show_engagement_models").default(true),
  showPartnerLogos: boolean("show_partner_logos").default(true),
  
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceDetailPageSchema = createInsertSchema(serviceDetailPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertServiceDetailPage = z.infer<typeof insertServiceDetailPageSchema>;

// Industry Pages Schema - Following the provided JSON structure
export const industryPages = pgTable("industry_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  
  // Page Meta
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"), // JSON array of keywords
  
  // Hero Section
  heroHeadline: text("hero_headline"),
  heroSubheading: text("hero_subheading"),
  heroBackgroundImage: text("hero_background_image"),
  heroBackgroundImageAlt: text("hero_background_image_alt"),
  heroBackgroundImageS3Key: text("hero_background_image_s3_key"),
  heroCtaText: text("hero_cta_text"),
  heroCtaLink: text("hero_cta_link"),
  
  // Overview Section
  overviewTitle: text("overview_title").default("Industry Overview"),
  overviewContent: text("overview_content"), // JSON array of paragraphs
  industryStatistics: text("industry_statistics"), // JSON array of {statistic, description}
  
  // Industries Detail Section
  industriesDetailTitle: text("industries_detail_title").default("Our Industry Solutions"),
  industries: text("industries"), // JSON array following the provided structure
  
  // Technology Stack Section
  technologyStackTitle: text("technology_stack_title").default("Technologies We Use"),
  keyTechnologies: text("key_technologies"), // JSON array
  platforms: text("platforms"), // JSON array
  tools: text("tools"), // JSON array
  
  // Engagement Process Section
  engagementProcessTitle: text("engagement_process_title").default("How We Work"),
  engagementSteps: text("engagement_steps"), // JSON array of process steps
  
  // Unique Value Propositions Section
  uniqueValuePropositionsTitle: text("unique_value_propositions_title"),
  uniqueValuePropositionsPoints: text("unique_value_propositions_points"), // JSON array
  
  // Testimonials Section
  testimonialsTitle: text("testimonials_title").default("What Our Clients Say"),
  testimonialsEntries: text("testimonials_entries"), // JSON array of testimonials
  
  // FAQs Section
  faqsTitle: text("faqs_title").default("Frequently Asked Questions"),
  faqsItems: text("faqs_items"), // JSON array of {question, answer}
  
  // Call to Action Section
  ctaHeadline: text("cta_headline"),
  ctaSubtext: text("cta_subtext"),
  ctaPrimaryButtonText: text("cta_primary_button_text"),
  ctaPrimaryButtonLink: text("cta_primary_button_link"),
  ctaSecondaryButtonText: text("cta_secondary_button_text"),
  ctaSecondaryButtonLink: text("cta_secondary_button_link"),
  
  // Section Visibility Controls
  showOverview: boolean("show_overview").default(true),
  showIndustriesDetail: boolean("show_industries_detail").default(true),
  showTechnologyStack: boolean("show_technology_stack").default(true),
  showEngagementProcess: boolean("show_engagement_process").default(true),
  showUniqueValuePropositions: boolean("show_unique_value_propositions").default(true),
  showTestimonials: boolean("show_testimonials").default(true),
  showFaqs: boolean("show_faqs").default(true),
  showCta: boolean("show_cta").default(true),
  
  // SEO and Content Fields
  primaryKeyword: text("primary_keyword"),
  secondaryKeywords: text("secondary_keywords"),
  referenceContent: text("reference_content"), // Content used for AI generation
  content: text("content"), // Additional content or notes
  generatedContent: text("generated_content"), // Summary of AI-generated content for admin review
  
  // Page Settings
  featured: boolean("featured").default(false),
  status: text("status").default("active").notNull(), // active, inactive  
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIndustryPageSchema = createInsertSchema(industryPages).omit({
  id: true,
  slug: true, // Auto-generated from title
  createdAt: true,
  updatedAt: true,
});

export type InsertIndustryPage = z.infer<typeof insertIndustryPageSchema>;
export type IndustryPage = typeof industryPages.$inferSelect;
export type ServiceDetailPage = typeof serviceDetailPages.$inferSelect;

// Card schemas for TypeScript typing
export const serviceCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
});

export const servicePageProcessStepSchema = z.object({
  number: z.string(),
  title: z.string(),
  description: z.string(),
});

export const servicePageCaseStudySchema = z.object({
  title: z.string(),
  description: z.string(),
  industry: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  altText: z.string().optional(),
});

export const servicePagePartnerLogoSchema = z.object({
  name: z.string(),
  logoUrl: z.string(),
  altText: z.string(),
});

export type ServiceCard = z.infer<typeof serviceCardSchema>;
export type ServicePageProcessStep = z.infer<typeof servicePageProcessStepSchema>;
export type ServicePageCaseStudy = z.infer<typeof servicePageCaseStudySchema>;
export type ServicePagePartnerLogo = z.infer<typeof servicePagePartnerLogoSchema>;

// Images Schema for AWS S3 storage
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename"),
  s3Key: text("s3_key").notNull(),
  s3Url: text("s3_url").notNull(),
  bucket: text("bucket").notNull(),
  contentType: text("content_type").notNull(),
  folder: text("folder").default("images").notNull(),
  status: text("status").default("active").notNull(), // active, deleted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

// Hire Pages Schema - Based on SEO Content Structure Guideline
export const hirePages = pgTable("hire_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "Hire Blockchain Developers"
  slug: text("slug").notNull().unique(), // e.g., "hire-blockchain-developers"
  developerType: text("developer_type"), // e.g., "Blockchain", "AI", "Mobile" - now optional
  
  // SEO Meta Information
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  canonicalUrl: text("canonical_url"),
  
  // Hero Section
  heroTitle: text("hero_title"), // H1: "Hire [Developer Type] Developers in USA & Canada"
  heroSubtitle: text("hero_subtitle"), // Pain-point solving line or credibility hook
  heroDescription: text("hero_description"),
  heroImageUrl: text("hero_image_url"),
  heroImageAlt: text("hero_image_alt"),
  heroCtaText: text("hero_cta_text").default("Hire Developers"),
  heroCtaUrl: text("hero_cta_url").default("#contact"),
  trustBadges: text("trust_badges"), // JSON array of badges/certifications
  
  // Value & Trust Section ("Why Hire From GreenAppleX")
  whyHireTitle: text("why_hire_title"), // Will be populated by AI with specific developer type
  whyHireDescription: text("why_hire_description"),
  whyHirePoints: text("why_hire_points"), // JSON array of trust points
  
  // Metrics + Social Proof Block
  metricsTitle: text("metrics_title").default("Key Highlights"),
  projectsDelivered: text("projects_delivered"), // e.g., "100+ Blockchain Projects"
  yearsExperience: text("years_experience"), // e.g., "8-10+ Years"
  revenueSecured: text("revenue_secured"), // e.g., "$50M+ Secured"
  industryRecognition: text("industry_recognition"), // e.g., "Top Web3 Company 2024"
  clientLogos: text("client_logos"), // JSON array of client logos
  
  // Services / Expertise Offered
  servicesTitle: text("services_title"), // "Our [Developer Type] Services"
  servicesDescription: text("services_description"),
  servicesOffered: text("services_offered"), // JSON array of services with descriptions
  
  // Hiring Models Section
  hiringModelsTitle: text("hiring_models_title").default("Flexible Hiring Models"),
  hiringModelsDescription: text("hiring_models_description"),
  hiringModels: text("hiring_models"), // JSON array of models (Contract, Permanent, Dedicated Teams)
  
  // Testimonials & Success Stories
  testimonialsTitle: text("testimonials_title").default("Trusted by Global Founders"),
  testimonialsDescription: text("testimonials_description"),
  testimonials: text("testimonials"), // JSON array of client testimonials
  
  // FAQ Section
  faqTitle: text("faq_title").default("Frequently Asked Questions"),
  faqs: text("faqs"), // JSON array of FAQ items
  
  // Final CTA Section
  finalCtaTitle: text("final_cta_title"), // "Ready to Hire [Developer Type] Experts?"
  finalCtaDescription: text("final_cta_description"),
  finalCtaText: text("final_cta_text").default("Get Started Today"),
  finalCtaUrl: text("final_cta_url").default("#contact"),
  
  // Additional SEO and Technical Fields
  primaryKeyword: text("primary_keyword"), // Main SEO keyword
  secondaryKeywords: text("secondary_keywords"), // Supporting keywords
  targetLocations: text("target_locations"), // JSON array (USA, Canada, specific cities)
  coreSkills: text("core_skills"), // JSON array of core technologies/skills
  
  // Technology Stack Section  
  technologyStack: text("technology_stack"), // JSON object with description and categories
  aiTechnologies: text("ai_technologies"), // AI-generated technology recommendations for display on user side
  
  // AI Reference Content Generation
  referenceContent: text("reference_content"), // Reference content for AI generation
  content: text("content"), // Generated structured content (JSON)
  
  // Case Study Integration (same as Service CMS)
  caseStudyCategories: text("case_study_categories"), // JSON array of selected category names
  selectedCaseStudies: text("selected_case_studies"), // JSON array of selected case study IDs
  
  // Status and Management
  status: text("status").default("draft").notNull(), // draft, published, archived
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHirePageSchema = createInsertSchema(hirePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHirePage = z.infer<typeof insertHirePageSchema>;
export type HirePage = typeof hirePages.$inferSelect;

// JSON Schema Types for Hire Pages
export const trustPointSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const serviceOfferedSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const hiringModelSchema = z.object({
  title: z.string(),
  description: z.string(),
  benefits: z.array(z.string()),
  icon: z.string().optional(),
});

export const hireTestimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string(),
  quote: z.string(),
  rating: z.number().min(1).max(5),
  image: z.string().optional(),
});

// Case Studies CMS Schema - Following the structured JSON content guidelines
export const caseStudyPages = pgTable("case_study_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  
  // SEO Meta Information
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  canonicalUrl: text("canonical_url"),
  
  // Client Information
  clientName: text("client_name"),
  clientIndustry: text("client_industry"),
  clientLocation: text("client_location"),
  
  // Project Overview
  projectDuration: text("project_duration"),
  problemStatement: text("problem_statement"),
  objectives: text("objectives"), // JSON array
  
  // Challenges
  challenges: text("challenges"), // JSON array
  
  // Solution Details
  solutionStrategy: text("solution_strategy"),
  featuresCapabilities: text("features_capabilities"), // JSON array
  userExperienceDesign: text("user_experience_design"),
  technologiesUsed: text("technologies_used"), // JSON array
  
  // Implementation Process
  implementationProcess: text("implementation_process"), // JSON array of phases
  
  // Results and Impact
  quantitativeMetrics: text("quantitative_metrics"), // JSON object
  qualitativeBenefits: text("qualitative_benefits"), // JSON array
  businessOutcomes: text("business_outcomes"),
  
  // Client Testimonial
  clientTestimonial: text("client_testimonial"),
  
  // Future and Conclusion
  futureScopeEnhancements: text("future_scope_enhancements"),
  conclusion: text("conclusion"),
  
  // Reference Content for AI Generation
  referenceContent: text("reference_content"),
  
  // Category and Management
  category: text("category"),
  tags: text("tags"),
  status: text("status").default("draft").notNull(),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCaseStudyPageSchema = createInsertSchema(caseStudyPages).omit({
  id: true,
  slug: true, // Auto-generated from title
  createdAt: true,
  updatedAt: true,
}).extend({
  slug: z.string().optional(), // Allow manual slug override
});

export type InsertCaseStudyPage = z.infer<typeof insertCaseStudyPageSchema>;
export type CaseStudyPage = typeof caseStudyPages.$inferSelect;

// Case Study Categories Schema
export const caseStudyCategories = pgTable("case_study_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: text("status").default("active").notNull(), // active, inactive
  displayOrder: serial("display_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCaseStudyCategorySchema = createInsertSchema(caseStudyCategories).omit({
  id: true,
  slug: true, // Auto-generated from name
  createdAt: true,
  updatedAt: true,
});

export type InsertCaseStudyCategory = z.infer<typeof insertCaseStudyCategorySchema>;
export type CaseStudyCategory = typeof caseStudyCategories.$inferSelect;

// Technologies Schema
export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(), // Frontend, Backend, Database, DevOps, AI/ML, Blockchain, Mobile, etc.
  iconType: text("icon_type").notNull().default("text"), // "text", "svg", "library"
  iconData: text("icon_data"), // Text for text icons, SVG path, or library icon name
  iconColor: text("icon_color"), // Color for text/library icons
  description: text("description"),
  status: text("status").default("active").notNull(), // active, inactive
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTechnologySchema = createInsertSchema(technologies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTechnology = z.infer<typeof insertTechnologySchema>;
export type Technology = typeof technologies.$inferSelect;

// JSON Schema Types for Case Study Pages
// New schema matching the user's JSON structure
export const caseStudySchema = z.object({
  header: z.object({
    title: z.string(),
    subtitle: z.string(),
    client_logo_url: z.string().optional()
  }),
  client_introduction: z.object({
    client_name: z.string(),
    industry: z.string(),
    company_overview: z.string()
  }),
  project_overview: z.object({
    challenge: z.object({
      summary: z.string(),
      details: z.string()
    }),
    objectives: z.array(z.string())
  }),
  solution_section: z.object({
    solution_description: z.string(),
    key_features: z.array(z.string()),
    technologies_used: z.array(z.string())
  }),
  development_process: z.object({
    methodology: z.string(),
    stages: z.array(z.object({
      stage_name: z.string(),
      description: z.string()
    })),
    collaboration: z.string()
  }),
  outcomes_and_results: z.object({
    quantitative_results: z.object({
      metrics: z.array(z.object({
        name: z.string(),
        value: z.string(),
        description: z.string()
      }))
    }),
    qualitative_results: z.string(),
    client_feedback: z.object({
      testimonial: z.string(),
      client_contact: z.object({
        name: z.string(),
        designation: z.string()
      })
    })
  }),
  visual_assets: z.array(z.object({
    type: z.string(),
    url: z.string(),
    caption: z.string()
  })).optional(),
  conclusion_and_future: z.object({
    summary: z.string(),
    next_steps: z.string()
  }),
  call_to_action: z.object({
    text: z.string(),
    link: z.string()
  })
});

// Keep the existing individual case study schema for backward compatibility
export const individualCaseStudySchema = z.object({
  projectName: z.string(), // Project/Client Name
  clientName: z.string().optional(), // If different from project name
  location: z.string(), // Country/Location
  industry: z.string(), // Industry or domain (Education, Medtech, SaaS)
  summary: z.string(), // Brief summary describing problem solved/value delivered
  
  // Key Details
  technologies: z.array(z.string()), // Technology or methodology used
  challenges: z.string(), // Challenges faced
  solutions: z.string(), // Solutions implemented
  outcomes: z.string(), // Measured benefits or outcomes
  innovations: z.string().optional(), // Unique innovations or features
  
  // Visual Elements
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  
  // Additional Info
  projectDuration: z.string().optional(),
  teamSize: z.string().optional(),
  budget: z.string().optional(),
});

export const caseStudyTestimonialSchema = z.object({
  clientName: z.string(),
  position: z.string(), // Position/Title
  company: z.string(),
  testimonialText: z.string(), // Testimonial content
  rating: z.number().min(1).max(5).optional(),
  image: z.string().optional(),
  projectRelated: z.string().optional(), // Which case study this relates to
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
export type IndividualCaseStudy = z.infer<typeof individualCaseStudySchema>;
export type CaseStudyTestimonial = z.infer<typeof caseStudyTestimonialSchema>;

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type TrustPoint = z.infer<typeof trustPointSchema>;
export type ServiceOffered = z.infer<typeof serviceOfferedSchema>;
export type HiringModel = z.infer<typeof hiringModelSchema>;
export type HireTestimonial = z.infer<typeof hireTestimonialSchema>;
export type FAQ = z.infer<typeof faqSchema>;

// AI-Powered Service Pages Schema - Simplified to match database structure
export const aiServicePages = pgTable("ai_service_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  status: text("status").default("draft").notNull(), // draft, published, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiServicePageSchema = createInsertSchema(aiServicePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiServicePage = z.infer<typeof insertAiServicePageSchema>;
export type AiServicePage = typeof aiServicePages.$inferSelect;

// JSON Schema Types for AI Service Pages
export const serviceBenefitSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const serviceOfferingSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  features: z.array(z.string()).optional(),
});

export const serviceProcessStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const serviceTechnologyStackSchema = z.object({
  frontend: z.array(z.string()).optional(),
  backend: z.array(z.string()).optional(),
  database: z.array(z.string()).optional(),
  cloud: z.array(z.string()).optional(),
  ai_ml: z.array(z.string()).optional(),
  mobile: z.array(z.string()).optional(),
});

export const serviceCaseStudySchema = z.object({
  clientName: z.string(),
  industry: z.string(),
  challenge: z.string(),
  solution: z.string(),
  results: z.array(z.string()),
  testimonial: z.string().optional(),
});

export const serviceDifferentiatorSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  stats: z.string().optional(),
});

export const serviceIndustrySchema = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  examples: z.array(z.string()).optional(),
});

export type ServiceBenefit = z.infer<typeof serviceBenefitSchema>;
export type ServiceOfferingNew = z.infer<typeof serviceOfferingSchema>;
export type ServiceProcessStep = z.infer<typeof serviceProcessStepSchema>;
export type ServiceTechnologyStack = z.infer<typeof serviceTechnologyStackSchema>;
export type ServiceCaseStudy = z.infer<typeof serviceCaseStudySchema>;
export type ServiceDifferentiator = z.infer<typeof serviceDifferentiatorSchema>;
export type ServiceIndustry = z.infer<typeof serviceIndustrySchema>;
