/* eslint-disable*/
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import multer, { FileFilterCallback } from "multer";
import axios from "axios";

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

    const upload = multer({
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
          cb(new Error("Only image files (png, jpg, jpeg, gif) are allowed!"));
        } else {
          cb(null, true);
        }
      },
      dest: "../../upload",
    });

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Cache-Control", "no-cache");
      next();
    });

    this.app.use("/upload", upload.single("file"));
  }

  private setupRoutes(): void {
    const checkUserData = (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    };

    this.app.post("/upload", this.handleUpload);
    this.app.post("/time", checkUserData, this.handleTime);
    this.app.get("/user", this.handleUser);
    this.app.get("/pokemon/:id", this.handlePokemon);
  }

  private handleUpload(req: Request, res: Response): void {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.json({ message: "File uploaded successfully", file });
  }

  private handleTime(req: Request, res: Response): void {
    const { username } = req.body;
    const actualDate = new Date().toLocaleString();
    const result = { time: actualDate, username };
    res.json(result);
  }

  private handleUser(req: Request, res: Response): void {
    const { protocol, hostname } = req;
    const { name, age } = req.body;
    const user = { name, age, url: `${protocol}://${hostname}${req.originalUrl}` };
    console.log(`successfully sent user to http://localhost:8000 in the folder /user`);
    res.json(user);
  }

  private async handlePokemon(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    try {
      const response = await axios.get(url);
      const { name, height, weight } = response.data;
      res.json({ name, height, weight });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async listen(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.app.listen(this.port, () => {
        console.log(
          `✅ Backend App is running at http://localhost:${this.port} in ${this.app.get(
            "env"
          )} mode`
        );
        console.log("✋ Press CTRL-C to stop\n");

        resolve();
      });
    });
  }
}