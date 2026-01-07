import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Configure Digital Ocean Spaces client (compatible with S3)
const s3Client = new S3Client({
  endpoint: process.env.DIGITALOCEAN_ENDPOINT,
  region: "us-east-1", // Digital Ocean Spaces doesn't use regions, but SDK requires it
  credentials: {
    accessKeyId: process.env.DIGITALOCEAN_API_KEY || "",
    secretAccessKey: process.env.DIGITALOCEAN_SECRET_ACCESS_KEY || "",
  },
});

const SPACE_NAME = process.env.DIGITALOCEAN_SPACE_NAME || "your-space-name";
const BASE_FOLDER = process.env.DIGITALOCEAN_FOLDER || "hello-babul";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Digital Ocean Spaces
 * @param file - Multer file object
 * @param folder - Optional subfolder within the bucket
 * @returns Promise with upload result containing the public URL
 */
export const uploadToDigitalOcean = async (
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<UploadResult> => {
  try {
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Generate unique filename with base folder
    const timestamp = Date.now();
    const filename = `${BASE_FOLDER}/${folder}/${timestamp}-${file.originalname}`;

    // Prepare upload parameters
    const uploadParams = {
      Bucket: SPACE_NAME,
      Key: filename,
      Body: file.buffer,
      ACL: "public-read" as const, // Make file publicly accessible
      ContentType: file.mimetype,
    };

    // Upload to Digital Ocean Spaces
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construct public URL
    const endpoint = process.env.DIGITALOCEAN_ENDPOINT?.replace("https://", "");
    const publicUrl = `https://${SPACE_NAME}.${endpoint}/${filename}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Digital Ocean upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Determine if a file is an image or video based on mimetype
 * @param mimetype - File mimetype
 * @returns "image" | "video" | null
 */
export const getMediaType = (mimetype: string): "image" | "video" | null => {
  if (mimetype.startsWith("image/")) {
    return "image";
  } else if (mimetype.startsWith("video/")) {
    return "video";
  }
  return null;
};
