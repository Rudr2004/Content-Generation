import AWS from 'aws-sdk';
import crypto from 'crypto';
import ImageModel from './models/image';

export interface StoredImageResult {
  permanentUrl: string;
  filename: string;
  s3Key: string;
  id?: string; // Changed to string for MongoDB ObjectId
}

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Downloads an image from a temporary URL and stores it permanently in AWS S3
 * @param temporaryUrl - The temporary URL from OpenAI DALL-E
 * @param prefix - Optional prefix for the filename (e.g., 'blog-')
 * @param folder - Optional folder structure in S3 (e.g., 'blog', 'profile', 'products')
 * @returns Promise with the permanent URL and file info
 */
export async function storeImagePermanently(
  temporaryUrl: string,
  prefix: string = 'blog-',
  folder: string = 'images'
): Promise<StoredImageResult> {
  if (!BUCKET_NAME) {
    throw new Error('AWS S3 bucket name is not configured. Please set AWS_S3_BUCKET_NAME environment variable.');
  }

  try {
    // Generate unique filename using timestamp and random hash
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    const filename = `${prefix}${timestamp}-${randomHash}.png`;
    const s3Key = `${folder}/${filename}`;
    
    // Download the image from the temporary URL
    const response = await fetch(temporaryUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    // Get the image data as buffer
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    
    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: imageBuffer,
      ContentType: 'image/png',
    };
    
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Store image metadata in database
    const imageRecord = await ImageModel.create({
      filename,
      s3Key,
      s3Url: uploadResult.Location,
      bucket: BUCKET_NAME,
      contentType: 'image/png',
      folder,
      status: 'active'
    });
    
    console.log(`Image stored successfully in S3: ${filename}`);
    
    return {
      permanentUrl: uploadResult.Location,
      filename,
      s3Key,
      id: imageRecord._id.toString()
    };
    
  } catch (error) {
    console.error('Error storing image permanently:', error);
    throw new Error(`Failed to store image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Deletes a stored image file from S3 and database
 * @param filename - The filename to delete
 * @returns Promise<boolean> - true if deleted successfully
 */
export async function deleteStoredImage(filename: string): Promise<boolean> {
  if (!BUCKET_NAME) {
    throw new Error('AWS S3 bucket name is not configured.');
  }

  try {
    // Find the image record in database
    const imageRecord = await ImageModel.findOne({ filename });
    
    if (!imageRecord) {
      console.log(`Image not found in database: ${filename}`);
      return false;
    }
    
    // Delete from S3
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: imageRecord.s3Key,
    };
    
    await s3.deleteObject(deleteParams).promise();
    
    // Update database record to mark as deleted
    imageRecord.status = 'deleted';
    await imageRecord.save();
    
    console.log(`Image deleted successfully from S3: ${filename}`);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Lists all stored images from database
 * @param folder - Optional folder to filter by
 * @returns Promise with array of image records
 */
export async function listStoredImages(folder?: string): Promise<any[]> {
  try {
    const query: any = { status: 'active' };
    if (folder) {
      query.folder = folder;
    }
    
    const imageRecords = await ImageModel.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return imageRecords;
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
}

/**
 * Uploads an image buffer directly to S3 (for form uploads)
 * @param buffer - Image buffer
 * @param filename - Original filename
 * @param contentType - MIME type
 * @param folder - S3 folder
 * @returns Promise with stored image result
 */
export async function uploadImageToS3(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<StoredImageResult> {
  if (!BUCKET_NAME) {
    throw new Error('AWS S3 bucket name is not configured.');
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    const extension = filename.split('.').pop() || 'png';
    const uniqueFilename = `${timestamp}-${randomHash}.${extension}`;
    const s3Key = `${folder}/${uniqueFilename}`;
    
    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    };
    
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Store in database
    const imageRecord = await ImageModel.create({
      filename: uniqueFilename,
      originalFilename: filename,
      s3Key,
      s3Url: uploadResult.Location,
      bucket: BUCKET_NAME,
      contentType,
      folder,
      status: 'active'
    });
    
    return {
      permanentUrl: uploadResult.Location,
      filename: uniqueFilename,
      s3Key,
      id: imageRecord._id.toString()
    };
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}