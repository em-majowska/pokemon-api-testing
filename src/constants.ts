import z from "zod";

export const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh"] as const;
export const POKEMON_TYPES = [
  "feu",
  "eau",
  "plante",
  "electrik",
  "psy",
  "normal",
] as const;
export const MAX_TEAM_SIZE = 6;

export type Region = (typeof REGIONS)[number];
export type PokemonType = (typeof POKEMON_TYPES)[number];

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID invalide");

export type TObjectId = z.infer<typeof objectId>;
