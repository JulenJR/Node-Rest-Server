import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, {Request, Response, NextFunction} from "express";
import helmet from "helmet";
import multer from "multer";
import axios from "axios";

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
	}


	async listen(): Promise<void> {
		await new Promise<void>((resolve) => {
			this.app.listen(this.port, () => {
				// eslint-disable-next-line no-console
				console.log(
					`✅ Backend App is running at http://localhost:${this.port} in ${this.app.get(
						"env"
					)} mode`
				);
				// eslint-disable-next-line no-console
				console.log("✋ Press CTRL-C to stop\n");

				resolve();
			});
		});
	}
}
