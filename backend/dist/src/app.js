import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { UserService } from "./modules/user/user.service.js";
import { EventService } from "./modules/event/event.service.js";
import { TransactionService } from "./modules/transaction/transaction.service.js";
import { ReviewService } from "./modules/review/review.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { UserController } from "./modules/user/user.controller.js";
import { EventController } from "./modules/event/event.controller.js";
import { TransactionController } from "./modules/transaction/transaction.controller.js";
import { ReviewController } from "./modules/review/review.controller.js";
import { AuthRouter } from "./modules/auth/auth.router.js";
import { UserRouter } from "./modules/user/user.router.js";
import { EventRouter } from "./modules/event/event.router.js";
import { TransactionRouter } from "./modules/transaction/transaction.router.js";
import { ReviewRouter } from "./modules/review/review.router.js";
import { MediaController } from "./modules/media/media.controller.js";
import { MediaRouter } from "./modules/media/media.router.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";
import { ValidationMiddleware } from "./middleware/validation.middleware.js";
import { Scheduler } from "./jobs/scheduler.js";
const PORT = 8000;
export class App {
    app;
    constructor() {
        this.app = express();
        this.configure();
        this.registerModules();
        this.handleError();
    }
    configure = () => {
        this.app.use(cors());
        this.app.use(express.json());
    };
    registerModules = () => {
        // shared dependency
        const prismaClient = prisma;
        // services
        const authService = new AuthService(prismaClient);
        const userService = new UserService(prismaClient);
        const eventService = new EventService(prismaClient);
        const transactionService = new TransactionService(prismaClient);
        const reviewService = new ReviewService(prismaClient);
        // controllers
        const authController = new AuthController(authService);
        const userController = new UserController(userService);
        const eventController = new EventController(eventService);
        const transactionController = new TransactionController(transactionService);
        const reviewController = new ReviewController(reviewService);
        // middlewares
        const authMiddleware = new AuthMiddleware();
        const validationMiddleware = new ValidationMiddleware();
        // routes
        const authRouter = new AuthRouter(authController, validationMiddleware);
        const userRouter = new UserRouter(userController, authMiddleware);
        const eventRouter = new EventRouter(eventController, authMiddleware);
        const transactionRouter = new TransactionRouter(transactionController, authMiddleware // Inject authMiddleware
        );
        const reviewRouter = new ReviewRouter(reviewController, authMiddleware); // Inject authMiddleware
        // media
        const mediaController = new MediaController();
        const mediaRouter = new MediaRouter(mediaController);
        // entry point
        this.app.use("/auth", authRouter.getRouter());
        this.app.use("/users", userRouter.getRouter());
        this.app.use("/events", eventRouter.getRouter());
        this.app.use("/", transactionRouter.getRouter()); // Transactions use root-level routes
        this.app.use("/", reviewRouter.getRouter()); // Reviews use root-level routes
        this.app.use("/media", mediaRouter.getRouter());
        // serve uploaded files
        this.app.use("/uploads", express.static("uploads"));
        // Initialize scheduler for background jobs
        new Scheduler(prismaClient);
    };
    handleError = () => {
        this.app.use((err, req, res, next) => {
            const message = err.message || "Something went wrong!";
            const status = err.status || 500;
            res.status(status).send({ message });
        });
        this.app.use((req, res) => {
            res.status(404).send({ message: "Route not found" });
        });
    };
    start() {
        this.app.listen(PORT, () => {
            console.log(`Server running on port : ${PORT}`);
        });
    }
}
