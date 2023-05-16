import { Server } from "./Server";
import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import axios from "axios";

require = require('esm')(module);

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
const upload = multer({
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
      return cb(new Error('Only image files (png, jpg, jpeg, gif) are allowed!'));
    }
    cb(null, true);
  },
  dest: '../../upload'
});

// Cache-Control header middleware
app.use(function(req: Request, res: Response, next: Function) {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Enable CORS
app.use(cors());

// Parse JSON in request body
app.use(express.json());


//curl -X POST -F "file=@C:\\Users\\formacio\\Downloads\\image.png" http://localhost:8000/upload
app.post('/upload', upload.single('file'), (req : Request, res : Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  res.json({ message: 'File uploaded successfully', file: file });
});

function checkUserData(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

//curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"username\", \"password\": \"yourpassword\"}" http://localhost:8000/time

app.post('/time',checkUserData , (req: Request, res: Response) => {
  const { username } = req.body;
  const actualDate = new Date().toLocaleString();
  const result = { time: actualDate, username: username };
  res.json(result);
});

app.get('/user', (req: Request, res: Response) => {
  const { protocol, hostname } = req;
  const { name, age } = req.body;
  const user = { name: name, age: age, url: `${protocol}://${hostname}${req.originalUrl}` };
  console.log('successfully sent user to http://localhost:8000 in the folder /user')
  res.json(user);
});

app.get('/pokemon/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  
  try {
    const response = await axios.get(url);
    const data = response.data;
    const name = data.name;
    const height = data.height;
    const weight = data.weight;
    
    res.json({name, height, weight });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});