/* eslint-disable*/

import express from "express";
import { UploadFileController } from "../controllers/UploadFileController";

import { fileMiddleware} from "../middlewares/FileMiddleware"
const fileRouter = express.Router();

const uploadFileController = new UploadFileController()


fileRouter.post("/upload",fileMiddleware.single('file'));
fileRouter.post("/upload",uploadFileController.run);

export { fileRouter };
