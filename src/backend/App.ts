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