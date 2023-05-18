/* eslint-disable*/
import  { Request, Response } from "express";
import { UserCreator } from "../../application/use-cases/UserCreator";

export class UserController {

    constructor() {
    }

    run(req: Request, res: Response): void {

        const { protocol, hostname } = req;
        const { name, age } = req.body;
        const userCreator = new UserCreator()

        const user = userCreator.run({ name, age, url: `${protocol}://${hostname}${req.originalUrl}`})
 
        res.json(user);
    }
}
