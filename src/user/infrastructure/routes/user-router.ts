/* eslint-disable*/
import express from "express";
import { UserController } from '../controllers/UserController';

const userRouter = express.Router();

const userController = new UserController();

userRouter.get('/user', userController.run);

export { userRouter };