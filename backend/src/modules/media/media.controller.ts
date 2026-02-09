import { Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";

export class MediaController {
    uploadFile = async (req: Request, res: Response) => {
        if (!req.file) {
            throw new ApiError("No file uploaded", 400);
        }

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename
            }`;

        res.status(200).send({
            message: "File uploaded successfully",
            url: fileUrl,
            filename: req.file.filename,
        });
    };
}
