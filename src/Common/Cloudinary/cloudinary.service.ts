import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import { BadRequest } from "../Exeptions/domain.error.js";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../../config/config.service.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// SMALL FILES MAX: 20MB
export async function uploadSmallFileToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  try {
    if (!file?.buffer) {
      throw new BadRequest("No file buffer found");
    }

    const MAX_SIZE = 20 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      throw new BadRequest("File size exceeds 20MB limit");
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(new BadRequest("Failed to upload file"));
          }

          if (!result) {
            return reject(new BadRequest("Upload failed"));
          }

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Small File Upload Error:", error);

    throw error;
  }
}

// LARGE FILES MAX: 3GB
export async function uploadLargeFileToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  try {
    if (!file?.buffer) {
      throw new BadRequest("No file buffer found");
    }

    const MAX_SIZE = 3 * 1024 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      throw new BadRequest("File size exceeds 3GB limit");
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_large_stream(
        {
          folder,
          resource_type: "auto",
          chunk_size: 20 * 1024 * 1024,
          timeout: 1000 * 60 * 30,
        },
        (error, result) => {
          if (error) {
            return reject(new BadRequest("Failed to upload large file"));
          }

          if (!result) {
            return reject(new BadRequest("Large upload failed"));
          }

          resolve(result);
        },
      );

      streamifier
        .createReadStream(file.buffer, {
          highWaterMark: 10 * 1024 * 1024,
        })
        .pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Large File Upload Error:", error);

    throw error;
  }
}

export async function uploadSmallFilesToCloudinary(Files: Express.Multer.File[], folder: string): Promise<string[]> {
    const imageUrls = await Promise.all(
      Files.map((file) => uploadSmallFileToCloudinary(file, folder)),
    );
    return imageUrls;
}

export async function uploadLargeFilesToCloudinary(Files: Express.Multer.File[], folder: string): Promise<string[]> {
    const imageUrls = await Promise.all(
      Files.map((file) => uploadLargeFileToCloudinary(file, folder)),
    );
    return imageUrls;
}

export async function deleteFile(publicId: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
        });
        return result.result;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete image');
    }
}
