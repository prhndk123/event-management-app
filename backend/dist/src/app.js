import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
const PORT = 8000;
export class App {
    app;
    constructor() {
        this.app = express();
        this.registerModules();
        this.configure();
        this.handleError();
    }
    configure = () => {
        this.app.use(cors());
        this.app.use(express.json());
    };
    registerModules = () => {
        // shared dependency
        const prismaClient = prisma;
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
