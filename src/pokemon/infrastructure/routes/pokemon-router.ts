/* eslint-disable*/
import express from "express";
import { PokemonController } from "../controller/PokemonController";

const pokemonRouter = express.Router();

const pokemonController = new PokemonController();

pokemonRouter.get('/pokemon/:id', pokemonController.run);

export { pokemonRouter };
