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

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'upload/');
  },
  filename: (req, file, cb)=>{
    cb(null, file.originalname);
  }
});


const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb)=>{
    console.log('Mimetype:   ', file.mimetype);
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif'){
      cb(null, true);
    }else{
      throw new Error('the file is not .png, .jpg or .gif');
    }
  }
}).single('file');


app.get('/user', (req: Request, res: Response) => {
  const { protocol, hostname } = req;
  const { name, age } = req.query;

  const user = { name: name || 'username', age: age || 6, url: `${protocol}://${hostname}${req.originalUrl}` };

  res.json(user);
});

app.post('/upload',upload, (req: Request, res: Response) =>{
  
  if (!req.file) res.status(400).json({ error: 'No file uploaded' });
  else res.json({ message: 'File uploaded succsesfully', file: req.file });

});  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});