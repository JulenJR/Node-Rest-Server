import { Server } from "./Server";
import express, { Request, Response } from 'express';
import path from 'path';
import * as fs from 'fs';
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
const upload = multer({ dest: '../../upload' });

app.post('/upload',upload.single('file'), (req : Request, res : Response) =>{
  
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.json({ message: 'File uploaded successfully', file: file });

})

app.get('/user', (req: Request, res: Response) => {
  const { protocol, hostname } = req;
  const { name, age } = req.query;

  const user = { name: name || 'username', age: age || 6, url: `${protocol}://${hostname}${req.originalUrl}` };
  console.log('succesfully sent user to http://localhost:8000 in the folder /user')
  res.json(user);
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});