/* eslint-disable*/

import  { Request } from "express";
import multer, { FileFilterCallback } from "multer";

export const fileMiddleware = multer({
	fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
		if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
			cb(new Error("Only image files (png, jpg, jpeg, gif) are allowed!"));
		} else {
			cb(null, true);
		}
	},
	dest: "../../upload",
});


