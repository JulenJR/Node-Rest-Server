/* eslint-disable*/
import { Request, Response } from "express";

export class TimeController {
    constructor(){
    }

    run (req : Request, res : Response): void{

        const  username  = req.body;
        const actualDate = new Date().toLocaleString();
        const result = { time: actualDate, username };
        
        res.json(result);
    }
}