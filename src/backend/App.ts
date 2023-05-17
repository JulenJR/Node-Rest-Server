/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
import { Server } from "./Server";

require = require('esm')(module);

export default class App {
  server?: Server;

  async start(): Promise<void> {
    const port = process.env.PORT ?? "8000";
    this.server = new Server(port);

    await this.server.listen();
  }
}