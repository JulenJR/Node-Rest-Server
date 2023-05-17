/* eslint-disable*/
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import multer, { FileFilterCallback } from "multer";
import axios from "axios";

const FILE_UPLOAD_DESTINATION = "../../upload";
const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif"];

export class Server {
  private readonly app: express.Express;
  private readonly port: string;

  constructor(port: string) {
    this.port = port;
    this.app = express();
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    const cacheControlMiddleware = (req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Cache-Control", "no-cache");
      next();
    };

    

    this.app.use(cacheControlMiddleware);
  }

  private setupRoutes(): void {

    const checkUserDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    };

    const upload = multer({
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!file.originalname.match(new RegExp(`\\.(${ALLOWED_IMAGE_EXTENSIONS.join("|")})$`))) {
          cb(new Error("Only image files (png, jpg, jpeg, gif) are allowed!"));
        } else {
          cb(null, true);
        }
      },
      dest: FILE_UPLOAD_DESTINATION,
    });

    this.app.post("/upload", upload.single("file"), this.handleUpload);
    this.app.post("/time", checkUserDataMiddleware, this.handleTime);
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
    const timeResponse = { time: actualDate, username };
    res.json(timeResponse);
  }

  private handleUser(req: Request, res: Response): void {
    const { protocol, hostname } = req;
    const { name, age } = req.body;
    const user = { name, age, url: `${protocol}://${hostname}${req.originalUrl}` };
    console.log(`successfully sent user to http://localhost:${this.port} in the folder /user`);
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