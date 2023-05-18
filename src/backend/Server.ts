/* eslint-disable*/
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { fileRouter } from "../file/infrastructure/routes/file-router";
import {userRouter} from '../user/infrastructure/routes/user-router';
import { timeRouter } from "../time/infrastructure/routes/time-router";
import { pokemonRouter } from "../pokemon/infrastructure/routes/pokemon-router";
export class Server {
  private readonly app: express.Express;
  private readonly port: string;

  constructor(port: string) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Cache-Control", "no-cache");
      next();
    });

  }

  private setupRoutes(): void {
    const checkUserData = (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    };
    this.app.use(fileRouter)
    this.app.use(userRouter)
    this.app.use(timeRouter);
    this.app.use(pokemonRouter);
  }

  async listen(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.app.listen(this.port, () => {
        console.log(
          `✅ Backend App is running at http://localhost:${this.port} in ${this.app.get("env")} mode`);
        console.log("✋ Press CTRL-C to stop\n");

        resolve();
      });
    });
  }
}