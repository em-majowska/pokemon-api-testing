import z from "zod";
import { POKEMON_TYPES } from "../constants";

export const pokemonBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(30, "Name should have 2-30 characters"),
  type: z.enum(
    POKEMON_TYPES,
    "Type of pokemon should be one of : feu, eau, plante, electrik, psy, normal",
  ),
  level: z
    .int("Invalid number")
    .min(1)
    .max(100, "Level should be between 1 and 100")
    .default(1),
  trainerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectID format")
    .nullable()
    .default(null),
});

export type TPokemon = z.infer<typeof pokemonBodySchema>;
