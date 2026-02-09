import { ValidationMiddleware } from "../../middleware/validation.middleware.js";
import { AuthController } from "./auth.controller.js";
import express, { Router } from "express";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";

export class AuthRouter {
  private router: Router;
  constructor(
    private authController: AuthController,
    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = express.Router();
    this.initRoutes();
  }
  private initRoutes = () => {
    this.router.post(
      "/register",
      this.validationMiddleware.validateBody(RegisterDto),
      this.authController.register,
    );
    this.router.post(
      "/login",
      this.validationMiddleware.validateBody(LoginDto),
      this.authController.login,
    );
  };
  getRouter = () => {
    return this.router;
  };
}
