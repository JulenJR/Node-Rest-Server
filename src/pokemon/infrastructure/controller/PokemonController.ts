/* eslint-disable*/
import { Request, Response } from "express";

export class PokemonController {
    constructor(){

    }

    async run (req : Request, res : Response){
        const id = req.params.id;
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

        try {
        const response = await fetch(url);
        const data  = await response.json();
        const { name, height, weight } = data;
        res.json({ name, height, weight });
        
        } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        }
    }
}