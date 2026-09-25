import z from "zod";
import { objectId, REGIONS } from "../constants";
import { TPokemonDocument } from "../models/Pokemon";

export const trainerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Le nom est trop court (au moins 3 caractères)")
    .max(20, "Le nom doit contenir entre 3 et 20 caractères"),
  age: z
    .number()
    .int()
    .min(10, "Dresseur doit avoir au moins 10 ans")
    .max(99, "Dresseur est trop âgé (99 ans maximum)"),
  region: z.enum(REGIONS, {
    message:
      "La région doit être l'une des suivantes : Kanto, Johto, Hoenn, Sinnoh",
  }),
  badges: z
    .number()
    .int()
    .min(0, "Un dresseur ne peut pas avoir un nombre négatif de badges")
    .max(8, "Un dresseur ne peut pas avoir plus de 8 badges")
    .optional()
    .default(0),
});

export const createTrainerSchema = z.object({
  body: trainerBodySchema,
});

export const getTrainerSchema = z.object({
  params: z.object({ id: objectId }),
});

export const updateTrainerSchema = z.object({
  params: z.object({ id: objectId }),
  body: trainerBodySchema.partial(),
});

export type TTrainerTeam = {
  trainer: string;
  count: number;
  averageLevel: number;
  pokemons: TPokemonDocument[];
};

export type TTrainer = z.infer<typeof trainerBodySchema>;
