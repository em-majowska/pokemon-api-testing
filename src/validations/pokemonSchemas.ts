import z from "zod";
import { objectId, POKEMON_TYPES } from "../constants";

export const pokemonBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom est trop court")
    .max(30, "Le nom doit contenir entre 2 et 30 caractères"),
  type: z.enum(POKEMON_TYPES, {
    message: `Le type du pokémon doit être l'un des suivants : ${POKEMON_TYPES.join(", ")}`,
  }),
  level: z
    .number()
    .int("Nombre invalide")
    .min(1, "Le niveau doit être d'au moins 1")
    .max(100, "Le niveau doit être compris entre 1 et 100")
    .optional()
    .default(1),
  trainerId: objectId.nullable().default(null),
});

export const createPokemonSchema = z.object({
  body: pokemonBodySchema,
});

export const getPokemonQuerySchema = z.object({
  type: z.enum(POKEMON_TYPES).optional(),
});

export const getPokemonSchema = z.object({
  params: z.object({ id: objectId }),
});

export const updatePokemonSchema = z.object({
  params: z.object({ id: objectId }),
  body: createPokemonSchema.partial(),
});

export type TPokemon = z.infer<typeof pokemonBodySchema>;
export type TPokemonFilters = z.infer<typeof getPokemonQuerySchema>;
