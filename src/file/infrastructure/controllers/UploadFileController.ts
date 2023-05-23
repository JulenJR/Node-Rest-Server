/* eslint-disable*/
import  { Request, Response } from "express";
export class UploadFileController {
    
    constructor() {}

    run (req: Request, res: Response): void {

        const file = req.file;
        if (!file) {
            res.status(400).json({ error: "No file uploaded" });
    
            return;
        }
        res.json({ message: "File uploaded successfully", file });
    }
}