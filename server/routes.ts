import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage, type HirePage, type BlogPost, type User } from "./storage";
import { insertContactSubmissionSchema, insertBlogPostSchema, insertUserSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, insertAuthorSchema, insertServiceSchema, insertServiceTestimonialSchema, insertServiceCategorySchema, insertServiceSubcategorySchema, insertServicePageSchema, insertServiceDetailPageSchema, insertHirePageSchema, insertCaseStudyPageSchema, insertCaseStudyCategorySchema, insertTechnologySchema, insertAiServicePageSchema, insertIndustryPageSchema, insertSeoSettingsSchema, insertSeoKeywordsSchema, insertSeoAnalyticsSchema, insertSeoPageDataSchema, insertRobotsTxtSettingsSchema, insertPageIndexingStatusSchema, insertCentralLinkRegistrySchema, insertLinkUsageMappingSchema, insertLinkRedirectsSchema, insertLinkValidationSchema, insertSiteSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactNotification } from "./email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { storeImagePermanently, deleteStoredImage, listStoredImages, uploadImageToS3 } from "./image-storage";
import { uploadToS3, uploadToMemory, BUCKET_NAME } from "./upload-middleware";
import { generateHireTechContent } from './ai-hire-tech-generator';
import { generateServicePageContent, generateSeoKeywords, generateSeoMeta, scrapeAndSummarizeUrl } from './ai-service-content-generator';
import { generateUniversalServiceContent, generateServiceSeoMeta } from './universal-service-generator';
import { generateServiceContentFromReference, generateServiceMetadata, generateHireDeveloperFromReference } from './ai-service-generator';
import dotenv from 'dotenv';
import { createSitemapGenerator } from './sitemap-generator';
import { LinkSyncManager } from './link-sync';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn("⚠️  JWT_SECRET is not set! Using temporary fallback for development.");
  console.log("📝 For production, please set the JWT_SECRET environment variable:");
  console.log("   JWT_SECRET=your-secure-random-secret-key");
  return "temporary-dev-secret-a97f599bc47f33c857bf4945b5f0debb360eb5ca4777e096fde4c12d5441ebbc77f3917acdc6fc58efdfd9b818c8d9ae4ff92e950a324a36ff705e47553047f4";
})();

// Utility function to generate URL-friendly slugs
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to parse ID from route params (supports both MongoDB ObjectId strings and numeric IDs)
function parseId(idParam: string): string | number {
  // If it's a valid MongoDB ObjectId (24 hex characters), return as string
  if (/^[0-9a-fA-F]{24}$/.test(idParam)) {
    return idParam;
  }
  // If it's a numeric string, parse as number for legacy support
  const numId = parseInt(idParam, 10);
  if (!isNaN(numId)) {
    return numId;
  }
  // Otherwise return as string (will be handled by storage methods)
  return idParam;
}

// Function to ensure unique slugs for industry pages
async function ensureUniqueIndustrySlug(baseSlug: string, excludeId?: string | number): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    try {
      const existingPage = await storage.getIndustryPageBySlug(slug);
      if (!existingPage || (excludeId && String(existingPage.id) === String(excludeId))) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    } catch (error) {
      // If getIndustryPageBySlug throws an error (like "not found"), the slug is available
      return slug;
    }
  }
}

// Function to ensure unique slugs for hire pages
async function ensureUniqueHirePageSlug(baseSlug: string, excludeId?: string | number): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    try {
      const existingPage = await storage.getHirePageBySlug(slug);
      if (!existingPage || (excludeId && existingPage.id.toString() === excludeId.toString())) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    } catch (error) {
      // If getHirePageBySlug throws an error (like "not found"), the slug is available
      return slug;
    }
  }
}

// Function to ensure unique slugs for case study pages
async function ensureUniqueCaseStudyPageSlug(baseSlug: string, excludeId?: string | number): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    try {
      const existingPage = await storage.getCaseStudyPageBySlug(slug);
      if (!existingPage || (excludeId && existingPage.id.toString() === excludeId.toString())) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    } catch (error) {
      // If getCaseStudyPageBySlug throws an error (like "not found"), the slug is available
      return slug;
    }
  }
}

