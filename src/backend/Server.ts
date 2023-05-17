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

    const upload = multer({
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) => {
        if (
          !file.originalname.match(
            new RegExp(`\\.(${ALLOWED_IMAGE_EXTENSIONS.join("|")})$`)
          )
        ) {
          cb(new Error("Only image files (png, jpg, jpeg, gif) are allowed!"));
        } else {
          cb(null, true);
        }
      },
      dest: FILE_UPLOAD_DESTINATION,
    });

    const cacheControlMiddleware = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      res.setHeader("Cache-Control", "no-cache");
      next();
    };

    const checkUserDataMiddleware = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    };

    this.app.use(cacheControlMiddleware);

    this.app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
        const file = req.file;
        if (!file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        res.json({ message: "File uploaded successfully", file });
      }
    );

    this.app.post("/time", checkUserDataMiddleware, (req: Request, res: Response) => {
        const { username } = req.body;
        const actualDate = new Date().toLocaleString();
        const timeResponse = { time: actualDate, username };
        res.json(timeResponse);
      }
    );

    this.app.get("/user", (req: Request, res: Response) => {
      const { protocol, hostname } = req;
      const { name, age } = req.body;
      const user = {
        name,
        age,
        url: `${protocol}://${hostname}:${port}${req.originalUrl}`,
      };
      console.log( `successfully sent user to http://localhost:${port} in the folder /user` );
      res.json(user);
    });

    this.app.get("/pokemon/:id", async (req: Request, res: Response) => {
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
    });
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
