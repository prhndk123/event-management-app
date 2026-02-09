import express, { Router } from "express";
import { MediaController } from "./media.controller.js";
import { UploadMiddleware } from "../../middleware/uploader.middleware.js";

export class MediaRouter {
  private router: Router;

  constructor(
    private mediaController: MediaController,
    private uploadMiddleware: UploadMiddleware,
  ) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      "/upload",
      this.uploadMiddleware.upload().single("file"),
      this.mediaController.uploadFile,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
