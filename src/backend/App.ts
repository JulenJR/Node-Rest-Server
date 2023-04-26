import { Server } from "./Server";
import express, { Request, Response } from 'express';
import multer from 'multer';
export class App {
  server?: Server;

  async start(): Promise<void> {
    const port = process.env.PORT ?? "8000";
    this.server = new Server(port);

    await this.server.listen();
  }
}

const app = express();
const port = process.env.PORT || 8000;

app.get('/user', (req: Request, res: Response) => {
  const { protocol, hostname } = req;
  const { name, age } = req.query;

  const user = { name: name || 'username', age: age || 6, url: `${protocol}://${hostname}${req.originalUrl}` };

  res.json(user);
});

app.get('/upload', (req: Request, res: Response) =>{
  const { protocol, hostname } = req;
  const file = req.query;



});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});