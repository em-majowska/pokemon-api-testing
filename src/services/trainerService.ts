import Pokemon, { TPokemonDocument } from "../models/Pokemon";
import Trainer, { TTrainerDocument } from "../models/Trainer";
import { TTrainer, TTrainerTeam } from "../validations/trainerSchemas";
import { createHttpError } from "../utils/httpError";
import { getAverageLevel } from "../utils/pokemonUtils";
import { TObjectId } from "../constants";

export const getAllTrainers = async (): Promise<TTrainerDocument[]> => {
  return await Trainer.find();
};

export const getTrainerById = async (
  id: TObjectId,
): Promise<TTrainerDocument | null> => {
  return await Trainer.findById(id);
};

export const getTrainerTeam = async (id: TObjectId): Promise<TTrainerTeam> => {
  const trainer = await Trainer.findById(id);
  if (!trainer) {
    throw createHttpError(404, "Dresseur non trouvé");
  }

  const pokemons = await Pokemon.find({ trainerId: id });
  const levels = pokemons.map((p) => p.level);

  const data: TTrainerTeam = {
    trainer: trainer.name,
    count: pokemons.length,
    averageLevel: getAverageLevel(levels),
    pokemons,
  };

  return data;
};

export const createTrainer = async (
  data: TTrainer,
): Promise<TTrainerDocument> => {
  return await Trainer.create(data);
};

export const updateTrainer = async (
  id: TObjectId,
  data: Partial<TTrainer>,
): Promise<TTrainerDocument | null> => {
  return await Trainer.findByIdAndUpdate(id, data, { returnDocument: "after" });
};

export const deleteTrainer = async (
  id: TObjectId,
): Promise<TTrainerDocument | null> => {
  const hasPokemons = await Pokemon.exists({ trainerId: id });
  if (hasPokemons) {
    throw createHttpError(
      409,
      "Impossible de supprimer un dresseur qui a des pokémons dans son équipe",
    );
  }
  return await Trainer.findByIdAndDelete(id);
};