// Gender detection utility for automatic assignment in testimonials
function getGenderFromName(fullName: string): string {
  const femaleNames = [
    'Emily', 'Sarah', 'Jennifer', 'Sophia', 'Michelle', 'Lisa', 'Jessica',
    'Amanda', 'Nicole', 'Stephanie', 'Ava', 'Sandra', 'Rachel', 'Ashley',
    'Megan', 'Samantha', 'Hannah', 'Victoria', 'Elizabeth', 'Rebecca',
    'Lauren', 'Katherine', 'Anna', 'Maria', 'Grace', 'Natalie', 'Emma',
    'Olivia', 'Isabella', 'Chloe', 'Madison', 'Abigail', 'Taylor', 'Brianna',
    'Morgan', 'Jordan', 'Alex', 'Casey', 'Riley', 'Cameron', 'Quinn',
    'Laura', 'Amy', 'Angela', 'Christine', 'Diane', 'Helen', 'Janet',
    'Patricia', 'Catherine', 'Samantha', 'Diana', 'Melissa', 'Kimberly',
    // Additional international female names to prevent mismatches
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

  const firstName = fullName.split(' ')[0];

  // Check for unisex names that need special handling
  const unisexSpecialCases: Record<string, string> = {
    'Taylor Brooks': 'female', // Based on context in our database
    'Morgan Lee': 'male',
    'Jordan Mitchell': 'male',
    'Jamie Watson': 'male'
  };

  // Check specific full name mappings first
  if (unisexSpecialCases[fullName]) {
    return unisexSpecialCases[fullName];
  }

  return femaleNames.includes(firstName) ? 'female' : 'male';
}

async function fixExistingGenderAssignments() {
  try {
    const allTestimonials = await storage.getAllHirePageTestimonials();

    for (const testimonial of allTestimonials) {
      const correctGender = getGenderFromName(testimonial.clientName);
      if (testimonial.gender !== correctGender) {
        console.log(`Fixing gender for ${testimonial.clientName}: ${testimonial.gender || 'null'} -> ${correctGender}`);
        await storage.updateHirePageTestimonialGender(testimonial.id, correctGender);
      }
    }
    console.log('Gender assignment check completed');
  } catch (error) {
    console.error('Failed to fix gender assignments:', error);
  }
}

// Call this function when the server starts - with enhanced logging
fixExistingGenderAssignments();

// Enhanced automatic gender fixing for new testimonials
async function ensureCorrectGenderAssignments() {
  try {
    const allTestimonials = await storage.getAllHirePageTestimonials();
    let fixCount = 0;

    for (const testimonial of allTestimonials) {
      const correctGender = getGenderFromName(testimonial.clientName);
      if (testimonial.gender !== correctGender) {
        console.log(`Auto-fixing gender for ${testimonial.clientName}: ${testimonial.gender || 'null'} -> ${correctGender}`);
        await storage.updateHirePageTestimonialGender(testimonial.id, correctGender);
        fixCount++;
      }
    }

    if (fixCount > 0) {
      console.log(`Fixed ${fixCount} gender assignments automatically`);
    }
  } catch (error) {
    console.error('Failed to ensure correct gender assignments:', error);
  }
}

// Run this check every time the server processes hire testimonials
setInterval(ensureCorrectGenderAssignments, 30000); // Check every 30 seconds

// Automatic gender assignment for NEW testimonials during creation
function assignCorrectGenderOnCreation(testimonialData: any) {
  if (testimonialData.clientName || testimonialData.client) {
    const clientName = testimonialData.clientName || testimonialData.client?.split(',')[0]?.trim();
    if (clientName) {
      testimonialData.gender = getGenderFromName(clientName);
      console.log(`Auto-assigned gender for new testimonial: ${clientName} -> ${testimonialData.gender}`);
    }
  }
  return testimonialData;
}

// Enhanced automatic gender assignment system for comprehensive prevention

// AI Description Generation Functions
async function generateCategoryDescription(categoryName: string): Promise<string> {
  try {
    const { generateChatCompletion } = await import("./openai-client");

    const response = await generateChatCompletion([
      {
        role: "system",
        content: "You are a business technology expert. Write professional, compelling descriptions for service categories that appeal to business decision makers."
      },
      {
        role: "user",
        content: `Write a professional 2-3 sentence description for the service category "${categoryName}". Focus on business value, expertise, and solutions. Target audience: CTOs, IT managers, and business leaders looking for technology services.`
      }
    ], {
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || `Professional ${categoryName.toLowerCase()} services and solutions for modern businesses.`;
  } catch (error) {
    throw new Error("Failed to generate category description");
  }
}

async function generateSubcategoryDescription(subcategoryName: string, categoryName: string): Promise<string> {
  try {
    const { generateChatCompletion } = await import("./openai-client");

    const response = await generateChatCompletion([
      {
        role: "system",
        content: "You are a business technology expert. Write professional, compelling descriptions for service subcategories that appeal to business decision makers."
      },
      {
        role: "user",
        content: `Write a professional 2-3 sentence description for the service subcategory "${subcategoryName}" under the category "${categoryName}". Focus on specific capabilities, expertise, and business outcomes. Target audience: CTOs, IT managers, and business leaders.`
      }
    ], {
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || `Specialized ${subcategoryName.toLowerCase()} services and solutions.`;
  } catch (error) {
    throw new Error("Failed to generate subcategory description");
  }
}

// JWT middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
      };
    }
  }
}

// Role-based authorization middleware
const authorizeRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize sitemap generator
  const sitemapGenerator = createSitemapGenerator(storage);

  // Initialize link synchronization manager
  const linkSyncManager = new LinkSyncManager(storage);

  // Generate initial sitemap on server start
  sitemapGenerator.updateSitemapAsync();

  // Middleware to ensure ALL hire developer page routes use proper gender assignment
  app.use('/api/hire-developer-pages', (req, res, next) => {
    // Intercept POST requests that create testimonials
    if (req.method === 'POST' && req.url.includes('/testimonials')) {
      console.log('Processing hire testimonial creation/update with auto-gender assignment');
    }
    next();
  });

  // Health check endpoint for Docker and load balancers
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0"
    });
  });

  // Create admin user endpoint (for initial setup)
  app.post("/api/test/create-admin", async (req, res) => {
    try {
      // Check if admin already exists
      const existingAdmin = await storage.getUserByEmail('admin@greenapplex.com');
      if (existingAdmin) {
        return res.json({
          success: true,
          message: "Admin user already exists",
          credentials: {
            email: "admin@greenapplex.com",
            password: "admin123"
          }
        });
      }

      // Create admin user
      const passwordHash = await bcrypt.hash('admin123', 10);
      const adminUser = await storage.createUser({
        email: 'admin@greenapplex.com',
        passwordHash,
        role: 'super_admin',
        firstName: 'Admin',
        lastName: 'User'
      });

      res.json({
        success: true,
        message: "Admin user created successfully",
        credentials: {
          email: "admin@greenapplex.com",
          password: "admin123"
        }
      });
    } catch (error) {
      console.error("Error creating admin user:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ success: false, message: "Failed to create admin user", error: errorMessage });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  app.post("/api/auth/register", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check role restrictions
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      if (req.user.role === 'user_admin' && userData.role === 'super_admin') {
        return res.status(403).json({ success: false, message: "Cannot create super admin users" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      // Convert null values to undefined to match User interface
      const cleanedUserData = Object.fromEntries(
        Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
      ) as Partial<User>;
      const user = await storage.createUser(cleanedUserData);
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid user data", errors: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Registration failed" });
      }
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ success: false, message: "Failed to get user" });
    }
  });

  app.post("/api/auth/change-password", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

      const success = await storage.changePassword(req.user.id, currentPassword, newPassword);
      if (!success) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid password data", errors: error.errors });
      } else {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: "Failed to change password" });
      }
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        return res.json({ success: true, message: "If the email exists, a reset link has been sent" });
      }

      // Disabled: const resetToken = await storage.createPasswordResetToken(user.id);
      return res.status(501).json({ success: false, message: "Password reset temporarily disabled" });

      // Send reset email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Disabled: const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken.token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p><a href="#">Reset Password (Temporarily Disabled)</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });

      res.json({ success: true, message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ success: false, message: "Failed to send reset email" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);

      // Disabled: const success = await storage.resetPassword(token, password);
      return res.status(501).json({ success: false, message: "Password reset temporarily disabled" });
      // Disabled: if (!success) {
      //   return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      // }

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid reset data", errors: error.errors });
      } else {
        console.error("Reset password error:", error);
        res.status(500).json({ success: false, message: "Failed to reset password" });
      }
    }
  });

  // User management routes
  app.get("/api/users", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      }));
      res.json({ success: true, users: sanitizedUsers });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ success: false, message: "Failed to get users" });
    }
  });

  app.put("/api/users/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check role restrictions
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      if (req.user.role === 'user_admin' && updates.role === 'super_admin') {
        return res.status(403).json({ success: false, message: "Cannot promote user to super admin" });
      }

      const user = await storage.updateUser(id, updates);
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ success: false, message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user.id === id) {
        return res.status(400).json({ success: false, message: "Cannot delete your own account" });
      }

      await storage.deleteUser(id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ success: false, message: "Failed to delete user" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);

      // Send email notifications
      const emailResult = await sendContactNotification(data);

      res.json({
        success: true,
        id: submission.id,
        emailSent: emailResult.notificationSent,
        confirmationSent: emailResult.confirmationSent
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Contact form submission error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit contact form"
        });
      }
    }
  });

  // Get contact submissions (for potential admin panel)
  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Failed to get contact submissions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve contact submissions"
      });
    }
  });

  // Blog CMS endpoints
  app.post("/api/blog", async (req, res) => {
    try {
      console.log("Received blog data:", req.body);
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);

      // Automatically sync links from content
      if (post.content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'blog',
            post.id,
            post.content,
            post.title,
            'content',
            'markdown'  // Changed to markdown to detect both markdown and HTML links
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for blog post ${post.id}:`, error);
        }
      }

      // Update sitemap when a published blog post is created
      if (post.status === 'published') {
        sitemapGenerator.updateSitemapAsync();
      }

      res.json({ success: true, post });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Blog validation errors:", error.errors);
        res.status(400).json({
          success: false,
          message: "Invalid blog data",
          errors: error.errors
        });
      } else {
        console.error("Blog creation error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to create blog post"
        });
      }
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Failed to get blog posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog posts"
      });
    }
  });

  // Public blog posts (only published)
  app.get("/api/blog/public", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      const publishedPosts = posts.filter(post => post.status === 'published');
      res.json(publishedPosts);
    } catch (error) {
      console.error("Failed to get public blog posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog posts"
      });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }
      res.json(post);
    } catch (error) {
      console.error("Failed to get blog post:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog post"
      });
    }
  });

  // Get public blog post by slug
  app.get("/api/blog/public/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const posts = await storage.getBlogPosts();
      const post = posts.find(p => p.slug === slug && p.status === 'published');
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }
      res.json(post);
    } catch (error) {
      console.error("Failed to get blog post by slug:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog post"
      });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      console.log(`[Blog PUT] Updating blog post ${id}`);
      const data = insertBlogPostSchema.partial().parse(req.body);
      // Convert null values to undefined to match BlogPost interface
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === null ? undefined : value])
      ) as Partial<BlogPost>;
      const post = await storage.updateBlogPost(id as any, cleanedData);
      console.log(`[Blog PUT] Updated blog post ${id}, has content: ${!!post.content}`);

      // Automatically sync links from content
      if (post.content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'blog',
            post.id,
            post.content,
            post.title,
            'content',
            'markdown'  // Changed to markdown to detect both markdown and HTML links
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for blog post ${post.id}:`, error);
        }
      }

      // Update sitemap when blog post is updated (only if published)
      if (post.status === 'published') {
        sitemapGenerator.updateSitemapAsync();
      }

      res.json({ success: true, post });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid blog data",
          errors: error.errors
        });
      } else {
        console.error("Blog update error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to update blog post"
        });
      }
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteBlogPost(id);

      // Update sitemap when blog post is deleted - use immediate generation to ensure deletion is reflected
      setTimeout(async () => {
        await sitemapGenerator.generateSitemap();
      }, 100); // Small delay to ensure database transaction is committed

      res.json({ success: true });
    } catch (error) {
      console.error("Blog deletion error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete blog post"
      });
    }
  });

  app.get("/api/blog/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const posts = await storage.searchBlogPosts(query);
      res.json(posts);
    } catch (error) {
      console.error("Blog search error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search blog posts"
      });
    }
  });

  app.get("/api/blog-stats", async (req, res) => {
    try {
      const stats = await storage.getBlogStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to get blog stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog statistics"
      });
    }
  });

  // Get scheduled posts
  app.get("/api/scheduled-posts", async (req, res) => {
    try {
      const posts = await storage.getScheduledPosts();
      res.json(posts);
    } catch (error) {
      console.error("Failed to get scheduled posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve scheduled posts"
      });
    }
  });

  // Manual trigger to publish scheduled posts
  app.post("/api/publish-scheduled-posts", async (req, res) => {
    try {
      await storage.publishScheduledPosts();
      res.json({
        success: true,
        message: "Scheduled posts check completed"
      });
    } catch (error) {
      console.error("Failed to publish scheduled posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to publish scheduled posts"
      });
    }
  });

  // Publish scheduled posts (triggered by cron or manually)
  app.post("/api/publish-scheduled", async (req, res) => {
    try {
      await storage.publishScheduledPosts();
      res.json({ success: true, message: "Scheduled posts published successfully" });
    } catch (error) {
      console.error("Failed to publish scheduled posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to publish scheduled posts"
      });
    }
  });

  // SEO Blog Generation endpoint
  app.post("/api/generate-seo-blog", async (req, res) => {
    try {
      const { blogTitle, primaryKeyword, secondaryKeywords, region } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      // Resolve region with priority order
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion(region);

      const { generateSEOBlog } = await import("./ai-blog-generator");

      const generatedContent = await generateSEOBlog({
        blogTitle,
        primaryKeyword,
        secondaryKeywords: secondaryKeywords.split(',').map((k: string) => k.trim()),
        region: resolvedRegion,
      });

      res.json(generatedContent);
    } catch (error: any) {
      console.error("SEO blog generation error:", error);

      // Handle specific OpenAI quota errors
      if (error.message && error.message.includes('quota exceeded')) {
        res.status(429).json({
          success: false,
          message: "OpenAI API quota exceeded. Please check your plan and billing details, or try again later."
        });
      } else if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
        res.status(429).json({
          success: false,
          message: "API rate limit reached. Please wait a moment and try again."
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to generate SEO blog content. Please try again."
        });
      }
    }
  });

  // SEO Keywords Generation endpoint
  app.post("/api/generate-seo-keywords", async (req, res) => {
    try {
      const { blogTitle } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateSEOKeywords } = await import("./ai-blog-generator");
      const { resolveRegion } = await import("./region-resolver");
      const region = await resolveRegion((req.body as any).region);

      const keywords = await generateSEOKeywords(blogTitle, region);

      res.json({ keywords });
    } catch (error) {
      console.error("SEO keywords generation error:", error);

      // Return fallback keywords instead of error
      const fallbackKeywords = [
        "professional services",
        "business solutions",
        "technology consulting",
        "digital transformation",
        "enterprise solutions",
        "custom development",
        "business innovation",
        "professional consulting",
        "technology services USA",
        "business development Canada"
      ].join(', ');

      res.json({ keywords: fallbackKeywords });
    }
  });

  // Hire Developer Keywords Generation endpoint
  app.post("/api/generate-hire-developer-keywords", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { title } = req.body;

      if (!title || title.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }

      const { generateHireDeveloperKeywords, generateFallbackHireKeywords } = await import("./ai-hiredev-generator");
      const { resolveRegion } = await import("./region-resolver");
      const region = await resolveRegion((req.body as any).region);
      const keywords = await generateHireDeveloperKeywords(title, region);
      res.json({ success: true, keywords });
    } catch (error) {
      console.error("Error generating hire developer keywords:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("insufficient_quota")) {
        const { generateFallbackHireKeywords } = await import("./ai-hiredev-generator");
        const { resolveRegion } = await import("./region-resolver");
        const region = await resolveRegion((req.body as any).region);
        res.status(429).json({
          success: false,
          message: "OpenAI quota exceeded. Using fallback keywords.",
          keywords: generateFallbackHireKeywords((req.body as any).title || '', region)
        });
      } else {
        res.status(500).json({ success: false, message: "Failed to generate keywords" });
      }
    }
  });


  // Blog Title Generation endpoint
  app.post("/api/generate-blog-titles", async (req, res) => {
    try {
      const { marketTrends, techType, blogType, existingTitles } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateBlogTitles } = await import("./ai-blog-generator");

      const result = await generateBlogTitles({
        marketTrends,
        techType,
        blogType,
        existingTitles
      });

      res.json(result);
    } catch (error) {
      console.error("Blog title generation error:", error);

      // Return fallback titles instead of error
      const fallbackTitles = [
        "Professional Technology Solutions for Modern Business",
        "Complete Guide to Digital Transformation in 2025",
        "Top Business Innovation Strategies for Success",
        "How to Choose the Right Technology Partner",
        "Essential Business Development Best Practices",
        "Professional Consulting Services for Growth",
        "Technology Trends Shaping Business Future",
        "Custom Solutions for Enterprise Success"
      ];

      res.json({ titles: fallbackTitles });
    }
  });

  // Regenerate Content endpoint
  app.post("/api/regenerate-content", async (req, res) => {
    try {
      const { blogTitle, primaryKeyword, secondaryKeywords, region } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      // Resolve region with priority order
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion(region);

      const { regenerateContent } = await import("./ai-blog-generator");

      const content = await regenerateContent(
        blogTitle,
        primaryKeyword,
        secondaryKeywords.split(',').map((k: string) => k.trim()),
        resolvedRegion
      );

      res.json(content);
    } catch (error) {
      console.error("Content regeneration error:", error);

      // Return fallback content instead of error
      const fallbackContent = {
        content: `<h1>${req.body.blogTitle}</h1><p>Professional content generation temporarily unavailable. Please try again later or contact support for assistance.</p>`,
        excerpt: "Professional content generation service",
        metaTitle: `${req.body.blogTitle} | GreenAppleX`,
        metaDescription: "Professional content and services by GreenAppleX",
        keywords: "professional services, content generation, business solutions",
        tags: ["Professional", "Services", "Business"]
      };

      res.json(fallbackContent);
    }
  });

  // Regenerate Image endpoint
  app.post("/api/regenerate-image", async (req, res) => {
    try {
      const { blogTitle, primaryKeyword } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { regenerateImage } = await import("./ai-blog-generator");

      const image = await regenerateImage(blogTitle, primaryKeyword);

      res.json(image);
    } catch (error) {
      console.error("Image regeneration error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to regenerate image"
      });
    }
  });

  // AI Service Generation endpoint
  app.post("/api/ai/generate-service", async (req, res) => {
    try {
      const { title, category, subCategory } = req.body;

      if (!title || !category || !subCategory) {
        return res.status(400).json({
          success: false,
          message: "Title, category, and sub-category are required"
        });
      }

      // Generate fallback service content
      const fallbackService = {
        primaryKeyword: `${subCategory.toLowerCase()} services`,
        secondaryKeywords: `professional ${subCategory.toLowerCase()}, custom ${category.toLowerCase()}, expert ${subCategory.toLowerCase()} development, ${category.toLowerCase()} solutions, business ${subCategory.toLowerCase()}`,
        content: `Transform your business with our professional ${subCategory.toLowerCase()} solutions. Our expert team delivers cutting-edge ${category.toLowerCase()} services designed to accelerate growth and maximize efficiency.

Market Leadership in ${subCategory}

Our ${subCategory.toLowerCase()} services have helped over 500+ businesses achieve their digital transformation goals. We specialize in delivering scalable, secure, and innovative solutions that drive measurable results.

Core Service Offerings

Advanced ${subCategory} Development
We build robust, scalable ${subCategory.toLowerCase()} solutions using the latest technologies and industry best practices. Our development approach ensures optimal performance, security, and user experience.

Strategic Consulting & Planning
Our expert consultants work closely with your team to develop comprehensive strategies that align with your business objectives. We provide detailed roadmaps and implementation plans for successful project execution.

Integration & Implementation
Seamless integration with your existing systems and workflows. We ensure minimal disruption to your operations while maximizing the benefits of new ${subCategory.toLowerCase()} technologies.

Performance Optimization
Continuous monitoring and optimization to ensure your ${subCategory.toLowerCase()} solutions deliver peak performance. We use advanced analytics and monitoring tools to identify and resolve potential issues proactively.

Key Advantages

Proven Expertise
Our team consists of certified professionals with extensive experience in ${category.toLowerCase()} and ${subCategory.toLowerCase()}. We stay current with the latest trends and technologies to deliver cutting-edge solutions.

Agile Methodology
We follow agile development practices that enable rapid iteration, flexible adaptation to changing requirements, and early delivery of valuable features.

Enterprise-Grade Security
Security is built into every aspect of our ${subCategory.toLowerCase()} solutions. We implement industry-standard security protocols and conduct regular security audits.

Scalable Architecture
Our solutions are designed to grow with your business. We build flexible, modular architectures that can easily accommodate future expansion and evolving requirements.

24/7 Support & Maintenance
Comprehensive support and maintenance services to ensure your ${subCategory.toLowerCase()} solutions operate smoothly. Our dedicated support team is available around the clock to address any issues.

Implementation Process

Phase 1: Analysis & Strategy
Comprehensive analysis of your current systems, business requirements, and objectives. We develop a detailed strategy and implementation roadmap tailored to your specific needs.

Phase 2: Design & Architecture
Creation of detailed technical specifications, system architecture, and user interface designs. We ensure all stakeholders are aligned before proceeding to development.

Phase 3: Development & Testing
Iterative development using agile methodologies with continuous testing and quality assurance. Regular demos and feedback sessions ensure the solution meets your expectations.

Phase 4: Deployment & Optimization
Careful deployment with minimal business disruption, followed by performance monitoring and optimization to ensure optimal results.

Technology Stack

We leverage the most advanced technologies and frameworks in the ${category.toLowerCase()} space:

- Cloud-native architectures for maximum scalability
- Modern development frameworks and libraries
- AI and machine learning capabilities
- Advanced security and compliance tools
- Real-time analytics and monitoring solutions

Industry Applications

Our ${subCategory.toLowerCase()} solutions serve diverse industries including healthcare, finance, e-commerce, manufacturing, education, and government sectors. Each solution is customized to meet specific industry requirements and regulatory compliance needs.

Success Metrics

Our ${subCategory.toLowerCase()} projects typically deliver:
- 40-60% improvement in operational efficiency
- 30-50% reduction in processing time
- 99.9% system uptime and reliability
- Significant cost savings through automation
- Enhanced user satisfaction and engagement

Quality Assurance

We maintain the highest quality standards through:
- Comprehensive testing protocols
- Code reviews and security audits
- Performance benchmarking
- Compliance with industry standards
- Continuous integration and deployment practices

Innovation & Future-Readiness

Our ${subCategory.toLowerCase()} solutions are designed with future growth in mind. We incorporate emerging technologies and ensure your investment remains valuable as your business evolves and technology advances.`
      };

      res.json(fallbackService);
    } catch (error) {
      console.error("AI service generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate service content"
      });
    }
  });

  // AI Service SEO Keywords Generation endpoint  
  // OLD endpoint - redirect to new one with region support
  app.post("/api/ai/generate-seo-keywords", async (req, res) => {
    // This endpoint is deprecated - redirect to the authenticated version
    // But handle it for backward compatibility
    try {
      const { title, category, subCategory, region } = req.body;

      if (!title || !category || !subCategory) {
        return res.status(400).json({
          success: false,
          message: "Title, category, and sub-category are required"
        });
      }

      // Use the same logic as the authenticated endpoint
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion(region);
      const regions = resolvedRegion.split(',').map(r => r.trim()).filter(Boolean);
      const regionLower = resolvedRegion.toLowerCase();
      const hasUSA = regionLower.includes('usa') || regionLower.includes('united states');
      const hasCanada = regionLower.includes('canada');

      // Generate fallback keywords based on service details - region-aware
      const baseKeywords = [
        `${subCategory.toLowerCase()} services`,
        `professional ${subCategory.toLowerCase()}`,
        `custom ${subCategory.toLowerCase()}`,
        `${category.toLowerCase()} solutions`,
        `expert ${subCategory.toLowerCase()} development`,
        `${subCategory.toLowerCase()} consulting`,
        `business ${subCategory.toLowerCase()}`,
        `${subCategory.toLowerCase()} company`,
        `${subCategory.toLowerCase()} experts`,
        `${category.toLowerCase()} development services`,
        `professional ${category.toLowerCase()}`,
        `${subCategory.toLowerCase()} specialists`,
        `enterprise ${subCategory.toLowerCase()}`,
        // Only add USA/Canada if they're in the region list
        ...(hasUSA ? [`${subCategory.toLowerCase()} services USA`] : []),
        ...(hasCanada ? [`${subCategory.toLowerCase()} services Canada`] : []),
        // Add region-specific keywords
        ...regions.map(r => `${subCategory.toLowerCase()} services ${r}`),
        ...regions.map(r => `${subCategory.toLowerCase()} ${r}`),
        `hire ${subCategory.toLowerCase()} developers`,
        `${subCategory.toLowerCase()} outsourcing`,
        `${category.toLowerCase()} consulting services`,
        `${subCategory.toLowerCase()} implementation`,
        `${category.toLowerCase()} technology solutions`
      ];

      const keywords = baseKeywords.join(', ');
      res.json({ keywords });
    } catch (error) {
      console.error("Service SEO keywords generation error:", error);

      // Return fallback keywords for services - region-aware
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion((req.body as any).region).catch(() => "USA, Canada");
      const regions = resolvedRegion.split(',').map(r => r.trim()).filter(Boolean);
      const regionLower = resolvedRegion.toLowerCase();
      const hasUSA = regionLower.includes('usa') || regionLower.includes('united states');
      const hasCanada = regionLower.includes('canada');

      const fallbackKeywords = [
        "professional services",
        "business solutions",
        "technology consulting",
        "digital transformation",
        "enterprise solutions",
        "custom development",
        "business innovation",
        "professional consulting",
        // Only add USA/Canada if they're in the region list
        ...(hasUSA ? ["technology services USA"] : []),
        ...(hasCanada ? ["business development Canada"] : []),
        // Add region-specific keywords
        ...regions.map(r => `technology services ${r}`),
        ...regions.map(r => `business development ${r}`)
      ].join(', ');

      res.json({ keywords: fallbackKeywords });
    }
  });

  // Store image permanently endpoint
  app.post("/api/store-image", async (req, res) => {
    try {
      const { temporaryUrl, prefix = 'blog-' } = req.body;

      if (!temporaryUrl) {
        return res.status(400).json({
          success: false,
          message: "Temporary URL is required"
        });
      }

      const { storeImagePermanently } = await import("./image-storage");

      const result = await storeImagePermanently(temporaryUrl, prefix);

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error("Image storage error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to store image permanently"
      });
    }
  });

  // Authors API endpoints
  app.get("/api/authors", async (req, res) => {
    try {
      const authors = await storage.getAllAuthors();
      res.json(authors);
    } catch (error) {
      console.error("Error fetching authors:", error);
      res.status(500).json({ success: false, message: "Failed to fetch authors" });
    }
  });

  app.post("/api/authors", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const authorData = insertAuthorSchema.parse(req.body);
      const author = await storage.createAuthor(authorData);
      res.json(author);
    } catch (error) {
      console.error("Error creating author:", error);
      res.status(500).json({ success: false, message: "Failed to create author" });
    }
  });

  app.put("/api/authors/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = process.env.MONGODB_URI ? idParam : parseInt(idParam);
      const authorData = insertAuthorSchema.parse(req.body);
      const author = await storage.updateAuthor(id as any, authorData);
      res.json(author);
    } catch (error) {
      console.error("Error updating author:", error);
      res.status(500).json({ success: false, message: "Failed to update author" });
    }
  });

  app.delete("/api/authors/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = process.env.MONGODB_URI ? idParam : parseInt(idParam);
      await storage.deleteAuthor(id as any);
      res.json({ success: true, message: "Author deleted successfully" });
    } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({ success: false, message: "Failed to delete author" });
    }
  });

  // ===== HIRE DEVELOPER PAGES ROUTES =====

  // Get all hire developer pages
  app.get("/api/hire-developer-pages", async (req, res) => {
    try {
      const pages = await storage.getAllHirePages();
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching hire developer pages:", error);
      // Return empty array as fallback to prevent UI errors
      res.json([]);
    }
  });

  // Get published hire developer pages (for public display)
  app.get("/api/hire-developer-pages/published", async (req, res) => {
    try {
      const pages = await storage.getPublishedHirePages();
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching published hire developer pages:", error);
      res.json([]);
    }
  });

  // Get single hire developer page by ID
  app.get("/api/hire-developer-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getHirePage(id);
      if (!page) {
        return res.status(404).json({ success: false, message: "Hire developer page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching hire developer page:", error);
      res.status(500).json({ success: false, message: "Failed to fetch hire developer page" });
    }
  });

  // Get hire developer page by slug (for public display)
  app.get("/api/hire-developer-pages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getHirePageBySlug(slug);
      if (!page) {
        return res.status(404).json({ success: false, message: "Hire developer page not found" });
      }

      // Parse ai_technologies field if it exists and is a JSON string
      let processedPage = { ...page } as any;
      if ((page as any).aiTechnologies) {
        try {
          // If it's a string, try to parse as JSON first
          if (typeof (page as any).aiTechnologies === 'string') {
            const parsed = JSON.parse((page as any).aiTechnologies);
            if (Array.isArray(parsed)) {
              processedPage.aiTechnologies = parsed.join(', ');
            }
          } else if (Array.isArray((page as any).aiTechnologies)) {
            // Already an array, join it
            processedPage.aiTechnologies = (page as any).aiTechnologies.join(', ');
          }
        } catch {
          // If not JSON, treat as comma-separated string (no changes needed)
        }
      }

      res.json(processedPage);
    } catch (error) {
      console.error("Error fetching hire developer page by slug:", error);
      res.status(500).json({ success: false, message: "Failed to fetch hire developer page" });
    }
  });

  // Get testimonials for hire developer page (public endpoint)
  app.get("/api/hire-developer-pages/:hirePageId/testimonials/public", async (req, res) => {
    try {
      const hirePageId = parseId(req.params.hirePageId);

      // Fetch all testimonials
      const allTestimonials = await storage.getAllHirePageTestimonials();

      // Filter by hirePageId
      const testimonials = allTestimonials.filter(t => t.hirePageId.toString() === hirePageId.toString());

      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching hire developer page testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  // Create new hire developer page
  app.post("/api/hire-developer-pages", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const pageData = insertHirePageSchema.parse(req.body);

      // Generate unique slug if not provided or if provided slug is empty
      if (!pageData.slug || pageData.slug.trim() === '') {
        if (!pageData.title) {
          return res.status(400).json({ success: false, message: "Title is required to generate slug" });
        }
        const baseSlug = generateSlug(pageData.title);
        pageData.slug = await ensureUniqueHirePageSlug(baseSlug);
      } else {
        // Normalize provided slug and ensure uniqueness
        const normalizedSlug = generateSlug(pageData.slug);
        pageData.slug = await ensureUniqueHirePageSlug(normalizedSlug);
      }

      // Convert null values to undefined to match HirePage interface
      const cleanedPageData = Object.fromEntries(
        Object.entries(pageData).map(([key, value]) => [key, value === null ? undefined : value])
      ) as Partial<HirePage>;
      const page = await storage.createHirePage(cleanedPageData);

      // Automatically sync links from content
      if (page.content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'hire',
            page.id,
            page.content,
            page.title,
            'content',
            'markdown'
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for hire page ${page.id}:`, error);
        }
      }

      // Auto-generate testimonials using hire_page_testimonials table
      if (pageData.developerType && process.env.OPENAI_API_KEY) {
        try {
          await storage.generateHirePageTestimonials(page.id, pageData.developerType, pageData.developerType);
        } catch (error) {
          console.error("Failed to auto-generate testimonials:", error);
          // Don't fail the page creation if testimonials fail
        }
      }

      // Update sitemap when hire developer page is created
      sitemapGenerator.updateSitemapAsync();

      res.json({ success: true, page });
    } catch (error) {
      console.error("Error creating hire developer page:", error);
      res.status(500).json({ success: false, message: "Failed to create hire developer page" });
    }
  });

  // Update hire developer page
  app.put("/api/hire-developer-pages/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = insertHirePageSchema.partial().parse(req.body);

      // If content is provided as a structured object, stringify it
      if (pageData.content && typeof pageData.content === 'object') {
        pageData.content = JSON.stringify(pageData.content);
      }

      // Handle slug generation/updating
      const existingPage = await storage.getHirePage(id);
      if (existingPage) {
        if (pageData.title && (!pageData.slug || pageData.slug.trim() === '')) {
          // Generate new slug from title if no slug provided
          const baseSlug = generateSlug(pageData.title);
          pageData.slug = await ensureUniqueHirePageSlug(baseSlug, id);
        } else if (pageData.slug && pageData.slug !== existingPage.slug) {
          // Normalize and ensure uniqueness if slug is being changed
          const normalizedSlug = generateSlug(pageData.slug);
          pageData.slug = await ensureUniqueHirePageSlug(normalizedSlug, id);
        } else if (pageData.title && pageData.title !== existingPage.title && !pageData.slug) {
          // Auto-update slug if title changed but no explicit slug provided
          const baseSlug = generateSlug(pageData.title);
          pageData.slug = await ensureUniqueHirePageSlug(baseSlug, id);
        }
      } else if (pageData.title && (!pageData.slug || pageData.slug.trim() === '')) {
        // If page doesn't exist yet but we have a title, generate slug
        const baseSlug = generateSlug(pageData.title);
        pageData.slug = await ensureUniqueHirePageSlug(baseSlug, id);
      }

      // Convert null values to undefined to match HirePage interface
      const cleanedPageData = Object.fromEntries(
        Object.entries(pageData).map(([key, value]) => [key, value === null ? undefined : value])
      ) as Partial<HirePage>;
      const page = await storage.updateHirePage(id, cleanedPageData);

      // Automatically sync links from content
      if (page.content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'hire',
            page.id,
            page.content,
            page.title,
            'content',
            'markdown'
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for hire page ${page.id}:`, error);
        }
      }

      // Auto-generate testimonials if developer type is updated and no testimonials exist
      if (pageData.developerType && process.env.OPENAI_API_KEY) {
        try {
          const existingTestimonials = await storage.getHirePageTestimonials(id);

          // Only generate if no testimonials exist
          if (!existingTestimonials || existingTestimonials.length === 0) {
            const { generateTestimonials } = await import("./ai-hire-content-generator");
            const testimonials = await generateTestimonials(pageData.developerType, 3);

            // Save generated testimonials to database with automatic gender assignment
            for (const testimonial of testimonials) {
              await storage.createHirePageTestimonial({
                hirePageId: id,
                clientName: testimonial.clientName,
                clientCompany: testimonial.clientCompany,
                clientPosition: testimonial.clientPosition,
                testimonialText: testimonial.testimonialText,
                rating: testimonial.rating,
                gender: getGenderFromName(testimonial.clientName)
              });
            }
          }
        } catch (error) {
          console.error("Failed to auto-generate testimonials on update:", error);
          // Don't fail the page update if testimonials fail
        }
      }

      // Update sitemap when hire developer page is updated
      sitemapGenerator.updateSitemapAsync();

      res.json({ success: true, page });
    } catch (error) {
      console.error("Error updating hire developer page:", error);
      res.status(500).json({ success: false, message: "Failed to update hire developer page" });
    }
  });

  // Delete hire developer page
  app.delete("/api/hire-developer-pages/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteHirePage(id);

      // Update sitemap when hire developer page is deleted - use immediate generation to ensure deletion is reflected
      setTimeout(async () => {
        await sitemapGenerator.generateSitemap();
      }, 100); // Small delay to ensure database transaction is committed

      res.json({ success: true, message: "Hire developer page deleted successfully" });
    } catch (error) {
      console.error("Error deleting hire developer page:", error);
      res.status(500).json({ success: false, message: "Failed to delete hire developer page" });
    }
  });

  // Search hire developer pages
  app.get("/api/hire-developer-pages/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const pages = await storage.searchHirePages(query);
      res.json(pages || []);
    } catch (error) {
      console.error("Error searching hire developer pages:", error);
      res.json([]);
    }
  });

  // ===== HIRE DEVELOPER PAGE TESTIMONIALS ROUTES =====

  // Get testimonials for a specific hire developer page (public endpoint)
  app.get("/api/hire-developer-pages/:hirePageId/testimonials", async (req, res) => {
    try {
      const hirePageId = parseId(req.params.hirePageId);
      const testimonials = await storage.getHirePageTestimonials(hirePageId);
      res.json({ success: true, testimonials });
    } catch (error) {
      console.error("Error fetching hire developer page testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  // Generate AI testimonials for hire developer page
  app.post("/api/hire-developer-pages/:hirePageId/testimonials/generate", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const hirePageId = parseId(req.params.hirePageId);
      const { developerType, category } = req.body;

      if (!developerType) {
        return res.status(400).json({
          success: false,
          message: "Developer type is required"
        });
      }

      const testimonials = await storage.generateHirePageTestimonials(hirePageId.toString(), developerType, category || developerType);
      res.json({
        success: true,
        testimonials,
        message: "Testimonials generated successfully"
      });
    } catch (error) {
      console.error("Error generating hire developer page testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to generate testimonials" });
    }
  });

  // Create manual testimonial for hire developer page
  app.post("/api/hire-developer-pages/:hirePageId/testimonials", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const hirePageId = parseId(req.params.hirePageId);
      const testimonialData = insertServiceTestimonialSchema.parse({
        ...req.body,
        serviceId: hirePageId // Using serviceId field for compatibility
      });

      // Automatically assign gender based on client name if not provided
      if (!testimonialData.gender && testimonialData.clientName) {
        testimonialData.gender = getGenderFromName(testimonialData.clientName);
      }

      const testimonial = await storage.createHirePageTestimonial(testimonialData);
      res.json({ success: true, testimonial });
    } catch (error) {
      console.error("Error creating hire developer page testimonial:", error);
      res.status(500).json({ success: false, message: "Failed to create testimonial" });
    }
  });

  // Delete all testimonials for hire developer page
  app.delete("/api/hire-developer-pages/:hirePageId/testimonials", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const hirePageId = parseId(req.params.hirePageId);
      await storage.deleteHirePageTestimonials(hirePageId);
      res.json({ success: true, message: "All testimonials deleted successfully" });
    } catch (error) {
      console.error("Error deleting hire developer page testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to delete testimonials" });
    }
  });

  // AI Routes for Hire Developer Pages
  app.post("/api/ai/generate-hire-developer-titles", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { developerType, market } = req.body;

      if (!developerType) {
        return res.status(400).json({
          success: false,
          message: "Developer type is required"
        });
      }

      console.log("Generating titles for:", { developerType, market });

      // Generate titles using AI
      const { generateHireDeveloperTitles } = await import("./ai-hiredev-generator");
      const titles = await generateHireDeveloperTitles(developerType, market || "USA & Canada");

      res.json({
        success: true,
        titles: titles || [],
        message: `Generated ${titles?.length || 0} title options`
      });

    } catch (error: any) {
      console.error("Title generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate titles"
      });
    }
  });

  // Generate dynamic hire tech content (technology stack and testimonials)
  app.post("/api/ai/generate-hire-tech-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { technology } = req.body;

      if (!technology) {
        return res.status(400).json({
          success: false,
          message: "Technology parameter is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const content = await generateHireTechContent(technology);

      res.json({
        success: true,
        content,
        message: `Generated technology stack and testimonials for ${technology} developers`
      });
    } catch (error) {
      console.error("Error generating hire tech content:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: "Failed to generate hire tech content",
        error: errorMessage
      });
    }
  });

  // Admin endpoint to regenerate all hire page testimonials with proper gender names
  app.post("/api/admin/regenerate-hire-testimonials", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      await storage.regenerateAllHirePageTestimonials();
      res.json({
        success: true,
        message: "All hire page testimonials have been regenerated with clearly gendered names"
      });
    } catch (error) {
      console.error("Error regenerating hire testimonials:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: "Failed to regenerate testimonials",
        error: errorMessage
      });
    }
  });

  // Test OpenAI API endpoint
  app.post("/api/test-openai", async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateChatCompletion } = await import("./openai-client");

      const response = await generateChatCompletion([
        { role: "user", content: "Say hello" }
      ], {
        max_tokens: 10
      });

      res.json({
        success: true,
        message: "AI API is working",
        response: response.choices[0].message.content
      });
    } catch (error) {
      console.error("OpenAI test error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: "OpenAI API test failed",
        error: errorMessage
      });
    }
  });

  // AI Content Generation for Hire Developer Pages - Following SEO Content Structure Guideline
  app.post("/api/ai/generate-hire-developer-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { title, primaryKeyword, secondaryKeywords, developerType, location, primarySkills, experienceLevel, projectTypes, companySize, budget, timeline, referenceContent } = req.body;

      // Accept either title or developerType for backward compatibility
      const devType = developerType || (title ? title.replace('Hire ', '').replace(' Developers', '').replace(' Developer', '') : '');

      if (!devType && !title) {
        return res.status(400).json({
          success: false,
          message: "Title or developer type is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      // Resolve region with priority order
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion((req.body as any).region || location);

      const { generateHireDeveloperContent } = await import("./ai-hiredev-generator");

      const request = {
        developerType: devType,
        location: resolvedRegion,
        primarySkills: primarySkills || primaryKeyword || '',
        experienceLevel: experienceLevel || 'Senior',
        projectTypes: projectTypes || 'Custom Development',
        companySize: companySize || 'All Sizes',
        budget,
        timeline,
        referenceContent,
        metrics: {
          projects: '100+',
          years: '10+',
          revenue: '$50M+',
          clients: '500+'
        },
        trustBadges: ['ISO Certified', 'SOC2 Compliant', 'Award-winning Team', 'Top Tech Company 2024']
      };

      const content = await generateHireDeveloperContent(request);

      // Debug logging to verify content generation
      console.log("Full generated content:", JSON.stringify(content, null, 2));

      // Extract technologies from technologyStack and convert to comma-separated string for aiTechnologies
      let aiTechnologies = '';
      if (content.technologyStack && content.technologyStack.categories) {
        const allTechnologies = content.technologyStack.categories
          .flatMap(category => category.technologies)
          .filter(tech => tech && tech.trim() !== '');
        aiTechnologies = allTechnologies.join(', ');
      }

      console.log("Extracted aiTechnologies:", aiTechnologies);

      // Ensure ALL required fields are properly mapped for form population
      res.json({
        success: true,
        title: content.title,
        slug: content.slug,
        heroSubtitle: content.heroSubtitle,
        heroDescription: content.heroDescription,
        whyHireTitle: content.whyHireTitle,
        whyHireDescription: content.whyHireDescription,
        whyHirePoints: content.whyHirePoints,
        servicesTitle: content.servicesTitle,
        servicesDescription: content.servicesDescription,
        servicesOffered: content.servicesOffered,
        technologyStack: content.technologyStack,
        aiTechnologies: aiTechnologies, // Add the extracted technologies here
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
        primaryKeyword: content.primaryKeyword,
        secondaryKeywords: content.secondaryKeywords,
        developerType: content.developerType,
        location: content.location
      });
    } catch (error) {
      console.error("Error generating hire developer content:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate content"
      });
    }
  });

  // Comprehensive AI Content Generation for Hire Developer Pages
  app.post("/api/ai/generate-comprehensive-hire-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      // Resolve region with priority order
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion((req.body as any).region || req.body.location);
      
      const { developerType, companySectors = ["startups", "enterprises"] } = req.body;

      if (!developerType) {
        return res.status(400).json({
          success: false,
          message: "Developer type is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateHireDeveloperContent } = await import("./ai-hire-content-generator");

      const content = await generateHireDeveloperContent({
        developerType,
        location: resolvedRegion,
        companySectors
      });

      // Also generate additional testimonials for immediate use
      const { generateTestimonials } = await import("./ai-hire-content-generator");
      const additionalTestimonials = await generateTestimonials(developerType, 3);

      res.json({
        success: true,
        content: {
          ...content,
          additionalTestimonials: additionalTestimonials
        }
      });
    } catch (error) {
      console.error("Error generating comprehensive hire developer content:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: "Failed to generate content",
        error: errorMessage
      });
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Message is required and must be a string"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateChatResponse } = await import("./ai-chatbot");

      const reply = await generateChatResponse(message);

      res.json({ reply });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate chat response"
      });
    }
  });

  // List stored images endpoint (for admin purposes)
  app.get("/api/stored-images", async (req, res) => {
    try {
      const { listStoredImages } = await import("./image-storage");

      const images = await listStoredImages();

      res.json({
        success: true,
        images
      });
    } catch (error) {
      console.error("Error listing stored images:", error);
      res.status(500).json({
        success: false,
        message: "Failed to list stored images"
      });
    }
  });

  // Delete stored image endpoint (for admin purposes)
  app.delete("/api/stored-images/:filename", async (req, res) => {
    try {
      const { filename } = req.params;

      const { deleteStoredImage } = await import("./image-storage");

      const success = await deleteStoredImage(filename);

      if (success) {
        res.json({
          success: true,
          message: "Image deleted successfully"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Image not found"
        });
      }
    } catch (error) {
      console.error("Error deleting stored image:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete stored image"
      });
    }
  });

  // ===== INDUSTRY AI CONTENT GENERATION ROUTES =====

  // Generate industry page titles
  app.post("/api/ai/generate-industry-titles", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { industryType, market } = req.body;

      if (!industryType) {
        return res.status(400).json({
          success: false,
          message: "Industry type is required"
        });
      }

      console.log("Generating industry titles for:", { industryType, market });

      // Generate titles using AI
      const { generateIndustryTitles } = await import("./ai-industry-generator");
      const titles = await generateIndustryTitles(industryType, market || "Global");

      res.json({
        success: true,
        titles: titles || [],
        message: `Generated ${titles?.length || 0} title options`
      });

    } catch (error: any) {
      console.error("Industry title generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate industry titles"
      });
    }
  });

  // Generate industry tech content (technology stack and testimonials)
  app.post("/api/ai/generate-industry-tech-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { industryType } = req.body;

      if (!industryType) {
        return res.status(400).json({
          success: false,
          message: "Industry type parameter is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateIndustryTechContent } = await import("./ai-industry-generator");
      const content = await generateIndustryTechContent(industryType);

      res.json({
        success: true,
        content,
        message: `Generated technology stack and testimonials for ${industryType} industry`
      });
    } catch (error) {
      console.error("Error generating industry tech content:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: "Failed to generate industry tech content",
        error: errorMessage
      });
    }
  });

  // Generate comprehensive industry page content
  app.post("/api/ai/generate-industry-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const {
        title,
        industryType,
        primaryFocus,
        geographicFocus,
        companySize,
        challenges,
        solutions,
        targetAudience,
        businessModel
      } = req.body;

      // Accept either title or industryType
      const industry = industryType || (title ? title.replace(' Solutions', '').replace(' Services', '') : '');

      if (!industry && !title) {
        return res.status(400).json({
          success: false,
          message: "Title or industry type is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateIndustryContent } = await import("./ai-industry-generator");

      const request = {
        industryType: industry,
        primaryFocus: primaryFocus || 'Digital Solutions',
        geographicFocus: geographicFocus || 'Global',
        companySize: companySize || 'All Sizes',
        challenges: challenges || 'Digital transformation, efficiency, competition',
        solutions: solutions || 'Technology solutions, process optimization, digital innovation',
        targetAudience: targetAudience || 'Business leaders, IT decision makers',
        businessModel: businessModel || 'B2B services and solutions'
      };

      const content = await generateIndustryContent(request);

      // Debug logging to verify content generation
      console.log("Full generated industry content:", JSON.stringify(content, null, 2));

      res.json({
        success: true,
        content,
        message: `Generated comprehensive content for ${industry} industry`
      });
    } catch (error) {
      console.error("Error generating industry content:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate industry content"
      });
    }
  });

  // Generate industry keywords
  app.post("/api/ai/generate-industry-keywords", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateIndustryKeywords } = await import("./ai-industry-generator");
      const { resolveRegion } = await import("./region-resolver");
      const region = await resolveRegion((req.body as any).region);
      const keywords = await generateIndustryKeywords(title, region);

      // Format response to match form expectations
      const primaryKeyword = keywords[0] || title.toLowerCase();
      const secondaryKeywords = keywords.slice(1).join(', ');

      res.json({
        success: true,
        primaryKeyword,
        secondaryKeywords,
        keywords, // Keep original for backward compatibility
        message: `Generated ${keywords.length} SEO keywords`
      });
    } catch (error) {
      console.error("Error generating industry keywords:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate industry keywords"
      });
    }
  });

  // Generate comprehensive industry content
  app.post("/api/ai/generate-industry-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { title, referenceContent, industryType } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      console.log("Generating comprehensive industry content for:", { title, industryType });

      // Generate content using AI
      const { generateIndustryContent } = await import("./ai-industry-generator");
      const contentRequest = {
        industryType: industryType || title,
        primaryFocus: "Digital Solutions",
        geographicFocus: "Global",
        companySize: "All Sizes",
        challenges: "Digital transformation, efficiency, competition",
        solutions: "Technology solutions, process optimization, digital innovation",
        targetAudience: "Business leaders, IT decision makers",
        businessModel: "B2B services and solutions"
      };

      const content = await generateIndustryContent(contentRequest);

      // Map the AI response to form-compatible format
      const response = {
        success: true,
        // Hero Section
        heroHeadline: content.heroSection.title,
        heroSubheading: content.heroSection.heroSubtitle,
        heroCtaText: content.heroSection.ctaPrimary,

        // Overview
        overviewContent: content.overview.introduction,
        industryStatistics: content.overview.industryMetrics,

        // Industries Detail
        industries: content.industriesDetail.industries,

        // Technology Stack
        keyTechnologies: content.technologyStack.categories.find(cat => cat.name.toLowerCase().includes('frontend') || cat.name.toLowerCase().includes('technology'))?.technologies || [],
        platforms: content.technologyStack.categories.find(cat => cat.name.toLowerCase().includes('backend') || cat.name.toLowerCase().includes('cloud'))?.technologies || [],
        tools: content.technologyStack.categories.find(cat => cat.name.toLowerCase().includes('integration') || cat.name.toLowerCase().includes('devops'))?.technologies || [],

        // Process
        engagementSteps: content.engagementProcess.steps,

        // Why Choose Us
        uniqueValuePropositionsPoints: content.whyChooseUs.benefits,

        // Testimonials and FAQs
        testimonialsEntries: content.testimonials,
        faqsItems: content.faqs,

        // CTA
        ctaHeadline: `Transform Your ${industryType || 'Business'} with Our Solutions`,
        ctaSubtext: "Ready to revolutionize your operations? Let's discuss your digital transformation goals.",

        // SEO
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
        primaryKeyword: content.focusKeyword,
        secondaryKeywords: content.keywords,

        message: "Comprehensive industry content generated successfully"
      };

      res.json(response);

    } catch (error: any) {
      console.error("Industry content generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate industry content"
      });
    }
  });

  // Generate industry meta data (SEO-focused)
  app.post("/api/ai/generate-industry-meta", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { title, primaryKeyword, industryType } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      console.log("Generating industry meta data for:", { title, primaryKeyword, industryType });

      // Use unified AI client to generate meta data
      const { generateChatCompletion } = await import("./openai-client");

      const metaResponse = await generateChatCompletion([
        {
          role: "system",
          content: `You are an expert SEO meta data generator specializing in industry pages.

Generate compelling, SEO-optimized meta data for industry landing pages.

Requirements:
1. Meta Title: 50-60 characters, include primary keyword if provided
2. Meta Description: 150-160 characters, compelling with clear benefits
3. Meta Keywords: 15-20 relevant keywords, comma-separated

The content should:
- Be industry-specific and professional
- Include action-oriented language
- Highlight key benefits and solutions
- Target business decision makers
- Include location if relevant (USA, Global)

Return as JSON:
{
  "metaTitle": "SEO-optimized title",
  "metaDescription": "Compelling description with benefits",
  "metaKeywords": "keyword1, keyword2, keyword3, ..."
}`
        },
        {
          role: "user",
          content: `Generate SEO meta data for this industry page:
            
Title: ${title}
Primary Keyword: ${primaryKeyword || 'not specified'}
Industry Type: ${industryType || title}

Focus on creating compelling meta data that will attract business leaders and decision makers looking for industry solutions.`
        }
      ], {
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 500
      });

      const metaData = JSON.parse(metaResponse.choices[0].message.content!);

      res.json({
        success: true,
        metaTitle: metaData.metaTitle,
        metaDescription: metaData.metaDescription,
        metaKeywords: metaData.metaKeywords,
        message: "Meta data generated successfully"
      });
    } catch (error: any) {
      console.error("Error generating industry meta data:", error);
      const fallbackTitle = req.body.title || "Industry";
      res.status(500).json({
        success: false,
        message: "Failed to generate meta data",
        fallback: {
          metaTitle: `${fallbackTitle} - Professional Industry Solutions`,
          metaDescription: `Transform your ${fallbackTitle.toLowerCase()} operations with our comprehensive digital solutions. Expert consulting, proven results, and cutting-edge technology.`,
          metaKeywords: `${fallbackTitle.toLowerCase()}, industry solutions, digital transformation, business consulting, technology services`
        }
      });
    }
  });

  // Generate background image for industry pages using AI
  app.post("/api/ai/industry-image", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    console.log("🎨 AI Image generation request received");

    try {
      const { title, style = "professional", aspect = "16:9" } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      console.log("Starting AI image generation for:", title);

      // Build a professional prompt for industry background images
      const prompt = `Create a professional, modern background image for a ${title} industry landing page. 
      Style: ${style}, clean corporate design, subtle technology elements, gradient overlay suitable for text.
      Industry theme: ${title}. Professional business aesthetic, high-quality, modern design.
      Aspect ratio: ${aspect}. No text overlays, suitable as a hero background image.
      Colors: professional blue, gray, and white tones with subtle industry-relevant accents.
      Quality: premium business website background, clean and sophisticated.`;

      // Generate image using OpenAI DALL-E 3
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: aspect === "16:9" ? "1792x1024" : "1024x1024",
        quality: "standard",
        response_format: "url" // Get URL instead of base64 for better performance
      });

      if (!imageResponse.data || imageResponse.data.length === 0) {
        throw new Error("No image data received from OpenAI");
      }

      const imageUrl = imageResponse.data[0].url;

      if (!imageUrl) {
        throw new Error("No image URL received from OpenAI");
      }

      // Convert URL to base64 for frontend preview
      const imageDataResponse = await fetch(imageUrl);
      const imageBuffer = await imageDataResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');

      res.json({
        success: true,
        imageUrl: imageUrl,
        imageDataBase64: imageBase64,
        prompt: prompt,
        size: aspect === "16:9" ? "1792x1024" : "1024x1024",
        message: "Background image generated successfully"
      });

    } catch (error: any) {
      console.error("Error generating background image:", error.message);
      console.error("Full error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate background image",
        details: error.response?.data || error.message
      });
    }
  });

  // Store industry background image using existing image storage system
  app.post("/api/images/store-industry-background", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { imageUrl, filename } = req.body;

      if (!imageUrl || !filename) {
        return res.status(400).json({
          success: false,
          message: "Image URL and filename are required"
        });
      }

      console.log("Storing industry background image:", filename);

      // Use the existing image storage function from Blog CMS
      const { storeImagePermanently } = await import("./image-storage");

      try {
        // Store the image permanently using the existing blog CMS function
        const result = await storeImagePermanently(imageUrl, 'industry-bg-', 'industry-backgrounds');

        res.json({
          success: true,
          url: result.permanentUrl,
          key: result.s3Key,
          filename: result.filename,
          message: "Image stored successfully using existing storage system"
        });
      } catch (storageError: any) {
        console.warn("Storage to permanent location failed, using temporary URL:", storageError.message);

        // Fallback: Return the original URL with success status
        // This allows the UI to work even if S3 storage fails
        res.json({
          success: true,
          url: imageUrl, // Use original temporary URL
          key: `temp-${Date.now()}-${filename}`,
          filename: filename,
          temporary: true,
          message: "Image temporarily stored (permanent storage unavailable)",
          warning: "Using temporary storage - image may expire"
        });
      }

    } catch (error: any) {
      console.error("Error storing industry background:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to store industry background image"
      });
    }
  });

  // ======================================
  // INDUSTRY PAGES API ROUTES
  // ======================================

  // Get all industry pages
  app.get("/api/industry-pages", async (req, res) => {
    try {
      const pages = await storage.getAllIndustryPages();
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching industry pages:", error);
      // Return empty array as fallback to prevent UI errors
      res.json([]);
    }
  });

  // Get published industry pages (for public display)
  app.get("/api/industry-pages/published", async (req, res) => {
    try {
      const pages = await storage.getPublishedIndustryPages();
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching published industry pages:", error);
      res.json([]);
    }
  });

  // Get single industry page by ID
  app.get("/api/industry-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getIndustryPage(id);
      if (!page) {
        return res.status(404).json({ success: false, message: "Industry page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching industry page:", error);
      res.status(500).json({ success: false, message: "Failed to fetch industry page" });
    }
  });

  // Get industry page by slug (for public display)
  app.get("/api/industry-pages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getIndustryPageBySlug(slug);
      if (!page) {
        return res.status(404).json({ success: false, message: "Industry page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching industry page by slug:", error);
      res.status(500).json({ success: false, message: "Failed to fetch industry page" });
    }
  });

  // Search industry pages
  app.get("/api/industry-pages/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const pages = await storage.searchIndustryPages(query);
      res.json(pages || []);
    } catch (error) {
      console.error("Error searching industry pages:", error);
      res.json([]);
    }
  });

  // Create industry page
  app.post("/api/industry-pages", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const pageData = insertIndustryPageSchema.parse(req.body) as any;

      // Generate unique slug if not provided or if provided slug is empty
      if (!pageData.slug || pageData.slug.trim() === '') {
        const baseSlug = generateSlug(pageData.title);
        pageData.slug = await ensureUniqueIndustrySlug(baseSlug);
      } else {
        // Normalize provided slug and ensure uniqueness
        const normalizedSlug = generateSlug(pageData.slug);
        pageData.slug = await ensureUniqueIndustrySlug(normalizedSlug);
      }

      console.log("Creating industry page with slug:", pageData.slug);

      const page = await storage.createIndustryPage(pageData);

      // Update sitemap when industry page is created
      sitemapGenerator.updateSitemapAsync();

      res.json({ success: true, page });
    } catch (error) {
      console.error("Error creating industry page:", error);
      if (error && typeof error === 'object' && 'errors' in error) {
        console.error("Validation errors:", (error as any).errors);
        return res.status(400).json({ success: false, message: "Validation failed", errors: (error as any).errors });
      }
      res.status(500).json({ success: false, message: "Failed to create industry page" });
    }
  });

  // Update industry page
  app.put("/api/industry-pages/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = req.body;

      // Check if page exists first
      const existingPage = await storage.getIndustryPage(id);
      if (!existingPage) {
        return res.status(404).json({ success: false, message: "Industry page not found" });
      }

      // Parse partial data (don't require all fields for updates)
      const parsedData = insertIndustryPageSchema.partial().parse(pageData) as any;

      // Handle slug generation/updating
      if (parsedData.title && (!parsedData.slug || parsedData.slug.trim() === '')) {
        // Generate new slug from title if no slug provided
        const baseSlug = generateSlug(parsedData.title);
        parsedData.slug = await ensureUniqueIndustrySlug(baseSlug, id);
      } else if (parsedData.slug && parsedData.slug !== existingPage.slug) {
        // Normalize and ensure uniqueness if slug is being changed
        const normalizedSlug = generateSlug(parsedData.slug);
        parsedData.slug = await ensureUniqueIndustrySlug(normalizedSlug, id);
      } else if (parsedData.title && parsedData.title !== existingPage.title && !parsedData.slug) {
        // Auto-update slug if title changed but no explicit slug provided
        const baseSlug = generateSlug(parsedData.title);
        parsedData.slug = await ensureUniqueIndustrySlug(baseSlug, id);
      }

      if (parsedData.slug) {
        console.log("Updating industry page slug to:", parsedData.slug);
      }

      // If status is being changed to published, set publishedAt
      if (parsedData.status === 'published' && existingPage.status !== 'published') {
        parsedData.publishedAt = new Date();
      }

      const page = await storage.updateIndustryPage(id, parsedData);

      // Update sitemap when industry page is updated
      sitemapGenerator.updateSitemapAsync();

      res.json({ success: true, page });
    } catch (error) {
      console.error("Error updating industry page:", error);
      if (error && typeof error === 'object' && 'errors' in error) {
        console.error("Validation errors:", (error as any).errors);
        return res.status(400).json({ success: false, message: "Validation failed", errors: (error as any).errors });
      }
      res.status(500).json({ success: false, message: "Failed to update industry page" });
    }
  });

  // Delete industry page
  app.delete("/api/industry-pages/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteIndustryPage(id);

      // Update sitemap when industry page is deleted - use immediate generation to ensure deletion is reflected
      setTimeout(async () => {
        await sitemapGenerator.generateSitemap();
      }, 100); // Small delay to ensure database transaction is committed

      res.json({ success: true, message: "Industry page deleted successfully" });
    } catch (error) {
      console.error("Error deleting industry page:", error);
      res.status(500).json({ success: false, message: "Failed to delete industry page" });
    }
  });

  // ======================================
  // CASE STUDY PAGES API ROUTES  
  // ======================================

  // Get all case study pages
  app.get("/api/case-study-pages", async (req, res) => {
    try {
      const pages = await storage.getAllCaseStudyPages();
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching case study pages:", error);
      res.json([]);
    }
  });

  // Get published case study pages (for public display)
  app.get("/api/case-study-pages/published", async (req, res) => {
    try {
      const pages = await storage.getPublishedCaseStudyPages();
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching published case study pages:", error);
      res.json([]);
    }
  });

  // Get case study pages by multiple categories (for hire developer form) - MUST be before :id route
  app.get("/api/case-study-pages/by-categories", async (req, res) => {
    try {
      const categories = req.query.categories;
      console.log("Fetching case studies for categories:", categories);

      if (!categories) {
        return res.json([]);
      }

      // Handle both single string and array of categories
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      console.log("Category array:", categoryArray);

      // Fetch pages for all categories and combine them
      const allPages = [];
      for (const categoryName of categoryArray) {
        console.log("Fetching pages for category:", categoryName);
        try {
          const pages = await storage.getCaseStudyPagesByCategory(categoryName as string);
          console.log(`Found ${pages?.length || 0} pages for category ${categoryName}`);
          if (pages) {
            allPages.push(...pages);
          }
        } catch (categoryError) {
          console.error(`Error fetching pages for category ${categoryName}:`, categoryError);
        }
      }

      // Remove duplicates based on ID and filter for published only
      const uniquePages = allPages.filter((page, index, self) =>
        self.findIndex(p => p.id === page.id) === index && page.status === 'published'
      );

      console.log(`Returning ${uniquePages.length} unique published pages`);
      res.json(uniquePages);
    } catch (error) {
      console.error("Error fetching case study pages by categories:", error);
      res.status(500).json({ success: false, message: "Failed to fetch case study pages" });
    }
  });

  // Get case study pages by category name (for service page display)
  app.get("/api/case-study-pages/category/:categoryName", async (req, res) => {
    try {
      const categoryName = req.params.categoryName;
      const pages = await storage.getCaseStudyPagesByCategory(categoryName);
      res.json(pages || []);
    } catch (error) {
      console.error("Error fetching case study pages by category:", error);
      res.json([]);
    }
  });

  // Get single case study page by ID
  app.get("/api/case-study-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getCaseStudyPage(id);
      if (!page) {
        return res.status(404).json({ success: false, message: "Case study page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching case study page:", error);
      res.status(500).json({ success: false, message: "Failed to fetch case study page" });
    }
  });

  // Get case study page by slug (for public display)
  app.get("/api/case-study-pages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getCaseStudyPageBySlug(slug);
      if (!page) {
        return res.status(404).json({ success: false, message: "Case study page not found" });
      }

      // Only return published pages for public access
      if (page.status !== 'published') {
        return res.status(404).json({ success: false, message: "Case study page not found" });
      }

      res.json(page);
    } catch (error) {
      console.error("Error fetching case study page by slug:", error);
      res.status(500).json({ success: false, message: "Failed to fetch case study page" });
    }
  });

  // Get all published case study pages for public listing
  app.get("/api/case-study-pages/public", async (req, res) => {
    try {
      const pages = await storage.getPublishedCaseStudyPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching published case study pages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch case study pages" });
    }
  });

  // Create new case study page
  app.post("/api/case-study-pages", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const pageData = insertCaseStudyPageSchema.parse(req.body);

      // Generate unique slug if not provided or if provided slug is empty
      if (!pageData.slug || pageData.slug.trim() === '') {
        if (!pageData.title) {
          return res.status(400).json({ success: false, message: "Title is required to generate slug" });
        }
        const baseSlug = generateSlug(pageData.title);
        pageData.slug = await ensureUniqueCaseStudyPageSlug(baseSlug);
      } else {
        // Normalize provided slug and ensure uniqueness
        const normalizedSlug = generateSlug(pageData.slug);
        pageData.slug = await ensureUniqueCaseStudyPageSlug(normalizedSlug);
      }

      const page = await storage.createCaseStudyPage(pageData);

      // Automatically sync links from content
      // Combine multiple content fields for link syncing
      const contentFields = [
        (page as any).problemStatement,
        (page as any).solutionStrategy,
        (page as any).conclusion,
        (page as any).businessOutcomes,
        (page as any).clientTestimonial
      ].filter(Boolean).join('\n\n');

      if (contentFields || (page as any).content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'case-study',
            page.id,
            contentFields || (page as any).content || '',
            page.title,
            'content',
            'markdown'
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for case study ${page.id}:`, error);
        }
      }

      // Update sitemap when published case study is created
      if (page.status === 'published') {
        sitemapGenerator.updateSitemapAsync();
      }

      res.json({ success: true, page });
    } catch (error) {
      console.error("Error creating case study page:", error);
      res.status(500).json({ success: false, message: "Failed to create case study page" });
    }
  });

  // Update case study page
  app.put("/api/case-study-pages/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = insertCaseStudyPageSchema.partial().parse(req.body);

      // Handle slug generation/updating
      const existingPage = await storage.getCaseStudyPage(id);
      if (existingPage) {
        if (pageData.title && (!pageData.slug || pageData.slug.trim() === '')) {
          // Generate new slug from title if no slug provided
          const baseSlug = generateSlug(pageData.title);
          pageData.slug = await ensureUniqueCaseStudyPageSlug(baseSlug, id);
        } else if (pageData.slug && pageData.slug !== existingPage.slug) {
          // Normalize and ensure uniqueness if slug is being changed
          const normalizedSlug = generateSlug(pageData.slug);
          pageData.slug = await ensureUniqueCaseStudyPageSlug(normalizedSlug, id);
        } else if (pageData.title && pageData.title !== existingPage.title && !pageData.slug) {
          // Auto-update slug if title changed but no explicit slug provided
          const baseSlug = generateSlug(pageData.title);
          pageData.slug = await ensureUniqueCaseStudyPageSlug(baseSlug, id);
        }
      } else if (pageData.title && (!pageData.slug || pageData.slug.trim() === '')) {
        // If page doesn't exist yet but we have a title, generate slug
        const baseSlug = generateSlug(pageData.title);
        pageData.slug = await ensureUniqueCaseStudyPageSlug(baseSlug, id);
      }

      const page = await storage.updateCaseStudyPage(id, pageData);

      // Automatically sync links from content
      // Combine multiple content fields for link syncing
      const contentFields = [
        (page as any).problemStatement,
        (page as any).solutionStrategy,
        (page as any).conclusion,
        (page as any).businessOutcomes,
        (page as any).clientTestimonial
      ].filter(Boolean).join('\n\n');

      if (contentFields || (page as any).content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'case-study',
            page.id,
            contentFields || (page as any).content || '',
            page.title,
            'content',
            'markdown'
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for case study ${page.id}:`, error);
        }
      }

      // Update sitemap when published case study is updated
      if (page.status === 'published') {
        sitemapGenerator.updateSitemapAsync();
      }

      res.json({ success: true, page });
    } catch (error) {
      console.error("Error updating case study page:", error);
      res.status(500).json({ success: false, message: "Failed to update case study page" });
    }
  });

  // Delete case study page
  app.delete("/api/case-study-pages/:id", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteCaseStudyPage(id);

      // Update sitemap when case study page is deleted - use immediate generation to ensure deletion is reflected
      setTimeout(async () => {
        await sitemapGenerator.generateSitemap();
      }, 100); // Small delay to ensure database transaction is committed

      res.json({ success: true, message: "Case study page deleted successfully" });
    } catch (error) {
      console.error("Error deleting case study page:", error);
      res.status(500).json({ success: false, message: "Failed to delete case study page" });
    }
  });

  // Search case study pages
  app.get("/api/case-study-pages/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const pages = await storage.searchCaseStudyPages(query);
      res.json(pages || []);
    } catch (error) {
      console.error("Error searching case study pages:", error);
      res.json([]);
    }
  });

  // AI Routes for Case Study Pages
  app.post("/api/ai/generate-case-study-content", authenticateToken, authorizeRole(['super_admin', 'user_admin', 'content_admin']), async (req, res) => {
    try {
      const { title, category, referenceContent } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required"
        });
      }

      console.log("Generating case study content for:", { title, category });

      // Validate region
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion((req.body as any).region);
      
      if (!resolvedRegion || resolvedRegion.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Region is required for case study content generation. Please set a target region in the form."
        });
      }

      // Use inline case study structure instead of file loading to avoid module issues
      const caseStudyStructure = {
        "title": "string",
        "client": {
          "name": "string",
          "industry": "string",
          "location": "string"
        },
        "project_overview": {
          "duration": "string",
          "problem_statement": "string",
          "objectives": ["string"]
        },
        "challenges": ["string"],
        "solution": {
          "strategy": "string",
          "features_and_capabilities": ["string"],
          "user_experience_design": "string",
          "technologies_used": ["string"]
        },
        "implementation": {
          "phases": [
            {
              "phase_name": "string",
              "activities": ["string"],
              "duration": "string"
            }
          ]
        },
        "results_and_impact": {
          "quantitative_metrics": {
            "performance_improvement": "string",
            "cost_reduction": "string",
            "user_satisfaction": "string"
          },
          "qualitative_benefits": ["string"],
          "business_outcomes": "string"
        },
        "client_testimonial": "string",
        "future_scope_and_enhancements": "string",
        "conclusion": "string"
      };

      const regions = resolvedRegion.split(',').map(r => r.trim()).filter(Boolean);
      const regionList = regions.join(", ");
      
      let prompt = `Generate a comprehensive case study following this exact JSON structure:
      ${JSON.stringify(caseStudyStructure, null, 2)}
      
      CRITICAL REGION REQUIREMENTS:
      - Target regions: ${regionList}
      - Client location in case study should be from: ${regionList} ONLY
      - DO NOT include USA, Canada, or any other regions unless they are explicitly in the list above
      - If the region is "India, North-East, Australia", use locations ONLY from India, North-East, and Australia
      - DO NOT add "USA" or "Canada" to any location references unless they are in the provided region list
      
      Requirements:
      - Title: ${title}
      - Category: ${category}
      - Target Regions: ${regionList}
      - For client.name field: MUST use a random human name (e.g., "Michael Johnson", "Sarah Chen", "David Rodriguez") - NEVER use company names
      - For client.location field: Use ONLY locations from ${regionList} (e.g., cities in ${regions[0] || regions[0]}, ${regions[1] || regions[0]})
      - Include realistic industry and location information from ${regionList} ONLY
      - Include specific project challenges and objectives
      - Detail the solution strategy with features and technologies
      - Provide quantitative metrics (percentages, numbers, improvements)
      - Include implementation phases with activities
      - Add authentic client testimonial
      - Focus on business outcomes and future enhancements
      
      CRITICAL REQUIREMENT FOR PROBLEM_STATEMENT:
      - The "problem_statement" field must be EXACTLY 38-40 words. Count every single word carefully.
      - This is mandatory - do not exceed or fall short of this word count.
      - Make it clear, concise, and professional while staying within the exact word limit.
      
      IMPORTANT: The client.name field should always be a human name for privacy protection, not a company name.
      Make it professional, detailed, and realistic for the ${category} industry in ${regionList} markets.
      Use specific technologies relevant to ${category}.
      Include real business metrics and measurable outcomes.`;

      if (referenceContent) {
        prompt += `\n\nReference Content to incorporate:\n${referenceContent}\n\nUse this reference content to guide the case study details and ensure accuracy.`;
      }

      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const { generateChatCompletion } = await import("./openai-client");
      
      const completion = await generateChatCompletion([
        {
          role: "system",
          content: `You are an expert case study writer creating comprehensive, structured content for technology companies targeting ${regionList} markets.

CRITICAL REGION COMPLIANCE RULES:
1. ONLY use regions from the provided list: ${regionList}
2. NEVER include USA, Canada, or any other regions unless they are explicitly in the provided list
3. If the region is "India, Australia", generate content ONLY for India and Australia
4. Client location must be from: ${regionList} ONLY
5. All location references must use ONLY: ${regions.map(r => r.trim()).join(', ')}
6. Generate detailed JSON content following the exact structure provided, with realistic client information, specific metrics, and professional business outcomes relevant to ${regionList} markets.`
        },
        {
          role: "user",
          content: prompt
        }
      ], {
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0]?.message?.content;

      if (!generatedContent) {
        throw new Error('No content generated');
      }

      // Parse the JSON content
      let structuredContent;
      try {
        // Clean up the response to extract JSON
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('Error parsing generated JSON:', parseError);
        // Fallback to basic structure
        const regions = resolvedRegion.split(',').map(r => r.trim()).filter(Boolean);
        const defaultLocation = regions[0] || "Global";
        
        structuredContent = {
          title: title,
          client: {
            name: "Michael Thompson",
            industry: category,
            location: defaultLocation
          },
          project_overview: {
            duration: "6 months",
            problem_statement: "The client faced significant challenges with their outdated legacy systems that were hindering business growth, operational efficiency, and customer satisfaction. They required a comprehensive modern technology solution to streamline processes, reduce operational costs, and enhance overall user experience.",
            objectives: ["Improve efficiency", "Reduce costs", "enhance user experience"]
          },
          challenges: ["Legacy system limitations", "Scalability issues", "User adoption"],
          solution: {
            strategy: "Comprehensive technology implementation",
            features_and_capabilities: ["Feature 1", "Feature 2", "Feature 3"],
            user_experience_design: "Modern, intuitive interface design",
            technologies_used: ["React", "Node.js", "MongoDB"]
          },
          implementation_process: [
            {
              phase: "Discovery & Planning",
              activities: ["Requirements gathering", "Architecture design"]
            }
          ],
          results_and_impact: {
            quantitative_metrics: {
              user_growth: "200%",
              engagement_rate: "85%",
              retention: "90%"
            },
            qualitative_benefits: ["Improved user satisfaction", "Better performance"],
            business_outcomes: "Significant improvement in business operations and user engagement."
          },
          client_testimonial: "The solution exceeded our expectations and delivered remarkable results.",
          future_scope_enhancements: "Plan to expand features and integrate additional technologies.",
          conclusion: "Successful project demonstrating the power of modern technology solutions."
        };
      }

      // Return both JSON and formatted content for better display
      const formattedContent = JSON.stringify(structuredContent, null, 2);

      // Generate SEO metadata
      const metaTitle = `${title} | Case Studies | GreenAppleX`;
      const metaDescription = structuredContent.project_overview?.problem_statement?.substring(0, 160) || `Explore our ${category.toLowerCase()} case studies and success stories. See how GreenAppleX delivers exceptional results for clients.`;
      // Generate region-aware keywords for case study
      const { generateSeoKeywords } = await import("./ai-service-content-generator");
      let regionAwareKeywords: { primaryKeyword: string; secondaryKeywords: string[] } | null = null;
      
      try {
        const caseStudyDescription = structuredContent.project_overview?.problem_statement || 
                                   structuredContent.conclusion || 
                                   `${title} case study`;
        regionAwareKeywords = await generateSeoKeywords(title, caseStudyDescription, resolvedRegion);
      } catch (error) {
        console.error("Error generating region-aware keywords for case study:", error);
        // Fallback to simple keywords
      }
      
      // Use region-aware keywords if available, otherwise fallback
      const metaKeywords = regionAwareKeywords 
        ? `${regionAwareKeywords.primaryKeyword}, ${regionAwareKeywords.secondaryKeywords.join(', ')}`
        : `${category.toLowerCase()}, case studies, success stories, client projects, ${structuredContent.client?.industry || 'technology solutions'}`.toLowerCase();

      res.json({
        success: true,
        content: {
          json: structuredContent,
          formatted: formattedContent
        },
        metaTitle,
        metaDescription,
        metaKeywords,
        message: "Case study content generated successfully"
      });

    } catch (error: any) {
      console.error("Case study content generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate case study content"
      });
    }
  });

  // Author management routes
  app.post("/api/authors", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const authorData = insertAuthorSchema.parse(req.body);
      const author = await storage.createAuthor(authorData);
      res.json({ success: true, author });
    } catch (error) {
      console.error("Error creating author:", error);
      res.status(500).json({ success: false, message: "Failed to create author" });
    }
  });

  app.get("/api/authors", async (req, res) => {
    try {
      const authors = await storage.getAllAuthors();
      res.json(authors);
    } catch (error) {
      console.error("Error fetching authors:", error);
      res.status(500).json({ success: false, message: "Failed to fetch authors" });
    }
  });

  app.get("/api/authors/:id", async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = process.env.MONGODB_URI ? idParam : parseInt(idParam);
      const author = await storage.getAuthor(id as any);

      if (!author) {
        return res.status(404).json({ success: false, message: "Author not found" });
      }

      res.json({ success: true, author });
    } catch (error) {
      console.error("Error fetching author:", error);
      res.status(500).json({ success: false, message: "Failed to fetch author" });
    }
  });

  app.put("/api/authors/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const authorData = insertAuthorSchema.partial().parse(req.body);
      const author = await storage.updateAuthor(id, authorData);
      res.json({ success: true, author });
    } catch (error) {
      console.error("Error updating author:", error);
      res.status(500).json({ success: false, message: "Failed to update author" });
    }
  });

  app.delete("/api/authors/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteAuthor(id);
      res.json({ success: true, message: "Author deleted successfully" });
    } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({ success: false, message: "Failed to delete author" });
    }
  });

  // Service Category management routes
  app.get("/api/service-categories", async (req, res) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/service-categories", authenticateToken, authorizeRole(["super_admin", "user_admin"]), async (req, res) => {
    try {
      const categoryData = insertServiceCategorySchema.parse(req.body);
      const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Generate AI description if not provided
      let description = categoryData.description;
      if (!description && process.env.OPENAI_API_KEY) {
        try {
          description = await generateCategoryDescription(categoryData.name);
        } catch (aiError) {
          console.log("AI description generation failed, using fallback");
          description = `Professional ${(categoryData as any).name?.toLowerCase() || 'services'} services and solutions for modern businesses.`;
        }
      }

      const category = await storage.createServiceCategory({ ...categoryData, slug, description });
      res.json({ success: true, category });
    } catch (error: any) {
      console.error("Error creating category:", error);
      res.status(400).json({ success: false, message: error.message || "Failed to create category" });
    }
  });

  app.put("/api/service-categories/:id", authenticateToken, authorizeRole(["super_admin", "user_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const categoryData = insertServiceCategorySchema.partial().parse(req.body) as any;
      if (categoryData.name) {
        categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const category = await storage.updateServiceCategory(id, categoryData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/service-categories/:id", authenticateToken, authorizeRole(["super_admin", "user_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteServiceCategory(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Case Study Category management routes
  app.get("/api/case-study-categories", async (req, res) => {
    try {
      const categories = await storage.getAllCaseStudyCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/case-study-categories", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const categoryData = insertCaseStudyCategorySchema.parse(req.body);
      const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Generate AI description if not provided
      let description = categoryData.description;
      if (!description && process.env.OPENAI_API_KEY) {
        try {
          description = await generateCategoryDescription(categoryData.name);
        } catch (aiError) {
          console.log("AI description generation failed, using fallback");
          description = `Professional ${categoryData.name.toLowerCase()} case studies showcasing successful project outcomes.`;
        }
      }

      const category = await storage.createCaseStudyCategory({
        ...(categoryData as any),
        slug,
        description: description || (categoryData as any).description
      });
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.put("/api/case-study-categories/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const categoryData = insertCaseStudyCategorySchema.partial().parse(req.body) as any;
      if (categoryData.name) {
        categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const category = await storage.updateCaseStudyCategory(id, categoryData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/case-study-categories/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteCaseStudyCategory(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Service Subcategory management routes
  app.get("/api/service-subcategories", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const subcategories = categoryId
        ? await storage.getServiceSubcategoriesByCategory(categoryId)
        : await storage.getAllServiceSubcategories();
      res.json(subcategories);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/service-subcategories", authenticateToken, authorizeRole(["super_admin", "user_admin"]), async (req, res) => {
    try {
      const subcategoryData = insertServiceSubcategorySchema.parse(req.body);
      const slug = subcategoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Generate AI description if not provided
      let description = subcategoryData.description;
      if (!description && process.env.OPENAI_API_KEY) {
        try {
          // Get category name for context
          let categoryName = "Technology";
          if (subcategoryData.categoryId != null) {
            const category = await storage.getServiceCategory(subcategoryData.categoryId);
            categoryName = category?.name || "Technology";
          }
          description = await generateSubcategoryDescription(subcategoryData.name, categoryName);
        } catch (aiError) {
          console.log("AI description generation failed, using fallback");
          description = `Specialized ${(subcategoryData as any).name?.toLowerCase() || 'services'} services and solutions.`;
        }
      }

      const subcategory = await storage.createServiceSubcategory({ ...(subcategoryData as any), slug, description });
      res.json({ success: true, subcategory });
    } catch (error: any) {
      console.error("Error creating subcategory:", error);
      res.status(400).json({ success: false, message: error.message || "Failed to create subcategory" });
    }
  });

  app.put("/api/service-subcategories/:id", authenticateToken, authorizeRole(["super_admin", "user_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const subcategoryData = insertServiceSubcategorySchema.partial().parse(req.body) as any;
      if (subcategoryData.name) {
        subcategoryData.slug = subcategoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const subcategory = await storage.updateServiceSubcategory(id, subcategoryData);
      res.json(subcategory);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/service-subcategories/:id", authenticateToken, authorizeRole(["super_admin", "user_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteServiceSubcategory(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Service Pages routes
  app.get("/api/service-pages", async (req, res) => {
    try {
      const subcategoryId = req.query.subcategoryId ? parseInt(req.query.subcategoryId as string) : undefined;
      const pages = subcategoryId
        ? await storage.getServicePagesBySubcategory(subcategoryId)
        : await storage.getAllServicePages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/service-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getServicePage(id);
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/service-pages", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const pageData = insertServicePageSchema.parse(req.body) as any;
      const slug = (pageData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const page = await storage.createServicePage({ ...pageData, slug });
      res.json(page);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.put("/api/service-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = insertServicePageSchema.partial().parse(req.body) as any;
      if (pageData.title) {
        pageData.slug = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const page = await storage.updateServicePage(id, pageData);
      res.json(page);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/service-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteServicePage(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // AI SEO Keywords Generation
  app.post("/api/ai/generate-seo-keywords", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const { title, category, subCategory } = z.object({
        title: z.string().min(1, "Title is required"),
        category: z.string().min(1, "Category is required"),
        subCategory: z.string().min(1, "Sub-category is required"),
      }).parse(req.body);

      // Resolve region with priority order
      const { resolveRegion } = await import("./region-resolver");
      const region = await resolveRegion((req.body as any).region);
      const regions = region.split(',').map(r => r.trim()).filter(Boolean);

      let keywords = "";

      // Try OpenAI first, fallback to predefined keywords if API fails
      try {
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key not configured");
        }

        const { generateChatCompletion } = await import("./openai-client");

        const prompt = `Generate SEO-optimized keywords for a technology service targeting ONLY ${region} markets.

CRITICAL REGION REQUIREMENTS - MUST FOLLOW STRICTLY:
1. ONLY use regions from this exact list: ${region}
2. NEVER include USA, Canada, or any other regions unless they are explicitly in the list above
3. If the region is "India, Australia", generate keywords ONLY for India and Australia
4. DO NOT add "USA" or "Canada" to any keywords
5. All location-based keywords must use ONLY: ${regions.map(r => r.trim()).join(', ')}

Title: ${title}
Category: ${category}
Sub-category: ${subCategory}

EXAMPLES FOR ${region}:
${regions.map(r => {
  const rLower = r.trim().toLowerCase();
  if (rLower.includes('india')) {
    return `- For India: "${title} services India", "${title} Mumbai", "${title} Delhi", "${title} Bangalore", "${title} development India", "best ${title} company India"`;
  } else if (rLower.includes('australia')) {
    return `- For Australia: "${title} services Australia", "${title} Sydney", "${title} Melbourne", "${title} Brisbane", "${title} development Australia", "top ${title} providers Australia"`;
  }
  return `- For ${r.trim()}: "${title} services ${r.trim()}", "${title} ${r.trim()}", "${title} development ${r.trim()}"`;
}).join('\n')}

Generate 18-20 highly targeted SEO keywords focusing on:
- Primary service keywords with high search volume for ${region} markets
- Location-based terms using ONLY ${regions.map(r => r.trim()).join(', ')} and their major cities
- Action-oriented keywords (hire, outsource, custom, professional, enterprise)
- Long-tail keywords for better conversion
- B2B focused terms (for startups, for enterprises, consulting, solutions)
- Industry-specific terminology relevant to ${region}
- Competitive advantage terms (affordable, top-rated, experienced, certified)

Target audience: Business decision makers in ${region} looking for technology services.

IMPORTANT: Return ONLY the keywords separated by commas. Each keyword should be relevant to ${region} markets. DO NOT include any keywords with USA or Canada unless they are in the region list.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `You are an SEO expert specializing in generating high-quality, relevant keywords for technology services targeting specific geographic regions.

CRITICAL REGION COMPLIANCE RULES:
1. ONLY use regions from the provided list: ${region}
2. NEVER include USA, Canada, or any other regions unless they are explicitly in the provided list
3. If the region is "India, Australia", generate keywords ONLY for India and Australia
4. All location-based keywords must use ONLY: ${regions.map(r => r.trim()).join(', ')}
5. Include major cities from the specified regions only (e.g., for India: Mumbai, Delhi, Bangalore; for Australia: Sydney, Melbourne, Brisbane)
6. Generate keywords that are specific, actionable, and optimized for search engines in the target regions.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        });

        keywords = response.choices[0].message.content?.trim() || "";
        
        // Post-process: Filter out USA/Canada keywords if not in region list
        const regionLower = region.toLowerCase();
        const hasUSA = regionLower.includes('usa') || regionLower.includes('united states');
        const hasCanada = regionLower.includes('canada');
        
        // Always filter if USA or Canada is not in the region list
        if (!hasUSA || !hasCanada) {
          // Also check for "USA Canada" as a combined phrase
          // Split keywords by comma and filter
          const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
          const filteredKeywords = keywordArray.filter(keyword => {
            const kwLower = keyword.toLowerCase();
            // Remove if contains USA and USA is not in region (check for various patterns)
            if (!hasUSA && (
              kwLower.includes(' usa') || 
              kwLower.includes('usa ') || 
              kwLower.endsWith(' usa') || 
              kwLower.startsWith('usa ') ||
              kwLower.includes('united states') ||
              kwLower.includes('usa canada') ||
              kwLower.includes('usa, canada') ||
              /\busa\b/i.test(keyword) ||
              /\bunited\s+states\b/i.test(keyword)
            )) {
              return false;
            }
            // Remove if contains Canada and Canada is not in region (check for various patterns)
            if (!hasCanada && (
              kwLower.includes(' canada') || 
              kwLower.includes('canada ') || 
              kwLower.endsWith(' canada') || 
              kwLower.startsWith('canada ') ||
              kwLower.includes('usa canada') ||
              kwLower.includes('usa, canada') ||
              /\bcanada\b/i.test(keyword)
            )) {
              return false;
            }
            // Remove if contains "USA Canada" or "USA, Canada" as combined phrase
            if ((!hasUSA || !hasCanada) && (
              kwLower.includes('usa canada') ||
              kwLower.includes('usa, canada') ||
              kwLower.includes('usa & canada')
            )) {
              return false;
            }
            return true;
          });
          keywords = filteredKeywords.join(', ');
        }
      } catch (openaiError: any) {
        console.log("OpenAI API failed, using fallback keywords:", openaiError.message);

        // Fallback keyword generation based on category and title
        const baseKeywords = generateFallbackKeywords(title, category, subCategory, region);
        keywords = baseKeywords;
      }

      // Parse keywords to extract primary and secondary
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
      const primaryKeyword = keywordArray[0] || "";
      const secondaryKeywords = keywordArray.slice(1).join(', ') || "";

      res.json({
        success: true,
        keywords,
        primaryKeyword,
        secondaryKeywords,
        message: keywords.includes("development services") ? "SEO keywords generated using fallback system" : "SEO keywords generated successfully"
      });
    } catch (error) {
      console.error("Error generating SEO keywords:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate SEO keywords"
      });
    }
  });

  // Enhanced fallback keyword generation function with region focus
  function generateFallbackKeywords(title: string, category: string, subCategory: string, region: string = "USA, Canada"): string {
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 2);
    const categoryWords = category.toLowerCase().split(' ').filter(word => word.length > 2);
    const subCategoryWords = subCategory.toLowerCase().split(' ').filter(word => word.length > 2);

    const baseTerms = Array.from(new Set(titleWords.concat(categoryWords, subCategoryWords)));
    const primaryTerm = baseTerms[0] || "development";

    // Use provided region, split and add common cities based on region
    const regionParts = region.split(',').map(r => r.trim()).filter(Boolean);
    const locations: string[] = [...regionParts];
    
    // Add common cities based on regions
    if (region.toLowerCase().includes('usa') || region.toLowerCase().includes('united states')) {
      locations.push("New York", "Los Angeles", "Chicago", "San Francisco");
    }
    if (region.toLowerCase().includes('canada')) {
      locations.push("Toronto", "Vancouver", "Montreal", "Calgary");
    }
    if (region.toLowerCase().includes('india')) {
      locations.push("Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai");
    }
    if (region.toLowerCase().includes('uk') || region.toLowerCase().includes('united kingdom')) {
      locations.push("London", "Manchester", "Birmingham", "Edinburgh");
    }

    const serviceTypes = [
      "services", "solutions", "development", "consulting",
      "company", "agency", "experts", "specialists", "providers"
    ];

    const modifiers = [
      "custom", "professional", "enterprise", "scalable",
      "innovative", "cutting-edge", "affordable", "top-rated",
      "experienced", "certified", "trusted", "leading"
    ];

    const actionWords = [
      "hire", "outsource", "get", "find", "choose", "best"
    ];

    // Generate comprehensive keyword list
    const keywords = [
      // Primary keywords
      title.toLowerCase(),
      category.toLowerCase() + " services",
      subCategory.toLowerCase() + " development",

      // Service-focused keywords
      ...baseTerms.slice(0, 2).map(term => term + " services"),
      ...baseTerms.slice(0, 2).map(term => term + " solutions"),
      ...baseTerms.slice(0, 2).map(term => term + " development"),

      // Location-based keywords (USA/Canada focus)
      ...locations.slice(0, 6).map(loc => primaryTerm + " services " + loc),
      ...locations.slice(0, 4).map(loc => primaryTerm + " development " + loc),
      ...locations.slice(0, 3).map(loc => "custom " + primaryTerm + " " + loc),

      // Action-oriented keywords
      ...actionWords.slice(0, 3).map(action => action + " " + primaryTerm + " developers"),
      ...actionWords.slice(0, 2).map(action => action + " " + primaryTerm + " services"),

      // Professional keywords
      ...modifiers.slice(0, 4).map(mod => mod + " " + primaryTerm + " development"),
      ...modifiers.slice(0, 3).map(mod => mod + " " + primaryTerm + " services"),

      // Company-focused keywords
      primaryTerm + " development company",
      primaryTerm + " consulting services",
      "professional " + primaryTerm + " team",
      "enterprise " + primaryTerm + " solutions",

      // Industry-specific keywords
      "B2B " + primaryTerm + " services",
      primaryTerm + " for startups",
      primaryTerm + " for enterprises"
    ];

    // Remove duplicates and limit to 20 keywords for better SEO focus
    return Array.from(new Set(keywords)).slice(0, 20).join(", ");
  }

  // Seed initial services (admin only)
  app.post("/api/services/seed", authenticateToken, authorizeRole(["super_admin"]), async (req, res) => {
    try {
      const { seedInitialServices } = await import("./seed-services");
      await seedInitialServices();
      res.json({ success: true, message: "Initial services seeded successfully" });
    } catch (error) {
      console.error("Error seeding services:", error);
      res.status(500).json({ success: false, message: "Failed to seed services" });
    }
  });

  // Service management routes
  app.post("/api/services", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      console.log("Received service data:", req.body);
      const { pages, ...serviceData } = req.body;
      const parsedServiceData = insertServiceSchema.parse(serviceData);
      console.log("Parsed service data:", parsedServiceData);

      const service = await storage.createService(parsedServiceData);

      // Automatically sync links from content
      if (service.content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'service',
            service.id,
            service.content,
            service.title,
            'content',
            'markdown'
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for service ${service.id}:`, error);
        }
      }

      // Create service detail pages if provided
      if (pages && Array.isArray(pages) && pages.length > 0) {
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          if (page.title && page.summary) {
            const slug = page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await storage.createServiceDetailPage({
              serviceId: service.id,
              title: page.title,
              slug,
              summary: page.summary,
              content: '',
              status: 'active',
              displayOrder: i
            });
          }
        }
      }

      // Update sitemap when service is created
      sitemapGenerator.updateSitemapAsync();

      res.json({ success: true, service });
    } catch (error) {
      console.error("Error creating service:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
      }
      res.status(500).json({ success: false, message: "Failed to create service", error: errorMessage });
    }
  });

  // Generate AI Service Content from Reference
  app.post("/api/services/generate-from-reference", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const { serviceName, category, referenceContent } = req.body;

      if (!serviceName || !category || !referenceContent) {
        return res.status(400).json({
          success: false,
          message: "Service name, category, and reference content are required"
        });
      }

      // Generate structured content from reference
      const generatedContent = await generateServiceContentFromReference(
        serviceName,
        category,
        referenceContent
      );

      // Generate SEO metadata
      const metadata = await generateServiceMetadata(
        serviceName,
        category,
        generatedContent
      );

      // Structure the content for the service page
      const structuredContent = {
        heroSection: generatedContent.heroSection,
        introOverview: generatedContent.introOverview,
        serviceOfferings: generatedContent.serviceOfferings,
        technologyTools: generatedContent.technologyTools,
        processMethodology: generatedContent.processMethodology,
        whyChooseUs: generatedContent.whyChooseUs,
        trustSignals: generatedContent.trustSignals,
        testimonials: generatedContent.testimonials,
        faqs: generatedContent.faqs,
        finalCta: generatedContent.finalCta
      };

      // Create comprehensive content text for the service
      const fullContent = `
# ${generatedContent.heroSection.headline}

${generatedContent.heroSection.subheading}

## Overview

${generatedContent.introOverview.paragraphs.join('\n\n')}

## ${generatedContent.serviceOfferings.title}

${generatedContent.serviceOfferings.components.map(comp =>
        `### ${comp.name}\n${comp.description}`
      ).join('\n\n')}

## Technology & Tools

**Core Technologies:** ${generatedContent.technologyTools.coreTechnologies.join(', ')}

**Platforms & Frameworks:** ${generatedContent.technologyTools.platformsFrameworks.join(', ')}

**Integration Tools:** ${generatedContent.technologyTools.integrationTools.join(', ')}

**Deployment Environments:** ${generatedContent.technologyTools.deploymentEnvironments.join(', ')}

## Our Process

${generatedContent.processMethodology.process.map((step, index) =>
        `**${index + 1}. ${step.step}**\n${step.description}`
      ).join('\n\n')}

## Why Choose Us

${generatedContent.whyChooseUs.whyChooseUs.map(point => `• ${point}`).join('\n')}

## Trusted By

${generatedContent.trustSignals.trustedBy.join(', ')}

## Client Testimonials

${generatedContent.testimonials.testimonials.map(testimonial =>
        `> "${testimonial.quote}"\n> — ${testimonial.client}`
      ).join('\n\n')}

## Frequently Asked Questions

${generatedContent.faqs.faqs.map(faq =>
        `**${faq.question}**\n${faq.answer}`
      ).join('\n\n')}

## ${generatedContent.finalCta.headline}

${generatedContent.finalCta.button}
      `.trim();

      res.json({
        success: true,
        content: fullContent,
        structuredContent,
        metadata,
        technologies: generatedContent.technologyTools.coreTechnologies,
        features: generatedContent.serviceOfferings.components.map(comp => comp.name)
      });

    } catch (error) {
      console.error("Error generating service content from reference:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        success: false,
        message: `Failed to generate content: ${errorMessage}`
      });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const { category, search } = req.query;

      let services;
      if (search) {
        services = await storage.searchServices(search as string);
      } else if (category) {
        services = await storage.getServicesByCategory(category as string);
      } else {
        services = await storage.getAllServices();
      }

      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ success: false, message: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const service = await storage.getService(id);

      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }

      res.json({ success: true, service });
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ success: false, message: "Failed to fetch service" });
    }
  });

  // Get service testimonials
  app.get("/api/services/:id/testimonials", async (req, res) => {
    try {
      const serviceId = parseId(req.params.id);
      const testimonials = await storage.getServiceTestimonials(serviceId);
      res.json({ success: true, testimonials });
    } catch (error) {
      console.error("Error fetching service testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/services/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;

      // First try to find admin-created service
      const adminService = await storage.getServiceBySlug(slug);
      if (adminService) {
        return res.json({ success: true, service: adminService, type: 'admin' });
      }

      // If not found, check core services (define core services directly)
      const coreServices = [
        { id: "generative-ai-solutions", title: "Generative AI Solutions", category: "AI & Machine Learning", description: "AI-driven content creation, predictive analytics, and chatbots using TensorFlow, PyTorch, and GANs." },
        { id: "ai-development", title: "AI Development", category: "AI & Machine Learning", description: "Machine learning, deep learning, NLP, and computer vision for automation and analytics." },
        { id: "data-science-services", title: "Data Science Services", category: "AI & Machine Learning", description: "Data analytics, big data (Hadoop, Spark), and visualization (Tableau, Power BI)." },
        { id: "big-data-development", title: "Big Data Development", category: "AI & Machine Learning", description: "Hadoop, Spark, and data warehousing (Snowflake, Redshift)." },
        { id: "web3-development", title: "Web3 Development", category: "Web3 & Blockchain", description: "Blockchain, smart contracts, NFTs, and DeFi solutions for decentralized applications." },
        { id: "blockchain-development", title: "Blockchain Development", category: "Web3 & Blockchain", description: "Ethereum, Hyperledger, Solana, and smart contract development for DeFi and NFTs." },
        { id: "mobile-app-development", title: "Mobile App Development", category: "Mobile Development", description: "iOS, Android, and cross-platform apps using React Native, Flutter, and Xamarin." },
        { id: "ar-vr-development", title: "AR/VR Development", category: "Mobile Development", description: "Unity and Unreal Engine for gaming and virtual experiences." },
        { id: "game-development", title: "Game Development", category: "Mobile Development", description: "Mobile and AR/VR games using Unity and Unreal Engine." },
        { id: "web-development", title: "Web Development", category: "Web Development", description: "Full-stack development for custom web apps using PHP, .NET, and JavaScript." },
        { id: "frontend-development", title: "Frontend Development", category: "Web Development", description: "User-friendly interfaces using React, Angular, Vue.js, and JavaScript." },
        { id: "backend-development", title: "Backend Development", category: "Web Development", description: "Scalable systems using Node.js, Python, PHP, and .NET." },
        { id: "api-development", title: "API Development", category: "Web Development", description: "REST, GraphQL, and gRPC for seamless integrations." },
        { id: "cms-development", title: "CMS Development", category: "Web Development", description: "WordPress, Drupal, and Sitecore for content management." },
        { id: "ecommerce-development", title: "E-commerce Development", category: "Web Development", description: "Platforms like Magento, Shopify, and WooCommerce for online stores." },
        { id: "custom-software-development", title: "Custom Software Development", category: "Enterprise Solutions", description: "Bespoke CRM, ERP, and industry-specific solutions using .NET, Java, and Python." },
        { id: "digital-transformation-consulting", title: "Digital Transformation Consulting", category: "Enterprise Solutions", description: "IoT, cloud computing, and blockchain for business modernization." },
        { id: "crm-development", title: "CRM Development", category: "Enterprise Solutions", description: "Salesforce, HubSpot, and Zoho for customer relationship management." },
        { id: "erp-development", title: "ERP Development", category: "Enterprise Solutions", description: "SAP, Oracle NetSuite, and Odoo for enterprise resource planning." },
        { id: "saas-development", title: "SaaS Development", category: "Enterprise Solutions", description: "Scalable SaaS platforms for various industries." },
        { id: "it-consulting", title: "IT Consulting", category: "Enterprise Solutions", description: "Strategic consulting for technology adoption and digital transformation." },
        { id: "cloud-computing-services", title: "Cloud Computing Services", category: "Cloud & DevOps", description: "AWS, Azure, and Google Cloud for scalable infrastructure." },
        { id: "devops-services", title: "DevOps Services", category: "Cloud & DevOps", description: "CI/CD pipelines, Docker, Kubernetes, and cloud platforms like AWS and Azure." },
        { id: "rpa-services", title: "RPA (Robotic Process Automation)", category: "Automation & Testing", description: "UiPath, Automation Anywhere, and Blue Prism for process automation." },
        { id: "automation-testing", title: "Automation Testing", category: "Automation & Testing", description: "Test automation using Selenium, Appium, and JMeter for quality assurance." },
        { id: "low-code-development", title: "Low-Code Development", category: "Automation & Testing", description: "Platforms like OutSystems and Mendix for rapid development." },
        { id: "iot-development", title: "IoT Development", category: "IoT & Security", description: "MQTT, AWS IoT, and Azure IoT for smart devices in retail and healthcare." },
        { id: "embedded-systems-development", title: "Embedded Systems Development", category: "IoT & Security", description: "C, C++, and firmware for IoT and automotive solutions." },
        { id: "cybersecurity-services", title: "Cybersecurity Services", category: "IoT & Security", description: "Secure coding and threat management for data protection." },
        { id: "ui-ux-design", title: "UI/UX Design", category: "Design & UX", description: "User-centric design for web and mobile apps." }
      ];
      const coreService = coreServices.find(service => service.id === slug);

      if (coreService) {
        // Check if there's an admin service that should replace this core service
        const allAdminServices = await storage.getAllServices();
        const matchingAdminService = allAdminServices.find(adminSvc => {
          if (adminSvc.status !== 'active' && adminSvc.status !== 'published') return false;

          // Map specific core services to admin services
          const serviceMapping: { [key: string]: string[] } = {
            "frontend-development": ["Frontend", "Frontend Development", "Frontend Technologies"],
            "backend-development": ["Backend", "Backend Development", "Backend Technologies"],
            "web-development": ["Web Development", "Full Stack"],
            "mobile-app-development": ["Mobile", "Mobile Development", "App Development"],
            "ai-development": ["AI", "Artificial Intelligence", "AI Development"],
            "blockchain-development": ["Blockchain", "Web3", "Blockchain Development"],
            "ui-ux-design": ["UI/UX", "Design", "User Experience"]
          };

          const possibleTitles = serviceMapping[slug] || [coreService.title];
          return possibleTitles.some(title =>
            adminSvc.title.toLowerCase().includes(title.toLowerCase()) ||
            title.toLowerCase().includes(adminSvc.title.toLowerCase())
          ) && adminSvc.category?.toLowerCase().includes(coreService.category.toLowerCase());
        });

        if (matchingAdminService) {
          // Return the admin service with some core service properties preserved
          const enhancedService = {
            ...matchingAdminService,
            slug: slug, // Keep the original core service slug for consistent routing
            category: coreService.category, // Preserve core category for consistency
          };
          return res.json({ success: true, service: enhancedService, type: 'enhanced' });
        }

        // If no matching admin service, return transformed core service
        // Transform core service to match admin service structure
        const transformedService = {
          id: coreService.id,
          title: coreService.title,
          slug: coreService.id,
          category: coreService.category,
          subCategory: "Core Service",
          content: `<h1>${coreService.title}</h1><p>${coreService.description}</p><p>This is a comprehensive ${coreService.title.toLowerCase()} service offering professional solutions tailored to your business needs.</p>`,
          excerpt: coreService.description,
          metaTitle: `${coreService.title} | GreenAppleX`,
          metaDescription: coreService.description,
          keywords: `${coreService.title.toLowerCase()}, ${coreService.category.toLowerCase()}, professional services`,
          status: 'published' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return res.json({ success: true, service: transformedService, type: 'core' });
      }

      return res.status(404).json({ success: false, message: "Service not found" });
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ success: false, message: "Failed to get service" });
    }
  });

  app.put("/api/services/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      console.log(`Updating service ${id} with data:`, req.body);

      const { pages, ...serviceData } = req.body;
      console.log('Parsed service data before validation:', serviceData);

      const parsedServiceData = insertServiceSchema.partial().parse(serviceData);
      console.log('Validated service data:', parsedServiceData);

      const service = await storage.updateService(id, parsedServiceData);

      // Automatically sync links from content
      if (service.content) {
        try {
          await linkSyncManager.syncLinksForContent(
            'service',
            service.id,
            service.content,
            service.title,
            'content',
            'markdown'
          );
        } catch (error) {
          console.error(`[LinkSync] Error syncing links for service ${service.id}:`, error);
        }
      }

      // Update service detail pages if provided
      if (pages && Array.isArray(pages)) {
        // First, get existing pages
        const existingPages = await storage.getServiceDetailPagesByService(id);

        // Delete existing pages that are not in the new pages array
        for (const existingPage of existingPages) {
          const stillExists = pages.some(p => p.title === existingPage.title);
          if (!stillExists) {
            await storage.deleteServiceDetailPage(existingPage.id);
          }
        }

        // Create or update pages
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          if (page.title && page.summary) {
            const slug = page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const existingPage = existingPages.find(p => p.title === page.title);

            if (existingPage) {
              // Update existing page
              await storage.updateServiceDetailPage(existingPage.id, {
                title: page.title,
                slug,
                summary: page.summary,
                displayOrder: i
              });
            } else {
              // Create new page
              await storage.createServiceDetailPage({
                serviceId: id,
                title: page.title,
                slug,
                summary: page.summary,
                content: '',
                status: 'active',
                displayOrder: i
              });
            }
          }
        }
      }

      // Update sitemap when service is updated
      sitemapGenerator.updateSitemapAsync();

      res.json({ success: true, service });
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ success: false, message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteService(id);

      // Update sitemap when service is deleted - use immediate generation to ensure deletion is reflected
      setTimeout(async () => {
        await sitemapGenerator.generateSitemap();
      }, 100); // Small delay to ensure database transaction is committed

      res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ success: false, message: "Failed to delete service" });
    }
  });

  // Service Testimonials API Routes
  app.get("/api/services/:serviceId/testimonials", async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      const testimonials = await storage.getServiceTestimonials(serviceId);
      res.json({ success: true, testimonials });
    } catch (error) {
      console.error("Error fetching service testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/services/:serviceId/testimonials/generate", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      const { category, subCategory } = req.body;

      if (!category || !subCategory) {
        return res.status(400).json({
          success: false,
          message: "Category and subcategory are required"
        });
      }

      const testimonials = await storage.generateServiceTestimonials(serviceId, category, subCategory);
      res.json({
        success: true,
        testimonials,
        message: "Testimonials generated successfully"
      });
    } catch (error) {
      console.error("Error generating service testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to generate testimonials" });
    }
  });

  // Get testimonials for a specific service (public endpoint)
  app.get("/api/services/:serviceId/testimonials", async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      const testimonials = await storage.getServiceTestimonials(serviceId);
      res.json({ success: true, testimonials });
    } catch (error) {
      console.error("Error fetching service testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/services/:serviceId/testimonials", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      const testimonialData = insertServiceTestimonialSchema.parse({
        ...req.body,
        serviceId
      });

      // Automatically assign gender based on client name if not provided
      if (!testimonialData.gender && testimonialData.clientName) {
        testimonialData.gender = getGenderFromName(testimonialData.clientName);
      }

      const testimonial = await storage.createServiceTestimonial(testimonialData);
      res.json({ success: true, testimonial });
    } catch (error) {
      console.error("Error creating service testimonial:", error);
      res.status(500).json({ success: false, message: "Failed to create testimonial" });
    }
  });

  app.delete("/api/services/:serviceId/testimonials", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      await storage.deleteServiceTestimonials(serviceId);
      res.json({ success: true, message: "All testimonials deleted successfully" });
    } catch (error) {
      console.error("Error deleting service testimonials:", error);
      res.status(500).json({ success: false, message: "Failed to delete testimonials" });
    }
  });

  // AI Generation Routes for Service Creation
  app.post("/api/ai/generate-service-content", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const { type, category, subCategory, title } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({
          success: false,
          message: "OpenAI API key not configured"
        });
      }

      const { generateChatCompletion } = await import("./openai-client");

      let prompt = '';
      let response: any = {};

      switch (type) {
        case 'title':
          prompt = `Generate a professional, SEO-optimized service title for a digital marketing agency.
          Category: ${category}
          Subcategory: ${subCategory}
          
          Requirements:
          - Make it compelling and professional
          - Include relevant keywords
          - Keep it under 60 characters
          - Target USA and Canada markets
          
          Return only the title text, nothing else.`;

          const titleResponse = await generateChatCompletion([
            { role: "user", content: prompt }
          ], {
            max_tokens: 100,
            temperature: 0.7,
          });

          response.title = titleResponse.choices[0].message.content?.trim() || '';
          break;

        case 'keywords':
          prompt = `Generate SEO keywords for the following service:
          Title: ${title}
          Category: ${category}
          Subcategory: ${subCategory}
          
          Requirements:
          - Provide 1 primary keyword (most important)
          - Provide 5-8 secondary keywords (comma-separated)
          - Target USA and Canada markets
          - Focus on commercial intent keywords
          - Include location-based variations where relevant
          
          Return in JSON format:
          {
            "primaryKeyword": "main keyword",
            "secondaryKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
          }`;

          const keywordResponse = await generateChatCompletion([
            { role: "user", content: prompt }
          ], {
            max_tokens: 200,
            temperature: 0.5,
            response_format: { type: "json_object" }
          });

          const keywordData = JSON.parse(keywordResponse.choices[0].message.content || '{}');
          response.primaryKeyword = keywordData.primaryKeyword || '';
          response.secondaryKeywords = keywordData.secondaryKeywords || '';
          break;

        case 'content':
          // Generate both content and testimonials
          const contentPrompt = `Generate comprehensive, SEO-optimized service content for a digital marketing agency.
          
          Service Details:
          Title: ${title}
          Category: ${category}
          Subcategory: ${subCategory}
          
          Requirements:
          - Minimum 500 words
          - Professional and engaging tone
          - Include value propositions
          - Describe the process/methodology
          - List key benefits
          - Target USA and Canada markets
          - Include relevant technologies/tools
          - End with a compelling call-to-action
          - Use proper HTML formatting (h2, h3, p, ul, li tags)
          - SEO-optimized with natural keyword integration
          
          Structure the content with:
          1. Introduction/Overview
          2. What We Offer
          3. Our Process
          4. Key Benefits
          5. Technologies We Use
          6. Why Choose GreenAppleX
          7. Call to Action
          
          Make it specific to the service category and subcategory provided.`;

          const testimonialsPrompt = `Generate 3 realistic client testimonials for the following service:
          
          Service: ${title}
          Category: ${category}
          Subcategory: ${subCategory}
          
          Requirements:
          - Create diverse client profiles (different industries, company sizes)
          - Include specific, measurable results where possible (e.g., "increased ROI by 40%", "reduced costs by $50k")
          - Make testimonials authentic and detailed (not generic)
          - Include client name, title, and company name
          - Focus on actual business outcomes and benefits
          - Target USA/Canada business context
          - Keep each testimonial 2-4 sentences
          
          Return as JSON object with testimonials array:
          {
            "testimonials": [
              {
                "clientName": "Full Name",
                "title": "Job Title", 
                "company": "Company Name",
                "testimonial": "Detailed testimonial text with specific results",
                "rating": 5
              }
            ]
          }`;

          // Generate content and testimonials in parallel
          const [contentResponse, testimonialsResponse] = await Promise.all([
            openai.chat.completions.create({
              model: "gpt-4o",
              messages: [{ role: "user", content: contentPrompt }],
              max_tokens: 2000,
              temperature: 0.7,
            }),
            openai.chat.completions.create({
              model: "gpt-4o",
              messages: [{ role: "user", content: testimonialsPrompt }],
              max_tokens: 800,
              temperature: 0.8,
              response_format: { type: "json_object" }
            })
          ]);

          response.content = contentResponse.choices[0].message.content?.trim() || '';

          // Parse testimonials response
          try {
            const testimonialsData = JSON.parse(testimonialsResponse.choices[0].message.content || '{"testimonials":[]}');
            response.testimonials = testimonialsData.testimonials || [];
          } catch (error) {
            console.error('Error parsing testimonials:', error);
            response.testimonials = [];
          }
          break;

        case 'technologies':
          prompt = `Suggest relevant technologies for this service:
          Title: ${title}
          Category: ${category}
          Subcategory: ${subCategory}
          
          Requirements:
          - Return 5-8 modern, widely-used technologies
          - Focus on technologies most relevant for this type of service
          - Include programming languages, frameworks, databases, cloud services as appropriate
          - Make suggestions practical and industry-standard
          
          Return as JSON array of technology names:
          {
            "technologies": ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"]
          }`;

          const techResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
            response_format: { type: "json_object" }
          });

          const techData = JSON.parse(techResponse.choices[0].message.content || '{"technologies":[]}');
          response.technologies = techData.technologies || [];
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Invalid generation type"
          });
      }

      res.json({ success: true, ...response });

    } catch (error: any) {
      console.error("AI generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate content with AI"
      });
    }
  });

  // Universal Service Content Generation
  app.post("/api/services/generate-universal", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const { serviceName, targetAudience, industryFocus, seoKeywords } = req.body;

      if (!serviceName) {
        return res.status(400).json({
          success: false,
          message: "Service name is required"
        });
      }

      console.log(`Generating universal service content for: ${serviceName}`);

      // Generate structured content matching LLM service page structure
      const content = await generateUniversalServiceContent(
        serviceName,
        targetAudience,
        industryFocus,
        seoKeywords?.split(',').map((k: string) => k.trim()).filter(Boolean)
      );

      // Generate SEO metadata
      const seoMeta = await generateServiceSeoMeta(serviceName, content);

      // Create service record with generated content
      const slug = serviceName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const serviceData = {
        title: content.heroSection.headline,
        slug,
        content: JSON.stringify(content),
        excerpt: content.heroSection.subheading,
        metaTitle: seoMeta.metaTitle,
        metaDescription: seoMeta.metaDescription,
        status: 'draft' as const
      };

      res.json({
        success: true,
        content,
        seoMeta,
        serviceData,
        message: `Universal service content generated successfully for ${serviceName}`
      });

    } catch (error: any) {
      console.error("Universal service generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate universal service content"
      });
    }
  });

  // Service Detail Pages routes
  app.get("/api/services/:serviceId/pages", async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      const pages = await storage.getServiceDetailPagesByService(serviceId);
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/services/:serviceId/pages", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const serviceId = parseId(req.params.serviceId);
      const pageData = insertServiceDetailPageSchema.parse({
        ...req.body,
        serviceId
      });

      // Auto-generate slug from title
      const slug = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const page = await storage.createServiceDetailPage({
        ...pageData,
        slug
      });

      res.json({ success: true, page });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.put("/api/services/:serviceId/pages/:pageId", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const pageId = parseId(req.params.pageId);
      const pageData = insertServiceDetailPageSchema.partial().parse(req.body);

      // Auto-generate slug if title is updated
      if (pageData.title) {
        pageData.slug = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      const page = await storage.updateServiceDetailPage(pageId, pageData);
      res.json({ success: true, page });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/services/:serviceId/pages/:pageId", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const pageId = parseId(req.params.pageId);
      await storage.deleteServiceDetailPage(pageId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ===== IMAGE MANAGEMENT ROUTES =====

  // Store image from temporary URL (for AI-generated images)
  app.post("/api/images/store", authenticateToken, async (req, res) => {
    try {
      const { temporaryUrl, prefix = 'image-', folder = 'images' } = req.body;

      if (!temporaryUrl) {
        return res.status(400).json({
          success: false,
          message: "temporaryUrl is required"
        });
      }

      const result = await storeImagePermanently(temporaryUrl, prefix, folder);
      res.json({
        success: true,
        image: result
      });
    } catch (error: any) {
      console.error("Error storing image:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to store image"
      });
    }
  });

  // Upload image file directly to S3
  app.post("/api/images/upload/:folder?", authenticateToken, (req, res) => {
    const folder = req.params.folder || 'uploads';

    if (!BUCKET_NAME) {
      return res.status(500).json({
        success: false,
        message: "AWS S3 is not configured. Please contact administrator."
      });
    }

    const upload = uploadToS3.single('image');

    upload(req, res, async (err: any) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "Upload failed"
        });
      }

      try {
        const file = req.file as any;
        if (!file) {
          return res.status(400).json({
            success: false,
            message: "No file uploaded"
          });
        }

        // Store metadata in database using MongoDB
        const ImageModel = (await import("./models/image")).default;

        const imageRecord = await ImageModel.create({
          filename: file.key.split('/').pop(),
          originalFilename: file.originalname,
          s3Key: file.key,
          s3Url: file.location,
          bucket: file.bucket,
          contentType: file.mimetype,
          folder,
          status: 'active'
        });

        res.json({
          success: true,
          image: {
            id: imageRecord._id.toString(),
            permanentUrl: file.location,
            filename: file.key.split('/').pop(),
            s3Key: file.key
          }
        });
      } catch (error: any) {
        console.error("Database error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to save image metadata"
        });
      }
    });
  });

  // List all images
  app.get("/api/images", authenticateToken, async (req, res) => {
    try {
      const folder = req.query.folder as string;
      const images = await listStoredImages(folder);
      res.json({
        success: true,
        images
      });
    } catch (error: any) {
      console.error("Error listing images:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to list images"
      });
    }
  });

  // ===== HIRE PAGES API ROUTES =====

  // Get all hire pages
  app.get("/api/hire-pages", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const pages = await storage.getAllHirePages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get published hire pages (public endpoint)
  app.get("/api/hire-pages/public", async (req, res) => {
    try {
      const pages = await storage.getPublishedHirePages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get single hire page
  app.get("/api/hire-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getHirePage(id);
      if (!page) {
        return res.status(404).json({ success: false, message: "Hire page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get hire page by slug (public endpoint)
  app.get("/api/hire-pages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getHirePageBySlug(slug);
      if (!page) {
        return res.status(404).json({ success: false, message: "Hire page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create hire page
  app.post("/api/hire-pages", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const pageData = insertHirePageSchema.parse(req.body);
      // Convert null values to undefined to match HirePage interface
      const cleanedData = Object.fromEntries(
        Object.entries(pageData).map(([key, value]) => [key, value === null ? undefined : value])
      ) as Partial<HirePage>;
      const page = await storage.createHirePage(cleanedData);
      res.json(page);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Update hire page
  app.put("/api/hire-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = insertHirePageSchema.partial().parse(req.body);
      // Convert null values to undefined to match HirePage interface
      const cleanedData = Object.fromEntries(
        Object.entries(pageData).map(([key, value]) => [key, value === null ? undefined : value])
      ) as Partial<HirePage>;
      const page = await storage.updateHirePage(id, cleanedData);
      res.json(page);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Delete hire page
  app.delete("/api/hire-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteHirePage(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Search hire pages
  app.get("/api/hire-pages/search/:query", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const query = req.params.query;
      const pages = await storage.searchHirePages(query);
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // AI Title Generation for Hire Pages
  app.post("/api/ai/generate-hire-titles", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const { developerType, targetLocation = "USA & Canada" } = z.object({
        developerType: z.string().min(1, "Developer type is required"),
        targetLocation: z.string().optional()
      }).parse(req.body);

      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({
          success: false,
          message: "OpenAI API key not configured. Please add your OpenAI API key to generate titles."
        });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Generate 8 compelling, SEO-optimized titles for a "Hire ${developerType} Developers" page targeting ${targetLocation} market.

Requirements:
- Include location targeting (USA, Canada, or major cities)
- Use action-oriented language (Hire, Get, Find, Outsource)
- Include developer type and relevant technologies
- Focus on business value and urgency
- Keep titles between 50-70 characters for SEO
- Appeal to business decision makers and CTOs

Examples format:
- "Hire Expert ${developerType} Developers in USA & Canada - Get Started Today"
- "Top ${developerType} Developers for Hire - Trusted by Fortune 500 Companies"

Generate 8 unique, high-converting titles that emphasize expertise, reliability, and results.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert in creating high-converting landing page titles for developer hiring services. Focus on SEO optimization and business appeal."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      });

      const generatedContent = response.choices[0].message.content?.trim() || "";
      const titles = generatedContent
        .split('\n')
        .filter(line => line.trim() && (line.includes('-') || line.includes(developerType)))
        .map(line => line.replace(/^\d+\.\s*|\-\s*|^\*\s*/, '').trim())
        .filter(title => title.length > 20)
        .slice(0, 8);

      res.json({
        success: true,
        titles,
        message: `${titles.length} titles generated successfully`
      });
    } catch (error: any) {
      console.error("Error generating hire titles:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate titles. Please try again."
      });
    }
  });

  // AI Content Generation for Hire Pages
  app.post("/api/ai/generate-hire-content", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      const { title, developerType, section } = z.object({
        title: z.string().min(1, "Title is required"),
        developerType: z.string().min(1, "Developer type is required"),
        section: z.enum(["hero", "why-hire", "services", "testimonials", "faq"]).optional()
      }).parse(req.body);

      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({
          success: false,
          message: "OpenAI API key not configured. Please add your OpenAI API key to generate content."
        });
      }

      const { generateChatCompletion } = await import("./openai-client");

      let prompt = "";

      if (section === "hero") {
        prompt = `Create compelling hero section content for "${title}":
        
Generate:
1. Hero subtitle (compelling tagline)
2. Hero description (2-3 sentences about expertise and value)
3. 4 trust badges/stats (format: "stat: description")

Focus on expertise, speed of hiring, and business results. Target audience: CTOs and business leaders.`;
      } else {
        prompt = `Generate comprehensive content for a "${title}" page targeting USA & Canada markets:

Create structured content including:

1. **Hero Section:**
   - Compelling subtitle
   - 2-3 sentence description emphasizing expertise and business value
   - 4 key metrics/trust badges

2. **Why Hire From GreenAppleX (6 key points):**
   - Faster hiring process
   - Pre-vetted talent
   - Risk-free trials
   - Cost savings
   - Timezone alignment
   - NDA-backed security

3. **Core Services (6 services):**
   - List specific ${developerType} development services
   - Include brief descriptions for each

4. **FAQ Section (5 questions):**
   - Address common hiring concerns
   - Include costs, timelines, and process questions

5. **Final CTA:**
   - Compelling call-to-action title and description

Format as JSON with clear section keys. Focus on business value, expertise, and results.`;
      }

      const response = await generateChatCompletion([
        {
          role: "system",
          content: "You are an expert copywriter specializing in developer hiring pages. Create professional, conversion-focused content that appeals to business decision makers."
        },
        {
          role: "user",
          content: prompt
        }
      ], {
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.7,
      });

      const content = JSON.parse(response.choices[0].message.content || "{}");

      res.json({
        success: true,
        content,
        message: "Content generated successfully"
      });
    } catch (error: any) {
      console.error("Error generating hire content:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate content. Please try again."
      });
    }
  });

  // Generate hire developer content from reference
  app.post("/api/ai/generate-hire-from-reference", authenticateToken, authorizeRole(["super_admin", "user_admin", "content_admin"]), async (req, res) => {
    try {
      // Resolve region with priority order
      const { resolveRegion } = await import("./region-resolver");
      const resolvedRegion = await resolveRegion((req.body as any).region || req.body.location);
      
      const { referenceContent, developerType } = req.body;

      if (!referenceContent || !developerType) {
        return res.status(400).json({
          success: false,
          message: "Reference content and developer type are required"
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({
          success: false,
          message: "OpenAI API key not configured. Please add your OpenAI API key to generate content."
        });
      }

      console.log(`Generating hire developer content from reference for: ${developerType}`);

      // Generate content that follows the exact JSON structure from reference
      const { generateChatCompletion } = await import("./openai-client");

      const prompt = `You are a professional content generator for hire developer pages. Generate comprehensive content for hiring ${developerType} developers based on the provided reference content.

IMPORTANT: You must analyze the reference content and generate content that follows this exact JSON structure:

{
  "hero_section": {
    "headline": "Extract and adapt headline from reference content for ${developerType}",
    "subheading": "Extract and adapt subheading from reference content",
    "primary_cta": "Extract CTA button text from reference content"
  },
  "intro_overview": "Extract and adapt intro_overview from reference content",
  "why_hire": [
    "Extract all reasons from reference why_hire array and adapt for ${developerType}"
  ],
  "hiring_models": [
    {
      "model": "Extract model name from reference hiring_models",
      "description": "Extract and adapt description for ${developerType}",
      "best_for": "Extract and adapt best_for content"
    }
  ],
  "skills_expertise": {
    "technical_skills": ["Extract technical_skills from reference and adapt"],
    "soft_skills": ["Extract soft_skills from reference"]
  },
  "technology_stack": {
    "languages": ["Extract languages from reference technology_stack"],
    "frameworks_libraries": ["Extract frameworks_libraries from reference"],
    "databases": ["Extract databases from reference"],
    "tools_platforms": ["Extract tools_platforms from reference"]
  },
  "hiring_process": [
    {
      "step": "Extract step names from reference hiring_process",
      "description": "Extract and adapt step descriptions"
    }
  ],
  "testimonials": [
    {
      "quote": "Extract quote from reference testimonials",
      "client": "Extract client name from reference",
      "role": "Extract role from reference",
      "company": "Extract company from reference"
    }
  ],
  "faqs": [
    {
      "question": "Extract question from reference faqs and adapt for ${developerType}",
      "answer": "Extract answer from reference and adapt"
    }
  ],
  "final_cta": {
    "headline": "Extract final CTA headline from reference",
    "button_text": "Extract CTA button text from reference"
  }
}

Reference Content to analyze and extract from:
${referenceContent}

CRITICAL INSTRUCTIONS:
1. Extract ALL information directly from the reference content provided
2. Maintain the same professional tone and structure as the reference
3. Adapt content specifically for ${developerType} developers
4. Ensure all arrays contain the same number of items as in the reference
5. Keep technical details relevant to ${developerType} development
6. Return ONLY the JSON structure with no additional text, markdown, or code blocks`;

      const completion = await generateChatCompletion([
        { role: "user", content: prompt }
      ], {
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      });

      let content = completion.choices[0].message.content;

      // Clean up any markdown formatting
      if (content) {
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const generatedContent = JSON.parse(content || "{}");

      res.json({
        success: true,
        content: generatedContent,
        message: `Hire developer content generated successfully from reference for ${developerType}`
      });

    } catch (error: any) {
      console.error("Hire developer reference generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate hire developer content from reference"
      });
    }
  });

  // Delete image
  app.delete("/api/images/:filename", authenticateToken, async (req, res) => {
    try {
      const { filename } = req.params;
      const success = await deleteStoredImage(filename);

      if (success) {
        res.json({
          success: true,
          message: "Image deleted successfully"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Image not found"
        });
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete image"
      });
    }
  });

  // ======================================
  // TECHNOLOGY MANAGEMENT API ROUTES  
  // ======================================

  // Get all technologies
  app.get("/api/technologies", async (req, res) => {
    try {
      const technologies = await storage.getAllTechnologies();
      res.json(technologies);
    } catch (error) {
      console.error("Error fetching technologies:", error);
      res.status(500).json({ error: "Failed to fetch technologies" });
    }
  });

  // Get single technology by ID
  app.get("/api/technologies/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const technology = await storage.getTechnology(id);
      if (!technology) {
        return res.status(404).json({ error: "Technology not found" });
      }
      res.json(technology);
    } catch (error) {
      console.error("Error fetching technology:", error);
      res.status(500).json({ error: "Failed to fetch technology" });
    }
  });

  // Create new technology (admin only)
  app.post("/api/technologies", authenticateToken, authorizeRole(["super_admin", "service_editor"]), async (req, res) => {
    try {
      const validatedData = insertTechnologySchema.parse(req.body);
      const technology = await storage.createTechnology(validatedData);
      res.json({ success: true, technology });
    } catch (error) {
      console.error("Error creating technology:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create technology" });
    }
  });

  // Update technology (admin only)
  app.put("/api/technologies/:id", authenticateToken, authorizeRole(["super_admin", "service_editor"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const validatedData = insertTechnologySchema.partial().parse(req.body);
      const technology = await storage.updateTechnology(id, validatedData);
      res.json({ success: true, technology });
    } catch (error) {
      console.error("Error updating technology:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update technology" });
    }
  });

  // Delete technology (admin only)
  app.delete("/api/technologies/:id", authenticateToken, authorizeRole(["super_admin", "service_editor"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteTechnology(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting technology:", error);
      res.status(500).json({ error: "Failed to delete technology" });
    }
  });

  // Get technologies by category
  app.get("/api/technologies/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const technologies = await storage.getTechnologiesByCategory(category);
      res.json(technologies);
    } catch (error) {
      console.error("Error fetching technologies by category:", error);
      res.status(500).json({ error: "Failed to fetch technologies by category" });
    }
  });

  // ======================================
  // AI SERVICE PAGES CMS API ROUTES  
  // ======================================

  // Search AI Service Pages (moved before other routes to avoid conflicts)
  app.get("/api/ai-service-pages/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ success: false, message: "Search query is required" });
      }

      const pages = await storage.searchAiServicePages(query);
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get published AI service pages (public)
  app.get("/api/ai-service-pages/public/published", async (req, res) => {
    try {
      const pages = await storage.getPublishedAiServicePages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get AI service page by slug (moved before generate-content to avoid route conflict)
  app.get("/api/ai-service-pages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getAiServicePageBySlug(slug);
      if (!page) {
        return res.status(404).json({ success: false, message: "AI service page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all AI service pages
  app.get("/api/ai-service-pages", async (req, res) => {
    try {
      const pages = await storage.getAllAiServicePages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get single AI service page by ID
  app.get("/api/ai-service-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getAiServicePage(id);
      if (!page) {
        return res.status(404).json({ success: false, message: "AI service page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create new AI service page
  app.post("/api/ai-service-pages", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const pageData = insertAiServicePageSchema.parse(req.body);
      const page = await storage.createAiServicePage(pageData);
      res.json({ success: true, page });
    } catch (error: any) {
      console.error("Error creating AI service page:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Update AI service page
  app.put("/api/ai-service-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = insertAiServicePageSchema.partial().parse(req.body);
      const page = await storage.updateAiServicePage(id, pageData);
      res.json({ success: true, page });
    } catch (error: any) {
      console.error("Error updating AI service page:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Delete AI service page
  app.delete("/api/ai-service-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteAiServicePage(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // AI Service Page Content Generation
  app.post("/api/ai-service-pages/generate-content", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const { serviceName, referenceUrl, referenceContent, rawData, category, subCategory, region } = req.body;

      // Debug logging
      console.log("Received request body:", {
        serviceName,
        hasReferenceUrl: !!referenceUrl,
        referenceUrlLength: referenceUrl ? String(referenceUrl).length : 0,
        hasReferenceContent: !!referenceContent,
        referenceContentLength: referenceContent ? String(referenceContent).length : 0,
        hasRawData: !!rawData,
        category,
        subCategory
      });

      if (!serviceName) {
        return res.status(400).json({ success: false, message: "Service name is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ success: false, message: "OpenAI API key is not configured" });
      }

      // Normalize and validate reference inputs
      const normalizedReferenceUrl = referenceUrl ? String(referenceUrl).trim() : '';
      const normalizedReferenceContent = referenceContent ? String(referenceContent).trim() : '';
      const normalizedRawData = rawData ? String(rawData).trim() : '';

      // Check if we have any reference material
      const hasReferenceUrl = normalizedReferenceUrl.length > 0;
      const hasReferenceContent = normalizedReferenceContent.length > 0;
      const hasRawData = normalizedRawData.length > 0;

      console.log("Normalized values:", {
        hasReferenceUrl,
        referenceUrlLength: normalizedReferenceUrl.length,
        hasReferenceContent,
        referenceContentLength: normalizedReferenceContent.length,
        hasRawData,
        rawDataLength: normalizedRawData.length
      });

      if (!hasReferenceUrl && !hasReferenceContent && !hasRawData) {
        console.error("No reference material provided");
        return res.status(400).json({
          success: false,
          message: "Please provide either a Reference URL or Reference Content to generate AI content"
        });
      }

      // Step 1: Process reference URL if provided
      let urlContent = '';
      if (hasReferenceUrl) {
        try {
          urlContent = await scrapeAndSummarizeUrl(normalizedReferenceUrl);
          if (!urlContent || urlContent.trim().length === 0) {
            console.warn("Reference URL processed but returned empty content");
          }
        } catch (error) {
          console.error("Failed to process reference URL:", error);
          // Don't fail completely if URL scraping fails, but log the error
          urlContent = '';
        }
      }

      // Resolve region early for keyword generation
      const { resolveRegion } = await import("./region-resolver");
      const regionParam = await resolveRegion(region);
      
      // Step 2: Use new reference-based content generation if reference content is provided
      let content;
      if (hasReferenceContent) {
        console.log("Using reference content for AI generation");
        try {
          // Generate region-aware keywords first
          const seoKeywords = await generateSeoKeywords(serviceName, normalizedReferenceContent, regionParam);
          
          content = await generateServiceContentFromReference(
            serviceName,
            "AI & Data Services", // Default category
            normalizedReferenceContent
          );
          
          // Store the region-aware keywords for response
          (content as any).generatedSeoKeywords = seoKeywords;
        } catch (error: any) {
          console.error("Error generating content from reference:", error);
          throw new Error(`Failed to generate content from reference: ${error.message || 'Unknown error'}`);
        }
      } else if (hasReferenceUrl || urlContent || hasRawData) {
        // Use original method when we have URL content or raw data
        console.log("Using original method with reference URL or raw data");
        try {
          const { resolveRegion } = await import("./region-resolver");
          const regionParam = await resolveRegion(region);
          const seoKeywords = await generateSeoKeywords(serviceName, urlContent || normalizedRawData, regionParam);
          content = await generateServicePageContent(
            serviceName,
            urlContent || undefined,
            normalizedReferenceUrl || undefined,
            normalizedRawData || undefined,
            [seoKeywords.primaryKeyword, ...seoKeywords.secondaryKeywords]
          );
          
          // Store the region-aware keywords for response
          (content as any).generatedSeoKeywords = seoKeywords;
        } catch (error: any) {
          console.error("Error generating content from URL/data:", error);
          throw new Error(`Failed to generate content: ${error.message || 'Unknown error'}`);
        }
      }

      // Validate that content was generated successfully
      if (!content || !content.heroSection || !content.heroSection.headline) {
        throw new Error("Content generation failed - missing required sections");
      }

      // Step 4: Generate SEO meta information
      let seoMeta;
      let regionAwareKeywords: { primaryKeyword: string; secondaryKeywords: string[] } | null = null;
      
      // If we have region-aware keywords from generateSeoKeywords, use those
      if ((content as any).generatedSeoKeywords) {
        regionAwareKeywords = (content as any).generatedSeoKeywords;
      }
      
      if (referenceContent) {
        seoMeta = await generateServiceMetadata(serviceName, "AI & Data Services", content);
      } else {
        // Type assertion: when no referenceContent, content is ServicePageContent
        seoMeta = await generateSeoMeta(serviceName, content as any);
      }
      
      // If we don't have region-aware keywords, generate them now
      if (!regionAwareKeywords) {
        const { resolveRegion } = await import("./region-resolver");
        const regionParam = await resolveRegion(region);
        regionAwareKeywords = await generateSeoKeywords(serviceName, referenceContent || (content as any).introOverview?.description || "", regionParam);
      }

      // Prepare response with all generated content in new structure
      const generatedData = {
        // Basic Information
        title: content.heroSection.headline,
        serviceName,

        // SEO Information - use region-aware keywords
        metaTitle: seoMeta.metaTitle,
        metaDescription: seoMeta.metaDescription,
        primaryKeyword: regionAwareKeywords.primaryKeyword || (seoMeta as any).primaryKeyword || "",
        secondaryKeywords: regionAwareKeywords.secondaryKeywords?.join(', ') || (seoMeta as any).secondaryKeywords || "",

        // Complete structured content as JSON string
        structuredContent: JSON.stringify(content),

        // Individual section content for backward compatibility
        heroSection: JSON.stringify(content.heroSection),
        introOverview: JSON.stringify(content.introOverview),
        serviceOfferings: JSON.stringify(content.serviceOfferings),
        technologyTools: JSON.stringify(content.technologyTools),
        process: JSON.stringify((content as any).process || (content as any).processMethodology?.process || []),
        whyChooseUs: JSON.stringify(Array.isArray((content as any).whyChooseUs) ? (content as any).whyChooseUs : (content as any).whyChooseUs?.whyChooseUs || []),
        trustSignals: JSON.stringify(content.trustSignals),
        testimonials: JSON.stringify((content as any).testimonials || (content as any).testimonials?.testimonials || []),
        faqs: JSON.stringify((content as any).faqs || (content as any).faqs?.faqs || []),
        finalCTA: JSON.stringify((content as any).finalCTA || (content as any).finalCta || {}),

        // Generation metadata
        aiGenerated: true,
        aiPromptUsed: `Generated content for ${serviceName} service page${referenceUrl ? ` using reference: ${referenceUrl}` : ''}`,
        lastAiGeneration: new Date().toISOString(),

        // Reference data
        referenceUrl: referenceUrl || undefined,
        rawData: rawData || undefined,
      };

      res.json({ success: true, generatedData, message: "AI content generated successfully" });
    } catch (error: any) {
      console.error("Error generating AI service content:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate AI content"
      });
    }
  });

  // Search AI Service Pages (moved before other routes to avoid conflicts)
  app.get("/api/ai-service-pages/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ success: false, message: "Search query is required" });
      }

      const pages = await storage.searchAiServicePages(query);
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ======================================
  // INDUSTRY PAGES CMS API ROUTES
  // ======================================

  // Search Industry Pages
  app.get("/api/industry-pages/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ success: false, message: "Search query is required" });
      }

      const pages = await storage.searchIndustryPages(query);
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get published industry pages (public)
  app.get("/api/industry-pages/published", async (req, res) => {
    try {
      const pages = await storage.getPublishedIndustryPages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get industry page by slug
  app.get("/api/industry-pages/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getIndustryPageBySlug(slug);
      if (!page) {
        return res.status(404).json({ success: false, message: "Industry page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get all industry pages
  app.get("/api/industry-pages", async (req, res) => {
    try {
      const pages = await storage.getAllIndustryPages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get single industry page by ID
  app.get("/api/industry-pages/:id", async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const page = await storage.getIndustryPage(id);
      if (!page) {
        return res.status(404).json({ success: false, message: "Industry page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Create new industry page
  app.post("/api/industry-pages", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const pageData = insertIndustryPageSchema.parse(req.body);
      const page = await storage.createIndustryPage(pageData);
      res.json({ success: true, page });
    } catch (error: any) {
      console.error("Error creating industry page:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Update industry page
  app.put("/api/industry-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const pageData = insertIndustryPageSchema.partial().parse(req.body);
      const page = await storage.updateIndustryPage(id, pageData);
      res.json({ success: true, page });
    } catch (error: any) {
      console.error("Error updating industry page:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Delete industry page
  app.delete("/api/industry-pages/:id", authenticateToken, authorizeRole(["super_admin", "user_admin", "service_editor"]), async (req, res) => {
    try {
      const id = parseId(req.params.id);
      await storage.deleteIndustryPage(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ===== SEO MANAGEMENT API ROUTES =====

  // SEO Settings Routes
  app.get("/api/seo/settings", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const settings = await storage.getAllSeoSettings();
      res.json({ success: true, settings });
    } catch (error: any) {
      console.error("Error fetching SEO settings:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO settings" });
    }
  });

  app.get("/api/seo/settings/:key", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSeoSettingByKey(key);
      if (!setting) {
        return res.status(404).json({ success: false, message: "Setting not found" });
      }
      res.json({ success: true, setting });
    } catch (error: any) {
      console.error("Error fetching SEO setting:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO setting" });
    }
  });

  app.post("/api/seo/settings", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const data = insertSeoSettingsSchema.parse(req.body);
      const setting = await storage.createSeoSetting(data);
      res.json({ success: true, setting });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating SEO setting:", error);
        res.status(500).json({ success: false, message: "Failed to create SEO setting" });
      }
    }
  });

  app.put("/api/seo/settings/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertSeoSettingsSchema.partial().parse(req.body);
      const setting = await storage.updateSeoSetting(Number(id), data);
      res.json({ success: true, setting });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating SEO setting:", error);
        res.status(500).json({ success: false, message: "Failed to update SEO setting" });
      }
    }
  });

  app.delete("/api/seo/settings/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSeoSetting(Number(id));
      res.json({ success: true, message: "SEO setting deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting SEO setting:", error);
      res.status(500).json({ success: false, message: "Failed to delete SEO setting" });
    }
  });

  // SEO Keywords Routes
  app.get("/api/seo/keywords", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const keywords = await storage.getAllSeoKeywords();
      res.json({ success: true, keywords });
    } catch (error: any) {
      console.error("Error fetching SEO keywords:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO keywords" });
    }
  });

  app.get("/api/seo/keywords/category/:category", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { category } = req.params;
      const keywords = await storage.getSeoKeywordsByCategory(category);
      res.json({ success: true, keywords });
    } catch (error: any) {
      console.error("Error fetching SEO keywords by category:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO keywords" });
    }
  });

  app.post("/api/seo/keywords", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const data = insertSeoKeywordsSchema.parse(req.body);
      const keyword = await storage.createSeoKeyword(data);
      res.json({ success: true, keyword });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating SEO keyword:", error);
        res.status(500).json({ success: false, message: "Failed to create SEO keyword" });
      }
    }
  });

  app.put("/api/seo/keywords/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertSeoKeywordsSchema.partial().parse(req.body);
      const keyword = await storage.updateSeoKeyword(Number(id), data);
      res.json({ success: true, keyword });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating SEO keyword:", error);
        res.status(500).json({ success: false, message: "Failed to update SEO keyword" });
      }
    }
  });

  app.put("/api/seo/keywords/:id/ranking", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { currentRanking } = req.body;
      await storage.updateKeywordRankings(Number(id), currentRanking);
      res.json({ success: true, message: "Keyword ranking updated successfully" });
    } catch (error: any) {
      console.error("Error updating keyword ranking:", error);
      res.status(500).json({ success: false, message: "Failed to update keyword ranking" });
    }
  });

  app.delete("/api/seo/keywords/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSeoKeyword(Number(id));
      res.json({ success: true, message: "SEO keyword deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting SEO keyword:", error);
      res.status(500).json({ success: false, message: "Failed to delete SEO keyword" });
    }
  });

  // SEO Analytics Routes
  app.get("/api/seo/analytics", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { limit = 50, page = "", pageType = "" } = req.query;

      let analytics;
      if (page) {
        analytics = await storage.getSeoAnalyticsByPage(page as string);
      } else if (pageType) {
        analytics = await storage.getSeoAnalyticsByPageType(pageType as string);
      } else {
        analytics = await storage.getLatestSeoAnalytics(Number(limit));
      }

      res.json({ success: true, analytics });
    } catch (error: any) {
      console.error("Error fetching SEO analytics:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO analytics" });
    }
  });

  app.post("/api/seo/analytics", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const data = insertSeoAnalyticsSchema.parse(req.body);
      const analytics = await storage.createSeoAnalytics(data);
      res.json({ success: true, analytics });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating SEO analytics:", error);
        res.status(500).json({ success: false, message: "Failed to create SEO analytics" });
      }
    }
  });

  app.put("/api/seo/analytics/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertSeoAnalyticsSchema.partial().parse(req.body);
      const analytics = await storage.updateSeoAnalytics(Number(id), data);
      res.json({ success: true, analytics });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating SEO analytics:", error);
        res.status(500).json({ success: false, message: "Failed to update SEO analytics" });
      }
    }
  });

  // SEO Page Data Routes
  app.get("/api/seo/pages", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { pageType } = req.query;

      // Get all actual pages from content tables
      const pages = await storage.getAllPagesForSeo();

      // Filter by pageType if specified
      const filteredPages = pageType ? pages.filter(page => page.pageType === pageType) : pages;

      res.json({ success: true, pages: filteredPages });
    } catch (error: any) {
      console.error("Error fetching SEO page data:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO page data" });
    }
  });

  app.get("/api/seo/pages/:pageType/:referenceId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { pageType, referenceId } = req.params;
      const page = await storage.getSeoPageData(pageType, Number(referenceId));
      if (!page) {
        return res.status(404).json({ success: false, message: "SEO page data not found" });
      }
      res.json({ success: true, page });
    } catch (error: any) {
      console.error("Error fetching SEO page data:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO page data" });
    }
  });

  app.post("/api/seo/pages", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const data = insertSeoPageDataSchema.parse(req.body);
      const page = await storage.createSeoPageData(data);
      res.json({ success: true, page });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating SEO page data:", error);
        res.status(500).json({ success: false, message: "Failed to create SEO page data" });
      }
    }
  });

  app.put("/api/seo/pages/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertSeoPageDataSchema.partial().parse(req.body);
      const page = await storage.updateSeoPageData(Number(id), data);
      res.json({ success: true, page });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating SEO page data:", error);
        res.status(500).json({ success: false, message: "Failed to update SEO page data" });
      }
    }
  });

  app.delete("/api/seo/pages/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSeoPageData(Number(id));
      res.json({ success: true, message: "SEO page data deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting SEO page data:", error);
      res.status(500).json({ success: false, message: "Failed to delete SEO page data" });
    }
  });


  // SEO Dashboard Overview Route
  app.get("/api/seo/overview", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const overview = await storage.getSeoOverview();
      res.json({ success: true, overview });
    } catch (error: any) {
      console.error("Error fetching SEO overview:", error);
      res.status(500).json({ success: false, message: "Failed to fetch SEO overview" });
    }
  });

  // Sitemap Data Route (for sitemap management)
  app.get("/api/seo/sitemap-data", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const sitemapData = await storage.getSitemapData();
      res.json({ success: true, data: sitemapData });
    } catch (error: any) {
      console.error("Error fetching sitemap data:", error);
      res.status(500).json({ success: false, message: "Failed to fetch sitemap data" });
    }
  });

  // Refresh Sitemap Route (triggers manual sitemap regeneration)
  app.post("/api/seo/sitemap/refresh", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      await sitemapGenerator.generateSitemap();
      res.json({ success: true, message: "Sitemap refreshed successfully" });
    } catch (error: any) {
      console.error("Error refreshing sitemap:", error);
      res.status(500).json({ success: false, message: "Failed to refresh sitemap" });
    }
  });

  // ============================================================================
  // CENTRALIZED LINK MANAGEMENT SYSTEM API ROUTES
  // ============================================================================

  // Central Link Registry Routes

  // Get all central links
  app.get("/api/links/central", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const links = await storage.getAllCentralLinks();
      res.json({ success: true, links });
    } catch (error: any) {
      console.error("Error fetching central links:", error);
      res.status(500).json({ success: false, message: "Failed to fetch central links" });
    }
  });

  // Search central links
  app.get("/api/links/central/search", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ success: false, message: "Search query is required" });
      }

      const links = await storage.searchCentralLinks(query);
      res.json({ success: true, links });
    } catch (error: any) {
      console.error("Error searching central links:", error);
      res.status(500).json({ success: false, message: "Failed to search central links" });
    }
  });

  // Get central links by category
  app.get("/api/links/central/category/:category", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { category } = req.params;
      const links = await storage.getCentralLinksByCategory(category);
      res.json({ success: true, links });
    } catch (error: any) {
      console.error("Error fetching central links by category:", error);
      res.status(500).json({ success: false, message: "Failed to fetch central links by category" });
    }
  });

  // Get single central link
  app.get("/api/links/central/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      const link = await storage.getCentralLink(linkId);

      if (!link) {
        return res.status(404).json({ success: false, message: "Central link not found" });
      }

      res.json({ success: true, link });
    } catch (error: any) {
      console.error("Error fetching central link:", error);
      res.status(500).json({ success: false, message: "Failed to fetch central link" });
    }
  });

  // Create new central link
  app.post("/api/links/central", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const validatedData = insertCentralLinkRegistrySchema.parse(req.body);

      // Check for duplicate URLs
      const existingLinks = await storage.getCentralLinksByTargetUrl(validatedData.targetUrl);
      if (existingLinks.length > 0) {
        return res.status(409).json({
          success: false,
          message: "A link with this target URL already exists",
          existingLink: existingLinks[0]
        });
      }

      const link = await storage.createCentralLink(validatedData);
      res.status(201).json({ success: true, link, message: "Central link created successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating central link:", error);
        res.status(500).json({ success: false, message: "Failed to create central link" });
      }
    }
  });

  // Update central link
  app.put("/api/links/central/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      const validatedData = insertCentralLinkRegistrySchema.partial().parse(req.body);

      const link = await storage.updateCentralLink(linkId, validatedData);
      res.json({ success: true, link, message: "Central link updated and synchronized across content" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating central link:", error);
        res.status(500).json({ success: false, message: "Failed to update central link" });
      }
    }
  });

  // Delete central link
  app.delete("/api/links/central/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      await storage.deleteCentralLink(linkId);
      res.json({ success: true, message: "Central link deleted and removed from all content" });
    } catch (error: any) {
      console.error("Error deleting central link:", error);
      res.status(500).json({ success: false, message: "Failed to delete central link" });
    }
  });

  // Link Usage Mapping Routes

  // Get all link usages
  app.get("/api/links/usage", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const usages = await storage.getAllLinkUsages();
      res.json({ success: true, usages });
    } catch (error: any) {
      console.error("Error fetching link usages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link usages" });
    }
  });

  // Get link usage by link ID
  app.get("/api/links/usage/link/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      const usages = await storage.getLinkUsagesByLink(linkId);
      res.json({ success: true, usages });
    } catch (error: any) {
      console.error("Error fetching link usages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link usages" });
    }
  });

  // Get link usage by content
  app.get("/api/links/usage/content/:contentType/:contentId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      const usages = await storage.getLinkUsagesByContent(contentType, parseInt(contentId));
      res.json({ success: true, usages });
    } catch (error: any) {
      console.error("Error fetching link usages by content:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link usages by content" });
    }
  });

  // Link Redirect Routes

  // Get all link redirects
  app.get("/api/links/redirects", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const redirects = await storage.getAllLinkRedirects();
      res.json({ success: true, redirects });
    } catch (error: any) {
      console.error("Error fetching link redirects:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link redirects" });
    }
  });

  // Get active redirects only
  app.get("/api/links/redirects/active", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const redirects = await storage.getActiveLinkRedirects();
      res.json({ success: true, redirects });
    } catch (error: any) {
      console.error("Error fetching active link redirects:", error);
      res.status(500).json({ success: false, message: "Failed to fetch active link redirects" });
    }
  });

  // Create link redirect
  app.post("/api/links/redirects", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const validatedData = insertLinkRedirectsSchema.parse(req.body);
      const redirect = await storage.createLinkRedirect(validatedData);
      res.status(201).json({ success: true, redirect, message: "Link redirect created successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating link redirect:", error);
        res.status(500).json({ success: false, message: "Failed to create link redirect" });
      }
    }
  });

  // Update link redirect
  app.put("/api/links/redirects/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertLinkRedirectsSchema.partial().parse(req.body);

      const redirect = await storage.updateLinkRedirect(parseInt(id), validatedData);
      res.json({ success: true, redirect, message: "Link redirect updated successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating link redirect:", error);
        res.status(500).json({ success: false, message: "Failed to update link redirect" });
      }
    }
  });

  // Delete link redirect
  app.delete("/api/links/redirects/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLinkRedirect(parseInt(id));
      res.json({ success: true, message: "Link redirect deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting link redirect:", error);
      res.status(500).json({ success: false, message: "Failed to delete link redirect" });
    }
  });

  // Link Validation Routes

  // Validate all links
  app.post("/api/links/validate-all", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const validations = await storage.validateAllLinks();
      res.json({
        success: true,
        validations,
        message: `Validated ${validations.length} links successfully`
      });
    } catch (error: any) {
      console.error("Error validating all links:", error);
      res.status(500).json({ success: false, message: "Failed to validate all links" });
    }
  });

  // Validate single link
  app.post("/api/links/validate/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      const validation = await storage.validateLink(linkId);
      res.json({ success: true, validation, message: "Link validated successfully" });
    } catch (error: any) {
      console.error("Error validating link:", error);
      res.status(500).json({ success: false, message: "Failed to validate link" });
    }
  });

  // Get broken links
  app.get("/api/links/broken", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const brokenLinks = await storage.getBrokenLinks();
      res.json({ success: true, brokenLinks });
    } catch (error: any) {
      console.error("Error fetching broken links:", error);
      res.status(500).json({ success: false, message: "Failed to fetch broken links" });
    }
  });

  // Get link validation history
  app.get("/api/links/validation/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      const validations = await storage.getLinkValidationHistory(linkId);
      res.json({ success: true, validations });
    } catch (error: any) {
      console.error("Error fetching link validation history:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link validation history" });
    }
  });

  // Link Synchronization Routes

  // Sync all links in CMS
  app.post("/api/links/sync-all", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      await storage.syncAllLinksInCMS();
      res.json({ success: true, message: "All CMS content synchronized successfully" });
    } catch (error: any) {
      console.error("Error syncing all CMS links:", error);
      res.status(500).json({ success: false, message: "Failed to sync all CMS links" });
    }
  });

  // Sync specific content
  app.post("/api/links/sync/:contentType/:contentId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      await storage.syncLinksInContent(contentType, parseInt(contentId));
      res.json({ success: true, message: `Content ${contentType}/${contentId} synchronized successfully` });
    } catch (error: any) {
      console.error("Error syncing content links:", error);
      res.status(500).json({ success: false, message: "Failed to sync content links" });
    }
  });

  // Find and replace link in content
  app.post("/api/links/find-replace", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { oldTargetUrl, newTargetUrl } = req.body;

      if (!oldTargetUrl || !newTargetUrl) {
        return res.status(400).json({
          success: false,
          message: "Both oldTargetUrl and newTargetUrl are required"
        });
      }

      const replacementCount = await storage.findAndReplaceLinkInContent(oldTargetUrl, newTargetUrl);

      res.json({
        success: true,
        replacementCount,
        message: `Replaced ${replacementCount} link occurrences successfully`
      });
    } catch (error: any) {
      console.error("Error finding and replacing links:", error);
      res.status(500).json({ success: false, message: "Failed to find and replace links" });
    }
  });

  // Link Analytics Routes

  // Get link analytics
  app.get("/api/links/analytics/:linkId", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkId } = req.params;
      const analytics = await storage.getLinkAnalytics(linkId);
      res.json({ success: true, analytics });
    } catch (error: any) {
      console.error("Error fetching link analytics:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link analytics" });
    }
  });

  // Get usage report
  app.get("/api/links/report", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const report = await storage.getLinkUsageReport();
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error fetching link usage report:", error);
      res.status(500).json({ success: false, message: "Failed to fetch link usage report" });
    }
  });

  // Migration and Content Discovery Routes

  // Discover links in existing content
  app.post("/api/links/discover", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const result = await storage.discoverLinksInExistingContent();
      res.json({
        success: true,
        result,
        message: `Discovered ${result.discovered} links, created ${result.created} new entries, found ${result.duplicates} duplicates`
      });
    } catch (error: any) {
      console.error("Error discovering links in content:", error);
      res.status(500).json({ success: false, message: "Failed to discover links in content" });
    }
  });


  // Public Link Resolution Route (no authentication - for frontend use)
  app.get("/api/links/resolve/:linkId", async (req, res) => {
    try {
      const { linkId } = req.params;

      // Resolve redirect chain to get final target
      const finalLinkId = await storage.resolveLinkRedirect(linkId);
      const link = await storage.getCentralLink(finalLinkId);

      if (!link || link.status !== 'active') {
        return res.status(404).json({ success: false, message: "Link not found or inactive" });
      }

      // Update last accessed (fire and forget)
      storage.updateCentralLink(link.linkId, {
        lastAccessed: new Date()
      }).catch(console.error);

      res.json({
        success: true,
        targetUrl: link.targetUrl,
        displayText: link.displayText,
        title: link.title,
        linkId: link.linkId
      });
    } catch (error: any) {
      console.error("Error resolving link:", error);
      res.status(500).json({ success: false, message: "Failed to resolve link" });
    }
  });

  // ===== ROBOTS.TXT MANAGEMENT ROUTES =====

  // Public robots.txt endpoint - NO AUTHENTICATION REQUIRED
  app.get("/robots.txt", async (req, res) => {
    try {
      const settings = await storage.getActiveRobotsTxtSettings();
      const content = settings?.content || `User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml`;

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(content);
    } catch (error: any) {
      console.error("Error serving robots.txt:", error);
      res.setHeader('Content-Type', 'text/plain');
      res.send(`User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml`);
    }
  });

  // Get current active robots.txt settings (admin only)
  app.get("/api/seo/robots-txt", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const settings = await storage.getRobotsTxtSettings();
      res.json({ success: true, settings });
    } catch (error: any) {
      console.error("Error fetching robots.txt settings:", error);
      res.status(500).json({ success: false, message: "Failed to fetch robots.txt settings" });
    }
  });

  // Get all robots.txt versions (admin only)
  app.get("/api/seo/robots-txt/versions", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const versions = await storage.getAllRobotsTxtVersions();
      res.json({ success: true, versions });
    } catch (error: any) {
      console.error("Error fetching robots.txt versions:", error);
      res.status(500).json({ success: false, message: "Failed to fetch robots.txt versions" });
    }
  });

  // Create/Update robots.txt settings
  // Create new robots.txt version (admin only)
  app.post("/api/seo/robots-txt", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const data = insertRobotsTxtSettingsSchema.parse({
        ...req.body,
        createdBy: req.user.email,
        updatedBy: req.user.email
      });
      const settings = await storage.createRobotsTxtSettings(data);
      res.json({ success: true, settings });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating robots.txt version:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create robots.txt version" });
      }
    }
  });

  // Update specific robots.txt settings
  // Activate a specific robots.txt version (admin only)
  app.put("/api/seo/robots-txt/:id/activate", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const settings = await storage.activateRobotsTxtVersion(Number(id));
      res.json({ success: true, settings, message: `Version ${settings.version} activated successfully` });
    } catch (error: any) {
      console.error("Error activating robots.txt version:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to activate robots.txt version" });
    }
  });

  // Delete a specific robots.txt version (admin only)
  app.delete("/api/seo/robots-txt/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRobotsTxtVersion(Number(id));
      res.json({ success: true, message: "Robots.txt version deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting robots.txt version:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to delete robots.txt version" });
    }
  });

  // ===== PAGE INDEXING STATUS MANAGEMENT ROUTES =====

  // Get page indexing status by URL (public endpoint for runtime integration)
  app.get("/api/seo/page-indexing/check", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ success: false, message: "URL parameter is required" });
      }

      const status = await storage.getPageIndexingStatus(url as string);
      const defaultStatus = {
        isIndexable: true,
        metaRobotsTag: "index, follow"
      };

      res.json({
        success: true,
        status: status || defaultStatus,
        isIndexable: status?.isIndexable ?? true,
        metaRobotsTag: status?.metaRobotsTag || "index, follow"
      });
    } catch (error: any) {
      console.error("Error checking page indexing status:", error);
      res.json({
        success: true,
        isIndexable: true,
        metaRobotsTag: "index, follow"
      });
    }
  });

  // Get all page indexing statuses (admin only)
  app.get("/api/seo/page-indexing", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { pageType } = req.query;
      let statuses;

      if (pageType) {
        statuses = await storage.getPageIndexingStatusByType(pageType as string);
      } else {
        statuses = await storage.getAllPageIndexingStatuses();
      }

      res.json({ success: true, statuses });
    } catch (error: any) {
      console.error("Error fetching page indexing statuses:", error);
      res.status(500).json({ success: false, message: "Failed to fetch page indexing statuses" });
    }
  });

  // Create new page indexing status
  app.post("/api/seo/page-indexing", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const data = insertPageIndexingStatusSchema.parse({
        ...req.body,
        createdBy: req.user.email,
        updatedBy: req.user.email
      });
      const status = await storage.createPageIndexingStatus(data);
      res.json({ success: true, status });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating page indexing status:", error);
        res.status(500).json({ success: false, message: "Failed to create page indexing status" });
      }
    }
  });

  // Update page indexing status
  app.put("/api/seo/page-indexing/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { id } = req.params;
      const data = insertPageIndexingStatusSchema.partial().parse({
        ...req.body,
        updatedBy: req.user.email
      });
      const status = await storage.updatePageIndexingStatus(Number(id), data);
      res.json({ success: true, status });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating page indexing status:", error);
        res.status(500).json({ success: false, message: "Failed to update page indexing status" });
      }
    }
  });

  // Toggle page indexing status (indexing <-> non-indexing)
  app.put("/api/seo/page-indexing/:id/toggle", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const status = await storage.togglePageIndexingStatus(Number(id));
      res.json({
        success: true,
        status,
        message: `Page ${status.isIndexable ? 'set to indexing' : 'set to non-indexing'}`
      });
    } catch (error: any) {
      console.error("Error toggling page indexing status:", error);
      res.status(500).json({ success: false, message: "Failed to toggle page indexing status" });
    }
  });

  // Delete page indexing status
  app.delete("/api/seo/page-indexing/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePageIndexingStatus(Number(id));
      res.json({ success: true, message: "Page indexing status deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting page indexing status:", error);
      res.status(500).json({ success: false, message: "Failed to delete page indexing status" });
    }
  });

  // Get page indexing status by URL
  app.get("/api/seo/page-indexing/url", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { pageUrl } = req.query;
      if (!pageUrl || typeof pageUrl !== 'string') {
        return res.status(400).json({ success: false, message: "pageUrl query parameter is required" });
      }
      const decodedUrl = decodeURIComponent(pageUrl);
      const status = await storage.getPageIndexingStatus(decodedUrl);

      if (!status) {
        return res.status(404).json({ success: false, message: "Page indexing status not found" });
      }

      res.json({ success: true, status });
    } catch (error: any) {
      console.error("Error fetching page indexing status by URL:", error);
      res.status(500).json({ success: false, message: "Failed to fetch page indexing status" });
    }
  });

  // Update Sitemap Route (selective sitemap updates)
  app.post("/api/seo/sitemap/update", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { sections } = req.body; // Array of sections to update: ['services', 'blog', 'hire', 'case-studies']
      const result = await sitemapGenerator.updateSelectiveSections(sections);
      res.json({
        success: true,
        message: "Sitemap updated successfully",
        ...result // This includes updatedSections, timestamp, and totalUpdatedPages
      });
    } catch (error: any) {
      console.error("Error updating sitemap:", error);
      res.status(500).json({ success: false, message: "Failed to update sitemap" });
    }
  });

  // ============================================================================
  // Internal links Management API - Bidirectional Sync System
  // ============================================================================

  // Get all backlinks with filtering
  app.get("/api/seo/backlinks", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const {
        status,
        linkType,
        contentType,
        contentId,
        validationStatus
      } = req.query;

      let links = await storage.getAllCentralLinks();
      const allUsages = await storage.getAllLinkUsages();

      // IMPORTANT: Filter out internal links - backlinks should only show external links
      // Internal navigation links (starting with /) shouldn't appear in the Backlinks manager
      // Check the actual URL, not just the linkType field (in case of miscategorization)
      links = links.filter(link => !link.targetUrl.startsWith('/'));

      // Apply filters
      if (status) links = links.filter(link => link.status === status);
      if (linkType) links = links.filter(link => link.linkType === linkType);
      if (validationStatus) links = links.filter(link => link.validationStatus === validationStatus);

      // Get usage counts for each link individually (show each anchor text variation as separate row)
      const linksWithUsage = await Promise.all(
        links.map(async (link) => {
          // Filter to only include active usages for this specific linkId
          const linkUsages = allUsages.filter((u: any) => u.linkId === link.linkId && u.isActive !== false);
          const filteredUsages = contentType
            ? linkUsages.filter((u: any) => u.contentType === contentType && (contentId ? u.contentId === Number(contentId) : true))
            : linkUsages;

          return {
            ...link,
            usageCount: filteredUsages.length,
            usages: filteredUsages
          };
        })
      );

      // Filter out links with zero active usages
      const activeLinks = linksWithUsage.filter(link => link.usageCount > 0);

      res.json({
        success: true,
        backlinks: activeLinks,
        total: activeLinks.length
      });
    } catch (error: any) {
      console.error("Error fetching backlinks:", error);
      res.status(500).json({ success: false, message: "Failed to fetch backlinks" });
    }
  });

  // Get backlinks statistics (must come before /:id route to avoid conflict)
  app.get("/api/seo/backlinks/stats", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      // Get link statistics from existing methods
      const allLinks = await storage.getAllCentralLinks();
      const allUsages = await storage.getAllLinkUsages();
      // Filter to only count active usages
      const activeUsages = allUsages.filter((u: any) => u.isActive !== false);

      // Get unique link IDs that have at least one active usage
      const linkIdsWithActiveUsages = new Set(activeUsages.map((u: any) => u.linkId));

      // IMPORTANT: Filter to only include external links (same as backlinks endpoint)
      // Internal navigation links (starting with /) shouldn't be counted in backlinks stats
      // Check the actual URL, not just the linkType field (in case of miscategorization)
      const linksWithActiveUsages = allLinks.filter((l: any) =>
        linkIdsWithActiveUsages.has(l.linkId) && !l.targetUrl.startsWith('/')
      );

      const stats = {
        totalLinks: linksWithActiveUsages.length, // Only count external links with active usages
        activeLinks: linksWithActiveUsages.filter((l: any) => l.status === 'active').length,
        brokenLinks: linksWithActiveUsages.filter((l: any) => l.status === 'broken' || l.validationStatus === 'invalid').length,
        redirectLinks: linksWithActiveUsages.filter((l: any) => l.status === 'redirect').length,
        totalUsages: activeUsages.length,
        usagesByType: activeUsages.reduce((acc: any, usage: any) => {
          acc[usage.contentType] = (acc[usage.contentType] || 0) + 1;
          return acc;
        }, {})
      };

      res.json({ success: true, stats });
    } catch (error: any) {
      console.error("Error fetching backlinks stats:", error);
      res.status(500).json({ success: false, message: "Failed to fetch backlinks statistics" });
    }
  });

  // Fix link types for existing links (utility endpoint)
  app.post("/api/seo/backlinks/fix-link-types", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      console.log('[Fix Link Types] Starting link type correction...');
      const allLinks = await storage.getAllCentralLinks();
      let fixedCount = 0;

      for (const link of allLinks) {
        // Check if this is an internal link (starts with /)
        if (link.targetUrl.startsWith('/') && link.linkType !== 'internal') {
          console.log(`[Fix Link Types] Updating link ${link.linkId} from ${link.linkType} to internal: ${link.targetUrl}`);
          await storage.updateCentralLink(link.linkId, { linkType: 'internal' });
          fixedCount++;
        }
      }

      console.log(`[Fix Link Types] Fixed ${fixedCount} links`);
      res.json({
        success: true,
        message: `Fixed ${fixedCount} links`,
        fixedCount
      });
    } catch (error: any) {
      console.error("Error fixing link types:", error);
      res.status(500).json({ success: false, message: "Failed to fix link types" });
    }
  });

  // Track if a scan is already running
  let isScanRunning = false;

  // Scan website for all links
  app.post("/api/seo/backlinks/scan-website", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      // Prevent duplicate scans
      if (isScanRunning) {
        return res.status(429).json({
          success: false,
          message: "A scan is already in progress. Please wait for it to complete."
        });
      }

      isScanRunning = true;
      console.log('[Scan Website] Starting full website scan...');
      const results = {
        blog: { scanned: 0, linksFound: 0, errors: 0 },
        service: { scanned: 0, linksFound: 0, errors: 0 },
        hire: { scanned: 0, linksFound: 0, errors: 0 },
        caseStudy: { scanned: 0, linksFound: 0, errors: 0 }
      };

      // Scan all blog posts
      try {
        const blogs = await storage.getBlogPosts();
        console.log(`[Scan Website] Found ${blogs.length} blog posts to scan`);

        for (const blog of blogs) {
          if (blog.content) {
            try {
              // Convert string ID to number for link sync (contentId must be number)
              const contentId = typeof blog.id === 'string'
                ? parseInt(blog.id.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0
                : blog.id;
              const syncResult = await linkSyncManager.syncLinksForContent(
                'blog',
                contentId,
                blog.content,
                blog.title,
                'content',
                'markdown'  // Changed to markdown to detect both markdown and HTML links
              );
              results.blog.scanned++;
              results.blog.linksFound += syncResult.added;
            } catch (error) {
              console.error(`[Scan Website] Error scanning blog ${blog.id}:`, error);
              results.blog.errors++;
            }
          }
        }
      } catch (error) {
        console.error('[Scan Website] Error scanning blogs:', error);
      }

      // Scan all services
      try {
        const services = await storage.getAllServices();
        console.log(`[Scan Website] Found ${services.length} services to scan`);

        for (const service of services) {
          if (service.content) {
            try {
              // Convert string ID to number for link sync (contentId must be number)
              const contentId = typeof service.id === 'string'
                ? parseInt(service.id.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0
                : service.id;
              const syncResult = await linkSyncManager.syncLinksForContent(
                'service',
                contentId,
                service.content,
                service.title,
                'content',
                'markdown'  // Changed to markdown to detect both markdown and HTML links
              );
              results.service.scanned++;
              results.service.linksFound += syncResult.added;
            } catch (error) {
              console.error(`[Scan Website] Error scanning service ${service.id}:`, error);
              results.service.errors++;
            }
          }
        }
      } catch (error) {
        console.error('[Scan Website] Error scanning services:', error);
      }

      // Scan all hire developer pages
      try {
        const hirePages = await storage.getAllHirePages();
        console.log(`[Scan Website] Found ${hirePages.length} hire developer pages to scan`);

        for (const page of hirePages) {
          if (page.content) {
            try {
              // Convert string ID to number for link sync (contentId must be number)
              const contentId = typeof page.id === 'string'
                ? parseInt(page.id.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0
                : page.id;
              const syncResult = await linkSyncManager.syncLinksForContent(
                'hire',
                contentId,
                page.content,
                page.title,
                'content',
                'markdown'  // Changed to markdown to detect both markdown and HTML links
              );
              results.hire.scanned++;
              results.hire.linksFound += syncResult.added;
            } catch (error) {
              console.error(`[Scan Website] Error scanning hire page ${page.id}:`, error);
              results.hire.errors++;
            }
          }
        }
      } catch (error) {
        console.error('[Scan Website] Error scanning hire pages:', error);
      }

      // Scan all case studies
      try {
        const caseStudies = await storage.getAllCaseStudyPages();
        console.log(`[Scan Website] Found ${caseStudies.length} case studies to scan`);

        for (const caseStudy of caseStudies) {
          if (caseStudy.content) {
            try {
              // Convert string ID to number for link sync (contentId must be number)
              const contentId = typeof caseStudy.id === 'string'
                ? parseInt(caseStudy.id.replace(/[^0-9a-f]/gi, '').substring(0, 8), 16) || 0
                : caseStudy.id;
              const syncResult = await linkSyncManager.syncLinksForContent(
                'case-study',
                contentId,
                caseStudy.content,
                caseStudy.title,
                'content',
                'markdown'  // Changed to markdown to detect both markdown and HTML links
              );
              results.caseStudy.scanned++;
              results.caseStudy.linksFound += syncResult.added;
            } catch (error) {
              console.error(`[Scan Website] Error scanning case study ${caseStudy.id}:`, error);
              results.caseStudy.errors++;
            }
          }
        }
      } catch (error) {
        console.error('[Scan Website] Error scanning case studies:', error);
      }

      const totalScanned = results.blog.scanned + results.service.scanned + results.hire.scanned + results.caseStudy.scanned;
      const totalLinksFound = results.blog.linksFound + results.service.linksFound + results.hire.linksFound + results.caseStudy.linksFound;
      const totalErrors = results.blog.errors + results.service.errors + results.hire.errors + results.caseStudy.errors;

      console.log(`[Scan Website] Scan complete: ${totalScanned} pages scanned, ${totalLinksFound} links found, ${totalErrors} errors`);

      res.json({
        success: true,
        message: `Scanned ${totalScanned} pages and found ${totalLinksFound} links`,
        results,
        summary: {
          totalScanned,
          totalLinksFound,
          totalErrors
        }
      });
    } catch (error: any) {
      console.error("Error scanning website:", error);
      res.status(500).json({ success: false, message: "Failed to scan website" });
    } finally {
      // Always reset the flag when scan is done
      isScanRunning = false;
      console.log('[Scan Website] Scan lock released');
    }
  });

  // Get single backlink with detailed usage information
  app.get("/api/seo/backlinks/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const link = await storage.getCentralLink(id);

      if (!link) {
        return res.status(404).json({ success: false, message: "Backlink not found" });
      }

      const allUsages = await storage.getAllLinkUsages();
      // Filter to only include active usages
      const usages = allUsages.filter((u: any) => u.linkId === id && u.isActive !== false);
      const validations = await storage.getLinkValidationHistory(id);

      res.json({
        success: true,
        backlink: {
          ...link,
          usages,
          validations,
          usageCount: usages.length
        }
      });
    } catch (error: any) {
      console.error("Error fetching backlink:", error);
      res.status(500).json({ success: false, message: "Failed to fetch backlink" });
    }
  });

  // Create new backlink manually
  app.post("/api/seo/backlinks", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const data = {
        ...req.body,
        createdBy: req.user.email,
        updatedBy: req.user.email
      };

      const link = await storage.createCentralLink(data);

      res.json({ success: true, backlink: link });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating backlink:", error);
        res.status(500).json({ success: false, message: "Failed to create backlink" });
      }
    }
  });

  // Update backlink
  app.patch("/api/seo/backlinks/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { id } = req.params;
      const { propagateToContent, ...updateData } = req.body;

      const data = {
        ...updateData,
        updatedBy: req.user.email
      };

      const updatedLink = await storage.updateCentralLink(id, data);

      if (!updatedLink) {
        return res.status(404).json({ success: false, message: "Backlink not found" });
      }

      // Propagate changes to content if requested
      let propagationResult = null;
      if (propagateToContent && (updateData.targetUrl || updateData.displayText)) {
        console.log("[Backlink Update] Propagating changes to content...");
        try {
          const linkSyncManager = new LinkSyncManager(storage);
          const result = await linkSyncManager.propagateLinksToContent(
            id,
            updateData.targetUrl,
            updateData.displayText
          );
          console.log(`[Backlink Update] Propagated to ${result.updated} content items`);
          if (result.errors.length > 0) {
            console.warn("[Backlink Update] Some errors occurred:", result.errors);
          }
          propagationResult = {
            updatedCount: result.updated,
            errorCount: result.errors.length,
            errors: result.errors.length > 0 ? result.errors.slice(0, 3) : undefined // Only send first 3 errors
          };
        } catch (propagateError: any) {
          console.error("[Backlink Update] Failed to propagate changes:", propagateError);
          propagationResult = {
            updatedCount: 0,
            errorCount: 1,
            errors: [propagateError.message]
          };
        }
      }

      res.json({
        success: true,
        backlink: updatedLink,
        propagation: propagationResult
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating backlink:", error);
        res.status(500).json({ success: false, message: "Failed to update backlink" });
      }
    }
  });

  // Delete backlink
  app.delete("/api/seo/backlinks/:id", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { mode } = req.body; // Optional: 'mark-broken' to just mark as broken instead of deleting

      if (mode === 'mark-broken') {
        // Just mark as broken, don't delete
        await storage.updateCentralLink(id, { status: 'broken' });
        res.json({ success: true, message: "Backlink marked as broken" });
      } else {
        // Default behavior: remove from content and delete the backlink
        console.log("[Backlink Delete] Removing links from content...");
        let removalResult = {
          updatedCount: 0,
          errorCount: 0,
          errors: [] as string[]
        };

        try {
          const linkSyncManager = new LinkSyncManager(storage);
          const result = await linkSyncManager.removeLinksFromContent(id);
          console.log(`[Backlink Delete] Removed from ${result.updated} content items`);
          removalResult.updatedCount = result.updated;
          removalResult.errorCount = result.errors.length;
          removalResult.errors = result.errors.slice(0, 3); // Only send first 3 errors
          if (result.errors.length > 0) {
            console.warn("[Backlink Delete] Some errors occurred:", result.errors);
          }
        } catch (removeError: any) {
          console.error("[Backlink Delete] Failed to remove from content:", removeError);
          removalResult.errorCount = 1;
          removalResult.errors = [removeError.message];
          // Continue with deletion anyway
        }

        // Now delete the backlink from registry
        await storage.deleteCentralLink(id);
        const linkExists = await storage.getCentralLink(id);
        if (!linkExists) {
          res.json({
            success: true,
            message: "Backlink deleted successfully and removed from content",
            removal: removalResult
          });
        } else {
          res.status(404).json({ success: false, message: "Backlink not found" });
        }
      }
    } catch (error: any) {
      console.error("Error deleting backlink:", error);
      res.status(500).json({ success: false, message: "Failed to delete backlink" });
    }
  });

  // Scan specific content for links
  app.post("/api/seo/backlinks/scan-content", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { contentType, contentId } = req.body;

      if (!contentType || !contentId) {
        return res.status(400).json({
          success: false,
          message: "contentType and contentId are required"
        });
      }

      // TODO: Implement content scanning
      res.json({
        success: true,
        message: `Scan functionality to be implemented for ${contentType} ${contentId}`
      });
    } catch (error: any) {
      console.error("Error scanning content:", error);
      res.status(500).json({ success: false, message: "Failed to scan content" });
    }
  });

  // Validate links (check if they're still working)
  app.post("/api/seo/backlinks/validate", authenticateToken, authorizeRole(['super_admin', 'content_admin']), async (req, res) => {
    try {
      const { linkIds } = req.body; // Array of link IDs to validate

      if (!linkIds || !Array.isArray(linkIds)) {
        return res.status(400).json({
          success: false,
          message: "linkIds array is required"
        });
      }

      // Use existing validateAllLinks method
      const results = await storage.validateAllLinks();
      const filteredResults = results.filter((r: any) => linkIds.includes(r.linkId));

      res.json({
        success: true,
        validationResults: filteredResults
      });
    } catch (error: any) {
      console.error("Error validating links:", error);
      res.status(500).json({ success: false, message: "Failed to validate links" });
    }
  });


  // AI Model API Key Validation Routes
  app.post("/api/ai/validate-api-key", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      const model = typeof req.body?.model === 'string' ? req.body.model.trim() : '';
      const apiKey = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';

      if (!model || !apiKey) {
        return res.status(400).json({
          success: false,
          message: "Model and API key are required",
        });
      }

      const validModels = ['openai', 'gemini', 'perplexity', 'grok'];
      if (!validModels.includes(model)) {
        return res.status(400).json({
          success: false,
          message: `Invalid model. Must be one of: ${validModels.join(', ')}`,
        });
      }

      // Gemini: use dedicated validator with actionable error messages
      if (model === 'gemini') {
        const { validateGeminiKey } = await import('./utils/unified-ai-client');
        const result = await validateGeminiKey(apiKey);
        if (result.valid) {
          return res.json({ success: true, message: `API key for ${model} is valid` });
        }
        return res.status(400).json({
          success: false,
          message: result.error ?? `API key for ${model} is invalid`,
        });
      }

      // Other providers
      const { getAIProvider } = await import('./utils/unified-ai-client');
      const provider = getAIProvider(model as any, apiKey);
      const isValid = await provider.validateApiKey(apiKey);

      if (isValid) {
        return res.json({ success: true, message: `API key for ${model} is valid` });
      }
      res.status(400).json({
        success: false,
        message: `API key for ${model} is invalid`,
      });
    } catch (error: any) {
      console.error("Failed to validate API key:", error);
      res.status(500).json({
        success: false,
        message: error?.message ?? "Failed to validate API key",
      });
    }
  });

  app.post("/api/ai/test-model", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      const useDefaultFromEnv = !!settings?.aiModelSettings?.useDefaultModelFromEnv;
      const selectedModel = settings?.aiModelSettings?.selectedModel;

      // When "Use default model from ENV" is on, always test OpenAI+ENV (what we use for generation).
      if (useDefaultFromEnv) {
        const envKey = process.env.OPENAI_API_KEY;
        if (!envKey) {
          return res.status(400).json({
            success: false,
            message: "Use default model from ENV is enabled but OPENAI_API_KEY is not set in environment.",
          });
        }
        const { getActiveAIProvider } = await import('./utils/ai-settings-manager');
        const provider = await getActiveAIProvider();
        const testPrompt = "Say 'Hello, this is a test' and nothing else.";
        const response = await provider.generateText(testPrompt, { maxTokens: 20 });
        if (response && response.length > 0) {
          return res.json({
            success: true,
            message: "Default model (OpenAI, from ENV) is working correctly",
            testResponse: response,
            model: "openai",
          });
        }
        return res.status(400).json({
          success: false,
          message: "Default model (OpenAI, from ENV) test failed - no response received",
          testResponse: response,
        });
      }

      if (!selectedModel) {
        return res.status(400).json({
          success: false,
          message: "No model selected. Please select a model in AI Model Settings first.",
        });
      }

      const validModels = ['openai', 'gemini', 'perplexity', 'grok'];
      if (!validModels.includes(selectedModel)) {
        return res.status(400).json({
          success: false,
          message: `Invalid model selected: ${selectedModel}. Must be one of: ${validModels.join(', ')}`,
        });
      }

      // Gemini: test via list-models (same as validation). Avoids generateContent model/404 issues.
      if (selectedModel === 'gemini') {
        const { getDecryptedApiKey } = await import('./utils/ai-settings-manager');
        const { validateGeminiKey } = await import('./utils/unified-ai-client');
        const apiKey = await getDecryptedApiKey('gemini');
        if (!apiKey) {
          return res.status(400).json({
            success: false,
            message: "Gemini API key is not configured. Enter your key in Site Settings, then Save.",
          });
        }
        const result = await validateGeminiKey(apiKey);
        if (result.valid) {
          return res.json({
            success: true,
            message: "Model gemini is working correctly",
            testResponse: "API key valid (list-models).",
            model: "gemini",
          });
        }
        const hint = " Re-enter your key in Site Settings, click Validate, then Save.";
        const msg = (result.error || "Gemini API key invalid.") + hint;
        return res.status(400).json({ success: false, message: msg });
      }

      const { getActiveAIProvider } = await import('./utils/ai-settings-manager');
      const provider = await getActiveAIProvider();
      const testPrompt = "Say 'Hello, this is a test' and nothing else.";
      const response = await provider.generateText(testPrompt, { maxTokens: 20 });

      if (response && response.length > 0) {
        return res.json({
          success: true,
          message: `Model ${selectedModel} is working correctly`,
          testResponse: response,
          model: selectedModel,
        });
      }
      return res.status(400).json({
        success: false,
        message: `Model ${selectedModel} test failed - no response received`,
        testResponse: response,
      });
    } catch (error: any) {
      console.error("Failed to test model:", error);
      const raw = (error?.message || String(error)).toLowerCase();
      const apiKeyInvalid = raw.includes('api key not valid') || raw.includes('api_key_invalid') || raw.includes('invalid api key');
      const message = apiKeyInvalid
        ? "Saved API key is invalid. Re-enter your key in Site Settings, click Validate, then Save."
        : (error?.message || "Failed to test model. Make sure the API key is configured and valid.");
      return res.status(500).json({ success: false, message });
    }
  });

  // Site Settings Routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      
      const { maskApiKey } = await import('./utils/api-key-encryption');
      const cleanSettings = {
        ...settings,
        id: settings.id,
      } as Record<string, unknown>;

      const ai = cleanSettings.aiModelSettings as Record<string, unknown> | undefined;
      if (ai && typeof ai === 'object' && !Array.isArray(ai)) {
        const maskedKeys: Record<string, string> = {};
        const configured: Record<string, boolean> = {};
        const keys = ai.apiKeys as Record<string, string> | undefined;
        if (keys && typeof keys === 'object') {
          for (const [model, encryptedKey] of Object.entries(keys)) {
            if (typeof encryptedKey === 'string' && encryptedKey) {
              maskedKeys[model] = maskApiKey(encryptedKey);
              configured[model] = true;
            }
          }
        }
        const base = ai as Record<string, unknown>;
        cleanSettings.aiModelSettings = { ...base, apiKeys: maskedKeys, apiKeyConfigured: configured };
      }
      
      res.json(cleanSettings);
    } catch (error) {
      console.error("Failed to get site settings:", error);
      res.status(500).json({ success: false, message: "Failed to retrieve site settings" });
    }
  });

  app.post("/api/site-settings", authenticateToken, authorizeRole(['super_admin', 'user_admin']), async (req, res) => {
    try {
      console.log('Received site settings update:', JSON.stringify(req.body, null, 2)); // Debug log
      
      // Parse and validate the updates
      const parsed = insertSiteSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        console.error('Validation errors:', parsed.error.errors);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid settings data", 
          errors: parsed.error.errors 
        });
      }
      
      const updates = parsed.data;
      console.log('Parsed updates:', JSON.stringify(updates, null, 2)); // Debug log
      
      if (req.body.pageTitle !== undefined) {
        updates.pageTitle = req.body.pageTitle;
      }

      // Merge API keys: keep existing encrypted keys; only overwrite when client sends new plaintext
      const { encryptApiKey, isEncrypted, isMaskedKey } = await import('./utils/api-key-encryption');
      const current = await storage.getSiteSettings();
      const existingEncrypted = (current?.aiModelSettings?.apiKeys && typeof current.aiModelSettings.apiKeys === 'object')
        ? { ...(current.aiModelSettings.apiKeys as Record<string, string>) }
        : {};
      const rawApiKeys = (req.body?.aiModelSettings as { apiKeys?: Record<string, string> })?.apiKeys;
      if (rawApiKeys && typeof rawApiKeys === 'object') {
        for (const [model, apiKey] of Object.entries(rawApiKeys)) {
          if (typeof apiKey !== 'string' || !apiKey.trim()) continue;
          if (isEncrypted(apiKey) || isMaskedKey(apiKey)) continue;
          existingEncrypted[model] = encryptApiKey(apiKey.trim());
        }
      }
      if (updates.aiModelSettings) {
        const am = updates.aiModelSettings as Record<string, unknown>;
        updates.aiModelSettings = { ...am, apiKeys: existingEncrypted } as typeof updates.aiModelSettings;
      }
      
      const settings = await storage.updateSiteSettings(updates);

      const { resetAIProviderCache } = await import('./openai-client');
      resetAIProviderCache();

      const { maskApiKey } = await import('./utils/api-key-encryption');
      const cleanSettings = { ...settings, id: settings.id } as Record<string, unknown>;
      const ai = cleanSettings.aiModelSettings as Record<string, unknown> | undefined;
      
      if (ai && typeof ai === 'object' && !Array.isArray(ai)) {
        const maskedKeys: Record<string, string> = {};
        const configured: Record<string, boolean> = {};
        const keys = ai.apiKeys as Record<string, string> | undefined;
        if (keys && typeof keys === 'object') {
          for (const [model, encryptedKey] of Object.entries(keys)) {
            if (typeof encryptedKey === 'string' && encryptedKey) {
              maskedKeys[model] = maskApiKey(encryptedKey);
              configured[model] = true;
            }
          }
        }
        const base = ai as Record<string, unknown>;
        cleanSettings.aiModelSettings = { ...base, apiKeys: maskedKeys, apiKeyConfigured: configured };
      }
      
      res.json({ success: true, settings: cleanSettings });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid settings data", errors: error.errors });
      } else {
        console.error("Failed to update site settings:", error);
        res.status(500).json({ success: false, message: "Failed to update site settings" });
      }
    }
  });

  // Serve sitemap.xml from client/public directory
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.resolve('./client/public/sitemap.xml'));
  });

  const httpServer = createServer(app);
  return httpServer;
}