import multer from "multer";
import { Request } from "express";
import { ApiError } from "../utils/api-error.js";

// filter for image files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only image files are allowed", 400) as any, false);
  }
};

// Class-based uploader middleware for dependency injection
export class UploadMiddleware {
  upload = (maxSize: number = 2) => {
    const storage = multer.memoryStorage();
    const limits = {
      fileSize: maxSize * 1024 * 1024,
    };
    return multer({
      storage,
      limits,
      fileFilter,
    });
  };
}
