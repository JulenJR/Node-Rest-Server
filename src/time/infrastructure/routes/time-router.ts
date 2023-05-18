/* eslint-disable*/
import express from "express";
import { TimeController } from "../controllers/TimeController";

const timeRouter = express.Router();

const timeController = new TimeController();

timeRouter.post('/time', timeController.run);

export { timeRouter };