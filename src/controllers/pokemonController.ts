import { NextFunction, Request, Response } from "express";
import * as pokemonService from "../services/pokemonService";
import HttpError from "../utils/httpError";
import { PokemonType, TObjectId } from "../constants";
import { TPokemon } from "../validations/pokemonSchemas";

export const getAllPokemons = async (
  req: Request<{}, {}, { type: PokemonType }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pokemons = await pokemonService.getAllPokemons(req.query);
    res.status(200).json(pokemons);
  } catch (error) {
    next(error);
  }
};

export const getPokemonById = async (
  req: Request<{ id: TObjectId }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pokemon = await pokemonService.getPokemonById(req.params.id);
    if (!pokemon) {
      throw new HttpError("Pokémon non trouvé", 404);
    }
    res.status(200).json(pokemon);
  } catch (error) {
    next(error);
  }
};

export const createPokemon = async (
  req: Request<{}, TPokemon>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pokemon = await pokemonService.createPokemon(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    next(error);
  }
};

export const updatePokemon = async (
  req: Request<{ id: TObjectId }, Partial<TPokemon>>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pokemon = await pokemonService.updatePokemon(req.params.id, req.body);
    if (!pokemon) {
      throw new HttpError("Pokémon non trouvé", 404);
    }
    res.status(200).json(pokemon);
  } catch (error) {
    next(error);
  }
};

export const deletePokemon = async (
  req: Request<{ id: TObjectId }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pokemon = await pokemonService.deletePokemon(req.params.id);
    if (!pokemon) {
      throw new HttpError("Pokémon non trouvé", 404);
    }
    res.status(204).json(pokemon);
  } catch (error) {
    next(error);
  }
};
