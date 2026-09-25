import { TObjectId } from "../constants";
import Pokemon, { TPokemonDocument } from "../models/Pokemon";
import Trainer from "../models/Trainer";
import { createHttpError } from "../utils/httpError";
import { TPokemon, TPokemonFilters } from "../validations/pokemonSchemas";

export const getAllPokemons = async (
  filters?: TPokemonFilters,
): Promise<TPokemonDocument[]> => {
  const query: Record<string, unknown> = {};

  if (filters?.type) query.type = filters.type;
  return await Pokemon.find(query);
};

export const getPokemonById = async (
  id: TObjectId,
): Promise<TPokemonDocument | null> => {
  return await Pokemon.findById(id);
};

export const createPokemon = async (
  data: TPokemon,
): Promise<TPokemonDocument> => {
  const trainerId = data.trainerId;

  // If trainerId null
  if (!trainerId) {
    return await Pokemon.create(data);
  }

  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    throw createHttpError(
      404,
      "Le dresseur correspondant à cet ID n'existe pas",
    );
  }
  const team = await Pokemon.find({ trainerId });

  if (team.length === 6) {
    throw createHttpError(
      409,
      "Un dresseur peut avoir un maximum de 6 pokémons. Limite atteinte.",
    );
  }
  return await Pokemon.create(data);
};

export const updatePokemon = async (
  id: TObjectId,
  data: Partial<TPokemon>,
): Promise<TPokemonDocument | null> => {
  return await Pokemon.findByIdAndUpdate(id, data, { returnDocument: "after" });
};

export const deletePokemon = async (
  id: TObjectId,
): Promise<TPokemonDocument | null> => {
  return await Pokemon.findByIdAndDelete(id);
};
