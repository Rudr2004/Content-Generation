import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import type { Request } from 'express';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error('AWS_S3_BUCKET_NAME environment variable is required for file uploads');
}

// S3 Upload 
export const uploadToS3 = multer({
  storage: multerS3({
  s3: s3,
  bucket: BUCKET_NAME, 

  key: function (
    req: Request & { params: { folder?: string } },
    file: Express.Multer.File,
    cb: (error: any, key?: string) => void
  ) {
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    const extension = file.originalname.split('.').pop() || 'png';
    const folder = req.params.folder || 'uploads';
    const filename = `${folder}/${timestamp}-${randomHash}.${extension}`;
    cb(null, filename);
  },

  contentType: multerS3.AUTO_CONTENT_TYPE,

  metadata: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, metadata?: any) => void
  ) {
    cb(null, {
      fieldName: file.fieldname,
      originalName: file.originalname,
    });
  },
}),

  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for AI-generated images
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile?: boolean) => void
  ) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Memory Storage - fallback for testing or dev
export const uploadToMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for AI-generated images
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile?: boolean) => void
  ) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

export { s3, BUCKET_NAME };
